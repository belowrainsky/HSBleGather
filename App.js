/**
 * HsBleGather
 *
 *
 */

import React from 'react';
import{
  createStackNavigator,
  createAppContainer,
  createDrawerNavigator,
} from 'react-navigation';

import DeviceMsg from './src/screens/DeviceMsg';
import ManualGather from './src/screens/ManualGather';
import HistoryData from './src/screens/HistoryData';
<<<<<<< HEAD

import Bluetooth from './src/screens/Bluetooth';
import ManualConnect from './src/screens/Bluetooth/manualConnect';
import QRCodeConnect from './src/screens/Bluetooth/qrcodeConnect';

=======
import ManualConnect from './src/screens/Bluetooth';
>>>>>>> 78260a6ba4a41d74db2a713748a74ebf695cabc7
import Home from './src/screens/Home';

import {Root, StyleProvider} from 'native-base';
import getTheme from './native-base-theme/components';
import mytheme from './native-base-theme/variables/material'

import HsBleManager from './src/lib/hsBleManager';
global.HSBleManager = new HsBleManager();

const AppNavigator = createStackNavigator(
  {
  	Home: {screen: Home},
    DeviceMsg: {screen: DeviceMsg},
    ManualGather: {screen: ManualGather},
    HistoryData: {screen: HistoryData},
<<<<<<< HEAD
    Bluetooth : {screen: Bluetooth},
    ManualConnect: {screen: ManualConnect},
    QRCodeConnect: {screen: QRCodeConnect},    
=======
    ManualConnect: {screen: ManualConnect},
>>>>>>> 78260a6ba4a41d74db2a713748a74ebf695cabc7
  },
  {
  	initialRouteName:'Home',  
  	headerMode: 'none',
  }
);

const AppContainer = createAppContainer(AppNavigator);

export default class App extends React.Component {
	render(){
		return(
			<StyleProvider style={getTheme(mytheme)}>
				<Root>
					<AppContainer />
				</Root>
			</StyleProvider>
		);
	}
}