export interface Image {
  id: string;
  description: string;
  title: string;
  lat: number;
  lng: number;
  userId: string;
  snapshots: string[];
}

export interface Snapshot {
  id: string;
  date: string;
  source: string;
  target_image: string;
  imageId: string;
  userId: string;
}

export interface User {
  id: string;
  name: string;
  thumbnail: string;
  images: string[];
  snapshots: string[];
}

export interface ImageStore {
  image: Image;
  dateUpdated: string;
}

export interface SnapshotStore {
  snapshot: Snapshot;
  dateUpdated: string;
}

export interface UserStore {
  user: User;
  dateUpdated: string;
}
