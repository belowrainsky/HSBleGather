import React from 'react';
import {
  View, 
  Text,
  Alert,
  TextInput,
  Picker,  
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
  List,
  Toast,
  Input,  
  
} from 'native-base';

import parseBuffer from '../../lib/parseBuffer';
import { connect } from 'react-redux';
import { NavigationEvents } from 'react-navigation';
import {
  disconnectDevice,
} from '../../actions/bleAction';
import { Buffer } from 'buffer';
import DateTimePicker from 'react-native-datepicker';

import styles from './styles';
import openRealm from '../../lib/realmStorage';

let HSBleManager;

class DeviceMsg extends React.Component {

	constructor(props){
		super(props);
		this.state = {
			SN: '',
			deviceType: '',			
			deviceVolt: 0.0,
			gatherFunc: '',
			networkFunc: '',
			networkQuality: 0,
			gatherFre: '',	//监测间隔
			systemTime: '',			
			timeType: 'minute',	//时间类型：minute 或 hour	
			
			realm: null,
			setMsg: null,	
			isSetBtnClick: false,
			hasDevMsg: false,				
		};
		HSBleManager = global.HSBleManager;
	}	

	didFocus(){
		if (this.props.connectedDevice) {
	      HSBleManager.negotiateMtu().then(() => {
	        	HSBleManager.monitor(this.monitorListener)
	    	});
	    }	
	    this.onDisconnect();	
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
		      openRealm().then((realm) => {
			    this.setState({ realm });
			  });			      		     
	    }else {	    	
			try{
		      openRealm().then((realm) => {
		      	// const deviceName = this.props.connectedDevice.name.toString();
		      	const deviceName = 'HS32204J70000';
		      	const devs = realm.objects('setMsg').filtered('devNo == $0', deviceName)[0];	      	
		      	if(devs) {	      		
		      		this.setState({
		      			SN: devs.devNo,
		      			deviceType: devs.devType,
		      			deviceVolt: devs.volt,
		      			gatherFunc: devs.gatherFunc,
		      			networkFunc: devs.DtuFunc,
		      			networkQuality: devs.Csq,	      			
		      			systemTime: devs.time,  

		      			gatherFre: devs.interval.toString(),
		      			timeType: devs.intervalType,
		      		});
			      		this.setState({ setMsg: devs, realm });
			      		console.log(`-找到设备数据-`);
			      	}else {
			      		this.setState({ realm });
			      		console.log(`没有找到设备数据`);
			      	}
			      	console.log(`----打开数据库---`);
			     });
		      }catch(err){
		      	this.showToast(`获取设备信息错误：${err}`);
		      }
		    }	        	       
 	}

 	componentWillUnmount() {
 		this.disconnectListener && this.disconnectListener.remove();
 		this.setDeviceMsgTimer && clearTimeout(this.setDeviceMsgTimer);
 		this.getDeviceMsgTimer && clearTimeout(this.getDeviceMsgTimer); 		
 		this.monitorListener && clearTimeout(this.monitorListener);
 		
 		this.setState = (state, callback) => {
      		return;
   		};
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
      		 
      		if(result){
      			if(result.sn){
	      			const snNo = result.sn;
	      			let type = 'HDA';
	      			if(snNo[2] === '1')
	      			{
	      				type = 'RDM' ;
	      			}else if(snNo[2] === '2'){
	      				type = 'SDM';
	      			}else if(snNo[2] === '3'){
	      				type = 'HDA';
	      			}
	      			type = 'HS' + '-' + type + snNo.substring(3, 7);
	      			const deviceType = 
	      			this.setState({      				
	      				SN: `${snNo}`, 
	      				deviceType: type,	
	      			});
	      		}
	      		if(result.volt){
	      			const volt = result.volt;
	      			this.setState({      				
	      				deviceVolt: volt,			
	      			});      	
	      		}
	      		if(result.frequency){//监测间隔
	      			let gatherFre = result.frequency;	 
	      			if(gatherFre >= 60){
	      				gatherFre = gatherFre / 60;
	      				this.setState({timeType: 'hour'});
	      			}else{
	      				this.setState({timeType: 'minute'});
	      			}
	      			this.setState({      				
	      				gatherFre: `${gatherFre}`,
	      			});      	
	      		}
	      		if(result.SysTime){
	      			const systemTime = result.SysTime;
	      			this.setState({      				
	      				systemTime: `${systemTime}`,
	      				hasDevMsg: true,   				
	      			});      	
	      		}
	      		if(result.state){
	      			const state = result.state;
	      			
	      			if(state === 22){
	      				this.showToast('写入命令失败!');	      				
	      			}else if(state === 23){
	      				this.showToast('唤醒成功');
	      			}else if(state === 18){
	      				this.showToast('设备休眠...');
	      			}else if(state === 19){
	      				this.showToast('设备繁忙...');
	      			}else if(state === 23 && this.state.isSetBtnClick){
	      				this.showToast('设置成功');
	      				this.setMsgTbl(result);
	      			}else if(state === 22 && this.state.isSetBtnClick){
	      				this.setState({ isSetBtnClick: false });
	      			}

	      		}  
	      		if(result.dtuCsq) {
	      			console.log(`网络通信质量：${result.dtuCsq}`);
	      			const dtuCsq = parseInt(result.dtuCsq);
	      			this.setState({
	      				networkQuality: dtuCsq,
	      			});
	      		} 	
	      		if(result.modelStatus) {
	      			let modelStatus = result.modelStatus.toString();	      				      				      			      			
	      			console.log(`模块状态：${modelStatus}`);
	      			this.matchWhichStat(modelStatus);	      				      	
	      		}

	      		this.setMsgTbl(result);
	      		
	      		// if(result.sn && result.frequency && result.sysTime && result.dtuCsq && result.modelStatus){
	      		// 	const { realm, setMsg } = this.state;
	      		// 	realm.write(() => {
	      		// 		const devType = this.state.deviceType;
	      		// 		const devNo = this.state.SN;
	      		// 		const volt = this.state.deviceVolt;	      		
	      		// 		const gatherFunc = this.state.gatherFunc;
	      		// 		const DtuFunc = this.state.networkFunc;
	      		// 		const Csq = this.state.networkQuality;
	      		// 		const interval = this.state.gatherFre;
	      		// 		const intervalType = this.state.timeType;
	      		// 		const id = 1;
	      		// 		if(setMsg === null){
	      		// 			realm.create('setMsg', {id, devType, devNo, volt, gatherFunc, DtuFunc, Csq, interval, intervalType});
	      		// 		}else {
	      		// 			setMsg.devType = devType;
	      		// 			setMsg.devNo = devNo;
	      		// 			setMsg.volt = volt;
	      		// 			setMsg.gatherFunc = gatherFunc;
	      		// 			setMsg.DtuFunc = DtuFunc;
	      		// 			setMsg.Csq = Csq;
	      		// 			setMsg.interval = interval;
	      		// 			setMsg.intervalType = intervalType;
	      		// 		}	      				
	      		// 	});
	      		// }
      		}      		   		
	    }
	}

