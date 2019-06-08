import Env from '../constants/Env';
import { Image, Snapshot, User } from './Models';
import Cache from './cache';

export interface QueryOptions {
  location?: {
    lat: number;
    lng: number;
  };
  date_begin?: string;
  date_end?: string;
}

export default class Backend {
  static getImage(id: string) {
    // const it = Cache;
    // debugger;
    if (Cache.hasImage(id)) {
      return new Promise((resolve, reject) => {
        resolve(Cache.getImage(id));
      });
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
        });
    }
  }

  static queryImages(options: QueryOptions) {
    // Parse the options for the query
    if (options) {
      // TODO: Fix
      console.log('with options, but actually ignored');
    }

    // Construct the request url
    const url = Env.apiHost + '/api/images';

    // Make the request
    return fetch(url)
      .then(function(response) {
        return response.json();
      })
      .then(function(data: Image) {
        return data;
      });
  }

  static getSnapshot(id: string) {
    // Check the cache for the snapshot
    if (Cache.hasSnapshot(id)) {
      return new Promise((resolve, reject) => {
        resolve(Cache.getSnapshot(id));
      });
    } else {
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
    }
  }

  static getUser(id: string) {
    if (Cache.hasUser(id)) {
      return new Promise((resolve, reject) => {
        return Cache.getUser(id);
      });
    } else {
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
    }
  }

  static newImage(image: Image) {
    // Construct the request url
    const url = Env.apiHost + '/api/new/image';

    // Make the request
    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(image),
    }).then(response => response.json());
  }

  static newSnapshot(snapshot: Snapshot) {
    // Construct the request url
    const url = Env.apiHost + '/api/new/snapshot';

    // Make the request
    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(snapshot),
    }).then(response => response.json());
  }
}
