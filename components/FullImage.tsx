import ImageViewer from 'react-native-image-zoom-viewer';
import { Snapshot } from '../data/Models';
import React from 'react';
import {
  ActivityIndicator,
  CameraRoll,
  Modal,
  View,
  TouchableOpacity,
} from 'react-native';
import { Icon } from 'native-base';
import { Constants } from 'expo';

interface Props extends React.Props<any> {
  snapshots: Snapshot[];
  index: number;
  visible: boolean;
  close: () => void;
}

export class FullImage extends React.Component<Props, any> {
  loadingRender = () => {
    return <ActivityIndicator size="small" />;
  };

  saveToCameraRoll = index => {
    CameraRoll.saveToCameraRoll(
      this.props.snapshots[index].targetImage,
      'photo'
    );
  };

  navBack = () => {
    this.props.close();
  };

  renderHeader = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
          paddingLeft: 15,
          marginTop: Constants.statusBarHeight,
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 1,
        }}
      >
        <TouchableOpacity onPress={this.navBack}>
          <Icon
            type="AntDesign"
            name="close"
            style={{ fontSize: 30, color: 'white' }}
          />
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    return (
      <Modal
        visible={this.props.visible}
        transparent={true}
        supportedOrientations={['portrait', 'landscape']}
      >
        <View style={{ position: 'relative', flex: 1, zIndex: 0 }}>
          <ImageViewer
            imageUrls={this.props.snapshots.map(snapshot => {
              return { url: snapshot.targetImage };
            })}
            onCancel={this.navBack}
            index={this.props.index}
            loadingRender={this.loadingRender}
            enableSwipeDown
            renderHeader={this.renderHeader}
          />
        </View>
      </Modal>
    );
  }
}

export default FullImage;
