import React from 'react';
import {
  View, 
  Text,
  Alert,
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
  
} from 'native-base';

import parseBuffer from '../../lib/parseBuffer';
import { connect } from 'react-redux';
import { NavigationEvents } from 'react-navigation';
<<<<<<< HEAD
import {
  disconnectDevice,
} from '../../actions/bleAction';
=======
>>>>>>> 78260a6ba4a41d74db2a713748a74ebf695cabc7

let HSBleManager;

class DeviceMsg extends React.Component {

	constructor(props){
		super(props);
		this.state = {
			deviceType: '',
			deviceNo: '',
			deviceVolt: '',
			gatherFunc: '',
			networkFunc: '',
			networkQuality: '',
			gatherFre: '',
			systemTime: '',
		};
		HSBleManager = global.HSBleManager;
<<<<<<< HEAD
	}	

	componentWillMount() {
		if (!this.props.connectedDevice) {
	     	Alert.alert(
		        '提示',
		        '蓝牙未连接测斜仪，请先设置',
		        [
		          {text: '设置', onPress: () => this.props.navigation.navigate('ManualConnect')},
		        ],
		        {
		        	cancelable: false
		        }
	     	);
	    }
	}

	componentDidMount() {
   		this.onDisconnect(); // 监听断开连接 
 	}

 	componentWillUnmount() {
 		this.disconnectListener && this.disconnectListener.remove();
 		this.setState = (state, callback) => {
      		return;
   		};
 	}

	setSysInfo() {
		if(!this.props.connectedDevice){
			this.showToast('蓝牙未连接设备');
			console.log('设备未连接');			
		}else{
			HSBleManager.negotiateMtu().then(() => {
	        HSBleManager.write(parseBuffer.awakeDevice(), 2);
	        HSBleManager.read();
	        HSBleManager.write(parseBuffer.updateData(), 2);
	        HSBleManager.read();
	      });
		}	    
	}

	showAlert() {
		Alert.alert(
=======
	}

	componentDidMount() {
	    if (!this.props.connectedDevice) {
	      Alert.alert(
>>>>>>> 78260a6ba4a41d74db2a713748a74ebf695cabc7
	        '提示',
	        '蓝牙未连接测斜仪，请先设置',
	        [
	          {text: '设置', onPress: () => this.props.navigation.navigate('ManualConnect')},
	        ],
<<<<<<< HEAD
	     );
	}

	showToast(text, position = 'bottom', duration = 2000) {
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

=======
	      );
	    } else {
	      HSBleManager.negotiateMtu().then(() => {
	        HSBleManager.write(parseBuffer.awake(), 2);
	        HSBleManager.read();
	        HSBleManager.write(parseBuffer.updateData(), 2);
	        HSBleManager.read();
	      });
	    }
	}

>>>>>>> 78260a6ba4a41d74db2a713748a74ebf695cabc7
	render(){
		return(
			<Container>
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
					<View>					
						<ListItem>							
							<Text>设备型号：</Text>																					
							<Input placeholder='Device Type'/>							
						</ListItem>

						<ListItem>							
							<Text>设备编号：</Text>																					
							<Input placeholder='Device No'/>							
						</ListItem>

						<ListItem>
							<Text>设备电压：</Text>
							<Input placeholder='Device Volt'/>
						</ListItem>

						<ListItem>							
							<Text>采集功能：</Text>
							<Input placeholder='Gather func'/>							
						</ListItem>

						<ListItem>
							<Text>网络通信功能：</Text>
							<Input placeholder='Internet Connect func'/>							
						</ListItem>

						<ListItem>
							<Text>网络通信质量：</Text>
							<Input placeholder='Internet Connect Quality'/>
						</ListItem>

						<ListItem>
							<Text>采集频率：</Text>
							<Input placeholder='Gather Frequency'/>							
						</ListItem>

						<ListItem>							
							<Text>系统时间：</Text>
							<Input placeholder='System Time'/>							
						</ListItem>											
					</View>
					<View style={{marginTop: 50}}>
						<Button block rounded info 
<<<<<<< HEAD
							style={{height: 80, marginLeft: 5, marginRight: 5}}
							onPress={() => this.setSysInfo()}
						>							
=======
							style={{height: 80, marginLeft: 5, marginRight: 5}}>							
>>>>>>> 78260a6ba4a41d74db2a713748a74ebf695cabc7
							<Text style={{fontSize: 40, color: 'white'}}>设置</Text>
						</Button>
					</View>
				</Content>				
			</Container>
		);	
	}		
}

const mapStateToProps = (state) => {
  return {
<<<<<<< HEAD
    connectedDevice: state.bles.connectedDevice,    
  };
};

const mapDispatchToProps = (dispatch) => {
  return {       
    disconnectDevice: () => dispatch(disconnectDevice()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DeviceMsg);
=======
    connectedDevice: state.bles.connectedDevice,
  };
};


export default connect(mapStateToProps, null)(DeviceMsg);
>>>>>>> 78260a6ba4a41d74db2a713748a74ebf695cabc7
