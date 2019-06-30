export interface Image {
  id: string;
  description: string;
  title: string;
  lat: number;
  lng: number;
  userId: string;
  snapshots: string[];
  temp: boolean;
}

export interface Snapshot {
  id: string;
  date: string;
  source: string;
  targetImage: string;
  imageId: string;
  userId: string;
  temp: boolean;
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
