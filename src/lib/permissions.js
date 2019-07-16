import { PermissionsAndroid } from 'react-native';

export const requestCameraPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: '授权APP使用摄像头',
        message: 'APP某些功能需要使用摄像头，需要您的授权',
        buttonNeutral: '稍后提示',
        buttonNegative: '取消',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('摄像头授权成功');
    } else {
      console.log('摄像头授权失败');
    }
  } catch (err) {
    console.warn(err);
  }
}

export const requestLocationPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      {
        title: '授权APP使用位置信息',
        message: '请授权APP使用位置信息，以使用蓝牙连接功能',
        buttonNeutral: '稍后提示',
        buttonNegative: '取消',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('位置信息授权成功');
    } else {
      console.log('位置信息授权失败');
    }
  } catch (err) {
    console.warn(err);
  }
}
