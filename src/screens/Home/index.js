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

const huasilogo = require('./huasi.png');
const bluetooth = require('./bluetooth.png');
const manual = require('./Manual.png');
const history = require('./HistoryGather.png');
const deviceInfor = require('./DeviceMsg.png');

class Home extends React.Component {
  render() {
    return (
      <Container style={styles.container}>
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
              onPress={() => this.props.navigation.navigate('ManualConnect')}
            >
              <Image source={bluetooth} style={styles.image} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.touchable}
              onPress={() => this.props.navigation.navigate('DeviceMsg')}
            >
              <Image source={deviceInfor} style={styles.image} />
            </TouchableOpacity>
          </View>

          <View style={styles.touchableContainer}>
            <TouchableOpacity
              style={styles.touchable}
              onPress={() => this.props.navigation.navigate('ManualGather')}
            >
              <Image source={manual} style={styles.image} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.touchable}
              onPress={() => this.props.navigation.navigate('HistoryData')}
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

export default Home;