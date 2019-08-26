import React from 'react';
import {
  View, 
  Text,
  Alert,
  TextInput,
  ActivityIndicator,
} from 'react-native';

import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Icon,
  Left,
  Right,
  Body,
  ListItem,
  Toast,
  Input,  
  Separator,
} from 'native-base';

import { NavigationEvents } from 'react-navigation';
import parseBuffer from '../../lib/parseBuffer';
import { connect } from 'react-redux';
import styles from "./styles";
import { Buffer } from 'buffer';
import openRealm from '../../lib/realmStorage';
// import moment from 'moment';
import {
  disconnectDevice,
} from '../../actions/bleAction';

import { write2ChannFile, append2ChannnFile } from '../../lib/files';
import { Table, Row, Rows } from 'react-native-table-component';

let HSBleManager;

class ManualGather extends React.Component {

	constructor(props){
		super(props);
		this.state = {
			realm: null,
			collectAt: '',			
			frequency: {fre1:0.0, fre2:0.0, fre3:0.0, fre4:0.0},
			mod: {mod1:0.0, mod2:0.0, mod3:0.0, mod4: 0.0},
			temperature: {t1:0.0, t2: 0.0, t3: 0.0, t4: 0.0},	
			SN: '',
			isTapGather: false,
			isCurrentVersion: false,
			isWakeup: false,

			dataText: '',
			channData2table:[],//表格行数据
			devsVersion: null,
			version: 'other',
		};
		HSBleManager = global.HSBleManager;
	}

	didFocus(){
		if (this.props.connectedDevice) {
	      HSBleManager.negotiateMtu().then( () => {
	        HSBleManager.monitor(this.monitorListener);	             
	    	});
	  	}
	  	this.onDisconnect();	  	 
	}

	// 监听蓝牙断开
  	onDisconnect() {
      this.disconnectListener = HSBleManager.manager.onDeviceDisconnected(HSBleManager.peripheralId, (err, device) => {
	      if (err) {             
	        this.props.disconnectDevice();     
	        this.showToast('设备不正常断开蓝牙');           
	        console.log('设备断开蓝牙-手动页面-err0', err);			        
	      }else{
	        this.props.disconnectDevice();  
	        this.showToast('设备断开蓝牙');                   
	        console.log('设备断开蓝牙-手动页面-noErr0', device.id, device.name);
	      }
	      this.setState({isTapGather: false});
	    });
  	}

	componentDidMount() {
		if (!this.props.connectedDevice) {
	      this.showAlert();
	    } 
	    else {		
			HSBleManager.negotiateMtu().then(() => {
	        	HSBleManager.write(parseBuffer.awakeDevice(), 2);
	        });  
	        openRealm().then((realm) => {
		      	const devs = realm.objects('devsVersion').filtered('id == 1')[0];
		      	this.setState({ version: devs.version, realm: realm });
	      	}); 
	      	console.log(`版本是：${this.state.version}`); 	

	      	if(this.props.connectedDevice) {
	      		const deviceType = this.props.connectedDevice.name.toString().substring(2, 4);
	      		if(deviceType == '33') {
	      			this.setState({ version: 'current' });
	      		}else{
	      			this.setState({ version: 'other' });
	      		}
	      	}	
	      	console.log(`版本是after：${this.state.version}`);		
	    }	    	 
	}

	judgeCurrVersion(){
		try{
			if(this.state.isWakeup){
				HSBleManager.write(parseBuffer.getChannData(), 2);
			}else{
				HSBleManager.negotiateMtu().then(() => {
			        HSBleManager.write(parseBuffer.awakeDevice(), 2);	        
			        	        
			        this.getChannDataTimer = setTimeout(() => {
				      HSBleManager.write(parseBuffer.getChannData(), 2);
				      }, 1000);
		    	});
			}		
			this.setState({ isTapGather: true });		    
		}catch(err) {
			this.showToast('设备已断开,请重新连接');
			this.props.disconnectDevice();
			this.setState({ isTapGather: false });
		}	
	}	

