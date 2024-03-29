import Env from '../constants/Env';
import {
  Image,
  Snapshot,
  User,
  ImageStore,
  SnapshotStore,
  UserStore,
  Collection,
  CollectionStore,
} from './Models';
import { AsyncStorage } from 'react-native';

// Naming key convention
//
// Index -> 'index'
//
// Snapshot -> 'snapshot:{key}'
// Image -> 'image:{key}'
// User -> 'user:{key}'
//

interface StoreIndex {
  imageIDs: string[];
  snapshotIDs: string[];
  userIDs: string[];
  collectionIDs: string[];
}

interface Settings {
  localOnly: boolean;
}

export default class Storage {
  ///////////////// Colelctions ///////////////////

  static getCollection = async (id: string) => {
    const result = await AsyncStorage.getItem('collection:' + id);
    if (result) {
      console.log('Got collection from storage: ' + id);
      return JSON.parse(result).collection;
    } else {
      throw new Error('Unable to fetch collection.');
    }
  };

  static hasCollection = async (id: string) => {
    const result = await AsyncStorage.getItem('collection:' + id);
    if (result) {
      console.log('Has collection: ' + id);
      return true;
    } else {
      console.log('Does not have collection: ' + id);
      return false;
    }
  };

  static storeCollection = async (collection: Collection) => {
    try {
      var index: StoreIndex = await Storage.getIndex();
      const collectionStore: CollectionStore = {
        collection: collection,
        dateUpdated: Date.now() + '',
      };
      if (!(await Storage.hasCollection(collection.id))) {
        console.log('Add collection to index: ' + collection.id);
        const newIndex = {
          ...index,
          collectionIDs: index.collectionIDs.concat([collection.id]),
        };
        AsyncStorage.setItem('index', JSON.stringify(newIndex));
      }
      AsyncStorage.setItem(
        'collection:' + collection.id,
        JSON.stringify(collectionStore)
      );
      console.log('Stored collection: ' + collection.id);
    } catch (error) {
      throw new Error('Unable to insert collection.');
    }
  };

  static removeCollection = async (collectionId: string) => {
    await AsyncStorage.removeItem('collection:' + collectionId).then(
      async () => {
        var index: StoreIndex = await Storage.getIndex();
        const newIndex = {
          ...index,
          collectionIDs: index.collectionIDs.filter(value => {
            if (value != collectionId) {
              return true;
            } else {
              return false;
            }
          }),
        };
        console.log('Removed collection: ' + collectionId);
        await AsyncStorage.setItem('index', JSON.stringify(newIndex));
      }
    );
  };

  static getCollections = async () => {
    try {
      var index: StoreIndex = await Storage.getIndex();
      console.log('Store has collections: ' + index.collectionIDs);
      console.log('Index: ' + JSON.stringify(index));
      return index.collectionIDs;
    } catch (error) {
      throw new Error('Unable to get collections');
    }
  };

  /////////////////////////////////////////////////

  static getSnapshot = async (id: string) => {
    const result = await AsyncStorage.getItem('snapshot:' + id);
    if (result) {
      console.log('Got snapshot from storage: ' + id);
      return JSON.parse(result).snapshot;
    } else {
      throw new Error('Unable to fetch snapshot.');
    }
  };

  static storeSnapshot = async (snapshot: Snapshot) => {
    var index: StoreIndex = await Storage.getIndex();
    if (index.imageIDs.includes(snapshot.imageId)) {
      var image: Image = await Storage.getImage(snapshot.imageId);
      if (!image.snapshots.includes(snapshot.id)) {
        image = {
          ...image,
          snapshots: image.snapshots.concat([snapshot.id]),
        };
        await Storage.removeImage(snapshot.imageId);
        await Storage.storeImage(image);
      }
    }
    const snapshotStore: SnapshotStore = {
      snapshot: snapshot,
      dateUpdated: Date.now() + '',
    };
    if (!(await Storage.hasSnapshot(snapshot.id))) {
      console.log('Add snapshot to index: ' + snapshot.id);
      const newIndex = {
        ...index,
        snapshotIDs: index.snapshotIDs.concat([snapshot.id]),
      };
      AsyncStorage.setItem('index', JSON.stringify(newIndex));
    }
    AsyncStorage.setItem(
      'snapshot:' + snapshot.id,
      JSON.stringify(snapshotStore)
    );
    console.log('Stored sanpshot: ' + snapshot.id);
  };

