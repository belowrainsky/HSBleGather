import { BleManager } from 'react-native-ble-plx';
import { Buffer } from 'buffer';

const log = (msg, level = 'log') => {
  const verbose = true;
  verbose && console[level](msg);
};

class HsBleManager {
  constructor(){
    this.isConnecting = false;  //蓝牙是否连接
    this.monitorSubscription = null; // 监听订阅
    this.initUUID();
    this.manager = new BleManager();
  }

  initUUID() {
    this.readServiceUUID = [];
    this.readCharacteristicUUID = [];
    this.writeWithResponseServiceUUID = [];
    this.writeWithResponseCharacteristicUUID = [];
    this.writeWithoutResponseServiceUUID = [];
    this.writeWithoutResponseCharacteristicUUID = [];
    this.notifyServiceUUID = [];
    this.notifyCharacteristicUUID = [];
  }

  // 获取设备services - characteristics - value MAP
  async fetchServicesAndCharacteristicsForDevice(device) {
    const servicesMap = {};
    const services = await device.services();

    for (let service of services) {
      const characteristicsMap = {};
      const characteristics = await service.characteristics();

      for (let characteristic of characteristics) {
        characteristicsMap[characteristic.uuid] = {
          uuid: characteristic.uuid,
          isReadable: characteristic.isReadable,
          isWritableWithResponse: characteristic.isWritableWithResponse,
          isWritableWithoutResponse: characteristic.isWritableWithoutResponse,
          isNotifiable: characteristic.isNotifiable,
          isNotifying: characteristic.isNotifying,
          value: characteristic.value,
        };
      }

      servicesMap[service.uuid] = {
        uuid: service.uuid,
        isPrimary: service.isPrimary,
        characteristicsCount: characteristics.length,
        characteristics: characteristicsMap,
      };
    }
    return servicesMap;
  }

  parseServersMap(servicesMap) {
    this.initUUID();

    for (let suuid of Object.keys(servicesMap)) {
      const service = servicesMap[suuid];
      const characteristics = service.characteristics;

      for (let cuuid of Object.keys(characteristics)) {
        const characteristic = characteristics[cuuid];

        if (characteristic.isReadable) {
          this.readServiceUUID.push(service.uuid);
          this.readCharacteristicUUID.push(characteristic.uuid);
        }
        if (characteristic.isWritableWithResponse) {
          this.writeWithResponseServiceUUID.push(service.uuid);
          this.writeWithResponseCharacteristicUUID.push(characteristic.uuid);
        }
        if (characteristic.isWritableWithoutResponse) {
          this.writeWithoutResponseServiceUUID.push(service.uuid);
          this.writeWithoutResponseCharacteristicUUID.push(characteristic.uuid);
        }
        if (characteristic.isNotifiable) {
          this.notifyServiceUUID.push(service.uuid);
          this.notifyCharacteristicUUID.push(characteristic.uuid);
        }
      }
    }

    log(`readServiceUUID ${this.readServiceUUID}`);
    log(`readCharacteristicUUID ${this.readCharacteristicUUID}`);
    log(`writeWithResponseServiceUUID ${this.writeWithResponseServiceUUID}`);
    log(`writeWithResponseCharacteristicUUID ${this.writeWithResponseCharacteristicUUID}`);
    log(`writeWithoutResponseServiceUUID ${this.writeWithoutResponseServiceUUID}`);
    log(`writeWithoutResponseCharacteristicUUID ${this.writeWithoutResponseCharacteristicUUID}`);
    log(`notifyServiceUUID ${this.notifyServiceUUID}`);
    log(`notifyCharacteristicUUID ${this.notifyCharacteristicUUID}`);
  }

  // 搜索蓝牙
  scan(handleDevice) {
    return new Promise((resolve, reject) => {
      this.manager.startDeviceScan(null, null, (err, device) => {
        if (err) {
          return reject(err);
        }
        log(`发现蓝牙设备 ${device.id} ${device.name}`);
        handleDevice && handleDevice(device);
      });
    });
  }

  // 停止搜索蓝牙
  stopScan() {
    log('停止扫描蓝牙');
    this.manager.stopDeviceScan();
  }