	consoleBuffer(b, title = '') {	  
	  const string = Array.from(b).map(byte => byte.toString(16)).join(' ');
	  console.log(`${title}Buffer ${string}`);
	  this.setState({dataText: this.state.dataText+string+'\n'});
	}

	monitorListener = (err, characteristic) => {
	    if (err) {
	      console.log(err);
	      switch (err.errorCode) {
	        case 201:
	          this.showToast('监听失败 设备已断开');
	          this.props.disconnectDevice();
	          break;
	        case 205:
	          this.showToast('监听失败 设备未连接');
	          break;
	        default:
	          this.showToast(`监听失败 ${err.errorCode}`);
	      }
	    } else {
	    	const buffer = Buffer.from(characteristic.value, 'base64');
      		// const result = parseBuffer.push(buffer, false);
      		const result = parseBuffer.push2parse(buffer);
      		
      		let cacheBuffer = Buffer.alloc(0); // 暂存数据
      		cacheBuffer = Buffer.concat([cacheBuffer, buffer]);
      		this.consoleBuffer(cacheBuffer, '接收');		
   	      		    	 
			if(result) {
				if(result.sn){
	      			this.setState({
	      				SN: `${result.sn}`,
	      			});

	      			const snNo = result.sn;	      			      		
	      			if(snNo[2] === '3' && snNo[3] === '3'){
	      				this.setState({ isCurrentVersion: true, version: 'current' });
	      			}else{
	      				this.setState({ isCurrentVersion: false, version: 'other' });
	      			}
	      		}

	      		if(result.channelsFre && result.channelsTemperature && result.SysTime) {//其他版本
	      			const systemTime = result.SysTime;
	      			this.setState({      				
	      				collectAt: `${systemTime}`,   				
	      			}); 
	      			const celsius = result.channelsTemperature;
	      			this.setState({ 
	      				temperature: {t1: celsius[0], t2: celsius[1], t3: celsius[2], t4: celsius[3]},	      				
	      				isTapGather: false,
	      			});
	      			const fre = result.channelsFre;
	      			let mode = this.calFreMode(result.channelsFre);//频模
      				this.setState({
      					mod: {mod1: mode[0], mod2: mode[1], mod3: mode[2], mod4: mode[3]},
      					frequency: {fre1: fre[0], fre2: fre[1], fre3: fre[2], fre4: fre[3]},      					
      				});
      				for(let index = 0; index < 4; index++) {		      				
      					const singleData = [index+1, systemTime, fre[index], mode[index], celsius[index]];		      				
	      				this.state.channData2table.push(singleData);
	      				this.setState({ channData2table: this.state.channData2table });	      				  					      					
	      			}
	      		}
	      		else if( result.current && result.SysTime ){//电流版本
	      			const systemTime = result.SysTime;
	      			this.setState({      				
	      				collectAt: `${systemTime}`,   				
	      			});
	      			const currValue = result.current;
	      			let waterLevel = this.calWaterLevel(currValue);//水位
      				this.setState({
      					mod: {mod1: waterLevel[0], mod2: waterLevel[1], mod3: waterLevel[2], mod4: waterLevel[3]},
      					frequency: {fre1: currValue[0], fre2: currValue[1], fre3: currValue[2], fre4: currValue[3]},
      					isTapGather: false,
      				});	
      				for(let index = 0; index < currValue.length; index++) {		      				
      					const singleData = [index+1, systemTime, currValue[index], waterLevel[index]];		      				
	      				this.state.channData2table.push(singleData);
	      				this.setState({ channData2table: this.state.channData2table });	      								      					
	      			}
	      		}

				// if(result.SysTime){
	   //    			const systemTime = result.SysTime;
	   //    			this.setState({      				
	   //    				collectAt: `${systemTime}`,   				
	   //    			});      	
	   //    		}
	   //    		if(result.channelsTemperature) {	      			
	   //    			const celsius = result.channelsTemperature;
	   //    			this.setState({ 
	   //    				temperature: {t1: celsius[0], t2: celsius[1], t3: celsius[2], t4: celsius[3]},	      				
	   //    				isTapGather: false,
	   //    			});
	   //    		}
	   //    		if(result.current) {//电流
	   //    			const currValue = result.current;
	   //    			let waterLevel = this.calWaterLevel(currValue);//水位
    //   				this.setState({
    //   					mod: {mod1: waterLevel[0], mod2: waterLevel[1], mod3: waterLevel[2], mod4: waterLevel[3]},
    //   					frequency: {fre1: currValue[0], fre2: currValue[1], fre3: currValue[2], fre4: currValue[3]},
    //   					isTapGather: false,
    //   				});	      					      			
	   //    		}
	   //    		if(result.channelsFre) {//频率
	   //    			const fre = result.channelsFre;
	   //    			let mode = this.calFreMode(result.channelsFre);//频模
    //   				this.setState({
    //   					mod: {mod1: mode[0], mod2: mode[1], mod3: mode[2], mod4: mode[3]},
    //   					frequency: {fre1: fre[0], fre2: fre[1], fre3: fre[2], fre4: fre[3]},
    //   					isTapGather: false,
    //   				});
	   //    		}	    

	      		if(result.state){
	      			const state = result.state;	      			
	      			if(state === 22){
	      				this.showToast('唤醒设备失败!');
	      				this.setState({ isTapGather: false, isWakeup: false });
	      			}else if(state === 23) {
	      				this.setState({ isWakeup: true });
	      				console.log(`设置成功~`);
	      				this.showToast('唤醒设备成功...');
	      			}else if(state === 18){
	      				this.showToast('设备休眠...');
	      				this.setState({ isTapGather: false });
	      			}else if(state === 19){
	      				this.showToast('设备繁忙...');
	      				this.setState({ isTapGather: false });
	      			}
	      		}
			}     	      		    	      		         		      	
	    }
	}

