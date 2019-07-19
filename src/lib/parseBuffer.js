import { Buffer } from 'buffer';
import aesjs from 'aes-js';

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

function push(b) {
  let result = null;
  consoleBuffer(b, '接收');
  cacheBuffer = Buffer.concat([cacheBuffer, b]);
  consoleBuffer(cacheBuffer, '暂存');

  let startIndex = cacheBuffer.indexOf(Buffer.from([0xfe]));
  let endIndex = cacheBuffer.indexOf(Buffer.from([0x0d, 0x0a]), startIndex);
  while (endIndex !== -1 && startIndex !== -1) {
    const entry = cacheBuffer.slice(startIndex, endIndex + 2);
    consoleBuffer(entry, '单元');
    const data = entry.slice(1, -3);
    consoleBuffer(data, '数据');
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
    }

    cacheBuffer = cacheBuffer.slice(endIndex + 2);
    startIndex = cacheBuffer.indexOf(Buffer.from([0xfe]));
    endIndex = cacheBuffer.indexOf(Buffer.from([0x0d, 0x0a]), startIndex);
  }

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
    Object.assign(result, fieldValueMap(field, fieldLength, value));
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
  throw new Error('无效产品类型');
}

function fieldValueMap(field, fieldLength, value) {
  if (field.equals(Buffer.from([0x01]))) {
    return {
      t: value.readIntBE(0, fieldLength) / 100, // 温度
    };
  }
  if (field.equals(Buffer.from([0x02]))) {
    return {
      v: value.readIntBE(0, fieldLength) / 100, // 电压
    };
  }
  if (field.equals(Buffer.from([0x03]))) {
    return {
      state: value, // 状态
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
    };
  }
  if (field.equals(Buffer.from([0x12]))) {
    return {
      meshAp: value, // Mesh Ap 判断位
    };
  }
  if (field.equals(Buffer.from([0xe0]))) {
    return {
      sn: value.toString(), // SN码
    };
  }
  if (field.equals(Buffer.from([0xe1]))) {
    return {
      version: value.toString(), // 固件版本
    };
  }
  console.log('错误的字段');
  return {};
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
};

