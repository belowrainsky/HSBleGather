<<<<<<< HEAD
import React from 'react';
import {
  View,
  ImageBackground,
  TouchableOpacity,
  Image,
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
} from "native-base";
import styles from "./styles";

import { connect } from 'react-redux';
import {    
  disconnectDevice,
} from '../../actions/bleAction';
import { NavigationEvents } from 'react-navigation';


const huasilogo = require('./huasi.png');
const bluetooth = require('./bluetooth.png');
const manual = require('./Manual.png');
const history = require('./HistoryGather.png');
const deviceInfor = require('./DeviceMsg.png');

let HSBleManager;

class Home extends React.Component {

  constructor(props) {
    super(props);
    HSBleManager = global.HSBleManager;
  }

  didFocus() {
    this.disconnectListener = HSBleManager.manager.onDeviceDisconnected(HSBleManager.peripheralId, (err, device) => {
      if (err) {        
        this.props.disconnectDevice();            
        console.log('设备断开蓝牙-主页-didFocus', err);    
      }else{
        this.props.disconnectDevice();             
        console.log('设备断开蓝牙-主页-didFocus', device.id, device.name);
      }           
    });
  }

  // componentWillMount() {
  //   this.disconnectListener = HSBleManager.manager.onDeviceDisconnected(HSBleManager.peripheralId, (err, device) => {
  //     if (err) {        
  //       this.props.disconnectDevice();            
  //       console.log('设备断开蓝牙-主页-did', err);    
  //       this.showToast('设备断开蓝牙-主页-did, ${err}');
  //     }else{
  //       this.props.disconnectDevice();             
  //       console.log('设备断开蓝牙-noErr0-did', device.id, device.name);
  //       this.showToast('设备断开蓝牙-noErr0-did, ${device.id, device.name}');
  //     }           
  //   });
  // }

  componentWillUnmount() {
    this.disconnectListener && this.disconnectListener.remove(); // 不再监听 
    this.setState = (state, callback) => {
          return;
    };
  }

  showToast(text, position = 'bottom', duration = 2000) {
      Toast.show({ text, position, duration });
  }
//华思蓝牙数采软件
  render() {
    return (
      <Container style={styles.container}>
        <NavigationEvents
            onDidFocus={() => this.didFocus()}         
        />
        <Header>
          <Left style={{flex:1}}/>
          <Body style={{flex: 2, alignItems: 'center'}}>
            <Title>华思蓝牙数采软件</Title>
          </Body>
          <Right style={{flex: 1}} />
        </Header>

        <View style={styles.touchablesContainer}>
          <View style={styles.touchableContainer}>
            <TouchableOpacity
              style={styles.touchable}
              onPress={() => this.props.navigation.push('Bluetooth')}
            >
              <Image source={bluetooth} style={styles.image} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.touchable}
              onPress={() => this.props.navigation.push('DeviceMsg')}
            >
              <Image source={deviceInfor} style={styles.image} />
            </TouchableOpacity>
          </View>

          <View style={styles.touchableContainer}>
            <TouchableOpacity
              style={styles.touchable}
              onPress={() => this.props.navigation.push('ManualGather')}
            >
              <Image source={manual} style={styles.image} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.touchable}
              onPress={() => this.props.navigation.push('HistoryData')}
            >
              <Image source={history} style={styles.image} />
            </TouchableOpacity>            
          </View>

        </View>

        <View style={styles.logoContainer}>
          <Image source={huasilogo} style={styles.logo} />
        </View>

      </Container>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {    
    disconnectDevice: () => dispatch(disconnectDevice()),
  };
};

export default connect(null, mapDispatchToProps)(Home);
=======
import React from 'react';
import {
  View,
  ImageBackground,
  TouchableOpacity,
  Image,
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
} from "native-base";
import styles from "./styles";

<<<<<<< HEAD
import { connect } from 'react-redux';
import {    
  disconnectDevice,
} from '../../actions/bleAction';
import { NavigationEvents } from 'react-navigation';

=======
>>>>>>> 78260a6ba4a41d74db2a713748a74ebf695cabc7
const huasilogo = require('./huasi.png');
const bluetooth = require('./bluetooth.png');
const manual = require('./Manual.png');
const history = require('./HistoryGather.png');
const deviceInfor = require('./DeviceMsg.png');

