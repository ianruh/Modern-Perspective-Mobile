import React from 'react';
import {
  StyleSheet,
  Text as TextRN,
  View,
  Modal,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { Svg } from 'expo';
const { Circle, Rect, Image, Text } = Svg;

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
import SelectSnapshotModal from './SelectSnapshotModal';

interface Props extends React.Props<any> {
  visible: boolean;
  close: () => void;
  user: UserModel;
  image: ImageModel;
  snapshots: SnapshotModel[];
}

interface State {
  toolsExpanded: boolean;
  selectModalVisible: boolean;
  presentedSnapshots: SnapshotModel[];
  selectionClaim: number;
}

export default class OpacityBlendModal extends React.Component<Props, State> {
  static navigationOptions = {
    header: null,
  };

  state = {
    toolsExpanded: false,
    selectModalVisible: false,
    presentedSnapshots: [this.props.snapshots[0]],
    selectionClaim: 0,
  };

  navBack = () => {
    this.props.close();
  };

  async componentDidMount() {}

  toggleTools = () => {
    this.setState({ toolsExpanded: !this.state.toolsExpanded });
  };

  selectSnapshotOne = () => {
    this.setState({ selectModalVisible: true, selectionClaim: 0 });
  };

  selectSnapshotTwo = () => {
    this.setState({ selectModalVisible: true, selectionClaim: 1 });
  };

  snapshotSelected = snapshot => {
    this.setState({ selectModalVisible: false });
    var newSnaps = this.state.presentedSnapshots;
    newSnaps[this.state.selectionClaim] = snapshot;
    this.setState({
      ...this.state,
      presentedSnapshots: newSnaps,
    });
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
            <Title>Opacity Blend</Title>
          </Body>
          <Right />
          {/* <Right>
            <Button
              iconRight
              transparent
              primary
              onPress={this.showMoreActionSheet}
            >
              <Icon
                type="SimpleLineIcons"
                name="options-vertical"
              />
            </Button>
          </Right> */}
        </Header>
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#fff',
            position: 'relative',
          }}
        >
          <Svg
            height="100%"
            width="100%"
            viewBox="0 0 400 800"
            style={{ zIndex: 0 }}
          >
            {this.state.presentedSnapshots.map(snapshot => {
              return (
                <Image
                  x={-60}
                  y={0}
                  width="100%"
                  height="100%"
                  preserveAspectRatio="xMidYMid meet"
                  opacity="0.5"
                  href={{ uri: snapshot.targetImage }}
                  key={snapshot.id}
                />
              );
            })}
          </Svg>
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              flex: 1,
              width: '100%',
              height: '100%',
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'flex-end',
              zIndex: 1,
              padding: 10,
            }}
          >
            {!this.state.toolsExpanded && (
              <TouchableOpacity onPress={this.toggleTools}>
                <View
                  style={{
                    height: 50,
                    width: 50,
                    borderRadius: 25,
                    backgroundColor: 'grey',
                    shadowOffset: { width: 3, height: 3 },
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                  }}
                >
                  <Icon name="toolbox" type="MaterialCommunityIcons" />
                </View>
              </TouchableOpacity>
            )}
            {this.state.toolsExpanded && (
              <View
                style={{
                  height: 50,
                  width: '100%',
                  borderRadius: 25,
                  backgroundColor: 'grey',
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingLeft: 10,
                  paddingRight: 10,
                }}
              >
                <TouchableOpacity
                  onPress={this.selectSnapshotOne}
                  style={{ flexDirection: 'row', alignItems: 'center' }}
                >
                  <TextRN style={{ fontWeight: 'bold', margin: 5 }}>1: </TextRN>
                  <Icon name="image" type="Entypo" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={this.selectSnapshotTwo}
                  style={{ flexDirection: 'row', alignItems: 'center' }}
                >
                  <TextRN style={{ fontWeight: 'bold', margin: 5 }}>2: </TextRN>
                  <Icon name="image" type="Entypo" />
                </TouchableOpacity>
                <TouchableOpacity onPress={this.toggleTools}>
                  <Icon name="right" type="AntDesign" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
        <SelectSnapshotModal
          select={this.snapshotSelected}
          visible={this.state.selectModalVisible}
          close={() => this.setState({ selectModalVisible: false })}
          snapshots={this.props.snapshots}
        />
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    paddingLeft: 8,
    paddingRight: 8,
    backgroundColor: '#fff',
  },
});
