import { Buffer } from 'buffer';
import aesjs from 'aes-js';
<<<<<<< HEAD
import {  
  Toast,
} from 'native-base';
=======
>>>>>>> 17118f8b7c762a29eaadd552e1aef944b3b5d271

let cacheBuffer = Buffer.alloc(0); // 暂存数据

const key = Buffer.from("Wesley2017-03-16");
const aes = new aesjs.AES(key);

function decryptData(encryptedBuffer) {
  const array = Array.from(encryptedBuffer);
  const convertArray = [
    array[0], array[4], array[8], array[12],
    array[1], array[5], array[9], array[13],
    array[2], array[6], array[10], array[14],
    array[3], array[7], array[11], array[15],
  ];
  const decryptedBytes = aes.decrypt(Buffer(convertArray));
  const decryptedBuffer = new Buffer(decryptedBytes);
  return decryptedBuffer;
}

function xor(buffer) {
  const xor = Array.from(buffer).reduce((prev, cur) => prev ^ cur, 0);
  const xorBuffer = new Buffer([xor]);
  return xorBuffer;
}

function consoleBuffer(b, title = '') {
  // return;
  const string = Array.from(b).map(byte => byte.toString(16)).join(' ');
  console.log(`${title}Buffer ${string}`);
}

<<<<<<< HEAD
function showToast(text, position = 'bottom', duration = 5000) {
    Toast.show({ text, position, duration });
}

function push2parse(b) {
  let result = {};
  consoleBuffer(b, '接收');
  cacheBuffer = Buffer.concat([cacheBuffer, b]);
  consoleBuffer(cacheBuffer, '暂存');

  let startIndex = cacheBuffer.indexOf(Buffer.from([0xfe]));
  let endIndex = cacheBuffer.indexOf(Buffer.from([0x0d, 0x0a]), startIndex);
  
  console.log(`开始index=${startIndex}, 结束index+2=${endIndex+2}`);  

  const productType = cacheBuffer.slice(3, 5);
  console.log(`产品类型值 = ${productType.toString()}`);
  const isOsometer = productType.equals(Buffer.from([0x04, 0x00]));  

  while (endIndex !== -1 && startIndex !== -1 && cacheBuffer.length >= 11)
  {
    let entry = cacheBuffer.slice(startIndex, endIndex + 2);
    consoleBuffer(entry, '单元');
    let data = entry.slice(1, -3);
    consoleBuffer(data, '数据');

    let check = xor(data);
    let checkByte = entry.slice(-3, -2);
    console.log(`check: ${check.toString()}, checkByte: ${checkByte.toString()}`);
    if (checkByte.equals(check)) {      
      // result = parseData(data);     
      Object.assign(result, parseData(data));
    } else {
      consoleBuffer(check, '校验异常');
      const string = Array.from(cacheBuffer).map(byte => byte.toString(16)).join(' ');      
      showToast(`数据校验异常，请重新获取，数据=${string}`);        
    }

    let count = 0;
    while(!checkByte.equals(check)) {      
      console.log(`---01---`);
      const nextIndex = cacheBuffer.indexOf(Buffer.from([0x0d, 0x0a]), endIndex);

      console.log(`nextIndex=${nextIndex}, endIndex=${endIndex}`);

      if(nextIndex !== -1) {
        entry = cacheBuffer.slice(startIndex, nextIndex + 2);
        data = entry.slice(1, -3);
        check = xor(data);
        checkByte = entry.slice(-3, -2);
        console.log(`---1---`);
        consoleBuffer(check, '校验');
        consoleBuffer(checkByte, '字段校验值');        
        if(checkByte.equals(check))
        {
          console.log(`---2---`);
          endIndex += nextIndex;
          break;
        } else {
          endIndex += nextIndex;
        }
      }
      if(count >= 10){
        console.log(`count >= 10`);
        break;
      }
      count += 1;
    }
    console.log(`校验值异常次数：${count}`);
    
    if(checkByte.equals(check)){
      Object.assign(result, parseData(data));
      // result = parseData(data);
    }

    cacheBuffer = cacheBuffer.slice(endIndex + 2);
    startIndex = cacheBuffer.indexOf(Buffer.from([0xfe]));
    endIndex = cacheBuffer.indexOf(Buffer.from([0x0d, 0x0a]), startIndex);    
  }    
  return result;
}

