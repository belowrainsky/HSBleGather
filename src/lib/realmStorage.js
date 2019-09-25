import Realm from 'realm';
import moment from 'moment';
//设备-系统 信息 页面的table
const setMsgSchema = {
  name: 'setMsg',
  primaryKey: 'devNo',
  properties: {    
    devType: 'string', //设备型号
    devNo: 'string',   //设备SN码
    volt: 'double?',    //电压
    gatherFunc: 'string',//采集功能
    DtuFunc: 'string',  //网络通信功能
    Csq: 'string',      //网络通信质量
    interval: 'int', //监测间隔
    intervalType: 'string',//分钟或小时
    time: 'string'      //系统时间    
  }
};

//电流版本的table --人工采集
const CurrentSchema = {
  name: 'Current',  
  properties: {  
    channelNo: 'int',         
    current: 'double', //电流
    waterLevel: 'double',//水位
  },
};

//振弦版本的table --人工采集
const VibrateSchema = {
  name: 'Vibrate',  
  properties: {
    channelNo: 'int',
    frequency: 'double',//频率
    mode: 'double',      //频模
    temperature: 'double',//温度
  }
};

const OsmometerCurrentSchema = {
  name: 'OsmometerCurrent',
  primaryKey: 'id',
  properties: {
    id: 'int',    
    sysTime: 'date',
    sn: 'string',
    currentArr: 'Current[]',
  },
};

const OsmometerVibrateSchema = {
  name: 'OsmometerVibrate',
  primaryKey: 'id',
  properties: {
    id: 'int',    
    sysTime: 'date',
    sn: 'string',
    vibrateArr: 'Vibrate[]',
  },
};

const checkEmpty = (value) => {
  return value === null || value === undefined;
};

const openRealm = async () => {
  try {
    let realm = new Realm({
      schema: [
        CurrentSchema,
        VibrateSchema,                  
        setMsgSchema,   
        OsmometerCurrentSchema,
        OsmometerVibrateSchema,
      ]
    });  
    
    console.log(`打开realm成功！`);
    return Promise.resolve(realm);
  } catch (err) {
    console.log(`打开realm失败 ${err}`);
  }
};

export default openRealm;

