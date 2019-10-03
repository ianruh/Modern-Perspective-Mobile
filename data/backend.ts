import Env from '../constants/Env';
import { Image, Snapshot, User } from './Models';
import Cache from './cache';
import Storage from './storage';

export interface QueryOptions {
  location?: {
    lat: number;
    lng: number;
  };
  date_begin?: string;
  date_end?: string;
}

export default class Backend {
  static getImage = async (id: string) => {
    // Try the cache
    return Cache.getImage(id)
      .catch(async () => {
        // Try local storage
        const image: Image = await Storage.getImage(id);
        Cache.cacheImage(image);
        return image;
      })
      .catch(async () => {
        // If not in offline mode, try the server.
        if ((await Storage.getSettings()).localOnly) {
          throw new Error('Cannot fetch image');
        } else {
          // Construct the request url
          const url = Env.apiHost + '/api/image/' + id;

          // Make the request
          return fetch(url)
            .then(function(response) {
              return response.json();
            })
            .then(function(data: Image) {
              Cache.cacheImage(data);
              return data;
            })
            .catch(() => {
              throw new Error('Cannot fetch image');
            });
        }
      });
  };

  static queryImages = async (options: QueryOptions) => {
    var images: string[];
    if ((await Storage.getSettings()).localOnly) {
      images = await Storage.getImages();
    } else {
      // Construct the request url
      const url = Env.apiHost + '/api/images';

      // Make the request
      images = await fetch(url)
        .then(function(response) {
          return response.json();
        })
        .then(function(data: string[]) {
          return data;
        });
    }

    // Parse the options for the query
    if (options) {
      // TODO: Fix
      console.log('with options, but actually ignored');
    }

    return images;
  };

  static queryCollections = async (options: QueryOptions) => {
    var collections: string[];
    if ((await Storage.getSettings()).localOnly) {
      collections = await Storage.getCollections();
    } else {
      // Construct the request url
      const url = Env.apiHost + '/api/collections';

      // Make the request
      collections = await fetch(url)
        .then(function(response) {
          return response.json();
        })
        .then(function(data: string[]) {
          return data;
        });
    }

    // Parse the options for the query
    if (options) {
      // TODO: Fix
      console.log('with options, but actually ignored');
    }

    return collections;
  };

  static getSnapshot = async (id: string) => {
    return Cache.getSnapshot(id)
      .catch(() => {
        return Storage.getSnapshot(id);
      })
      .catch(() => {
        // Construct the request url
        const url = Env.apiHost + '/api/snapshot/' + id;

        // Make the request
        return fetch(url)
          .then(function(response) {
            return response.json();
          })
          .then(function(data: Snapshot) {
            Cache.cacheSnapshot(data);
            return data;
          });
      });
  };

  static getUser(id: string) {
    return Cache.getUser(id)
      .catch(() => {
        return Storage.getUser(id);
      })
      .catch(() => {
        // Construct the request url
        const url = Env.apiHost + '/api/user/' + id;

        // Make the request
        return fetch(url)
          .then(function(response) {
            return response.json();
          })
          .then(function(data: User) {
            Cache.cacheUser(data);
            return data;
          });
      });
  }

  static newImage = async (image: Image) => {
    if ((await Storage.getSettings()).localOnly) {
      const tempImage = { ...image, id: String(Math.random()), temp: true };
      await Storage.storeImage(tempImage);
      return tempImage;
    } else {
      // Construct the request url
      const url = Env.apiHost + '/api/image/new';

      // Make the request
      return fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(image),
      }).then(response => response.json());
    }
  };

  static newSnapshot = async (snapshot: Snapshot) => {
    if ((await Storage.getSettings()).localOnly) {
      const tempSnapshot = {
        ...snapshot,
        id: String(Math.random()),
        temp: true,
      };
      await Storage.storeSnapshot(tempSnapshot);
      return tempSnapshot;
    } else {
      // Construct the request url
      const url = Env.apiHost + '/api/snapshot/new';

      // Make the request
      return fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(snapshot),
      }).then(response => response.json());
    }
  };
}
