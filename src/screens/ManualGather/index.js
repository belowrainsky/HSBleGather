import React from 'react';
import {
  View, 
  Text,
  Alert,
  TextInput,
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
import moment from 'moment';
import {
  disconnectDevice,
} from '../../actions/bleAction';

let HSBleManager;

class ManualGather extends React.Component {

	constructor(props){
		super(props);
		this.state = {
			realm: null,
			collectAt: null,
			frequency: null,
			mod:null,
			temperature:null,
			channel: [],			
		};
		HSBleManager = global.HSBleManager;
	}

	didFocus(){
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
      });
  	}

	componentDidMount() {
		if (!this.props.connectedDevice) {
	      Alert.alert(
	        '提示',
	        '蓝牙未连接测斜仪，请先设置',
	        [
	          {text: '设置', onPress: () => this.props.navigation.navigate('ManualConnect')},
	        ],
	      );
	    } else {
	      HSBleManager.negotiateMtu().then(() => {
	        HSBleManager.monitor(this.monitorListener)
	      });
	    }
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
	    	// const buffer = Buffer.from(characteristic.value, 'base64');
      // 		const result = parseBuffer.push(buffer);
      // 		if (result) {
      // 			console.log(`收到数据为：${result}`);
      // 		}
	    }
	}

	showToast(text, position = 'bottom', duration = 2000) {
    	Toast.show({ text, position, duration });
  	}

	componentWillUnmount() {
		HSBleManager.unmonitor();
		this.disconnectListener && this.disconnectListener.remove();
		this.setState = (state, callback) => {
      		return;
   		};	
	}

	getData() {		
		if(!this.props.connectedDevice){
			this.showToast('设备断开蓝牙');
			return;
		}
		
		HSBleManager.negotiateMtu().then(() => {
	        HSBleManager.write(parseBuffer.awakeDevice(), 2);	        
	        HSBleManager.read();
	        HSBleManager.write(parseBuffer.updateData(), 2);
	        HSBleManager.read();
	    });
	}

	async save() {
		try{

		}catch(err){

		}
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
						<Title>手动获取信息</Title>
					</Body>
					<Right style={{flex:1}}/>									
				</Header>			

				<Content>
					<Separator bordered>
						<Text>通道1</Text>
					</Separator>
					<ListItem style={styles.listItem}>						
						<View style={styles.recordField}>
							<Text style={{flex: 1}}>时间：</Text>
							<Text style={{flex: 1}}>{this.state.collectAt}</Text>

							<Text style={{flex: 1}}>频率：</Text>
							<Text style={{flex: 1}}>{this.state.frequency}</Text>
						</View>
					</ListItem>

					<ListItem style={styles.listItem}>						
						<View style={styles.recordField}>
							<Text style={{flex: 1}}>频模：</Text>
							<Text style={{flex: 1}}>{this.state.mod}</Text>

							<Text style={{flex: 1}}>温度：</Text>
							<Text style={{flex: 1}}>{this.state.temperature}</Text>
						</View>
					</ListItem>

					<Separator bordered>
						<Text>通道2</Text>
					</Separator>
					<ListItem style={styles.listItem}>						
						<View style={styles.recordField}>
							<Text style={{flex: 1}}>时间：</Text>
							<Text style={{flex: 1}}>{this.state.collectAt}</Text>

							<Text style={{flex: 1}}>频率：</Text>
							<Text style={{flex: 1}}>{this.state.frequency}</Text>
						</View>
					</ListItem>

					<ListItem style={styles.listItem}>						
						<View style={styles.recordField}>
							<Text style={{flex: 1}}>频模：</Text>
							<Text style={{flex: 1}}>{this.state.mod}</Text>

							<Text style={{flex: 1}}>温度：</Text>
							<Text style={{flex: 1}}>{this.state.temperature}</Text>
						</View>
					</ListItem>

					<Separator bordered>
						<Text>通道3</Text>
					</Separator>
					<ListItem style={styles.listItem}>						
						<View style={styles.recordField}>
							<Text style={{flex: 1}}>时间：</Text>
							<Text style={{flex: 1}}>{this.state.collectAt}</Text>

							<Text style={{flex: 1}}>频率：</Text>
							<Text style={{flex: 1}}>{this.state.frequency}</Text>
						</View>
					</ListItem>

					<ListItem style={styles.listItem}>						
						<View style={styles.recordField}>
							<Text style={{flex: 1}}>频模：</Text>
							<Text style={{flex: 1}}>{this.state.mod}</Text>

							<Text style={{flex: 1}}>温度：</Text>
							<Text style={{flex: 1}}>{this.state.temperature}</Text>
						</View>
					</ListItem>

					<Separator bordered>
						<Text>通道4</Text>
					</Separator>
					<ListItem style={styles.listItem}>						
						<View style={styles.recordField}>
							<Text style={{flex: 1}}>时间：</Text>
							<Text style={{flex: 1}}>{this.state.collectAt}</Text>

							<Text style={{flex: 1}}>频率：</Text>
							<Text style={{flex: 1}}>{this.state.frequency}</Text>
						</View>
					</ListItem>

					<ListItem style={styles.listItem}>						
						<View style={styles.recordField}>
							<Text style={{flex: 1}}>频模：</Text>
							<Text style={{flex: 1}}>{this.state.mod}</Text>

							<Text style={{flex: 1}}>温度：</Text>
							<Text style={{flex: 1}}>{this.state.temperature}</Text>
						</View>
					</ListItem>

					<View style={{flex: 1, flexDirection:'row', justifyContent: 'center', marginTop: 20}}>
						<Button primary block
							style={{height: 50, width:280, marginLeft: 5, marginRight: 5}}
							onPress={ () => this.getData() }
							>
							<Text style={{fontSize: 36, color: 'white'}}>采集</Text>
						</Button>

						<Button success block
							style={{height: 50, width:280, marginLeft: 5, marginRight: 5}}
							onPress={() => this.save()}>							
							<Text style={{fontSize: 36, color: 'white'}}>保存</Text>
						</Button>
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

export default connect(mapStateToProps, mapDispatchToProps)(ManualGather);