	calFreMode(valueArray) {
		let freModes=[];
		for (let i =0; i<valueArray.length; i++){
			const value = (valueArray[i] ** 2) / 1000;
			freModes[i] = Math.round(value*100)/100;
		}
		return freModes;
	}

	calWaterLevel(valueArray) {
		let waterLevel=[];
		for (let i =0; i<valueArray.length; i++){					
			const fre = valueArray[i];
			let level;
			if(fre < 4 || fre > 20) {
				console.log(`电流范围应该在[4mA, 20mA],当前值：${level}`);
				level = 0;
			}else {
				level = 5 * (fre - 4) / (20 - 4);
				console.log(`电流在4到20之间: ${level}`);
			}			
			waterLevel[i] = Math.round(level*100)/100;
		}
		return waterLevel;
	}

	showAlert() {
		Alert.alert(
	        '提示',
	        '蓝牙未连接测斜仪，请先设置',
	        [
	          {text: '设置', onPress: () => this.props.navigation.navigate('ManualConnect')},
	        ],
	     );
	}

	showToast(text, position = 'bottom', duration = 2000) {
    	Toast.show({ text, position, duration });
  	}

	componentWillUnmount() {
		HSBleManager.unmonitor();
		this.disconnectListener && this.disconnectListener.remove();
		this.getChannDataTimer && clearTimeout(this.getChannDataTimer);
		this.setState = (state, callback) => {
      		return;
   		};	
	}

	getData() {		
		if(!this.props.connectedDevice || HSBleManager.peripheralId === null) {			
			this.showAlert();
			return;
		}		
		this.setState({ channData2table: [] });
		this.judgeCurrVersion();
	}

	writeToRealm(channelNo, t, fre, mod) {
		// let Osmometer;
		const date = new Date();
		this.state.realm.write(() => {			
			const Id = date.getTime();
			const collectAt = this.state.collectAt;			
			Osmometer = this.state.realm.create('Osmometer', {				
				collectAt: collectAt,
				temperature: t,
				frequency: fre,
				mod: mod,
				channelNo: channelNo,
				Id: Id, 
			});				
		});
	}