  // 连接蓝牙
  async connect(id) {
    log(`连接设备 ${id}`);
    this.isConnecting = true;
    try {
      const device = await this.manager.connectToDevice(id);
      this.peripheralId = device.id;
      this.Device = device;
      const discoveredDevice = await device.discoverAllServicesAndCharacteristics();
      const serversMap = await this.fetchServicesAndCharacteristicsForDevice(discoveredDevice);
      this.parseServersMap(serversMap);
      return Promise.resolve();
    } catch (err) {
      log(`连接失败 ${err}`);
      return Promise.reject(err);
    } finally {
      this.isConnecting = false;
    }
  }

  async read(index = 0) {
    try {
      const characteristic = await this.manager.readCharacteristicForDevice(this.peripheralId,
        this.readServiceUUID[index], this.readCharacteristicUUID[index]);
      const buffer = Buffer.from(characteristic.value, 'base64');
      log(`读取到蓝牙数据：${buffer}`)
      return Promise.resolve(buffer);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async write(value, index = 0) {
    try {
      const formatValue = new Buffer(value).toString('base64');
      await this.manager.writeCharacteristicWithResponseForDevice(this.peripheralId,
        this.writeWithResponseServiceUUID[index], this.writeWithResponseCharacteristicUUID[index], formatValue)
      log(`写入成功`);
      return Promise.resolve();
    } catch (err) {
      log(`写入失败 ${err}`);
      return Promise.reject(err);
    }
  }

  async writeWithoutResponse(value, index = 0) {
    try {
      const formatValue = new Buffer(value).toString('base64');
      await this.manager.writeCharacteristicWithoutResponseForDevice(this.peripheralId,
        this.writeWithoutResponseServiceUUID[index], this.writeWithoutResponseCharacteristicUUID[index], formatValue);
      log(`WithoutRes写成功 ${value}`);
      return Promise.resolve();
    } catch (err) {
      log(`WithoutRes写失败 ${err}`);
      return Promise.reject(err);
    }
  }

  monitor(handler, index = 0) {
    const subscription = this.manager.monitorCharacteristicForDevice(this.peripheralId, this.notifyServiceUUID[index],
      this.notifyCharacteristicUUID[index], handler);
    this.monitorSubscription && this.monitorSubscription.remove();
    this.monitorSubscription = subscription;
    return subscription;
  }

  unmonitor() {
    this.monitorSubscription && this.monitorSubscription.remove();
  }

  async monitorDevice(device, listener) {
    try {
      const isConnected = await device.isConnected();
      if (!isConnected) {
        const connectedDevice = await device.connect();
      }
      const discoveredDevice = await device.discoverAllServicesAndCharacteristics();
      const serversMap = await this.fetchServicesAndCharacteristicsForDevice(discoveredDevice);
      this.parseServersMap(serversMap);
      const subArray = [];
      for (let i = 0; i < this.notifyCharacteristicUUID.length; i += 1) {
        const sub = discoveredDevice.monitorCharacteristicForService(this.notifyServiceUUID[i],
          this.notifyCharacteristicUUID[i], listener);
        subArray.push(sub);
      }
      return Promise.resolve(subArray);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async negotiateMtu() {
    try {
      const device = await this.manager.requestMTUForDevice(this.peripheralId, 120);
      log('蓝牙协商MTU成功');
      return Promise.resolve();
    } catch (err) {
      log(`蓝牙协商MTU失败 ${err}`);
      return Promise.reject(err);
    }
  }

  // 断开蓝牙
  async disconnect() {
    if (!this.peripheralId) return;
    try {
      const device = await this.manager.cancelDeviceConnection(this.peripheralId);
      log(`蓝牙断开成功 ${device.id}`);
      log(`外部Id：${this.peripheralId}`);
      return Promise.resolve();
    } catch (err) {
      log(`蓝牙断开失败 ${err}`);
      return Promise.reject(err);
    }
  }

  // 卸载蓝牙管理器
  destroy() {
    this.manager.destroy();
  }

  isDeviceConnected() {
    if(HSBleManager.manager.isDeviceConnected(this.peripheralId)){      
      return true;
    }else{
      return false;
    }
  }
}

export default HsBleManager;