//设置设备信息到数据库
	setMsgTbl(result) {
		try{
			if(result.sn && result.frequency && result.SysTime && result.dtuCsq && result.modelStatus){
	  			let realm = this.state.realm;	  			

  				if(realm === null){
  					openRealm().then((realm) => {
  						this.setState({ realm });
  					});
  				}
	  			realm.write(() => {	
	  				// const devNo = this.state.SN;
		  			const devNo = 'HS32204J70000';
		  			const devType = this.state.deviceType;	  
		  			console.log(`设备型号111： ${devType}`);			
		  			let setMsg = realm.objects('setMsg').filtered('devNo == $0', devNo)[0];
		  			// let setMsg = this.state.setMsg;	  			
	  				const volt = this.state.deviceVolt;	      		
	  				const gatherFunc = this.state.gatherFunc;
	  				const DtuFunc = this.state.networkFunc;
	  				const Csq = this.state.networkQuality;
	  				const interval = parseInt(this.state.gatherFre);
	  				const intervalType = this.state.timeType;
	  				const time = this.state.systemTime;

	  				if(setMsg === undefined || setMsg === null) {
	  					setMsg = realm.create('setMsg', {devType, devNo, volt, gatherFunc, DtuFunc, Csq, interval, intervalType, time});
	  					console.log('创建setMsg！');
	  					this.setState({ setMsg });
	  				}else {
	  					setMsg.devType = devType;
	  					// setMsg.devNo = devNo;
	  					setMsg.volt = volt;
	  					setMsg.gatherFunc = gatherFunc;
	  					setMsg.DtuFunc = DtuFunc;
	  					setMsg.Csq = Csq;
	  					setMsg.interval = interval;
	  					setMsg.intervalType = intervalType;
	  					setMsg.time = time;
	  					console.log('更新setMsg！');
	  				}	      				
	  			});
	  			this.showToast('设置设备信息到数据库成功');
	  		}else {
	  			// this.showToast(`设置设备信息到数据库失败`);
	  			console.log('获取数据不全');
	  		}
		}catch(err){
			Toast.show({ text: `设置设备信息到数据库失败 ${err}`, type: 'danger' });
			console.log(`设置信息失败： ${err}`);
		}
	}

	matchWhichStat(modelState) {
		if(modelState.indexOf('3') !== -1) {
			this.setState({ networkFunc: 'DTU错误' });
		}else if(modelState.indexOf('4') !== -1){
			this.setState({ networkFunc: 'DTU正常' });
		}
		if(modelState.indexOf('7') !== -1){
			this.setState({ gatherFunc: '振弦错误' });
		}else if(modelState.indexOf('8') !== -1){			
			this.setState({ gatherFunc: '振弦正常' });
		}
	}

	getMsg() {
		if (!this.props.connectedDevice) {
			Alert.alert(
	        '提示',
	        '蓝牙未连接渗压计，请先设置',
	        [
	          {text: '设置', onPress: () => this.props.navigation.navigate('ManualConnect')},
	        ],
	      );
		} else {
			const buf = Buffer.from([0x12]);
			console.log(buf.readUIntBE(0, 1).toString());
			try{
				//缺少：采集功能、网络通信功能、网络通信质量
	    		HSBleManager.negotiateMtu().then(() => {
		        HSBleManager.write(parseBuffer.awakeDevice(), 2);
		        
		        this.getDeviceMsgTimer = setTimeout( () => {
		        	HSBleManager.write(parseBuffer.getOsmometerMsg(), 2)		
		       	 	}, 1500);
	    		});
			}catch(err) {
				this.showToast('设备已断开,请重新连接');
				this.props.disconnectDevice();
			}			
		}		
	}	

	setSysInfo() {
		if(!this.props.connectedDevice){			
			this.showAlert();				
		}else{
			HSBleManager.negotiateMtu().then(() => {
			let fre = [];

			let inputValue = this.state.gatherFre;
			let value;

			let interType = this.state.timeType;
			if(interType === 'minute') {
				if(inputValue >= 60) 
				{
					this.showToast('数值应该小于60分钟');
					return;
				}else if(60 % inputValue !== 0){
					this.showToast('间隔值取余60应为0');
					return;
				}else{
					value = parseInt(inputValue);
				}				

			}else if(interType === 'hour'){
				if(inputValue > 24) 
				{
					this.showToast('数值应该小于24小时');
					return;
				}
				value = parseInt(inputValue) * 60;
			}
			
			// let value = 1440 / parseInt(inputValue);//add 1440 /				
			// const valueInt = value;
			// value = parseInt(value).toString(16);				

			// let fre1, fre2;
			// if(valueInt >= 4096){				
			// 	fre1 = '0x'+ value[0] + value[1];
			// 	fre2 = '0x'+ value[2] + value[3];
				
			// }else if(valueInt > 255 && valueInt < 4096){				
			// 	fre1 = '0x'+ value[0];
			// 	fre2 = '0x'+ value[1] + value[2];
				
			// }else {				
			// 	fre1 = 0x00;
			// 	fre2 = '0x'+ value[0] + value[1];				
			// }
						
			console.log(`转为整数值value=${value}`);
			let fre1, fre2;
			const valueInt = value;
			value = parseInt(value).toString(16);
			if(valueInt > 255 && valueInt < 4096){				
				fre1 = '0x'+ value[0];
				fre2 = '0x'+ value[1] + value[2];
				
			}else if(valueInt < 255 && valueInt > 10){				
				fre1 = '0x00';
				fre2 = '0x'+ value[0] + value[1];				
			}else{
				fre1 = '0x00';
				fre2 = '0x0'+ value[0];
			}

			fre = [fre1, fre2];
			console.log(`频率：${fre1}, ${fre2}`);

			HSBleManager.negotiateMtu().then(() => {
				HSBleManager.write(parseBuffer.setFrequency(fre), 2);	        
	        
		        this.setDeviceMsgTimer = setTimeout(() => {
			       const ymd = parseBuffer.dateStrToHex(this.state.systemTime);		       
		        	HSBleManager.write(parseBuffer.setSysTime(ymd), 2);	        	
			    }, 1000);
			});

	        this.setState({isSetBtnClick: true});
	      });
		}	    
	}

	changeSysTime(date) {
		this.setState({
			systemTime: date,
		});
	}

	showAlert() {
		Alert.alert(
	        '提示',
	        '蓝牙未连接渗压计，请先设置',
	        [
	          {text: '设置', onPress: () => this.props.navigation.navigate('ManualConnect')},
	        ],
	     );
	}

	showToast(text, position = 'top', duration = 2000) {
      Toast.show({ text, position, duration });
  	}

	// 监听蓝牙断开
  	onDisconnect() {
      this.disconnectListener = HSBleManager.manager.onDeviceDisconnected(HSBleManager.peripheralId, (err, device) => {
      if (err) {             
        this.props.disconnectDevice();                
        console.log('设备断开蓝牙-设备页面', err);		
      }else{
        this.props.disconnectDevice();                     
        console.log('设备断开蓝牙-设备页面', device.id, device.name);
      }      
    });
  }

  _onPickerValueChange = (value, index) => {
  	console.log(`Picker值：${value}, index=${index}`);
  	this.setState({timeType: value});
  }

  formatDateTime() {
	let date = new Date();
	let y = date.getFullYear();
	let m = date.getMonth() + 1;
	m = m < 10 ? ('0' + m) : m;
	let d = date.getDate();
	d = d < 10 ? ('0' + d) : d;
	var h = date.getHours();
	h = h < 10 ? ('0' + h) : h;
	let minute = date.getMinutes();
	let second = date.getSeconds();
	minute = minute < 10 ? ('0' + minute) : minute;
	second = second < 10 ? ('0' + second) : second;
	const DateTimeStr = y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
	return DateTimeStr;
  };

  _getCurrentDateTime() {
  	const timeStr = this.formatDateTime();
  	this.setState({systemTime: timeStr});
  }

	render(){
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
						<Title>设备-系统 信息</Title>
					</Body>
					<Right style={{flex:1}}/>									
				</Header>			

				<Content>								
					<List>
						<ListItem style={styles.listItem}>						
							<View style={styles.recordField}>
								<Text style={{flex: 1}}>设备型号：</Text>
								<Text style={{flex: 1}}>{this.state.deviceType}</Text>								
							</View>
						</ListItem>	

						<ListItem style={styles.listItem}>						
							<View style={styles.recordField}>
								<Text style={{flex: 1}}>设备编号：</Text>
								<Text style={{flex: 1}}>{this.state.SN}</Text>								
							</View>
						</ListItem>

						<ListItem style={styles.listItem}>						
							<View style={styles.recordField}>
								<Text style={{flex: 1}}>设备电压：</Text>
								<Text style={{flex: 1}}>{this.state.deviceVolt}</Text>								
							</View>
						</ListItem>

						<ListItem style={styles.listItem}>						
							<View style={styles.recordField}>
								<Text style={{flex: 1}}>采集功能：</Text>
								<Text style={{flex: 1}}>{this.state.gatherFunc}</Text>								
							</View>
						</ListItem>

						<ListItem style={styles.listItem}>						
							<View style={styles.recordField}>
								<Text style={{flex: 1}}>网络通信功能：</Text>
								<Text style={{flex: 1}}>{this.state.networkFunc}</Text>								
							</View>
						</ListItem>

						<ListItem style={styles.listItem}>						
							<View style={styles.recordField}>
								<Text style={{flex: 1}}>网络通信质量：</Text>
								<Text style={{flex: 1}}>{this.state.networkQuality}</Text>								
							</View>
						</ListItem>

						<ListItem>
							<Text style={{flex: 1}}>监测间隔：</Text>					
							<TextInput
								keyboardType='numeric'
								onChangeText = {(text) => {
								 const newText = text.replace(/[^\d]+/, '');
								 this.setState({									
									gatherFre: newText
								  });
								}}
								value={this.state.gatherFre}
								placeholder="请输入数字"
								style={{textAlign: 'center', flex: 3}}
							/>
							<Picker
								selectedValue={this.state.timeType}
								onValueChange={this._onPickerValueChange}
								style={{flex: 1}}
							>
								<Picker.Item label='分钟' value='minute'></Picker.Item>
								<Picker.Item label='小时' value='hour'></Picker.Item>
							</Picker>
							
						</ListItem>

						<ListItem>							
							<Text>系统时间：</Text>							
							<DateTimePicker
					            style={{width: 200, flex: 2}}
					            date={this.state.systemTime}
					            mode="datetime"
					            placeholder="选择日期"
					            format="YYYY-MM-DD HH:mm:ss"
					            minDate="2000-01-01"
					            maxDate="2099-12-31"
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
					                marginLeft: 36
					              }              
					            }}
					            onDateChange={(date) => {this.changeSysTime(date)}}
				        	/>
				        	<Button success
				        			onPress={() => this._getCurrentDateTime()}
				        			style={{marginLeft: 5}}>
				        		<Text>当前时间</Text>
				        	</Button>							
						</ListItem>											
					</List>	
					<ListItem>
						<Button primary block
							style={{height: 50, marginLeft: 5, marginRight: 5, flex: 1}}
							onPress={ () => this.getMsg() }
							>
							<Text style={{fontSize: 36, color: 'white'}}>获取</Text>
						</Button>

						<Button success block
							style={{height: 50, marginLeft: 5, marginRight: 5, flex: 1}}
							onPress={() => this.setSysInfo()}>							
							<Text style={{fontSize: 36, color: 'white'}}>设置</Text>
						</Button>
					</ListItem>	

					<View style={{flex: 1, flexDirection:'row', justifyContent: 'center', marginTop: 20}}>
						
					</View>
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

export default connect(mapStateToProps, mapDispatchToProps)(DeviceMsg);