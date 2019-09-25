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
  CheckBox,
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

// import {Table} from 'shineout';

let HSBleManager;

class HistoryData extends React.Component {

	constructor(props){
		super(props);

		this.state = {								
			beginDatetime: '',	//閺冦儲婀￠弮鍫曟？闁瀚ㄩ崳銊			
			endDatetime: '',	//endDatetime

			frequency: {fre1:'', fre2:'', fre3:'', fre4: ''},
			mod: {mod1:'', mod2:'', mod3:'', mod4: ''},
			temperature: {T1:'', T2: '', T3: '', T4: ''},				
			collectAt: '',

			isSelectDate: false,
			isTapGather: false,	
			isCurrentVersion: false,//閺勵垰鎯佹稉铏规暩濞翠胶澧

			channData2table:[],//鐞涖劍鐗哥悰灞炬殶閹      	
      		dataText: '',
      		version: 'other',
      		realm: null,
      		vibrate: null,
      		current: null,

      		currentPage: 1,
      		pageSize: 5,
      		total: 10,
      		selectedValue: '',
		};
		
		HSBleManager = global.HSBleManager;	

		this.columns = [
	      {
	        title: 'Id',
	        render: 'id',	        width: 70,
	        sorter: this.handleSorter.bind(this, 'id'),
	      },
	      { title: 'First Name', render: 'firstName' },
	      { title: 'Last Name', render: 'lastName', sorter: this.handleSorter.bind(this, 'lastName') },
	      { title: 'Office', render: 'office' },
	      { title: 'Start Date', render: 'start', sorter: this.handleSorter.bind(this, 'start') },
	    ]			
	}	

	handlePageChange = (current, pageSize) => {
	  this.setState({ current, pageSize });
	}

	handleSorter = (name, order) => {
	  this.setState({ sorter: { name, order }, current: 1 }, this.fetchData)
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
			this.showToast('请选择起始时间和结束时间！');
			return;
		}else if(!this.isAnyDeviceConn()){
			this.props.disconnectDevice();
			this.showToast('蓝牙未连接渗压计，请先设置');
			return;
		}
		
		const realm = this.state.realm;
		const beginDatetime = moment( this.state.beginDatetime).toDate();
		const endDatetime = moment( this.state.endDatetime).toDate();
		
		// const deviceSN = this.props.connectedDevice.name.toString();
		const deviceSN = 'HS32204J70002';

		console.log(`开始时间：${beginDatetime}, 结束时间：${endDatetime}`);
		const beginNumber = moment( this.state.beginDatetime).toDate().getTime();
		const endNumber = moment( this.state.endDatetime).toDate().getTime();
		if(beginNumber >= endNumber){
			this.showToast("开始时间不得大于结束时间！");
			return;
		}
		let hasRealmData = false;
		if(this.state.version == 'current') {
			this.setState({ channData2table: [] });			
			let current = realm.objects('OsmometerCurrent').filtered('sn == $0 && sysTime >= $1 && sysTime <= $2', deviceSN, beginDatetime, endDatetime);			
			if(current.length > 0) {
				hasRealmData = true;
				this.setState({ isTapGather: false, isSelectDate: true });

				let allData = [];
				for (let j = 0; j < current.length; j++) {   	
					const sysTime = moment(vibrate[j].sysTime).format('YYYY-MM-DD hh:mm:ss');			
	   				for( let i = 0; i < current[j].currentArr.length; i++) {
		        		const channelNo = current[j].currentArr[i].channelNo;
		        		const current = current[j].currentArr[i].current;//閻㈠灚绁
		        		const waterLevel = current[j].currentArr[i].waterLevel;	        		
		        		console.log(`${i}-通道：${channelNo}, 电流:${current}, 水位：${waterLevel}`);	

		        		const singleData = [channelNo, sysTime, current, waterLevel];
			        	allData.push(singleData);		        		
		        	}		        	  	        
	   			}
	   			this.setState({ channData2table: allData });
			}
		}else if(this.state.version === 'other') {
			this.setState({ channData2table: [] });
			let vibrate = realm.objects('OsmometerVibrate').filtered('sn == $0 && sysTime >= $1 && sysTime <= $2', deviceSN, beginDatetime, endDatetime);			
			if(vibrate.length > 0) {
				hasRealmData = true;
				console.log(`振弦时间：${vibrate[0].sysTime}`);

				let allData = [];
				for (let j = 0; j < vibrate.length; j++) {   				
					const sysTime = moment(vibrate[j].sysTime).format('YYYY-MM-DD hh:mm:ss');
	   				for( let i = 0; i < vibrate[j].vibrateArr.length; i++) {
		        		const channelNo = vibrate[j].vibrateArr[i].channelNo;
		        		const frequency = vibrate[j].vibrateArr[i].frequency;
		        		const mode = vibrate[j].vibrateArr[i].mode;
		        		const temperature = vibrate[j].vibrateArr[i].temperature;
		        		console.log(`${i}-通道：${channelNo}, 模式：${mode}, 频率：${frequency}, 温度：${temperature}`);	
		        		const singleData = [channelNo, sysTime, frequency, mode, temperature];
		        		allData.push(singleData);		        		
		        	}
	   			}	   				   					      					
				this.setState({ channData2table: allData, isTapGather: false, isSelectDate: true });  
			}else {
				const time = new Date();
				console.log('创建表格${time.toString()}');
			}		   			   		      	
		}

