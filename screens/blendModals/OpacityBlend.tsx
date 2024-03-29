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
  Position,
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
  onNewBlend: (string) => void;
}

interface State {
  toolsExpanded: boolean;
  selectModalVisible: boolean;
  snapshots: SnapshotGroup[];
  selectedSnapshot: number;
  selectedTool: Tool;
  cropRectVisible: boolean;
  cropRectPosition: Position;
  viewBox: string;
}

interface SnapshotGroup {
  snapshot: SnapshotModel;
  position: Position;
  reference: any;
}

export default class OpacityBlendModal extends React.Component<Props, State> {
  static navigationOptions = {
    header: null,
  };

  //   <------------- Tools -------------->
  moveTool: Tool = {
    icon: { name: 'move', type: 'Feather' },
    upPressed: () => {
      if (!this.state.cropRectVisible) {
        var snapshots = this.state.snapshots;
        snapshots[this.state.selectedSnapshot].position.y -= 5;
        this.setState({ snapshots });
      } else {
        var position: Position = this.state.cropRectPosition;
        position.y -= 5;
        this.setState({ cropRectPosition: position });
      }
    },
    rightPressed: () => {
      if (!this.state.cropRectVisible) {
        var snapshots = this.state.snapshots;
        snapshots[this.state.selectedSnapshot].position.x += 5;
        this.setState({ snapshots });
      } else {
        var position: Position = this.state.cropRectPosition;
        position.x += 5;
        this.setState({ cropRectPosition: position });
      }
    },
    downPressed: () => {
      if (!this.state.cropRectVisible) {
        var snapshots = this.state.snapshots;
        snapshots[this.state.selectedSnapshot].position.y += 5;
        this.setState({ snapshots });
      } else {
        var position: Position = this.state.cropRectPosition;
        position.y += 5;
        this.setState({ cropRectPosition: position });
      }
    },
    leftPressed: () => {
      if (!this.state.cropRectVisible) {
        var snapshots = this.state.snapshots;
        snapshots[this.state.selectedSnapshot].position.x -= 5;
        this.setState({ snapshots });
      } else {
        var position: Position = this.state.cropRectPosition;
        position.x -= 5;
        this.setState({ cropRectPosition: position });
      }
    },
  };

