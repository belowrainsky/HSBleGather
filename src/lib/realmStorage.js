import Realm from 'realm';

const OsmometerSchema = {
  name: 'Osmometer',
  primaryKey: 'Id',
  properties: {
<<<<<<< HEAD
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

=======
    collectAt: 'date',
    voltage: 'double',
    temperature: 'double',
    frequency: 'double',
    mod: 'double',
    waterLevel: 'double',

    pressure: 'double',//'渗压'
    current: 'double',// '电流',
    Id: 'int',
  }
};

>>>>>>> 17118f8b7c762a29eaadd552e1aef944b3b5d271
const checkEmpty = (value) => {
  return value === null || value === undefined;
};

const openRealm = async () => {
  try {
<<<<<<< HEAD
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
=======
    const realm = new Realm({
      schema: [
        OsmometerSchema,
      ],
    });
    realm.write(() => {
      
>>>>>>> 17118f8b7c762a29eaadd552e1aef944b3b5d271
    });
    return Promise.resolve(realm);
  } catch (err) {
    console.log(`打开realm失败 ${err}`);
  }
};

export default openRealm;