		//数据库没有数据
		if(!hasRealmData) {
			try {			
				if(this.isAnyDeviceConn()){
					//清空数据				
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
					this.showToast('蓝牙未连接渗压计，请先设置');
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
				console.log(`-1-水位：${level}`);
				level = 0;
			}else {
				level = 5 * (fre - 4) / (20 - 4);
				console.log(`-2-水位：${level}`);
			}
			waterLevel[i] = Math.round(level*100)/100;
		}
		return waterLevel;
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
	        this.showToast('设备断开蓝牙');           
	        console.log('设备断开蓝牙-err0', err);			        
	      }else{
	        this.props.disconnectDevice();  
	        this.showToast('蓝牙已断开');                   
	        console.log('蓝牙已断开-noErr0', device.id, device.name);
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
      		// const result = parseBuffer.push2parse(buffer);   
      		const result = parseBuffer.push(buffer);

      		let cacheBuffer = Buffer.alloc(0); // 閺嗗倸鐡ㄩ弫鐗堝祦
      		cacheBuffer = Buffer.concat([cacheBuffer, buffer]);
      		this.consoleBuffer(cacheBuffer, '接收到数据:');	 

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
					let waterLevel;//濮樼繝缍
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
	      				this.showToast('设备休眠......');
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

		const tableHead = this.state.version === 'current' 
												? ['通道号', '时间', '电流', '水位'] 
												: ['通道号', '时间', '频率', '频模', '温度'];
		const checkBox = (data, index) => {
			<CheckBox checked={false}/>
		};		

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
						>
					  		{this.state.isTapGather ? <ActivityIndicator size="small" color="#fff"/>
											  		: null}
						</Button>
					</Right>
				</Header>			
				<Content>	
					<View style={{flexDirection: 'row', alignItems: 'center'}}>
						<Text style={{alignItems: 'center'}}> 从 </Text>
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
				        <Text style={{alignItems: 'center'}}> 到 </Text>
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
				        <Button primary onPress={() => this.getHisData()}
							        	disabled={this.state.isTapGather}
							        	style={{marginLeft: 5, marginTop: 5, marginBottom: 5, alignItems: 'center', marginRight: 10}}>
				        	<Text style={{fontSize: 23, color: 'white'}}>获取</Text>
				        </Button>
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

// <Table
// 	data={this.allData}
// 	keygen='id'
// 	format='id'
// 	columns={this.columns}
// 	onRowSelect={value =>{
// 		this.setState({selectedValue: value})
// 	}}
// 	pagination={{
// 		align: 'center',
// 		currentPage,
// 		pageSize,
// 		onChange: this.handlePageChange,
// 		total,
// 	}}
// />

//<Button onPress={() => this.props.navigation.navigate('CheckableDataTable')}>Open DataTable</Button>
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