function push(b, isGetDevMSg) {
  let result = {};
=======
function push(b) {
  let result = null;
>>>>>>> 17118f8b7c762a29eaadd552e1aef944b3b5d271
  consoleBuffer(b, '接收');
  cacheBuffer = Buffer.concat([cacheBuffer, b]);
  consoleBuffer(cacheBuffer, '暂存');

  let startIndex = cacheBuffer.indexOf(Buffer.from([0xfe]));
  let endIndex = cacheBuffer.indexOf(Buffer.from([0x0d, 0x0a]), startIndex);
<<<<<<< HEAD

  let nextIndex = cacheBuffer.indexOf(Buffer.from([0xfe]), endIndex);
  let lastIndex = cacheBuffer.lastIndexOf(Buffer.from([0x0d, 0x0a], endIndex));
  
  console.log(`开始index=${startIndex}, 结束index+2=${endIndex+2}`);  

  if(isGetDevMSg) {
    console.log('isGetDevMSg == true');
    // if((endIndex+2) !== nextIndex || nextIndex === -1) {
    //   console.log('isGetDevMSg == true, 或者nextindex=-1');
    //   return;
    // }    
  }else {
    console.log('isGetDevMSg == false');
    if(lastIndex === -1){
      console.log('isGetDevMSg == false, 或者lastIndex=-1');
      return;
    }
  }  

  // const len = parseInt(cacheBuffer.slice(-3, -2));
  let len;
  if(startIndex !== -1 && cacheBuffer.length >= 11 ) {
    len = cacheBuffer.slice(startIndex+6, startIndex+7).readUInt8(0) + 10;
    console.log(`数据长度： ${len}`);
  }  

  const productType = cacheBuffer.slice(3, 5);
  console.log(`产品类型值 = ${productType}`);
  const isOsometer = productType.equals(Buffer.from([0x04, 0x00]));  

  while (endIndex !== -1 && startIndex !== -1 && cacheBuffer.length >= 11)
  {
=======
  while (endIndex !== -1 && startIndex !== -1) {
>>>>>>> 17118f8b7c762a29eaadd552e1aef944b3b5d271
    const entry = cacheBuffer.slice(startIndex, endIndex + 2);
    consoleBuffer(entry, '单元');
    const data = entry.slice(1, -3);
    consoleBuffer(data, '数据');
<<<<<<< HEAD

    const check = xor(data);
    const checkByte = entry.slice(-3, -2);

    if (checkByte.equals(check)) {      
      // result = parseData(data);     
      Object.assign(result, parseData(data));
    } else {
      consoleBuffer(check, '校验异常');
      const string = Array.from(cacheBuffer).map(byte => byte.toString(16)).join(' ');      
      showToast(`数据校验异常，请重新获取，数据=${string}`);      
=======
    const check = xor(data);
    const checkByte = entry.slice(-3, -2);

    if (checkByte.equals(check)) {
      // consoleBuffer(data, '解密前')
      // const decrypted = decryptData(data.slice(0, 16));
      // const other = data.slice(16);
      // const concat = Buffer.concat([decrypted, other]);
      // consoleBuffer(concat, '解密后')
      // result = parseData(concat);
      result = parseData(data);
    } else {
      consoleBuffer(check, '校验异常');
>>>>>>> 17118f8b7c762a29eaadd552e1aef944b3b5d271
    }

    cacheBuffer = cacheBuffer.slice(endIndex + 2);
    startIndex = cacheBuffer.indexOf(Buffer.from([0xfe]));
    endIndex = cacheBuffer.indexOf(Buffer.from([0x0d, 0x0a]), startIndex);
<<<<<<< HEAD

    console.log(`开始index1=${startIndex}, 结束index1=${endIndex}`);    
  }    
=======
  }

>>>>>>> 17118f8b7c762a29eaadd552e1aef944b3b5d271
  return result;
}

function parseData(data) {
  const result = {};
  result.serial = data.slice(0, 2).readUInt16BE(0);
  result.productType = productTypeMap(data.slice(2, 4));

  let i = 4;
  const dataLength = data.length;
  while (i < dataLength) {
    const field = data.slice(i, i + 1); // 字段
    const fieldLength = data.slice(i + 1, i + 2).readUInt8(0); // 字段长度
    const value = data.slice(i + 2, i + 2 + fieldLength);
<<<<<<< HEAD
    Object.assign(result, fieldValueMap(field, fieldLength, value));    
=======
    Object.assign(result, fieldValueMap(field, fieldLength, value));
>>>>>>> 17118f8b7c762a29eaadd552e1aef944b3b5d271
    i = i + 2 + fieldLength;
  }

  return result;
};

function productTypeMap(b) {
  if (b.equals(Buffer.from([0x01, 0x00]))) return 'ADM';
  if (b.equals(Buffer.from([0x02, 0x00]))) return 'RDM';
  if (b.equals(Buffer.from([0x02, 0x01]))) return 'RDM355';
  if (b.equals(Buffer.from([0x02, 0x02]))) return 'RDM16475';
  if (b.equals(Buffer.from([0x03, 0x00]))) return 'SDM';
<<<<<<< HEAD
  if (b.equals(Buffer.from([0x04, 0x00]))) return 'Osmometer';
  // throw new Error('无效产品类型');
  showToast('无效产品类型');
  console.log('无效产品类型');
=======
  throw new Error('无效产品类型');
>>>>>>> 17118f8b7c762a29eaadd552e1aef944b3b5d271
}

function fieldValueMap(field, fieldLength, value) {
  if (field.equals(Buffer.from([0x01]))) {
    return {
      t: value.readIntBE(0, fieldLength) / 100, // 温度
    };
  }
<<<<<<< HEAD
  
  if (field.equals(Buffer.from([0x03]))) {
    return {
      state: value.readUIntBE(0, fieldLength), // 状态
=======
  if (field.equals(Buffer.from([0x02]))) {
    return {
      v: value.readIntBE(0, fieldLength) / 100, // 电压
    };
  }
  if (field.equals(Buffer.from([0x03]))) {
    return {
      state: value, // 状态
>>>>>>> 17118f8b7c762a29eaadd552e1aef944b3b5d271
    };
  }
  if (field.equals(Buffer.from([0x04]))) {
    const gx = value.readInt32BE(0) / 1e7;
    const gy = value.readInt32BE(4) / 1e7;
    const gz = value.readInt32BE(8) / 1e7;
    return {
      g: { gx, gy, gz }, // 加速度
    };
  }
  if (field.equals(Buffer.from([0x05]))) {
    return {
      angularVelocity: value, // 角速度
    };
  }
  if (field.equals(Buffer.from([0x06]))) {
    const anglex = value.readInt32BE(0) / 1e6;
    const angley = value.readInt32BE(4) / 1e6;
    const anglez = value.readInt32BE(8) / 1e6;
    return {
      angle: { anglex, angley, anglez }, // 角度
    };
  }
  if (field.equals(Buffer.from([0x10]))) {
    return {
      meshMac: value, // Mesh Mac 地址
    };
  }
  if (field.equals(Buffer.from([0x11]))) {
    return {
      meshId: value, // Mesh id
<<<<<<< HEAD

=======
>>>>>>> 17118f8b7c762a29eaadd552e1aef944b3b5d271
    };
  }
  if (field.equals(Buffer.from([0x12]))) {
    return {
      meshAp: value, // Mesh Ap 判断位
    };
  }
<<<<<<< HEAD
  
  if (field.equals(Buffer.from([0xe1]))) {
    return {
      version: value.toString(), // 固件版本
    };
  }

=======
>>>>>>> 17118f8b7c762a29eaadd552e1aef944b3b5d271
  if (field.equals(Buffer.from([0xe0]))) {
    return {
      sn: value.toString(), // SN码
    };
  }
<<<<<<< HEAD

  if (field.equals(Buffer.from([0x02]))) {
    return {
      volt: value.readIntBE(0, fieldLength) / 100, // 电压
    };
  }

  if (field.equals(Buffer.from([0xe5]))) {
    let valueFre =value.readUIntBE(0, fieldLength);     
    // let freq = valueFre === 0 ? 1 : (1440 / valueFre);
    let freq = valueFre === 0 ? 1 : valueFre;    
    freq = parseInt(freq); 
    freq = Math.round(freq*100) / 100;
    return {
      frequency: freq,
    };
  }

  if(field.equals(Buffer.from([0x20])))//多个频率
  {    
    let channelFre_1 = value.readUIntBE(1, 4) / 100 ;
    let channelFre_2 = value.readUIntBE(6, 4) / 100;
    let channelFre_3 = value.readUIntBE(11, 4) / 100;
    let channelFre_4 = value.readUIntBE(16, 4) / 100;
    
    const channelsFre = [channelFre_1, channelFre_2, channelFre_3, channelFre_4];    
    return {
      channelsFre: channelsFre,
    };
  }

  if(field.equals(Buffer.from([0x23])))//多个电流
  {    
    let current1 = value.readUIntBE(1, 4) / 1000;
    let current2 = value.readUIntBE(6, 4) / 1000;
    let current3 = value.readUIntBE(11, 4) / 1000;
    let current4 = value.readUIntBE(16, 4) / 1000;
    
    const currentArr = [current1, current2, current3, current4];    
    return {
      current: currentArr,
    };
  }

  if(field.equals(Buffer.from([0x21])))//多个温度
  {
    const t1 = value.readUIntBE(1, 2) / 100;
    const t2 = value.readUIntBE(4, 2) / 100;
    const t3 = value.readUIntBE(7, 2) / 100;
    const t4 = value.readUIntBE(10, 2) / 100;
    const channelsTemperature = [ t1, t2, t3, t4 ];
    return {
      channelsTemperature : channelsTemperature,
    };
  }

  if (field.equals(Buffer.from([0xe2]))) {
       const year = value.readUIntBE(0, 1)+2000;
       let month = value.readUIntBE(1, 1);
       if(month <=9 ){
          month = '0' + month.toString();
       }
       let day = value.readUIntBE(2, 1);
       if(day <= 9){
        day = '0' + day.toString();
       }
       let hour = value.readUIntBE(3, 1);
       if(hour <= 9){
        hour = '0' + hour.toString();
       }
       let minute = value.readUIntBE(4, 1);
       if(minute <= 9){
        minute = '0' + minute.toString();
       }
       let second = value.readUIntBE(5, 1);
       if(second <= 9) {
        second = '0' + second.toString();   
       }
       // 系统时间       
       const date = year.toString()+'-'+month+'-'+day+' '+hour+':'+minute+':'+second; 
       console.log(`获取到的系统时间： ${date}`);
    return {                 
      SysTime: date,
    };
  }

  if (field.equals(Buffer.from([0xd4]))) {
    return {
      channData: value.toString(), // 通道数据
    };
  }

  if (field.equals(Buffer.from([0xd3]))) {        
    return {
      selectData: value.toString(), //历史-选择数据
    };
  }

  if(field.equals(Buffer.from([0xB2]))) {       
    return {
      dtuCsq: '-'+value.readUIntBE(0, 1), //通信质量
    }; 
  }

  if(field.equals(Buffer.from([0xB0]))) {
    const modelSta = value.readUIntBE(0, 1)+'-'+value.readUIntBE(1, 1)
                  +'-'+value.readUIntBE(2, 1)+'-'+value.readUIntBE(3, 1);
    return {
      modelStatus: modelSta,  //模块状态
    };
  }  

  console.log('错误的字段或未设置的字段');
  return {};  
=======
  if (field.equals(Buffer.from([0xe1]))) {
    return {
      version: value.toString(), // 固件版本
    };
  }
  console.log('错误的字段');
  return {};
>>>>>>> 17118f8b7c762a29eaadd552e1aef944b3b5d271
}

function wrapPayload(payload) {
  return Buffer.concat([
    Buffer.from([0xfe]),
    payload,
    xor(payload),
    Buffer.from([0x0d, 0x0a]),
  ]);
};

<<<<<<< HEAD
//设备-系统 信息 页面的获取
function getOsmometerMsg()
{  
  let snCmd = [0x00, 0x00, 0x00, 0x00, 0xe0, 0x00];
  let voltCmd = [0x02, 0x00];
  let systimeCmd = [0xe2, 0x00];
  let freCmd = [0xe5, 0x00];
  let CSQCmd = [0xB2, 0x00];
  let modelStatusCmd = [0xB0, 0x00];
  let cmdArray = snCmd.concat(voltCmd, systimeCmd, freCmd, CSQCmd, modelStatusCmd);
  const cmd = Buffer.from(cmdArray);  
  return wrapPayload(cmd);
}

//获取SN码
function SNPacket() {
  const cmd = Buffer.from([0x00, 0x00, 0x00, 0x00, 0xe0, 0x00]);
  return wrapPayload(cmd);
}

//获取版本信息
function versionPacket() {
  const cmd = Buffer.from([0x00, 0x01, 0x00, 0x00, 0xe1, 0x00]);
  return wrapPayload(cmd);
}

//唤醒设备
function awakeDevice() {
  const cmd = Buffer.from([0x00, 0x02, 0x00, 0x01, 0x03, 0x01, 0x11]);
  return wrapPayload(cmd);
}

//获取系统时间
function getUpdateData() {
  const cmd = Buffer.from([0x00, 0x03, 0x00, 0x00, 0xe2, 0x00]);
  return wrapPayload(cmd);
}

//获取电压
function getVolt() {
  const cmd = Buffer.from([0x00, 0x04, 0x00, 0x00, 0x02, 0x00]);
  return wrapPayload(cmd);
}

//设置时间
function setSysTime(datetime) {
  let cmm = [0x00, 0x05, 0x00, 0x01, 0xe2, 0x08];
  cmm.push(datetime[0], datetime[1], datetime[2], datetime[3], datetime[4], datetime[5], 0x00, 0x00);    
  const cmd = Buffer.from(cmm);
  return wrapPayload(cmd);
}

//设置频率
function setFrequency(fre) {
  let cmm = [0x00, 0x08, 0x00, 0x01, 0xe5, 0x02];
  cmm.push(fre[0], fre[1]);  
  let cmd = Buffer.from(cmm); 
  console.log(`设置频率： ${cmm.toString()}`);   
  return wrapPayload(cmd); 
}

//获取时间
function getSysTime() {
  const cmd = Buffer.from([0x00, 0x06, 0x00, 0x00, 0xe2, 0x00]);
  return wrapPayload(cmd);
}

// //设置闹钟
// function setAlarmClock() {
//   const cmd = Buffer.from([0x00, 0x06, 0x00, 0x01, 0xe4, 0x00]);
//   return wrapPayload(cmd);
// }

//设置状态
// function setDeviceState() {
//   const cmd = Buffer.from([0x00, 0x07, 0x00, 0x01, 0x03, 0x00]);
//   return wrapPayload(cmd);
// }

//获取频率
function getFrequency() {
  const cmd = Buffer.from([0x00, 0x07, 0x00, 0x00, 0xe5, 0x00]);
  return wrapPayload(cmd); 
}

//获取当前4个通道的数据
function getChannData(){
  const cmd = Buffer.from([0x00, 0x09, 0x00, 0x00, 0xd4, 0x00]);
  return wrapPayload(cmd);  
}

//获取时间段内的时间
function getHistoryData(beginDatetime, endDatetime) {
  let comm = [0x00, 0x0A, 0x00, 0x00, 0xd3, 0x0C];
  comm.push(beginDatetime[0], beginDatetime[1], beginDatetime[2], beginDatetime[3], beginDatetime[4], beginDatetime[5]); 
  comm.push(endDatetime[0], endDatetime[1], endDatetime[2], endDatetime[3], endDatetime[4], endDatetime[5]);  
  // comm.push(0x00, 0x01, 0x02, 0x15, 0x14, 0x00,  0x00, 0x01, 0x04, 0x01, 0x01, 0x00);  
  const cmd = Buffer.from(comm);  
  console.log(`获取历史数据命令：${comm.toString()}`);
  return wrapPayload(cmd);   
}

//网络通信质量:DTU CSQ 
function getDTUCSQ_Data() {
  const cmd = Buffer.from([0x00, 0x0B, 0x00, 0x00, 0xB2, 0x00]);
  return wrapPayload(cmd);
}

function getCurSaveData() {
  const cmd = Buffer.from([0x00, 0x0C, 0x00, 0x00, 0xD2, 0x00]);
  return wrapPayload(cmd); 
}

//将时间日期转成十六进制数
function dateStrToHex(datetimeStr) {
    let date = datetimeStr;
    let year = date.substring(2, 4);    
    let month = date.substring(5, 7);   
    let day = date.substring(8, 10);
    let hour = date.substring(11, 13);    
    let minute = date.substring(14, 16);    
    let second = date.substring(17, 19);        

    year = '0x' + parseInt(year).toString(16);
    month = '0x' + parseInt(month).toString(16);
    day = '0x' + parseInt(day).toString(16);
    hour = '0x' + parseInt(hour).toString(16);
    minute = '0x' + parseInt(minute).toString(16);
    second = '0x' + parseInt(second).toString(16);    
    
    const ymd = [year, month, day, hour, minute, second];
    return ymd;     
}

export default {
  consoleBuffer,
  
  push,
  push2parse,

  SNPacket,
  versionPacket,
  awakeDevice,
  getUpdateData,
  getVolt,
  getSysTime,
  getChannData,
  getHistoryData,
  getFrequency,

  setSysTime,
  setFrequency,

  dateStrToHex,
  getDTUCSQ_Data,
  getOsmometerMsg,

  getCurSaveData,
=======
<<<<<<< HEAD
//获取SN码
=======
>>>>>>> 78260a6ba4a41d74db2a713748a74ebf695cabc7
function SNPacket() {
  const cmd = Buffer.from([0x00, 0x00, 0x00, 0x00, 0xe0]);
  return wrapPayload(cmd);
}

<<<<<<< HEAD
//获取版本信息
=======
>>>>>>> 78260a6ba4a41d74db2a713748a74ebf695cabc7
function versionPacket() {
  const cmd = Buffer.from([0x00, 0x01, 0x00, 0x00, 0xe1]);
  return wrapPayload(cmd);
}

<<<<<<< HEAD
//唤醒设备
function awakeDevice() {
  const cmd = Buffer.from([0x00, 0x02, 0x00, 0x00, 0x11, 0x00]);
  return wrapPayload(cmd);
}

//获取更新时间
function updateData() {
  const cmd = Buffer.from([0x00, 0x03, 0x00, 0x00, 0xe2, 0x00]);
=======
function awake() {
  const cmd = Buffer.from([0x00, 0x02, 0x04, 0x00, 0x11]);
  return wrapPayload(cmd);
}

function updateData() {
  const cmd = Buffer.from([0x00, 0x03, 0x04, 0x00, 0xe2]);
>>>>>>> 78260a6ba4a41d74db2a713748a74ebf695cabc7
  return wrapPayload(cmd);
}


<<<<<<< HEAD
//设置电压
function setVolt() {
  const cmd = Buffer.from([0x00, 0x04, 0x00, 0x01, 0x02, 0x00]);
  return wrapPayload(cmd);
}

//设置时间
function setCurrentTime() {
  const cmd = Buffer.from([0x00, 0x05, 0x00, 0x01, 0xe3, 0x00]);
  return wrapPayload(cmd);
}

//设置闹钟
function setAlarmClock() {
  const cmd = Buffer.from([0x00, 0x06, 0x00, 0x01, 0xe4, 0x00]);
  return wrapPayload(cmd);
}

//设置状态
function setDeviceState() {
  const cmd = Buffer.from([0x00, 0x07, 0x00, 0x01, 0x03, 0x00]);
  return wrapPayload(cmd);
}

//设置频率
function setFrequency() {
  const cmd = Buffer.from([0x00, 0x08, 0x00, 0x01, 0x0A, 0x00]);
  return wrapPayload(cmd); 
}

=======
>>>>>>> 78260a6ba4a41d74db2a713748a74ebf695cabc7
export default {
  consoleBuffer,
  push,
  SNPacket,
  versionPacket,
<<<<<<< HEAD
  awakeDevice,
  updateData,
  setVolt,
  setCurrentTime,
  setAlarmClock,
  setDeviceState,
  setFrequency,
=======
  awake,
  updateData,
>>>>>>> 78260a6ba4a41d74db2a713748a74ebf695cabc7
>>>>>>> 17118f8b7c762a29eaadd552e1aef944b3b5d271
};

