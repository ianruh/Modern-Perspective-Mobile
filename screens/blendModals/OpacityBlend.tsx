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
  Tool,
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
import Arrows from '../../components/Arrows';
import ToolbarIcon from '../../components/ToolbarIcon';
import BlendToolsBar from '../../components/BlendToolsBar';

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
  snapshots: SnapshotGroup[];
  selectedSnapshot: number;
  selectedTool: Tool;
}

interface SnapshotGroup {
  snapshot: SnapshotModel;
  position: SnaphPosition;
  reference: any;
}

interface SnaphPosition {
  x: number;
  y: number;
  width: string; // Percentages
  height: string;
  opacity: number;
}

export default class OpacityBlendModal extends React.Component<Props, State> {
  static navigationOptions = {
    header: null,
  };

  //   <------------- Tools -------------->
  moveTool: Tool = {
    icon: { name: 'move', type: 'Feather' },
    upPressed: () => {
      var snapshots = this.state.snapshots;
      snapshots[this.state.selectedSnapshot].position.y -= 5;
      this.setState({ snapshots });
    },
    rightPressed: () => {
      var snapshots = this.state.snapshots;
      snapshots[this.state.selectedSnapshot].position.x += 5;
      this.setState({ snapshots });
    },
    downPressed: () => {
      var snapshots = this.state.snapshots;
      snapshots[this.state.selectedSnapshot].position.y += 5;
      this.setState({ snapshots });
    },
    leftPressed: () => {
      var snapshots = this.state.snapshots;
      snapshots[this.state.selectedSnapshot].position.x -= 5;
      this.setState({ snapshots });
    },
  };

  resizeTool: Tool = {
    icon: { name: 'ios-resize', type: 'Ionicons' },
    upPressed: () => {
      var snapshots = this.state.snapshots;
      var height = parseFloat(
        snapshots[this.state.selectedSnapshot].position.height
      );
      var newHeight = height + 1 + '%';
      snapshots[this.state.selectedSnapshot].position.height = newHeight;
      this.setState({ snapshots });
    },
    rightPressed: () => {
      var snapshots = this.state.snapshots;
      var width = parseFloat(
        snapshots[this.state.selectedSnapshot].position.width
      );
      var newWidth = width + 1 + '%';
      snapshots[this.state.selectedSnapshot].position.width = newWidth;
      this.setState({ snapshots });
    },
    downPressed: () => {
      var snapshots = this.state.snapshots;
      var height = parseFloat(
        snapshots[this.state.selectedSnapshot].position.height
      );
      var newHeight = height - 1 + '%';
      snapshots[this.state.selectedSnapshot].position.height = newHeight;
      this.setState({ snapshots });
    },
    leftPressed: () => {
      var snapshots = this.state.snapshots;
      var width = parseFloat(
        snapshots[this.state.selectedSnapshot].position.width
      );
      var newWidth = width - 1 + '%';
      snapshots[this.state.selectedSnapshot].position.width = newWidth;
      this.setState({ snapshots });
    },
  };

  opacityTool: Tool = {
    icon: { name: 'opacity', type: 'MaterialIcons' },
    upPressed: () => {
      var snapshots = this.state.snapshots;
      if (snapshots[this.state.selectedSnapshot].position.opacity < 1) {
        snapshots[this.state.selectedSnapshot].position.opacity += 0.1;
      }
      this.setState({ snapshots });
    },
    downPressed: () => {
      var snapshots = this.state.snapshots;
      if (snapshots[this.state.selectedSnapshot].position.opacity > 0) {
        snapshots[this.state.selectedSnapshot].position.opacity -= 0.1;
      }
      this.setState({ snapshots });
    },
    noHorizontal: true,
  };

  defaultPosition: SnaphPosition = {
    x: -50,
    y: 0,
    width: '100%',
    height: '100%',
    opacity: 0.5,
  };

  state = {
    toolsExpanded: false,
    selectModalVisible: false,
    snapshots: [
      {
        snapshot: this.props.snapshots[0],
        position: this.defaultPosition,
        reference: null,
      },
    ],
    selectedSnapshot: 0,
    selectedTool: null,
  };

  navBack = () => {
    this.props.close();
  };

  async componentDidMount() {}

  toggleTools = () => {
    this.setState({
      toolsExpanded: !this.state.toolsExpanded,
      selectedTool: null,
    });
  };

  selectSnapshot = async index => {
    this.setState({ selectModalVisible: true, selectedSnapshot: index });
  };

  selectWhichSnapshot = index => {
    this.setState({ selectedSnapshot: index });
  };

  snapshotSelected = snapshot => {
    this.setState({ selectModalVisible: false });
    var snapshots = this.state.snapshots;
    var newPosition: SnaphPosition = {
      x: null,
      y: null,
      width: null,
      height: null,
      opacity: null,
    };
    Object.assign(newPosition, this.defaultPosition);
    snapshots[this.state.selectedSnapshot] = {
      snapshot,
      position: newPosition,
      reference: null,
    };
    this.setState({
      ...this.state,
      snapshots,
    });
  };

  selectTool = (tool: Tool) => {
    this.setState({ selectedTool: tool, toolsExpanded: false });
  };

  ToolBar = ({ index }) => {
    return (
      <BlendToolsBar>
        <ToolbarIcon
          icon={{ name: 'select1', type: 'AntDesign' }}
          index={index}
          onPress={this.selectSnapshot}
        />
        <ToolbarIcon
          icon={this.opacityTool.icon}
          index={index}
          onPress={index => this.selectTool(this.opacityTool)}
        />
        <ToolbarIcon
          icon={this.resizeTool.icon}
          index={index}
          onPress={index => this.selectTool(this.resizeTool)}
        />
        <ToolbarIcon
          icon={this.moveTool.icon}
          index={index}
          onPress={index => this.selectTool(this.moveTool)}
        />
      </BlendToolsBar>
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
            <Title>Opacity Blend</Title>
          </Body>
          <Right />
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
            {this.state.snapshots.map((snapshotGroup, index) => {
              return (
                <Image
                  x={snapshotGroup.position.x}
                  y={snapshotGroup.position.y}
                  width={snapshotGroup.position.width}
                  height={snapshotGroup.position.height}
                  preserveAspectRatio={index === 0 ? 'MidXMidY meet' : 'none'}
                  opacity={snapshotGroup.position.opacity}
                  href={{ uri: snapshotGroup.snapshot.targetImage }}
                  key={snapshotGroup.snapshot.id}
                  ref={component => (snapshotGroup.reference = component)}
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
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              zIndex: 1,
              padding: 10,
            }}
          >
            <Arrows
              centerIcon={
                this.state.selectedTool && this.state.selectedTool.icon
              }
              visible={!!this.state.selectedTool}
              tool={this.state.selectedTool}
            />
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
                  height: 200,
                  width: 50,
                  borderRadius: 25,
                  backgroundColor: 'rgba(135, 135, 135, 0.5)',
                  justifyContent: 'space-between',
                  flexDirection: 'column',
                  alignItems: 'center',
                  paddingTop: 15,
                }}
              >
                <ToolbarIcon
                  index={0}
                  onPress={this.selectWhichSnapshot}
                  selected={this.state.selectedSnapshot === 0}
                  icon={{ name: 'image', type: 'Entypo' }}
                >
                  <this.ToolBar index={0} />
                </ToolbarIcon>
                <ToolbarIcon
                  index={1}
                  onPress={this.selectWhichSnapshot}
                  selected={this.state.selectedSnapshot === 1}
                  icon={{ name: 'image', type: 'Entypo' }}
                >
                  <this.ToolBar index={1} />
                </ToolbarIcon>
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
