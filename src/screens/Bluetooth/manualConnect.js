import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  FlatList,
  TextInput,
  Platform,
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
  Toast,
  ListItem,
} from "native-base";
import styles from "./styles";
import { connect } from 'react-redux';
import {
  addDevice,
  connectDevice,
  disconnectDevice,
  clearDevice,
  removeDevice,
} from '../../actions/bleAction';
import { Buffer } from 'buffer';
import { requestLocationPermission, requestMultiplePermission } from '../../lib/permissions';
// import openRealm from '../../lib/realmStorage';

let HSBleManager;

class ManualConnect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scaning: false,
      connectingId: '', // 当前正在发起连接的设备          
      version: '',
    };
    HSBleManager = global.HSBleManager;
  }

  componentDidMount() {
    this.onStateChangeListener = HSBleManager.manager.onStateChange((state) => {
      console.log('stateChange', state);
      if (state === 'PoweredOn') {
        this.scan();
      } else if (state === 'PoweredOff') {
        this.showToast('蓝牙未打开');
      }
    }, true);    
  }

  componentWillUnmount() {
    //卸载定时，防止setstate
    HSBleManager.stopScan();
    this.scanTimer && clearTimeout(this.scanTimer);
    this.onStateChangeListener && this.onStateChangeListener.remove();
    this.disconnectListener && this.disconnectListener.remove();    

    // if (this.props.connectedDevice) {      
    //   const deviceName = this.props.connectedDevice.name.toString();
    //   console.log(`设备名： ${deviceName}`);
    //   const realm = this.state.realm; 
    //   const devs = realm.objects('devsVersion').filtered('id == 1')[0]; 
    //   if(deviceName.substring(0, 2) == 'HS'){
    //     const devsType = deviceName.substring(2, 4);
    //     if(devsType == '33'){
    //       realm.write(() => {
    //         devs.version = 'current';
    //       });
    //       this.DevConnectedVersion = 'current';
    //     }else{
    //       realm.write(() => {
    //         devs.version = 'other';
    //       });

    //       this.DevConnectedVersion = 'other';
    //     }
    //   } 
    // }                              

    this.setState = (state, callback) => {
          return;
    };
  }

  didFocus() {
    this.onDisconnect(); // 监听断开连接 
  }

  handleScanDevice = (device) => {
    console.log(`发现蓝牙设备 ${device.id} ${device.name}`);    
    this.props.addDevice(device);
  }

  pressScan() {
    if (this.state.scaning) return;
    this.scan();
  }

  scan() {
    this.setState({ scaning: true });
    this.scanTimer && clearTimeout(this.scanTimer);
    this.scanTimer = setTimeout(() => {
      if (this.state.scaning) {
        HSBleManager.stopScan();
        this.setState({ scaning: false });
      }
    }, 5000);
    HSBleManager
      .scan(this.handleScanDevice)
      .then(() => {})
      .catch((err) => {
        if (err.errorCode === 101) {
          this.showToast('未获得位置信息授权', 'top');
          requestLocationPermission().then(() => this.scan());          
        } else if (err.errorCode === 102) {
          this.showToast('蓝牙未打开');
        } else if(err.errorCode === 601){
          this.showToast('请打开手机定位');
        }
        else {
          this.showToast(`扫描蓝牙错误 ${err.errorCode}`)
        }
      });
  }

  async connect({ item, index }) {
    if (this.state.scaning) {  // 连接的时候正在扫描，先停止扫描
      HSBleManager.stopScan();
      this.setState({ scaning: false });
    }
    if (HSBleManager.isConnecting) {
      this.showToast('正在连接其他设备');
      return;
    }
    await this.disconnect();
    this.setState({ connectingId: item.id });
    try {
      await HSBleManager.connect(item.id);
      this.props.connectDevice(item);
      this.setState({
        connectingId: '',
      });
      
      this.onDisconnect(); // 监听断开连接
    } catch (err) {
      this.setState({ connectingId: '' });
      this.showToast(`设备 ${item.name || item.id} 连接失败`);
    }
  }

  // 监听蓝牙断开
  onDisconnect() {
    this.disconnectListener = HSBleManager.manager.onDeviceDisconnected(HSBleManager.peripheralId, (err, device) => {
      if (err) {        
        this.props.disconnectDevice();        
        console.log('设备断开蓝牙-err0', err);		
      }else{
        this.props.disconnectDevice();             
        console.log('设备断开蓝牙-noErr0', device.id, device.name);
      }    
      this.props.clearDevice();
      if (this.state.scaning) return;
      this.scan();       
    });
  }

  // 主动断开蓝牙连接
  async disconnect() {
    try {
     await HSBleManager.disconnect();
    } catch (err) {
    }
    this.props.disconnectDevice();
  }


  showToast(text, position = 'bottom', duration = 2000) {
    Toast.show({ text, position, duration });
  }

  _renderHeader = (text) => {
    return (
      <View>
        <Text style={styles.subtitle}> {text} </Text>
      </View>
    );
  }

  _renderItem = ({ item, index }) => {
    return (
      <ListItem>
      <TouchableOpacity
        onPress={() => this.connect({ item, index })}
        style={styles.itemContainer}>
        <View style={{flexDirection: 'row'}}>
          <Icon name="bluetooth" style={{width: 25}} />
          <Text style={styles.itemName}>{item.name ? item.name : item.id}</Text>
        </View>
        <Text style={styles.itemConnecting}>
          {
            item.id === this.state.connectingId
            ? '正在连接...' : ''
          }
        </Text>
      </TouchableOpacity>
      </ListItem>
    );
  }

  // write2Realm(devType) {
  //   const realm = this.state.realm;
  //   realm.write( () => {
  //       realm.create('devsVersion', {
  //         version: devType,
  //         id: 1,
  //       });
  //   } );
  // }

  _renderConnectedDevice = () => {
    if (this.props.connectedDevice) {
      const item = this.props.connectedDevice;                     

      return (
        <View style={styles.mt20}>
          {this._renderHeader('已连接设备')}
          <ListItem>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => this.disconnect()}
            style={styles.itemContainer}>
            <View style={{flexDirection: 'row'}}>
              <Icon name="bluetooth" style={{width: 25}} />
              <Text style={styles.itemName}>{item.name ? item.name : item.id}</Text>
            </View>
          </TouchableOpacity>
          </ListItem>
        </View>
      );
    }
  }

  render() {
    return (
      <Container style={styles.container}>
        <Header>
          <Left style={{flex: 1}}>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body style={{flex: 1, alignItems: 'center'}}>
            <Title>蓝牙 - 手动连接</Title>
          </Body>
          <Right style={{flex: 1}}>
            <Button transparent
              disabled={this.state.scaning}
              onPress={() => this.pressScan()}
            >
              {this.state.scaning
                ? <ActivityIndicator size="small" color="#fff" />
                : <Text style={{color: '#fff'}}>扫描</Text>}
            </Button>
          </Right>
        </Header>

        <Content>
          {this._renderConnectedDevice()}

          <FlatList
            renderItem={this._renderItem}
            keyExtractor={item => item.id}
            data={this.props.devices}
            ListHeaderComponent={this._renderHeader('可用设备')}
            extraData={[
              this.state.scaning,
            ]}
            keyboardShouldPersistTaps='handled'
          />
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    devices: state.bles.devices,
    connectedDevice: state.bles.connectedDevice,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addDevice: device => dispatch(addDevice({ device })),
    connectDevice: device => dispatch(connectDevice({ device })),
    
    disconnectDevice: () => dispatch(disconnectDevice()),
    clearDevice: () => dispatch(clearDevice()),
    removeDevice: () => dispatch(removeDevice()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManualConnect);