  static removeSnapshot = async (snapshotId: string) => {
    await AsyncStorage.removeItem('snapshot:' + snapshotId).then(async () => {
      var index: StoreIndex = await Storage.getIndex();
      const newIndex = {
        ...index,
        snapshotIDs: index.snapshotIDs.filter(value => {
          if (value != snapshotId) {
            return true;
          } else {
            return false;
          }
        }),
      };
      console.log('Removed snapshot: ' + snapshotId);
      await AsyncStorage.setItem('index', JSON.stringify(newIndex));
    });
  };

  static hasSnapshot = async (id: string) => {
    const result = await AsyncStorage.getItem('snapshot:' + id);
    if (result) {
      console.log('Has snapshot: ' + id);
      return true;
    } else {
      console.log('Does not have snapshot: ' + id);
      return false;
    }
  };

  static getImage = async (id: string) => {
    const result = await AsyncStorage.getItem('image:' + id);
    if (result) {
      console.log('Got image from storage: ' + id);
      return JSON.parse(result).image;
    } else {
      throw new Error('Unable to fetch image.');
    }
  };

  static hasImage = async (id: string) => {
    const result = await AsyncStorage.getItem('image:' + id);
    if (result) {
      console.log('Has image: ' + id);
      return true;
    } else {
      console.log('Does not have image: ' + id);
      return false;
    }
  };

  static storeImage = async (image: Image) => {
    try {
      var index: StoreIndex = await Storage.getIndex();
      const imageStore: ImageStore = {
        image: image,
        dateUpdated: Date.now() + '',
      };
      if (!(await Storage.hasImage(image.id))) {
        console.log('Add image to index: ' + image.id);
        const newIndex = {
          ...index,
          imageIDs: index.imageIDs.concat([image.id]),
        };
        AsyncStorage.setItem('index', JSON.stringify(newIndex));
      }
      AsyncStorage.setItem('image:' + image.id, JSON.stringify(imageStore));
      console.log('Stored image: ' + image.id);
    } catch (error) {
      throw new Error('Unable to insert image.');
    }
  };

  static removeImage = async (imageId: string) => {
    await AsyncStorage.removeItem('image:' + imageId).then(async () => {
      var index: StoreIndex = await Storage.getIndex();
      const newIndex = {
        ...index,
        imageIDs: index.imageIDs.filter(value => {
          if (value != imageId) {
            return true;
          } else {
            return false;
          }
        }),
      };
      console.log('Removed image: ' + imageId);
      await AsyncStorage.setItem('index', JSON.stringify(newIndex));
    });
  };

  static getUser = async (id: string) => {
    try {
      const index = await Storage.getIndex();
      if (index.userIDs.includes(id)) {
        return JSON.parse(await AsyncStorage.getItem('user:' + id)).user;
      } else {
        throw new Error('Unable to fetch user.');
      }
    } catch (error) {
      throw new Error('Unable to fetch user.');
    }
  };

  static storeUser = async (user: User) => {
    try {
      var index: StoreIndex = await Storage.getIndex();
      const userStore: UserStore = {
        user: user,
        dateUpdated: Date.now() + '',
      };
      AsyncStorage.setItem('user:' + user.id, JSON.stringify(userStore));
      const newIndex = {
        ...index,
        userIDs: index.userIDs.concat([user.id]),
      };
      AsyncStorage.setItem('index', JSON.stringify(newIndex));
    } catch (error) {
      throw new Error('Unable to insert user.');
    }
  };

  static getIndex = async () => {
    try {
      const index: StoreIndex = JSON.parse(await AsyncStorage.getItem('index'));
      if (index === null) {
        throw new Error("Index doesn't exist");
      }
      return index;
    } catch (error) {
      try {
        const index: StoreIndex = {
          imageIDs: [],
          snapshotIDs: [],
          userIDs: [],
          collectionIDs: [],
        };
        await AsyncStorage.setItem('index', JSON.stringify(index));
        return index;
      } catch (error) {
        throw new Error('Unable to create store index.');
      }
    }
  };

  static getSettings = async () => {
    const settings: Settings = JSON.parse(
      await AsyncStorage.getItem('settings')
    );
    if (!settings) {
      const newSettings = {
        localOnly: false,
      };
      await AsyncStorage.setItem('settings', JSON.stringify(newSettings));
      return newSettings;
    } else {
      return settings;
    }
  };

  static setLocalOnly = async value => {
    var settings = await Storage.getSettings();
    settings.localOnly = value;
    await AsyncStorage.setItem('settings', JSON.stringify(settings));
  };

  static getImages = async () => {
    try {
      var index: StoreIndex = await Storage.getIndex();
      console.log('Store has images: ' + index.imageIDs);
      console.log('Index: ' + JSON.stringify(index));
      return index.imageIDs;
    } catch (error) {
      throw new Error('Unable to get images');
    }
  };
}
