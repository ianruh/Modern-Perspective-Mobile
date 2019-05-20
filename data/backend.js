import Env from '../constants/Env';

export default class Backend {
  static snapCache = {};

  static getImage(id) {
    const url = Env.apiHost + '/api/image/' + id;

    return fetch(url)
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        return data;
      });
  }

  static queryImages(options) {
    if (options) {
      // TODO: Fix
      console.log('with options, but actually ignored');
    }
    const url = Env.apiHost + '/api/images';

    return fetch(url)
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        return data;
      });
  }

  static getSnapshot(id) {
    if (Backend.snapCache[id]) {
      return new Promise((resolve, reject) => {
        resolve(Backend.snapCache[id]);
      });
    }
    const url = Env.apiHost + '/api/snapshot/' + id;
    return fetch(url)
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        Backend.snapCache[id] = data;
        return data;
      });
  }

  static getUser(id) {
    const url = Env.apiHost + '/api/user/' + id;

    return fetch(url)
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        return data;
      });
  }

  static newImage(image) {
    const url = Env.apiHost + '/api/new/image';

    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(image),
    }).then(response => response.json());
  }

  static newSnapshot(snapshot) {
    const url = Env.apiHost + '/api/new/snapshot';

    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(snapshot),
    }).then(response => response.json());
  }
}
