import { Platform } from 'react-native';
import RNFS from 'react-native-fs';

export const huasidir = Platform.OS === 'ios'
  ? RNFS.LibraryDirectoryPath + '/huasidata'
  : RNFS.ExternalDirectoryPath + '/huasidata';

const mkdir = () => {
  RNFS.mkdir(huasidir)
    .then(() => {
      console.log('数据目录创建成功');
    })
    .catch((err) => {
      console.log(err.message);
    });
};

mkdir();

export const filePath = (filename) => {
  return `${huasidir}/${filename}`;
};

export const readFiles = async () => {
  try {
    const result = await RNFS.readDir(huasidir)
    console.log('GOT RESULT', result);
    return Promise.resolve(result);
  } catch (err) {
    console.log(err.message, err.code);
  }
};

export const write2ChannFile = async (filename, collection, isCurrentVersion) => {
  try {
    const path = filePath(filename);

    let header;
    if(isCurrentVersion) {
      // header = [
      // '通道',
      // '时间',
      // '电流',
      // '水位',
      // '温度',
      // ].join(',') + '\n';
      header= '通道,时间,电流,水位,温度\n';
    }else {
      // header = [
      // '通道',
      // '时间',
      // '频率',
      // '频模',
      // '温度',
      // ].join(',') + '\n';
      header= '通道,时间,频率,频模,温度\n';
    }
    // const header = [
    //   '通道',
    //   '时间',
    //   '频率',
    //   '频模',
    //   '温度',
    // ].join(',') + '\n';
    await RNFS.writeFile(path, header, 'utf8');
        
    const channelNo = collection.channelNo;
    const collectAt = collection.collectAt;
    const t = collection.t;
    const fre = collection.fre;
    const mod = collection.mod;
    const rowData = [channelNo, collectAt, fre, mod, t].join(',')+'\n';  

    await RNFS.appendFile(path, rowData, 'utf8');

    console.log(`文件 ${path} 写入-header和通道1-数据成功`);
    return Promise.resolve(path);
  } catch (err) {
    console.log(`文件写入失败， ${err} `);
    return Promise.reject(err);
  }
};

export const append2ChannnFile = async(filename, collection) => {
 try {
    const path = filePath(filename);
        
    const channelNo = collection.channelNo;
    const collectAt = collection.collectAt;
    const t = collection.t;
    const fre = collection.fre;
    const mod = collection.mod;
    const rowData = [channelNo, collectAt, fre, mod, t].join(',')+'\n';  

    await RNFS.appendFile(path, rowData, 'utf8');

    console.log(`文件 ${path} 写入其他通道数据成功`);
    return Promise.resolve(path);
  } catch (err) {
    console.log(`文件写入失败， ${err} `);
    return Promise.reject(err);
  }

}
