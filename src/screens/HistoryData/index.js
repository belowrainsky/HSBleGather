import React from 'react';
import {
  View, 
  Text,
  Alert,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
  Picker,
  FlatList,

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
import styles from "./styles";
import { Buffer } from 'buffer';
import parseBuffer from '../../lib/parseBuffer';
import { connect } from 'react-redux';
import {
  disconnectDevice,
} from '../../actions/bleAction';

import DateTimePicker from 'react-native-datepicker';
import { Table, Row, Rows } from 'react-native-table-component';
import moment from 'moment';
import openRealm from '../../lib/realmStorage';

let HSBleManager;

class HistoryData extends React.Component {

	constructor(props){
		super(props);		

		this.state = {								
			beginDatetime: '',	//日期时间选择器值			
			endDatetime: '',	//endDatetime

			frequency: {fre1:'', fre2:'', fre3:'', fre4: ''},
			mod: {mod1:'', mod2:'', mod3:'', mod4: ''},
			temperature: {T1:'', T2: '', T3: '', T4: ''},				
			collectAt: '',

			isSelectDate: false,
			isTapGather: false,	
			isCurrentVersion: false,//是否为电流版			

			channData2table:[],//表格行数据      		
      		dataText: '',
      		version: 'other',
      		realm: null,
      		vibrate: null,
      		current: null,
		};
		
		HSBleManager = global.HSBleManager;				
	}

	isAnyDeviceConn() {
		if(!this.props.connectedDevice)		
		{
			Alert.alert(
	        '提示',
	        '蓝牙未连接渗压计，请先设置',
	        [
	          {text: '设置', onPress: () => this.props.navigation.navigate('ManualConnect')},
	        ],
	      );
			return false;
		}else {
			return true;
		}
	}

	chooseBeginData(date) {			
		this.setState({
			beginDatetime: date,				
		});			
	}	

	chooseEndData(date) {
		this.setState({ 
			endDatetime: date, 				
		});
		this.getHisData(date);		
	}

	addData2table() {
		const time='2019-08-14 13:16:23';
		const channelNo = 1;
		const fre = 1.2;
		const freMode = 2.3;
		const temperature = 26;
		let aData = [channelNo, time, fre, freMode, temperature];
		this.state.channData2table.push(aData);
		
		this.setState({ channData2table: this.state.channData2table });		
	}

	getHisData(date) {	
		if(this.state.beginDatetime === '' || this.state.endDatetime === '') {
			this.showToast('请选择开始和结束日期');
			return;
		}else if(!this.isAnyDeviceConn()){
			this.props.disconnectDevice();
			this.showToast('设备断开，请重新连接');
			return;
		}
		
		const realm = this.state.realm;
		const beginDatetime = moment( this.state.beginDatetime).toDate();
		const endDatetime = moment( this.state.endDatetime).toDate();
		
		// const deviceSN = this.props.connectedDevice.name.toString();
		const deviceSN = 'HS32204J70002';

		console.log(`开始时间：${beginDatetime}, 结束时间：${endDatetime}`);

		let hasRealmData = false;
		if(this.state.version == 'current') {			
			let current = realm.objects('OsmometerCurrent').filtered('sn == $0 && sysTime >= $0 && sysTime <= $1', deviceSN, beginDatetime, endDatetime);			
			if(current.length > 0) {
				hasRealmData = true;
			}

			let allData = [];
			for (let j = 0; j < current.length; j++) {   	
				const sysTime = moment(vibrate[j].sysTime).format('YYYY-MM-DD hh:mm:ss');			
   				for( let i = 0; i < current[j].currentArr.length; i++) {
	        		const channelNo = current[j].currentArr[i].channelNo;
	        		const current = current[j].currentArr[i].current;//电流
	        		const waterLevel = current[j].currentArr[i].waterLevel;	        		
	        		console.log(`${i}-通道号：${channelNo}, 电流:${current}, 水位：${waterLevel}`);	

	        		const singleData = [channelNo, sysTime, current, waterLevel];
		        	allData.push(singleData);		        		
	        	}
	        	this.setState({ channData2table: allData, isTapGather: false, isSelectDate: true });  
   			}
		}else if(this.state.version === 'other') {
			this.setState({ channData2table: [] });
			let vibrate = realm.objects('OsmometerVibrate').filtered('sn == $0 && sysTime >= $1 && sysTime <= $2', deviceSN, beginDatetime, endDatetime);			
			// let vibrate = realm.objects('OsmometerVibrate').filtered('sn == $0', deviceSN);			
			
			if(vibrate.length > 0) {
				hasRealmData = true;
				console.log(`系统时间：${vibrate[0].sysTime}`);

				let allData = [];
				for (let j = 0; j < vibrate.length; j++) {   				
					const sysTime = moment(vibrate[j].sysTime).format('YYYY-MM-DD hh:mm:ss');
	   				for( let i = 0; i < vibrate[j].vibrateArr.length; i++) {
		        		const channelNo = vibrate[j].vibrateArr[i].channelNo;
		        		const frequency = vibrate[j].vibrateArr[i].frequency;
		        		const mode = vibrate[j].vibrateArr[i].mode;
		        		const temperature = vibrate[j].vibrateArr[i].temperature;
		        		console.log(`${i}-通道号：${channelNo}, 频模：${mode}, 频率：${frequency}, 温度：${temperature}`);	
		        		const singleData = [channelNo, sysTime, frequency, mode, temperature];
		        		allData.push(singleData);		        		
		        	}
	   			}
	   				   					      						
				this.setState({ channData2table: allData, isTapGather: false, isSelectDate: true });  
			}else {
				const time = new Date();
				console.log('没有找到数据！时间：${time.toString()}');
			}		   			   		      	
		}

		//如果数据库没有数据，再发送指令获取
		if(!hasRealmData) {
			try {			
				if(this.isAnyDeviceConn()){
					//清除数据				
					this.setState({ channData2table: [] });	

					this.setState({
						isTapGather: true,
						isSelectDate: true,
					});
					const beginDatetime = this.state.beginDatetime;
					const endDatetime = this.state.endDatetime;
					const beginYMD = parseBuffer.dateStrToHex(beginDatetime);
					const endYMD = parseBuffer.dateStrToHex(endDatetime);			
					
					HSBleManager.negotiateMtu().then(() => {
						HSBleManager.write(parseBuffer.awakeDevice(), 2);   				   
				
						setTimeout( () => {
						      HSBleManager.write(parseBuffer.getHistoryData(beginYMD, endYMD), 2);
						}, 1000 );
					});				
				}	
			}catch(err) {
				if(err.errorCode === 201 || err.errorCode === 205){
					this.props.disconnectDevice();
					this.showToast('设备断开，请重新连接');
				}
			}
		}				
	}

 	calFreMode(valueArray) {
		let freModes=[];
		for (let i =0; i<valueArray.length; i++){
			const value = (valueArray[i] ** 2) / 1000;
			freModes[i] = value.toFixed(3);
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

	componentDidMount() {
   		if (!this.props.connectedDevice) {
	      Alert.alert(
	        '提示',
	        '蓝牙未连接渗压计，请先设置',
	        [
	          {text: '设置', onPress: () => this.props.navigation.navigate('ManualConnect')},
	        ],
	      );
	    }
	    if(this.props.connectedDevice) {
      		const deviceType = this.props.connectedDevice.name.toString().substring(2, 4);
      		if(deviceType == '33') {
      			this.setState({ version: 'current' });
      		}else{
      			this.setState({ version: 'other' });
      		}
	    }
	    openRealm().then((realm) => {
	    	this.setState({ realm });
	    });
	}

	componentWillUnmount() {
		this.disconnectListener && this.disconnectListener.remove();
		this.tableRender && clearTimeout(this.tableRender);
		HSBleManager.unmonitor();
		this.setState = (state, callback) => {
      		return;
   		};	
   		this.getCurSaveDataTimer && clearTimeout(this.getCurSaveDataTimer);
	}

	didFocus(){
		if (this.props.connectedDevice) {
	      HSBleManager.negotiateMtu().then(() => {
	        HSBleManager.monitor(this.monitorListener)
	      });
	    }

	    this.onDisconnect();
	}

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

	showToast(text, position = 'bottom', duration = 2000) {
      Toast.show({ text, position, duration });
  	}

  	consoleBuffer(b, title = '') {	  
	  const string = Array.from(b).map(byte => byte.toString(16)).join(' ');
	  console.log(`${title}Buffer ${string}`);
	  this.setState({dataText: string});
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
      		const result = parseBuffer.push2parse(buffer);   
      		// const result = parseBuffer.push(buffer);

      		let cacheBuffer = Buffer.alloc(0); // 暂存数据
      		cacheBuffer = Buffer.concat([cacheBuffer, buffer]);
      		this.consoleBuffer(cacheBuffer, '接收');	 

      		if(result){   
      			if(result.sn){	      			
	      			const snNo = result.sn;	      			      		
	      			if(snNo[2] === '3' && snNo[3] === '3'){
	      				this.setState({ isCurrentVersion: true });
	      			}
	      		}	

	      		if((result.channelsFre && result.channelsTemperature) || result.current  && result.SysTime) {

	      			let mode;
	      			let fre;
	      			if(result.channelsFre) {
	      				fre = result.channelsFre;
	      				mode = this.calFreMode(result.channelsFre);
	      			}	      			
	      			const celsius = result.channelsTemperature;
	      			const systemTime = result.SysTime;

					let currValue;
					let waterLevel;//水位
	      			if(result.current){
	      				currValue = result.current;
	      				waterLevel = this.calWaterLevel(currValue)
	      			}	      				      			

	      			this.setState({ 	      				 
	      				isTapGather: false,	
	      			});

	      			let allData = [];
	      			for(let index = 0; index < 4; index++) {	
	      				if(this.state.isCurrentVersion){
	      					const singleData = [index+1, systemTime, currValue[index], waterLevel[index]];		      				
		      				allData.push(singleData);
		      				
	      				}else {
	      					const singleData = [index+1, systemTime, fre[index], mode[index], celsius[index]];		      				
		      				allData.push(singleData);		      				
	      				} 	      								      				
	      			}
	      			this.state.channData2table = this.state.channData2table.concat(allData);
	      			this.setState({ channData2table: this.state.channData2table });  				      		
	      		}
	      	
	      		if(result.state && this.state.isSelectDate){
	      			const state = result.state;	      			
	      			if(state === 22){
	      				this.showToast('唤醒设备失败!');	      				
	      				this.setState({isTapGather: false});
	      			}else if(state === 23) {	      				
	      				console.log(`唤醒设备成功~`);	      				
	      				this.showToast('设置设备成功...');
	      			}else if(state === 18 || state === 25){
	      				this.showToast('设备休眠...');
	      				this.setState({isTapGather: false});
	      			}else if(state === 19){
	      				this.showToast('设备繁忙...');
	      				this.setState({isTapGather: false});
	      			}
	      		}  
      		}      		   		
	    }
	}		
	
	render(){
		const {fre1, fre2, fre3, fre4} = this.state.frequency;
		const {mod1, mod2, mod3, mod4} = this.state.mod;
		const {t1, t2, t3, t4} = this.state.temperature;
		const cols = 5;
		// const tableHead = this.state.isCurrentVersion ? ['通道号', '时间', '电流', '水位'] 
		// 											  : ['通道号', '时间', '频率', '频模', '温度'];
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
						<Title>历史数据</Title>
					</Body>
					<Right style={{flex:1}}>
						<Button transparent 
						onPress={() => this.getHisData()}
						disabled={this.state.isTapGather}
						>
					  		{this.state.isTapGather ? <ActivityIndicator size="small" color="#fff"/>
											  : <Text style={{color: "#fff"}}>可选取</Text>}
						</Button>
					</Right>
				</Header>			
				<Content>	
					<ListItem>
						<Text style={{flex: 0.5, alignItems: 'center'}}> 从 </Text>
							<DateTimePicker
					            style={{height: 40, flex: 2.5}}
					            date={this.state.beginDatetime}
					            mode="datetime"
					            placeholder="选择开始日期"
					            format="YYYY-MM-DD HH:mm:ss"
					            minDate="2000-01-01 00:00:01"
					            maxDate="2099-12-31 23:59:59"
					            confirmBtnText="Confirm"
					            cancelBtnText="Cancel"
					            customStyles={{
					              dateIcon: {
					                position: 'absolute',
					                left: 0,
					                top: 4,
					                marginLeft: 0
					              },
					              dateInput: {
					                marginLeft: 36,
					                borderWidth: 1,
					              }
					            }}				            
					            onDateChange={(date) => {this.chooseBeginData(date)}}
					        />
					        <Text style={{flex: 0.5, alignItems: 'center'}}> 到 </Text>
					        <DateTimePicker
					            style={{height: 40, flex: 2.5}}
					            date={this.state.endDatetime}
					            mode="datetime"
					            placeholder="选择结束日期"
					            format="YYYY-MM-DD HH:mm:ss"
					            minDate="2000-01-01 00:00:01"
					            maxDate="2099-12-31 23:59:59"
					            confirmBtnText="Confirm"
					            cancelBtnText="Cancel"
					            customStyles={{
					              dateIcon: {
					                position: 'absolute',
					                left: 0,
					                top: 4,
					                marginLeft: 0
					              },
					              dateInput: {
					                marginLeft: 36,
					                borderWidth: 1,
					              }
					            }}				            
					            onDateChange={(date) => {this.chooseEndData(date)}}
					        />
					</ListItem>					
					<View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
						
					</View>		

					<View style={{alignItems: 'center'}}>
						<Text style={{alignItems: 'center', fontSize: 20}}>历史数据列表</Text>
					</View>
											
					<View style={styles.tableContainer}>
				        <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
				          <Row data={tableHead} style={styles.tableHead} textStyle={styles.tableText}/>
				          <Rows data={this.state.channData2table} textStyle={styles.tableText}/>
				        </Table>
				    </View>
				</Content>				
			</Container>
		)		
	}
}

//<Text>{this.state.dataText}</Text>		

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

export default connect(mapStateToProps, mapDispatchToProps)(HistoryData);
