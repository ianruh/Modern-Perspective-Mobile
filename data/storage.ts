import Env from '../constants/Env';
import {
  Image,
  Snapshot,
  User,
  ImageStore,
  SnapshotStore,
  UserStore,
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
}

interface Settings {
  localOnly: boolean;
}

export default class Storage {
  static getSnapshot = async (id: string) => {
    try {
      const index = await Storage.getIndex();
      if (index.snapshotIDs.includes(id)) {
        return JSON.parse(await AsyncStorage.getItem('snapshot:' + id))
          .snapshot;
      } else {
        throw new Error('Unable to fetch snapshot.');
      }
    } catch (error) {
      throw new Error('Unable to fetch snapshot.');
    }
  };

  static storeSnapshot = async (snapshot: Snapshot) => {
    try {
      var index: StoreIndex = await Storage.getIndex();
      const snapshotStore: SnapshotStore = {
        snapshot: snapshot,
        dateUpdated: Date.now() + '',
      };
      AsyncStorage.setItem(
        'snapshot:' + snapshot.id,
        JSON.stringify(snapshotStore)
      );
      const newIndex = {
        ...index,
        snapshotIDs: index.snapshotIDs.concat([snapshot.id]),
      };
      AsyncStorage.setItem('index', JSON.stringify(newIndex));
    } catch (error) {
      throw new Error('Unable to insert snapshot.');
    }
  };

  static removeSnapshot = async (snapshotId: string) => {
    AsyncStorage.removeItem('snapshot:' + snapshotId).then(async () => {
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
      AsyncStorage.setItem('index', JSON.stringify(newIndex));
    });
  };

  static getImage = async (id: string) => {
    try {
      const index = await Storage.getIndex();
      if (index.imageIDs.includes(id)) {
        return JSON.parse(await AsyncStorage.getItem('image:' + id)).image;
      } else {
        throw new Error('Unable to fetch image.');
      }
    } catch (error) {
      throw new Error('Unable to fetch image.');
    }
  };

  static hasImage = async (id: string) => {
    try {
      const index = await Storage.getIndex();
      if (index.imageIDs.includes(id)) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      throw new Error('Unable to fetch image.');
    }
  };

  static storeImage = async (image: Image) => {
    try {
      var index: StoreIndex = await Storage.getIndex();
      const imageStore: ImageStore = {
        image: image,
        dateUpdated: Date.now() + '',
      };
      AsyncStorage.setItem('image:' + image.id, JSON.stringify(imageStore));
      if (!index.imageIDs.includes(image.id)) {
        const newIndex = {
          ...index,
          imageIDs: index.imageIDs.concat([image.id]),
        };
        AsyncStorage.setItem('index', JSON.stringify(newIndex));
      }
    } catch (error) {
      throw new Error('Unable to insert image.');
    }
  };

  static removeImage = async (imageId: string) => {
    AsyncStorage.removeItem('image:' + imageId).then(async () => {
      var index: StoreIndex = await Storage.getIndex();
      const newIndex = {
        ...index,
        imageIDs: index.imageIDs.filter(value => {
          if (value !== imageId) {
            return true;
          } else {
            return false;
          }
        }),
      };
      AsyncStorage.setItem('index', JSON.stringify(newIndex));
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
      return index.imageIDs;
    } catch (error) {
      throw new Error('Unable to get images');
    }
  };
}
