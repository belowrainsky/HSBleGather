import Realm from 'realm';

const OsmometerSchema = {
  name: 'Osmometer',
  primaryKey: 'Id',
  properties: {
    collectAt: 'string',
    voltage: 'double?',
    temperature: 'double',
    frequency: 'double',
    mod: 'double',
    waterLevel: 'double?',

    pressure: 'double?',//'渗压'
    current: 'double?',// '电流',
    Id: 'int',
    channelNo: 'int',
  }
};

const devsVersionSchema = {
  name: 'devsVersion',
  primaryKey: 'id',
  properties: {
    id: 'int',
    version: 'string?',
  },
};

const checkEmpty = (value) => {
  return value === null || value === undefined;
};

const openRealm = async () => {
  try {
    let realm = new Realm({
      schema: [
        OsmometerSchema,
        devsVersionSchema,
      ]
    });    
    realm.write(() => {
      const devs = realm.create('devsVersion', {
        id: 1, 
      }, true);
      if(checkEmpty(devs.version)){
        devs.version = 'other';
      }
    });
    return Promise.resolve(realm);
  } catch (err) {
    console.log(`打开realm失败 ${err}`);
  }
};

export default openRealm;

