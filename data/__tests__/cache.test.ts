import { Image, Snapshot, User } from '../models';
import Cache from '../cache';

describe('Cache', () => {
  const testSnapshot: Snapshot = {
    id: '123',
    date: 'January 1, 2000',
    source: 'test',
    target_image: 'test image',
    imageId: '1',
    userId: '1',
  };
  const testImage: Image = {
    id: '123',
    description: 'description',
    title: 'title',
    lat: 2.22,
    lng: 2.22,
    userId: '1',
    snapshots: ['1', '2'],
  };
  const testUser: User = {
    id: '123',
    name: 'name',
    thumbnail: 'thumbnail',
    images: ['1', '2'],
    snapshots: ['1', '2'],
  };

  it('Cache snapshot', () => {
    Cache.cacheSnapshot(testSnapshot);
    expect(Cache.hasSnapshot('123')).toBe(true);
  });

  it('Cache and retrieve snapshot', () => {
    Cache.cacheSnapshot(testSnapshot);
    expect(Cache.hasSnapshot('123')).toBe(true);
    expect(Cache.getSnapshot('123')).toBe(testSnapshot);
  });

  it('Cache image', () => {
    Cache.cacheImage(testImage);
    expect(Cache.hasImage('123')).toBe(true);
  });

  it('Cache and retrieve image', () => {
    Cache.cacheImage(testImage);
    expect(Cache.hasImage('123')).toBe(true);
    expect(Cache.getImage('123')).toBe(testImage);
  });

  it('Cache user', () => {
    Cache.cacheUser(testUser);
    expect(Cache.hasUser('123')).toBe(true);
  });

  it('Cache and retrieve user', () => {
    Cache.cacheUser(testUser);
    expect(Cache.hasUser('123')).toBe(true);
    expect(Cache.getUser('123')).toBe(testUser);
  });

  it('Clear all caches', () => {
    Cache.cacheImage(testImage);
    Cache.cacheSnapshot(testSnapshot);
    Cache.cacheUser(testUser);
    expect(Cache.hasImage('123')).toBe(true);
    expect(Cache.hasSnapshot('123')).toBe(true);
    expect(Cache.hasUser('123')).toBe(true);
    Cache.clearCache();
    expect(Cache.hasImage('123')).toBe(false);
    expect(Cache.hasSnapshot('123')).toBe(false);
    expect(Cache.hasUser('123')).toBe(false);
  });
});
