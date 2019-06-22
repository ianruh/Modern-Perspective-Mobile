import React from 'react';
import {
  StyleSheet,
  Text as TextRN,
  View,
  Modal,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from 'react-native';

import {
  User as UserModel,
  Snapshot as SnapshotModel,
  Image as ImageModel,
} from '../../data/models';
import Backend from '../../data/backend';
import {
  Container,
  Header,
  Left,
  Button,
  Icon,
  Body,
  Title,
  Right,
} from 'native-base';

interface Props extends React.Props<any> {
  visible: boolean;
  close: () => void;
  snapshots: SnapshotModel[];
  select: (snapshot) => void;
}

interface State {}

export default class OpacityBlendModal extends React.Component<Props, State> {
  static navigationOptions = {
    header: null,
  };

  state = {};

  navBack = () => {
    this.props.close();
  };

  async componentDidMount() {}

  SnapshotThumbnail = snapshot => {
    return (
      <View
        style={{
          width: 100,
          height: 100,
          backgroundColor: '#e1e7f2',
          borderRadius: 6,
          margin: 10,
          padding: 5,
        }}
        key={snapshot.id}
      >
        <TouchableOpacity onPress={() => this.props.select(snapshot)}>
          <Image
            style={{ height: 90, width: 90, borderRadius: 6 }}
            source={{ uri: snapshot.targetImage }}
          />
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    return (
      <Modal
        animationType="slide"
        visible={this.props.visible}
        transparent={true}
        supportedOrientations={['portrait', 'landscape']}
      >
        <Header>
          <Left>
            <Button transparent onPress={this.navBack}>
              <TextRN>Cancel</TextRN>
            </Button>
          </Left>
          <Body>
            <Title>Select Snapshot</Title>
          </Body>
          <Right />
        </Header>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            flexWrap: 'wrap',
            alignItems: 'flex-start',
            backgroundColor: '#fff',
          }}
        >
          {this.props.snapshots.map(snapshot => {
            return this.SnapshotThumbnail(snapshot);
          })}
        </View>
      </Modal>
    );
  }
}
