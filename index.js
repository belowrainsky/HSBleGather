/**
 * @format
 */
import React from 'react';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { Provider } from 'react-redux';
import store from './src/store';
import { YellowBox } from 'react-native';

const RNRedux = () => (
	<Provider store={store}>
		<App />
	</Provider>
);

YellowBox.ignoreWarnings([
	'Warning: componentWillMount is deprecated',
	'Warning: componentWillReceiveProps is deprecated',
	'Module RCTImageLoader requires',
	'Warning: componentWillUpdate is deprecated',
]);

AppRegistry.registerComponent(appName, () => RNRedux);
