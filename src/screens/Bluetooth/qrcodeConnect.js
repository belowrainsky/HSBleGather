<<<<<<< HEAD
import React from 'react';
import { View, Alert,  } from 'react-native';
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
  Text,
  Vibration,
  Toast,
} from "native-base";
import styles from "./styles";
import { RNCamera } from 'react-native-camera';
import BarcodeMask from 'react-native-barcode-mask';
import { NavigationEvents } from 'react-navigation';
import { connect } from 'react-redux';
import {
  addDevice,
  connectDevice,
  disconnectDevice,
  clearDevice,
  removeDevice,
} from '../../actions/bleAction';

let HSBleManager;

class QRCodeConnect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      torchOn: false,
          
      scaning: false,
      connectingId: '', // 当前正在发起连接的设备      
    };

    HSBleManager = global.HSBleManager;
  }

  didFocus() {
    this.isBarCodeReaded = false;

    if(HSBleManager.peripheralId)
      HSBleManager.monitor(this.monitorListener);
  }

  monitorListener = (err, characteristic) => {
    if (err) {
      console.log(err);
      switch (err.errorCode) {
        case 201:
          this.showToast('连接失败 设备已断开');
          this.props.disconnectDevice();
          break;
        case 205:
          this.showToast('连接失败 设备未连接');
          this.props.disconnectDevice();
          break;
        case 204:
          this.showToast('未发现该设备');
          break;
        case 203:
          this.showToast('设备已连接');
          break;
        // default:
        //   this.showToast(`监听失败 ${err.errorCode}`);
      }
    }
  }

  componentWillMount() {
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
    this.onStateChangeListener && this.onStateChangeListener.remove();
    this.disconnectListener && this.disconnectListener.remove();
    this.scanTimer && clearTimeout(this.scanTimer);  
    this.setState = (state, callback) => {
      return;
    };
  }

  // 主动断开蓝牙连接
  async disconnect() {
    try {
     await HSBleManager.disconnect();
    } catch (err) {
    }
    this.props.disconnectDevice();
  }

  handleScanDevice = (device) => {
    console.log(`发现蓝牙设备 ${device.id} ${device.name}`);    
    this.props.addDevice(device);
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
        }else if(err.errorCode === 203){
          this.showToast('设备已连接');
        }else if(err.errorCode === 204){
          this.showToast('未发现该设备');
        }else {
          this.showToast(`扫描蓝牙错误 ${err.errorCode}`)
        }
      });
  }

  // 监听蓝牙断开
  onDisconnect() {
    this.disconnectListener = HSBleManager.manager.onDeviceDisconnected(HSBleManager.peripheralId, (err, device) => {
      if (err) {
        // this.props.removeDevice();
        this.props.disconnectDevice();
        this.props.clearDevice();
        this.scan();
        console.log('设备断开蓝牙-err0', err);    
      }else{
        this.props.disconnectDevice();             
        console.log('设备断开蓝牙-noErr0', device.id, device.name);
      }
    
      this.disconnectListener && this.disconnectListener.remove(); // 不再监听      
    });
  }

  connectedAlert(Msg){
    Alert.alert(
        '提示',
        `蓝牙连接成功 ${Msg}，开始测量`,
        [
          {
            text: '取消',
            onPress: () => {
              this.isBarCodeReaded = false;
            },
          },
          {
            text: '确定',
            onPress: () => {
              this.props.navigation.navigate('Holes')
            },
          },
        ],
        { cancelable: false }
    );
  }

  async connect( item ) {
        
    if (this.state.scaning) {  // 连接的时候正在扫描，先停止扫描
      HSBleManager.stopScan();
      this.setState({ scaning: false });
    }
    if (HSBleManager.isConnecting) {
      this.showToast('正在连接其他设备');
      return;
    }
    await this.disconnect();
    
    this.setState({ connectingId: item });
    try {
      await HSBleManager.connect(item);  
      
      this.props.connectDevice(HSBleManager.Device);    

      this.setState({
        connectingId: '',
      });    

      this.onDisconnect(); // 监听断开连接      
      this.connectedAlert(item);

    } catch (err) {
      this.setState({ connectingId: '' });
      this.showToast(`设备 ${item} 连接失败`);//, 原因:${err}
    }
  }

  showToast(text, position = 'bottom', duration = 2000, textStyle = {color: 'yellow'}) {
    Toast.show({ text, position, duration, textStyle });
  }

  onBarCodeRead = (Msg) => {
    if (!this.isBarCodeReaded) {
      this.isBarCodeReaded = true;
 
      //扫描出蓝牙的ID或蓝牙名，连接蓝牙
      this.connect(Msg.data);
    }
  }

  render() {
    return (
      <Container style={styles.container}>
        <NavigationEvents
          onDidFocus={() => this.didFocus()}
        />
        <Header>
          <Left style={{flex: 1}}>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body style={{flex: 1, alignItems: 'center'}}>
            <Title>蓝牙 - 扫码连接</Title>
          </Body>
          <Right style={{flex: 1}} />
        </Header>
        <Content contentContainerStyle={{ flexGrow: 1 }}>
          <RNCamera
            ref={ref => this.camera = ref}
            style={styles.preview}
            captureAudio={false}
            flashMode={this.state.torchOn ? RNCamera.Constants.FlashMode.torch : RNCamera.Constants.FlashMode.off}
            onBarCodeRead={this.onBarCodeRead}
            barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
          >
            <BarcodeMask edgeColor={'#62B1F6'} showAnimatedLine={true}/>
          </RNCamera>
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

    disconnectDevice: (device) => dispatch(disconnectDevice( {device} )),
    clearDevice: () => dispatch(clearDevice()),
    removeDevice: () => dispatch(removeDevice()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(QRCodeConnect);
=======
import React from 'react';
import { View, Alert,  } from 'react-native';
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
  Text,
  Vibration,
  Toast,
} from "native-base";
import styles from "./styles";
import { RNCamera } from 'react-native-camera';
import BarcodeMask from 'react-native-barcode-mask';
import { NavigationEvents } from 'react-navigation';
import { connect } from 'react-redux';
import {
  addDevice,
  connectDevice,
  disconnectDevice,
  clearDevice,
  removeDevice,
} from '../../actions/bleAction';

let HSBleManager;

class QRCodeConnect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      torchOn: false,
          
      scaning: false,
      connectingId: '', // 当前正在发起连接的设备      
    };

    HSBleManager = global.HSBleManager;
  }

  didFocus() {
    this.isBarCodeReaded = false;

    if(HSBleManager.peripheralId)
      HSBleManager.monitor(this.monitorListener);
  }

  monitorListener = (err, characteristic) => {
    if (err) {
      console.log(err);
      switch (err.errorCode) {
        case 201:
          this.showToast('连接失败 设备已断开');
          this.props.disconnectDevice();
          break;
        case 205:
          this.showToast('连接失败 设备未连接');
          this.props.disconnectDevice();
          break;
        case 204:
          this.showToast('未发现该设备');
          break;
        case 203:
          this.showToast('设备已连接');
          break;
        // default:
        //   this.showToast(`监听失败 ${err.errorCode}`);
      }
    }
  }

  componentWillMount() {
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
    this.onStateChangeListener && this.onStateChangeListener.remove();
    this.disconnectListener && this.disconnectListener.remove();
    this.scanTimer && clearTimeout(this.scanTimer);  
    this.setState = (state, callback) => {
      return;
    };
  }

  // 主动断开蓝牙连接
  async disconnect() {
    try {
     await HSBleManager.disconnect();
    } catch (err) {
    }
    this.props.disconnectDevice();
  }

  handleScanDevice = (device) => {
    console.log(`发现蓝牙设备 ${device.id} ${device.name}`);    
    this.props.addDevice(device);
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
        }else if(err.errorCode === 203){
          this.showToast('设备已连接');
        }else if(err.errorCode === 204){
          this.showToast('未发现该设备');
        }else {
          this.showToast(`扫描蓝牙错误 ${err.errorCode}`)
        }
      });
  }

  // 监听蓝牙断开
  onDisconnect() {
    this.disconnectListener = HSBleManager.manager.onDeviceDisconnected(HSBleManager.peripheralId, (err, device) => {
      if (err) {
        // this.props.removeDevice();
        this.props.disconnectDevice();
        this.props.clearDevice();
        this.scan();
        console.log('设备断开蓝牙-err0', err);    
      }else{
        this.props.disconnectDevice();             
        console.log('设备断开蓝牙-noErr0', device.id, device.name);
      }
    
      this.disconnectListener && this.disconnectListener.remove(); // 不再监听      
    });
  }

  connectedAlert(Msg){
    Alert.alert(
        '提示',
        `蓝牙连接成功 ${Msg}，开始测量`,
        [
          {
            text: '取消',
            onPress: () => {
              this.isBarCodeReaded = false;
            },
          },
          {
            text: '确定',
            onPress: () => {
              this.props.navigation.navigate('Holes')
            },
          },
        ],
        { cancelable: false }
    );
  }

  async connect( item ) {
        
    if (this.state.scaning) {  // 连接的时候正在扫描，先停止扫描
      HSBleManager.stopScan();
      this.setState({ scaning: false });
    }
    if (HSBleManager.isConnecting) {
      this.showToast('正在连接其他设备');
      return;
    }
    await this.disconnect();
    
    this.setState({ connectingId: item });
    try {
      await HSBleManager.connect(item);  
      
      this.props.connectDevice(HSBleManager.Device);    

      this.setState({
        connectingId: '',
      });    

      this.onDisconnect(); // 监听断开连接      
      this.connectedAlert(item);

    } catch (err) {
      this.setState({ connectingId: '' });
      this.showToast(`设备 ${item} 连接失败`);//, 原因:${err}
    }
  }

  showToast(text, position = 'bottom', duration = 2000, textStyle = {color: 'yellow'}) {
    Toast.show({ text, position, duration, textStyle });
  }

  onBarCodeRead = (Msg) => {
    if (!this.isBarCodeReaded) {
      this.isBarCodeReaded = true;
 
      //扫描出蓝牙的ID或蓝牙名，连接蓝牙
      this.connect(Msg.data);
    }
  }

  render() {
    return (
      <Container style={styles.container}>
        <NavigationEvents
          onDidFocus={() => this.didFocus()}
        />
        <Header>
          <Left style={{flex: 1}}>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body style={{flex: 1, alignItems: 'center'}}>
            <Title>蓝牙 - 扫码连接</Title>
          </Body>
          <Right style={{flex: 1}} />
        </Header>
        <Content contentContainerStyle={{ flexGrow: 1 }}>
          <RNCamera
            ref={ref => this.camera = ref}
            style={styles.preview}
            captureAudio={false}
            flashMode={this.state.torchOn ? RNCamera.Constants.FlashMode.torch : RNCamera.Constants.FlashMode.off}
            onBarCodeRead={this.onBarCodeRead}
            barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
          >
            <BarcodeMask edgeColor={'#62B1F6'} showAnimatedLine={true}/>
          </RNCamera>
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

    disconnectDevice: (device) => dispatch(disconnectDevice( {device} )),
    clearDevice: () => dispatch(clearDevice()),
    removeDevice: () => dispatch(removeDevice()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(QRCodeConnect);
>>>>>>> 17118f8b7c762a29eaadd552e1aef944b3b5d271