  resizeTool: Tool = {
    icon: { name: 'ios-resize', type: 'Ionicons' },
    upPressed: () => {
      if (!this.state.cropRectVisible) {
        var snapshots = this.state.snapshots;
        var height = parseFloat(
          snapshots[this.state.selectedSnapshot].position.height_p
        );
        var newHeight = height + 1 + '%';
        snapshots[this.state.selectedSnapshot].position.height_p = newHeight;
        this.setState({ snapshots });
      } else {
        var position: Position = this.state.cropRectPosition;
        position.height_px += 5;
        this.setState({ cropRectPosition: position });
      }
    },
    rightPressed: () => {
      if (!this.state.cropRectVisible) {
        var snapshots = this.state.snapshots;
        var width = parseFloat(
          snapshots[this.state.selectedSnapshot].position.width_p
        );
        var newWidth = width + 1 + '%';
        snapshots[this.state.selectedSnapshot].position.width_p = newWidth;
        this.setState({ snapshots });
      } else {
        var position: Position = this.state.cropRectPosition;
        position.width_px += 5;
        this.setState({ cropRectPosition: position });
      }
    },
    downPressed: () => {
      if (!this.state.cropRectVisible) {
        var snapshots = this.state.snapshots;
        var height = parseFloat(
          snapshots[this.state.selectedSnapshot].position.height_p
        );
        var newHeight = height - 1 + '%';
        snapshots[this.state.selectedSnapshot].position.height_p = newHeight;
        this.setState({ snapshots });
      } else {
        var position: Position = this.state.cropRectPosition;
        position.height_px -= 5;
        this.setState({ cropRectPosition: position });
      }
    },
    leftPressed: () => {
      if (!this.state.cropRectVisible) {
        var snapshots = this.state.snapshots;
        var width = parseFloat(
          snapshots[this.state.selectedSnapshot].position.width_p
        );
        var newWidth = width - 1 + '%';
        snapshots[this.state.selectedSnapshot].position.width_p = newWidth;
        this.setState({ snapshots });
      } else {
        var position: Position = this.state.cropRectPosition;
        position.width_px -= 5;
        this.setState({ cropRectPosition: position });
      }
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

  //   cropTool: Tool = {
  //     icon: { name: 'crop', type: 'MaterialIcons' },
  //     upPressed: () => {
  //       var position: Position = this.state.cropRectPosition;
  //       position.y -= 5;
  //       this.setState({ cropRectPosition: position });
  //     },
  //     rightPressed: () => {
  //       var position: Position = this.state.cropRectPosition;
  //       position.x += 5;
  //       this.setState({ cropRectPosition: position });
  //     },
  //     downPressed: () => {
  //       var position: Position = this.state.cropRectPosition;
  //       position.y += 5;
  //       this.setState({ cropRectPosition: position });
  //     },
  //     leftPressed: () => {
  //       var position: Position = this.state.cropRectPosition;
  //       position.x -= 5;
  //       this.setState({ cropRectPosition: position });
  //     },
  //   };

  defaultSnapshotPosition: Position = {
    x: -50,
    y: 0,
    width_p: '100%',
    height_p: '100%',
    opacity: 0.5,
  };

  defaultCropRectPosition: Position = {
    x: 10,
    y: 30,
    width_px: 380,
    height_px: 680,
  };

  state = {
    toolsExpanded: false,
    selectModalVisible: false,
    snapshots: [
      {
        snapshot: this.props.snapshots[0],
        position: this.defaultSnapshotPosition,
        reference: null,
      },
    ],
    selectedSnapshot: 0,
    selectedTool: null,
    cropRectVisible: false,
    cropRectPosition: this.defaultCropRectPosition,
    viewBox: '0 0 400 800',
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
    if (this.state.selectedSnapshot === index) {
      this.setState({ selectedSnapshot: -1 });
    } else {
      this.setState({ selectedSnapshot: index, cropRectVisible: false });
    }
  };

  snapshotSelected = snapshot => {
    this.setState({ selectModalVisible: false });
    var snapshots = this.state.snapshots;
    var newPosition: Position = {
      x: null,
      y: null,
      width_p: null,
      height_p: null,
      opacity: null,
    };
    Object.assign(newPosition, this.defaultSnapshotPosition);
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
    this.setState({
      selectedTool: tool,
      toolsExpanded: false,
    });
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
          disabled={!(this.state.snapshots.length > index)}
        />
        <ToolbarIcon
          icon={this.resizeTool.icon}
          index={index}
          onPress={index => this.selectTool(this.resizeTool)}
          disabled={!(this.state.snapshots.length > index)}
        />
        <ToolbarIcon
          icon={this.moveTool.icon}
          index={index}
          onPress={index => this.selectTool(this.moveTool)}
          disabled={!(this.state.snapshots.length > index)}
        />
      </BlendToolsBar>
    );
  };

  CropBar = () => {
    return (
      <BlendToolsBar>
        <ToolbarIcon
          icon={{ name: 'done', type: 'MaterialIcons' }}
          onPress={_ => this.saveSnapshot()}
        />
        <ToolbarIcon
          icon={this.resizeTool.icon}
          onPress={index => this.selectTool(this.resizeTool)}
        />
        <ToolbarIcon
          icon={this.moveTool.icon}
          onPress={index => this.selectTool(this.moveTool)}
        />
      </BlendToolsBar>
    );
  };

  saveSnapshot = async () => {
    const viewBox =
      this.state.cropRectPosition.x +
      ' ' +
      this.state.cropRectPosition.y +
      ' ' +
      this.state.cropRectPosition.width_px +
      ' ' +
      this.state.cropRectPosition.height_px;
    await this.setState({ viewBox, cropRectVisible: false });

    /////////////////// Change user ID ///////////////
    this.svgRef.toDataURL(base64 => {
      const targetImage = 'data:image/png;base64,' + base64;
      const newSnapshot = {
        date: this.formatDate(new Date()),
        source: '',
        targetImage: targetImage,
        imageId: this.props.image.id,
        userId: 1,
      };
      this.props.onNewBlend(newSnapshot);
    });
  };

  formatDate = date => {
    var monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();

    return day + ' ' + monthNames[monthIndex] + ' ' + year;
  };

  svgRef = null;

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
            viewBox={this.state.viewBox}
            style={{ zIndex: 0 }}
            ref={component => (this.svgRef = component)}
          >
            {this.state.snapshots.map((snapshotGroup, index) => {
              return (
                <Image
                  x={snapshotGroup.position.x}
                  y={snapshotGroup.position.y}
                  width={snapshotGroup.position.width_p}
                  height={snapshotGroup.position.height_p}
                  preserveAspectRatio={index === 0 ? 'MidXMidY meet' : 'none'}
                  opacity={snapshotGroup.position.opacity}
                  href={{ uri: snapshotGroup.snapshot.targetImage }}
                  key={snapshotGroup.snapshot.id}
                  ref={component => (snapshotGroup.reference = component)}
                />
              );
            })}
            {this.state.cropRectVisible && (
              <Rect
                x={this.state.cropRectPosition.x}
                y={this.state.cropRectPosition.y}
                width={this.state.cropRectPosition.width_px}
                height={this.state.cropRectPosition.height_px}
                fill="transparent"
                strokeWidth="3"
                stroke="rgb(128,0,0)"
              />
            )}
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
                  icon={{ name: 'crop', type: 'MaterialIcons' }}
                  onPress={_ => {
                    this.setState({
                      cropRectVisible: !this.state.cropRectVisible,
                      selectedSnapshot: -1,
                    });
                  }}
                  selected={this.state.cropRectVisible}
                >
                  <this.CropBar />
                </ToolbarIcon>
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
