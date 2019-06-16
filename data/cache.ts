import Env from '../constants/Env';
import {
  Image,
  Snapshot,
  User,
  ImageStore,
  SnapshotStore,
  UserStore,
} from './Models';

export default class Cache {
  static imageCache: any = {};
  static snapshotCache: any = {};
  static userCache: any = {};

  static hasImage = (id: string) => {
    return !!Cache.imageCache[id];
  };

  static getImage = async (id: string): Promise<Image> => {
    return new Promise((resolve, reject) => {
      if (Cache.hasImage(id)) {
        resolve(Cache.imageCache[id].image);
      } else {
        reject(null);
      }
    });
  };

  static cacheImage = (image: Image) => {
    const imageStore: ImageStore = {
      image: image,
      dateUpdated: Date.now() + '',
    };
    Cache.imageCache[image.id] = imageStore;
  };

  static hasSnapshot = (id: string) => {
    return !!Cache.snapshotCache[id];
  };

  static getSnapshot = async (id: string): Promise<Snapshot> => {
    return new Promise((resolve, reject) => {
      if (Cache.hasSnapshot(id)) {
        resolve(Cache.snapshotCache[id].snapshot);
      } else {
        reject(null);
      }
    });
  };

  static cacheSnapshot = (snapshot: Snapshot) => {
    const snapshotStore: SnapshotStore = {
      snapshot: snapshot,
      dateUpdated: Date.now() + '',
    };
    Cache.snapshotCache[snapshot.id] = snapshotStore;
  };

  static hasUser = (id: string) => {
    return !!Cache.userCache[id];
  };

  static getUser = async (id: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      if (Cache.hasUser(id)) {
        resolve(Cache.userCache[id].user);
      } else {
        reject(null);
      }
    });
  };

  static cacheUser = (user: User) => {
    const userStore: UserStore = {
      user: user,
      dateUpdated: Date.now() + '',
    };
    Cache.userCache[user.id] = userStore;
  };

  static clearCache(cache?: 'image' | 'snapshot' | 'user') {
    if (cache) {
      if (cache === 'image') {
        Cache.imageCache = {};
      }
      if (cache === 'snapshot') {
        Cache.snapshotCache = {};
      }
      if (cache === 'user') {
        Cache.userCache = {};
      }
    } else {
      Cache.clearCache('image');
      Cache.clearCache('snapshot');
      Cache.clearCache('user');
    }
  }
}