<<<<<<< HEAD
let HSBleManager;

class Home extends React.Component {

  constructor(props) {
    super(props);
    HSBleManager = global.HSBleManager;
  }

  didFocus() {
    this.disconnectListener = HSBleManager.manager.onDeviceDisconnected(HSBleManager.peripheralId, (err, device) => {
      if (err) {        
        this.props.disconnectDevice();            
        console.log('设备断开蓝牙-主页-didFocus', err);    
      }else{
        this.props.disconnectDevice();             
        console.log('设备断开蓝牙-主页-didFocus', device.id, device.name);
      }           
    });
  }

  // componentWillMount() {
  //   this.disconnectListener = HSBleManager.manager.onDeviceDisconnected(HSBleManager.peripheralId, (err, device) => {
  //     if (err) {        
  //       this.props.disconnectDevice();            
  //       console.log('设备断开蓝牙-主页-did', err);    
  //       this.showToast('设备断开蓝牙-主页-did, ${err}');
  //     }else{
  //       this.props.disconnectDevice();             
  //       console.log('设备断开蓝牙-noErr0-did', device.id, device.name);
  //       this.showToast('设备断开蓝牙-noErr0-did, ${device.id, device.name}');
  //     }           
  //   });
  // }

  componentWillUnmount() {
    this.disconnectListener && this.disconnectListener.remove(); // 不再监听 
    this.setState = (state, callback) => {
          return;
    };
  }

  showToast(text, position = 'bottom', duration = 2000) {
      Toast.show({ text, position, duration });
  }

  render() {
    return (
      <Container style={styles.container}>
        <NavigationEvents
            onDidFocus={() => this.didFocus()}         
        />
=======
class Home extends React.Component {
  render() {
    return (
      <Container style={styles.container}>
>>>>>>> 78260a6ba4a41d74db2a713748a74ebf695cabc7
        <Header>
          <Left style={{flex:1}}/>
          <Body style={{flex: 2, alignItems: 'center'}}>
            <Title>华思自动化蓝牙采集软件</Title>
          </Body>
          <Right style={{flex: 1}} />
        </Header>

        <View style={styles.touchablesContainer}>
          <View style={styles.touchableContainer}>
            <TouchableOpacity
              style={styles.touchable}
<<<<<<< HEAD
              onPress={() => this.props.navigation.push('Bluetooth')}
=======
              onPress={() => this.props.navigation.navigate('ManualConnect')}
>>>>>>> 78260a6ba4a41d74db2a713748a74ebf695cabc7
            >
              <Image source={bluetooth} style={styles.image} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.touchable}
<<<<<<< HEAD
              onPress={() => this.props.navigation.push('DeviceMsg')}
=======
              onPress={() => this.props.navigation.navigate('DeviceMsg')}
>>>>>>> 78260a6ba4a41d74db2a713748a74ebf695cabc7
            >
              <Image source={deviceInfor} style={styles.image} />
            </TouchableOpacity>
          </View>

          <View style={styles.touchableContainer}>
            <TouchableOpacity
              style={styles.touchable}
<<<<<<< HEAD
              onPress={() => this.props.navigation.push('ManualGather')}
=======
              onPress={() => this.props.navigation.navigate('ManualGather')}
>>>>>>> 78260a6ba4a41d74db2a713748a74ebf695cabc7
            >
              <Image source={manual} style={styles.image} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.touchable}
<<<<<<< HEAD
              onPress={() => this.props.navigation.push('HistoryData')}
=======
              onPress={() => this.props.navigation.navigate('HistoryData')}
>>>>>>> 78260a6ba4a41d74db2a713748a74ebf695cabc7
            >
              <Image source={history} style={styles.image} />
            </TouchableOpacity>            
          </View>

        </View>

        <View style={styles.logoContainer}>
          <Image source={huasilogo} style={styles.logo} />
        </View>

      </Container>
    );
  }
}

<<<<<<< HEAD
const mapDispatchToProps = (dispatch) => {
  return {    
    disconnectDevice: () => dispatch(disconnectDevice()),
  };
};

export default connect(null, mapDispatchToProps)(Home);
=======
export default Home;
>>>>>>> 78260a6ba4a41d74db2a713748a74ebf695cabc7
>>>>>>> 17118f8b7c762a29eaadd552e1aef944b3b5d271
