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
  Tab,
  Tabs,
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
import moment from 'moment';

import fieldValueArr from '../../field/fieldValueArr';

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
			networkQuality: '',
			gatherFre: '',	//监测间隔
			systemTime: '',			
			timeType: 'minute',	//时间类型：minute 或 hour
			
			realm: null,
			setMsg: null,	
			isSetBtnClick: false,
			hasDevMsg: false,		

			// dataText: '',

			inspireWay: '',
			lowFre: '2000',
			highFre: '3500',
			themistorBValue: '',
			exThemistorValue: '',
			disable: false,
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
		   //    openRealm().then((realm) => {
			  //   this.setState({ realm });
			  // });		      		     
	    }else {	    	
			// try{
		 //      openRealm().then((realm) => {
		 //      	const deviceName = this.props.connectedDevice.name.toString();
		      	
		 //      	const devs = realm.objects('setMsg').filtered('devNo == $0', deviceName)[0];	      	
		 //      	if(devs) {	      		
		 //      		this.setState({
		 //      			SN: devs.devNo,
		 //      			deviceType: devs.devType,
		 //      			deviceVolt: devs.volt,
		 //      			gatherFunc: devs.gatherFunc,
		 //      			networkFunc: devs.DtuFunc,
		 //      			networkQuality: devs.Csq,	      			
		 //      			systemTime: devs.time,  

		 //      			gatherFre: devs.interval.toString(),
		 //      			timeType: devs.intervalType,
		 //      		});
			//       		this.setState({ setMsg: devs, realm });
			//       		console.log(`-找到设备数据-`);
			//       	}else {
			//       		this.setState({ realm });
			//       		console.log(`没有找到设备数据`);
			//       	}
			//       	console.log(`----打开数据库---`);
			//      });
		 //      }catch(err){
		 //      	this.showToast(`获取设备信息错误：${err}`);
		 //    }
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

 	consoleBuffer(b, title = '') {	  
	  const string = Array.from(b).map(byte => byte.toString(16)).join(' ');
	  // console.log(`${title}Buffer ${string}`);
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
      		const result = parseBuffer.push2parse(buffer);    

			const isGetDevMsgSucc = buffer.indexOf(fieldValueArr.rtnGetDevMsgArr());
      		// let cacheBuffer = Buffer.alloc(0); // 暂存数据
      		// cacheBuffer = Buffer.concat([cacheBuffer, buffer]);
      		// this.consoleBuffer(cacheBuffer, '数据');		     		
      		 
      		if(result) {
      			if(result.sn){
	      			const snNo = result.sn;
	      			let type = 'HDA';
	      			let dev, commWay, channNo;
	      			if(snNo[2] === '1')
	      			{
	      				type = 'RDM' ;
	      			}else if(snNo[2] === '2'){
	      				type = 'SDM';
	      			}else if(snNo[2] === '3'){
	      				type = 'HDA';
	      			}
	      			if(snNo[3] === '1'){
	      				dev = '全功能版';
	      			}else if(snNo[3] === '2'){
	      				dev = '振弦版';
	      			}else if(snNo[3] === '3'){
	      				dev = '电流版';
	      			}else if(snNo[3] === '4'){
	      				dev = '电压版';
	      			}else if(snNo[3] === '5'){
	      				dev = '差阻版';
	      			}

	      			if(snNo[4] === '1'){
	      				commWay = '4G';
	      			}else if(snNo[4] === '2'){
	      				commWay = 'NB';
	      			}else if(snNo[4] === '3'){
	      				commWay = 'Mesh';
	      			}else if(snNo[4] === '4'){
	      				commWay = 'Lora';
	      			}else if(snNo[4] === '5'){
	      				commWay = 'BT';
	      			}else if(snNo[4] === '6'){
	      				commWay = '485';
	      			}else if(snNo[4] === '6'){
	      				commWay = '232';
	      			}

	      			commWay += '网络';

	      			if(snNo[6] === '1'){
	      				channNo = '1通道';
	      			}else if(snNo[6] === '2'){
	      				channNo = '2通道';
	      			}else if(snNo[6] === '3'){
	      				channNo = '3通道';
	      			}else if(snNo[6] === '4'){
	      				channNo = '4通道';
	      			}

	      			type = 'HS' + '-' + type + ' ' + dev + ' '
	      					+ commWay + ' ' + channNo;
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
	      		if(result.SysTime && isGetDevMsgSucc !== -1){
	      			const systemTime = result.SysTime;
	      			this.setState({      				
	      				systemTime: `${systemTime}`,
	      				hasDevMsg: true,   				
	      			});      	
	      		}

	      		if(result.inspireWay) 
	      		{
	      			const inspireWay = result.inspireWay === 0x68 ? 'customize' : 'wholeFre';
	      			this.setState({inspireWay: inspireWay});
	      			if(inspireWay === 'customize'){
	      				this.setState({disable: true});
	      			}else{
	      				this.setState({disable: false});
	      			}
	      		}

	      		if(result.lowFre){
	      			const lowFre = result.lowFre + '';
	      			this.setState({lowFre: lowFre});
	      		}

	      		if(result.highFre){
	      			const highFre = result.highFre + '';
	      			this.setState({highFre: highFre});
	      		}

	      		if(result.themistorBValue){
	      			const themistorBValue = result.themistorBValue + '';
	      			this.setState({themistorBValue: themistorBValue});
	      		}

	      		if(result.exThemistorValue){
	      			const exThemistorValue = result.exThemistorValue + '';
	      			this.setState({exThemistorValue: exThemistorValue});
	      			const isGetVibreateParasSucc = buffer.indexOf(fieldValueArr.rtnGetVibrateParasArr());
	      			if(isGetVibreateParasSucc !== -1)
	      			{
	      				this.showToast('获取振弦参数成功');
	      			}
	      		}

	      		if(result.state){
	      			const state = result.state;
	      			// const isSetVibrateParasSucc = buffer.indexOf(Buffer.from([0x04, 0x00, 0x00, 0x00, 0x01]));
	      			const isSetVibrateParasSucc = buffer.indexOf(fieldValueArr.rtnSetVibrateParasArr());
	      			const isSetDevIntervalSucc = buffer.indexOf(fieldValueArr.rtnSetDevIntervalArr());
	      			const isSetDevSysTimeSucc = buffer.indexOf(fieldValueArr.rtnSetDevSysTimeArr());

	      			console.log(`设置参数：${isSetVibrateParasSucc}`);
	      			if(state === 22 && isSetVibrateParasSucc !== -1){	      				
	      				this.showToast('设置振弦参数失败!');	      				
	      			}else if(state === 23 && isSetVibrateParasSucc !== -1){	//&& isSetVibrateParasSucc !== -1
	      				this.showToast('设置振弦参数成功');
	      			}else if(state === 18){
	      				this.showToast('设备休眠...');
	      			}else if(state === 19){
	      				this.showToast('设备繁忙...');
	      			}else if(state === 22 && this.state.isSetBtnClick){
	      				this.setState({ isSetBtnClick: false });
	      			}else if(state === 23 && isSetDevIntervalSucc !== -1 && isSetDevSysTimeSucc !== -1){
	      				this.showToast('设置监测间隔和系统时间成功！');
	      				// this.setMsgTbl(result);
	      			}else if(state === 23 && this.state.isSetBtnClick){
	      				// this.showToast('设置成功');
	      				// this.setMsgTbl(result);
	      			}

	      			if(state == 22 && isSetDevIntervalSucc !== -1){
	      				this.showToast('设置监测间隔失败！');
	      			}
	      			if(state == 22 && isSetDevSysTimeSucc !== -1){
	      				this.showToast('设置系统时间失败！');
	      			}
	      		}  

	      		if(result.dtuCsq) {
	      			console.log(`网络通信质量：${result.dtuCsq}`);
	      			const dtuCsq = parseInt(result.dtuCsq);
	      			let dtuState;
	      			if(dtuCsq >= -51 && dtuCsq <= -53){
	      				dtuState = '无效';
	      			}else if(dtuCsq >= -113 && dtuCsq <= -74) {
	      				dtuState = '差';
	      			}else if(dtuCsq >= -73 && dtuCsq <= -61) {
	      				dtuState = '良';
	      			}else if(dtuCsq >= -62 && dtuCsq <= -55) {
	      				dtuState = '优';
	      			}
	      			this.setState({
	      				networkQuality: dtuState,
	      			});
	      		} 	
	      		if(result.modelStatus && result.sn) {
	      			let modelStatus = result.modelStatus.toString();
	      			let SN = result.sn;	      				      				      				      			      		
	      			console.log(`模块状态：${modelStatus}`);
	      			this.matchWhichStat(modelStatus, SN[3]);     				      
	      		}

	      		// this.setMsgTbl();//保存到数据库中	      	
      		}      		   		
	    }
	}

//设置设备信息到数据库
	setMsgTbl() {
		try{
			let {SN, gatherFre, systemTime, networkQuality, networkFunc, gatherFunc} = this.state;
			if(SN && gatherFre && systemTime && networkQuality && networkFunc && gatherFunc){
	  			let realm = this.state.realm;	  			

  				if(realm === null){
  					openRealm().then((realm) => {
  						this.setState({ realm });
  					});
  				}
	  			realm.write(() => {	
	  				const devNo = this.state.SN;		  			
		  			const devType = this.state.deviceType;	  
		  			console.log(`设备型号111： ${devType}`);			
		  			let setMsg = realm.objects('setMsg').filtered('devNo == $0', devNo)[0];		  				
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
	  			this.showToast(`设置设备信息到数据库失败`);
	  			// console.log('获取数据不全');
	  		}
		}catch(err){
			console.log(`设置信息失败： ${err}`);
			Toast.show({ text: `设置设备信息到数据库失败 ${err}`, type: 'danger' });			
		}
	}

	matchWhichStat(modelState, dev) {
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
		if(dev === '3'){
			this.setState({ gatherFunc: '正常' });
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
			try{
				//缺少：采集功能、网络通信功能、网络通信质量
	    		HSBleManager.negotiateMtu().then(() => {
		        HSBleManager.write(parseBuffer.awakeDevice(), 2);
		        
		        this.getDeviceMsgTimer = setTimeout( () => {
		        	HSBleManager.write(parseBuffer.getOsmometerMsg(), 2)		
		       	 	}, 1500);
	    		});
	    		this.setState({ isSetBtnClick: false });
			}catch(err) {
				this.showToast('设备已断开,请重新连接');
				this.props.disconnectDevice();
			}			
		}		
	}	

	getVibrateParas() {
		if (!this.props.connectedDevice) {
			Alert.alert(
	        '提示',
	        '蓝牙未连接渗压计，请先设置',
	        [
	          {text: '设置', onPress: () => this.props.navigation.navigate('ManualConnect')},
	        ],
	      );
		} else {				
			try{
				//缺少：采集功能、网络通信功能、网络通信质量
	    		HSBleManager.negotiateMtu().then(() => {
		        HSBleManager.write(parseBuffer.awakeDevice(), 2);
		        
		        this.getDeviceMsgTimer = setTimeout( () => {
		        	HSBleManager.write(parseBuffer.getVibrateParas(), 2)		
		       	 	}, 1500);
	    		});	    		
			}catch(err) {
				this.showToast('设备已断开,请重新连接');
				this.props.disconnectDevice();
			}			
		}
	}

	convert2HexArr(value) {
		// if(value >= 4096 && value <= 65535) {
		// 	value1 = '0x'+value[0]+value[1];
  //       	value2 = '0x'+value[2]+value[3];
		// }
		// if(value > 255 && value < 4096){				
		// 	value1 = '0x'+value[0];
  //       	value2 = '0x'+value[1]+value[2];		
		// }else if(valueInt < 255 && valueInt > 10){				
		// 	fre1 = '0x00';
		// 	fre2 = '0x'+ value[0] + value[1];				
		// }else{
		// 	fre1 = '0x00';
		// 	fre2 = '0x0'+ value[0];
		// }

		let value1, value2, len;
		let rtnValue = [];
		len = value.length;
		console.log(`输入值的长度为 ${len}`);
		if(len === 4) {
        	value1 = '0x'+value[0]+value[1];
        	value2 = '0x'+value[2]+value[3];
        }else if(len == 3){
        	value1 = '0x'+value[0];
        	value2 = '0x'+value[1]+value[2];
        }else if(len == 2){
        	value1 = '0x00';
        	value2 = '0x'+value[0]+value[1];
        }else if(len == 1){
        	value1 = '0x00';
        	value2 = '0x'+value[0];
        }
        rtnValue = [value1, value2];
        return rtnValue;
	}

	setVibrateParas() {
		if (!this.props.connectedDevice) {
			Alert.alert(
	        '提示',
	        '蓝牙未连接渗压计，请先设置',
	        [
	          {text: '设置', onPress: () => this.props.navigation.navigate('ManualConnect')},
	        ],
	      );
		} else {				
			try{
				//缺少：采集功能、网络通信功能、网络通信质量
	    		HSBleManager.negotiateMtu().then(() => {
		        HSBleManager.write(parseBuffer.awakeDevice(), 2);		        
				
				const lowFre =  parseInt(this.state.lowFre).toString(16);
		        const highFre = parseInt(this.state.highFre).toString(16);	
		        const themistorBValue = parseInt(this.state.themistorBValue).toString(16);
		        const exThemistorValue = parseInt(this.state.exThemistorValue).toString(16);

		        const lowFreValue = parseInt(this.state.lowFre);
		        const highFreValue = parseInt(this.state.highFre);
		        const themistorBInt = parseInt(this.state.themistorBValue);
		        const exThemistorInt = parseInt(this.state.exThemistorValue);
		        if(lowFreValue < 300 || lowFreValue > 8000){
		        	this.showToast('起始频率必须在300~8000之间');
		        	return;
		        }

		        if(highFreValue < 300 || highFreValue > 8000){
		        	this.showToast('终止频率必须在300~8000之间');
		        	return;
		        }

		        if(themistorBInt < 1000 || themistorBInt > 8000){
		        	this.showToast('热敏电阻B值必须在1000~8000之间');
		        	return;
		        }

		        if(exThemistorInt < 1 || exThemistorInt > 255){
		        	this.showToast('热敏电阻标称电阻值必须在1~255之间');
		        	return;
		        }

		        let lowFreArr, highFreArr, themistorBValueArr, exThemistorValueArr;
		        let lowFre1, lowFre2, highFre1, highFre2;
		        // if(lowFre === 4) {
		        // 	lowFre1 = '0x'+lowFre[0]+lowFre[1];
		        // 	lowFre2 = '0x'+lowFre[2]+lowFre[3];
		        // }else if(lowFre == 3){
		        // 	lowFre1 = '0x'+lowFre[0];
		        // 	lowFre2 = '0x'+lowFre[1]+lowFre[2];
		        // }else if(lowFre == 2){
		        // 	lowFre1 = '0x'+lowFre[0];
		        // 	lowFre2 = '0x'+lowFre[1];
		        // }else if(lowFre == 1){
		        // 	lowFre1 = '0x00';
		        // 	lowFre2 = '0x'+lowFre[0];
		        // }
		        
		        const inspireWay = this.state.inspireWay === 'customize' ? 0x68 : 0x64;
		        if(this.state.inspireWay === 'wholeFre'){
		        	lowFreArr = [0x07, 0xD0];
		        	highFreArr = [0x0D, 0xAC];
		        }else{
		        	lowFreArr = this.convert2HexArr(lowFre);
		        	highFreArr = this.convert2HexArr(highFre);
		        }		        
		        themistorBValueArr = this.convert2HexArr(themistorBValue);
		        exThemistorValueArr = this.convert2HexArr(exThemistorValue);		        

		        const paras = [inspireWay, lowFreArr[0], lowFreArr[1], highFreArr[0], highFreArr[1], 
		        themistorBValueArr[0], themistorBValueArr[1], exThemistorValueArr[0], exThemistorValueArr[1]];		       
		        
		        this.getDeviceMsgTimer = setTimeout( () => {		        
		        	HSBleManager.write(parseBuffer.setVibrateParas(paras), 2);
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
			
			HSBleManager.write(parseBuffer.awakeDevice(), 2);

			HSBleManager.negotiateMtu().then(() => {
				HSBleManager.write(parseBuffer.setFrequency(fre), 2);	        
	        
		        this.setDeviceMsgTimer = setTimeout(() => {
			       const ymd = parseBuffer.dateStrToHex(this.state.systemTime);		       
		        	HSBleManager.write(parseBuffer.setSysTime(ymd), 2);	        	
			    }, 1500);
			});

	        this.setState({isSetBtnClick: true});	      
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

//激励方法
  _onInpireWayPickerValueChange = (value, index) => {
  	this.setState({inspireWay: value});
	if(value === 'wholeFre')
    {
    	this.setState({disable: false, lowFre: '2000', highFre: '3500'});
    }else{
    	this.setState({disable: true});
    }
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
	console.log(`当前时间：${DateTimeStr}`);
	return DateTimeStr;
  };

  _getCurrentDateTime() {
  	// const timeStr = this.formatDateTime();
  	// this.setState({systemTime: timeStr});

  	this.setState({systemTime: moment().format('YYYY-MM-DD HH:mm:ss')});
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
					<Tabs>
						<Tab heading="设备信息">
						<Container>
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
											style={{textAlign: 'center', flex: 2}}
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
								            minDate="2000-00-00"
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
							</Content>
						</Container>							
						</Tab>	
						<Tab heading="振弦参数">
							<Container>
								<Content>																		
									<ListItem>										
										<Text style={{flex:1}}>激励方法:</Text>											
										<Picker
											selectedValue={this.state.inspireWay}
											onValueChange={this._onInpireWayPickerValueChange}
											style={{flex: 3, alignItems: 'center'}}
										>
											<Picker.Item label='全频段扫描法' value='wholeFre' 
												style={{alignItems: 'center'}}>
											</Picker.Item>
											<Picker.Item label='自定义频段扫描法' value='customize'></Picker.Item>
										</Picker>															
									</ListItem>							
									
									<ListItem>										
										<Text style={{flex:1}}>起始频率:</Text>											
										<TextInput
											keyboardType='numeric'
											onChangeText = {(text) => {
											 const newLowFre = text.replace(/[^\d]+/, '');
											 this.setState({									
												lowFre: newLowFre
											  });
											}}
											value={this.state.lowFre}
											placeholder="请输入起始频率(300~8000)"
											editable={this.state.disable}
											style={{textAlign: 'center', flex: 3}}
										/>										
										<Text style={{flex:0.5}}>Hz</Text>
									</ListItem>
									<ListItem>										
										<Text style={{flex:1}}>终止频率:</Text>											
										<TextInput
											keyboardType='numeric'
											onChangeText = {(text) => {
											 const newHighFre = text.replace(/[^\d]+/, '');
											 this.setState({									
												highFre: newHighFre
											  });
											}}
											value={this.state.highFre}
											placeholder="请输入终止频率(300~8000)"
											editable={this.state.disable}
											style={{textAlign: 'center', flex: 3}}
										/>	
										<Text style={{flex:0.5}}>Hz</Text>																								
									</ListItem>
									<ListItem>										
										<Text style={{flex:1}}>热敏电阻B值:</Text>											
										<TextInput
											keyboardType='numeric'
											onChangeText = {(text) => {
											 const newThemistorBValue = text.replace(/[^\d]+/, '');
											 this.setState({									
												themistorBValue: newThemistorBValue
											  });
											}}
											value={this.state.themistorBValue}
											placeholder="请输入热敏电阻B值(1000~8000)"
											style={{textAlign: 'center', flex: 3}}
										/>																									
									</ListItem>
									<ListItem>										
										<Text style={{alignItems:'center', flex:1}}>热敏电阻标称电阻值:</Text>											
										<TextInput
											keyboardType='numeric'
											onChangeText = {(text) => {
											 const newExThemistorValue = text.replace(/[^\d]+/, '');
											 this.setState({									
												exThemistorValue: newExThemistorValue
											  });
											}}
											value={this.state.exThemistorValue}
											placeholder="请输入热敏电阻标称电阻值(1~255)"
											style={{textAlign: 'center', flex: 3}}
										/>	
										<Text style={{flex:0.5}}>KΩ</Text>																	
									</ListItem>
									<Button primary block
										style={{height: 50, marginLeft: 5, marginRight: 5, flex: 1}}
										onPress={ () => this.getVibrateParas() }
										>
										<Text style={{fontSize: 36, color: 'white'}}>获取</Text>
									</Button>
									<Button success block
										style={{height: 50, marginLeft: 5, marginRight: 5, flex: 1, marginTop: 10}}
										onPress={ () => this.setVibrateParas() }
										>
										<Text style={{fontSize: 36, color: 'white'}}>设置</Text>
									</Button>									
								</Content>
							</Container>
						</Tab>						
					</Tabs>												
			</Container>
		);	
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

export default connect(mapStateToProps, mapDispatchToProps)(DeviceMsg);