	async save() {
		if(this.state.collectAt === '') {
			this.showToast('还没有收到数据！');
			return;
		}
		try{						
			const {fre1, fre2, fre3, fre4} = this.state.frequency;
			const {mod1, mod2, mod3, mod4} = this.state.mod;
			const {t1, t2, t3, t4} = this.state.temperature;		

			let Osmometer;
			let collectedAtString = this.state.collectAt;	
			
			const sn = this.state.SN;
			collectedAtString = collectedAtString.replace(/:/g, '-');
						
			const filename = `${sn}-${collectedAtString}.csv`;
			let filepath;
			
			//写入csv文件
			let rowData = {channelNo: 1, t: t1, fre: fre1, mod: mod1, collectAt: collectedAtString};			
			filepath = await write2ChannFile(filename, rowData, this.state.isCurrentVersion);
			rowData = {channelNo: 2, t: t2, fre: fre2, mod: mod2, collectAt: collectedAtString};
			filepath = await append2ChannnFile(filename, rowData);
			rowData = {channelNo: 3, t: t3, fre: fre3, mod: mod3, collectAt: collectedAtString};
			filepath = await append2ChannnFile(filename, rowData);
			rowData = {channelNo: 4, t: t4, fre: fre4, mod: mod4, collectAt: collectedAtString};
			filepath = await append2ChannnFile(filename, rowData);	

			//写入realm数据库中
			this.writeToRealm(1, t1, fre1, mod1, Osmometer);						
			this.writeToRealm(2, t2, fre2, mod2, Osmometer);						
			this.writeToRealm(3, t3, fre3, mod3, Osmometer);						
			this.writeToRealm(4, t4, fre4, mod4, Osmometer);							
			
			Toast.show({ text: `保存成功 ${filepath}`, type: 'success' });
			// Toast.show({ text: `保存成功`, type: 'success' });
		}catch(err){
			Toast.show({ text: `数据保存失败 ${err}`, type: 'danger' });
		}
	}
	
	render(){
		const {fre1, fre2, fre3, fre4} = this.state.frequency;
		const {mod1, mod2, mod3, mod4} = this.state.mod;
		const {t1, t2, t3, t4} = this.state.temperature;
		const freCurrText = this.state.isCurrentVersion ? '电流：' : '频率：';
		const modeWaterText = this.state.isCurrentVersion ? '水位：' : '频模：';

		const tableHead = this.state.version === 'current' 
												? ['通道号', '时间', '电流', '水位'] 
												: ['通道号', '时间', '频率', '频模', '温度'];

		return(
			<Container>
				<NavigationEvents
          			onDidFocus={() => this.didFocus()}         
        		/>
				<Header>
					<Left style={{flex: 1}}>
						<Button transparent onPress={() => this.props.navigation.goBack()}>	
							<Icon name='arrow-back'/>
						</Button>
					</Left>
					<Body style={{flex:2, alignItems: 'center'}}>
						<Title>手动获取数据</Title>
					</Body>
					<Right style={{flex:1}}>
						<Button transparent>
	  						{this.state.isTapGather === true ? <ActivityIndicator size="small" color="#fff"/>
							  : <Text style={{color: "#fff"}}>可采集</Text>}
						</Button>
					</Right>
				</Header>			

				<Content>					
					<View style={{alignItems: 'center'}}>
						<Text style={{alignItems: 'center', fontSize: 20}}>当前数据列表</Text>
					</View>
					<View style={styles.tableContainer}>
				        <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
				          <Row data={tableHead} style={styles.tableHead} textStyle={styles.tableText}/>
				          <Rows data={this.state.channData2table} textStyle={styles.tableText}/>
				        </Table>
				    </View>

				    <ListItem noIndent>
				    	<Button primary block
							style={{height: 50, marginLeft: 5, marginRight: 5, flex: 1}}
							onPress={ () => this.getData() }
							>
							<Text style={{fontSize: 36, color: 'white'}}>采集</Text>
						</Button>

						<Button success block
							style={{height: 50, marginLeft: 5, marginRight: 5, flex: 1}}
							onPress={() => this.save()}>							
							<Text style={{fontSize: 36, color: 'white'}}>保存</Text>
						</Button>
				    </ListItem>					
					<Text>{this.state.dataText}</Text>									
				</Content>				
			</Container>
		);		
	}
}

