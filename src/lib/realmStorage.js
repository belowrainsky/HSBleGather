import Realm from 'realm';

const OsmometerSchema = {
  name: 'Osmometer',
  primaryKey: 'Id',
  properties: {
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

const checkEmpty = (value) => {
  return value === null || value === undefined;
};

const openRealm = async () => {
  try {
    const realm = new Realm({
      schema: [
        OsmometerSchema,
      ],
    });
    realm.write(() => {
      
    });
    return Promise.resolve(realm);
  } catch (err) {
    console.log(`打开realm失败 ${err}`);
  }
};

export default openRealm;

