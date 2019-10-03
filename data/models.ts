export interface Image {
  id: string;
  description: string;
  title: string;
  lat: number;
  lng: number;
  userId: string;
  collections?: string[];
  snapshots: string[];
  coverSnapshotId?: string;
  temp?: boolean;
}

export interface Snapshot {
  id: string;
  date: string;
  source: string;
  colorized: boolean;
  targetImage: string;
  imageId: string;
  userId: string;
  temp?: boolean;
  isCover?: boolean;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  dateCreated: string;
  images: string[];
  lat: number;
  lng: number;
  coverImageId: string;
  userId: string;
  time?: number;
  distance?: number;
  isTour: boolean;
}

export interface User {
  id: string;
  name: string;
  thumbnail: string;
  images: string[];
  snapshots: string[];
  collections: string[];
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

export interface CollectionStore {
  collection: Collection;
  dateUpdated: string;
}

export interface Tool {
  icon: {
    name: string;
    type?:
      | 'AntDesign'
      | 'Entypo'
      | 'EvilIcons'
      | 'Feather'
      | 'FontAwesome'
      | 'FontAwesome5'
      | 'Foundation'
      | 'Ionicons'
      | 'MaterialCommunityIcons'
      | 'MaterialIcons'
      | 'Octicons'
      | 'SimpleLineIcons'
      | 'Zocial';
  };
  upPressed?: () => void;
  rightPressed?: () => void;
  downPressed?: () => void;
  leftPressed?: () => void;
  noHorizontal?: boolean;
  noVertical?: boolean;
}

export interface Position {
  x: number;
  y: number;
  width_p?: string; // Percentages
  height_p?: string;
  width_px?: number; // Pixel
  height_px?: number;
  opacity?: number;
}
