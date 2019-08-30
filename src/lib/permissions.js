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

export const requestMultiplePermission = async () => {
  try {
      const permissions = [          
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,          
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      ]
      //返回得是对象类型
      const granteds = await PermissionsAndroid.requestMultiple(permissions);
      var data = "是否同意地址权限: "
      if (granteds["android.permission.ACCESS_FINE_LOCATION"] === "granted") {
          data = data + "是\n";
          console.log('位置信息授权成功');
      } else {
          data = data + "否\n"
          console.log('位置信息授权失败');
      }
      data = data+"是否同意蓝牙权限: "
      if (granteds["android.permission.BLUETOOTH"] === "granted") {
          data = data + "是\n"
          console.log('蓝牙信息授权成功');
      } else {
          data = data + "否\n"
          console.log('蓝牙信息授权失败');
      }
      data = data+"是否同意存储权限: "
      if (granteds["android.permission.WRITE_EXTERNAL_STORAGE"] === "granted") {
          data = data + "是\n"
          console.log('存储信息授权成功');
      } else {
          data = data + "否\n"
          console.log('存储信息授权失败');
      }      
  } catch (err) {
      console.warn(err.toString());
  }
}
