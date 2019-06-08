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

  static insertSnapshot = async (snapshot: Snapshot) => {
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

  static insertImage = async (image: Image) => {
    try {
      var index: StoreIndex = await Storage.getIndex();
      const imageStore: ImageStore = {
        image: image,
        dateUpdated: Date.now() + '',
      };
      AsyncStorage.setItem('image:' + image.id, JSON.stringify(imageStore));
      const newIndex = {
        ...index,
        imageIDs: index.imageIDs.concat([image.id]),
      };
      AsyncStorage.setItem('index', JSON.stringify(newIndex));
    } catch (error) {
      throw new Error('Unable to insert image.');
    }
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

  static insertUser = async (user: User) => {
    try {
      var index: StoreIndex = await Storage.getIndex();
      const userStore: UserStore = {
        user: user,
        dateUpdated: Date.now() + '',
      };
      AsyncStorage.setItem('user:' + user.id, JSON.stringify(user));
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
}
