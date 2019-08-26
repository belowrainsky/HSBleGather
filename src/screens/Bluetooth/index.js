import React from 'react';
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
} from "native-base";
import styles from "./styles";

class BluetoothModes extends React.Component {
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
            <Title>蓝牙连接</Title>
          </Body>
          <Right style={{flex: 1}} />
        </Header>

        <Content padder>
          <Button iconLeft primary block
            style={styles.mb20}
            onPress={() => this.props.navigation.navigate('ManualConnect')}
          >
            <Icon name='bluetooth' />
            <Text>选择蓝牙设备</Text>
          </Button>
          <Button iconLeft primary block
            style={styles.mb20}
            onPress={() => this.props.navigation.navigate('QRCodeConnect')}
          >
            <Icon name='qr-scanner' />
            <Text>扫码连接蓝牙</Text>
          </Button>
        </Content>
      </Container>
    );
  }
}

export default BluetoothModes;