const mapStateToProps = (state) => {
  return {
    connectedDevice: state.bles.connectedDevice,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {       
    disconnectDevice: () => dispatch(disconnectDevice()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManualGather);

//<Text>{this.state.dataText}</Text>
// <Separator bordered>
// <Text>通道1</Text>
// </Separator>
// <ListItem style={styles.listItem}>						
// <View style={styles.recordField}>
// 	<Text style={{flex: 1}}>时间：</Text>
// 	<Text style={styles.textStyle}>{this.state.collectAt}</Text>

// 	<Text style={{flex: 1}}>{freCurrText}</Text>
// 	<Text style={styles.textStyle}>{fre1}</Text>
// </View>
// </ListItem>

// <ListItem style={styles.listItem}>						
// <View style={styles.recordField}>
// 	<Text style={{flex: 1}}>{modeWaterText}</Text>
// 	<Text style={styles.textStyle}>{mod1}</Text>

// 	<Text style={{flex: 1}}>温度：</Text>
// 	<Text style={styles.textStyle}>{t1}</Text>
// </View>
// </ListItem>

// <Separator bordered>
// <Text>通道2</Text>
// </Separator>
// <ListItem style={styles.listItem}>						
// <View style={styles.recordField}>
// 	<Text style={{flex: 1}}>时间：</Text>
// 	<Text style={styles.textStyle}>{this.state.collectAt}</Text>

// 	<Text style={{flex: 1}}>{freCurrText}</Text>
// 	<Text style={styles.textStyle}>{fre2}</Text>
// </View>
// </ListItem>

// <ListItem style={styles.listItem}>						
// <View style={styles.recordField}>
// 	<Text style={{flex: 1}}>{modeWaterText}</Text>
// 	<Text style={styles.textStyle}>{mod2}</Text>

// 	<Text style={{flex: 1}}>温度：</Text>
// 	<Text style={styles.textStyle}>{t2}</Text>
// </View>
// </ListItem>

// <Separator bordered>
// <Text>通道3</Text>
// </Separator>
// <ListItem style={styles.listItem}>						
// <View style={styles.recordField}>
// 	<Text style={{flex: 1}}>时间：</Text>
// 	<Text style={styles.textStyle}>{this.state.collectAt}</Text>

// 	<Text style={{flex: 1}}>{freCurrText}</Text>
// 	<Text style={styles.textStyle}>{fre3}</Text>
// </View>
// </ListItem>

// <ListItem style={styles.listItem}>						
// <View style={styles.recordField}>
// 	<Text style={{flex: 1}}>{modeWaterText}</Text>
// 	<Text style={styles.textStyle}>{mod3}</Text>

// 	<Text style={{flex: 1}}>温度：</Text>
// 	<Text style={styles.textStyle}>{t3}</Text>
// </View>
// </ListItem>

// <Separator bordered>
// <Text>通道4</Text>
// </Separator>
// <ListItem style={styles.listItem}>						
// <View style={styles.recordField}>
// 	<Text style={{flex: 1}}>时间：</Text>
// 	<Text style={styles.textStyle}>{this.state.collectAt}</Text>

// 	<Text style={{flex: 1}}>{freCurrText}</Text>
// 	<Text style={styles.textStyle}>{fre4}</Text>
// </View>
// </ListItem>

// <ListItem style={styles.listItem}>						
// <View style={styles.recordField}>
// 	<Text style={{flex: 1}}>{modeWaterText}</Text>
// 	<Text style={styles.textStyle}>{mod4}</Text>

// 	<Text style={{flex: 1}}>温度：</Text>
// 	<Text style={styles.textStyle}>{t4}</Text>
// </View>
// </ListItem>
// 
// <View style={{flex: 1, flexDirection:'row', justifyContent: 'center', marginTop: 20}}>
// <Button primary block
// 	style={{height: 50, width:280, marginLeft: 5, marginRight: 5}}
// 	onPress={ () => this.getData() }
// 	>
// 	<Text style={{fontSize: 36, color: 'white'}}>采集</Text>
// </Button>

// <Button success block
// 	style={{height: 50, width:280, marginLeft: 5, marginRight: 5}}
// 	onPress={() => this.save()}>							
// 	<Text style={{fontSize: 36, color: 'white'}}>保存</Text>
// </Button>
// </View>