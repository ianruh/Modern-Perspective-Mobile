import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Slider,
  Dimensions,
  Image,
} from 'react-native';
import { Grid, Col, Button, Icon, ActionSheet, Root } from 'native-base';
import Backend from '../data/backend';
import { Camera, Permissions, ScreenOrientation, Constants } from 'expo';
import { Header } from 'react-navigation';

export default class CameraScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
    opacity: 50,
    sliderLayout: {
      transform: [
        { rotate: '-90deg' },
        { translateY: -1 * (Dimensions.get('window').width / 2 - 30) },
      ],
      width: Dimensions.get('window').height * 0.6,
    },
    menuOptionClicked: null,
    selectedSnapIndex: 0,
    image: null,
    user: null,
    snapshots: [],
  };

  async componentWillMount() {
    ScreenOrientation.allowAsync(
      ScreenOrientation.Orientation.ALL_BUT_UPSIDE_DOWN
    );
  }

  async componentDidMount() {
    this.camera = React.createRef();
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
    const image = this.props.navigation.getParam('image', null);
    const user = this.props.navigation.getParam('user', null);
    const snapshots = this.props.navigation.getParam('snapshots', []);
    if (snapshots) {
      this.setState({ image, snapshots, user });
    } else {
      image.snapshots.forEach(snapshotId => {
        Backend.getSnapshot(snapshotId).then(snapshot => {
          const snapshots = this.state.snapshots.concat([snapshot]);
          this.setState({ snapshots });
        });
        this.setState({ image, user });
      });
    }
  }

  changeOpacity = opacity => {
    this.setState({ opacity });
  };

  onLayout = event => {
    this.setState({
      sliderLayout: {
        transform: [
          { rotate: '-90deg' },
          { translateY: -1 * (Dimensions.get('window').width / 2 - 30) },
        ],
        width: Dimensions.get('window').height * 0.6,
      },
    });
  };

  //   navBack = () => {
  //     this.props.navigation.navigate('Home');
  //   };
  navBack = () => {
    this.props.navigation.goBack();
  };

  showActionSheet = () => {
    const BUTTONS = ['Share', 'Save', 'Flag', 'Cancel'];
    const CANCEL_INDEX = 3;

    ActionSheet.show(
      {
        options: BUTTONS,
        cancelButtonIndex: CANCEL_INDEX,
        title: 'Options',
      },
      buttonIndex => {
        this.setState({ menuOptionClicked: BUTTONS[buttonIndex] });
      }
    );
  };

  previousSnap = () => {
    if (this.state.selectedSnapIndex != 0) {
      this.setState({ selectedSnapIndex: this.state.selectedSnapIndex - 1 });
    }
  };

  nextSnap = () => {
    if (this.state.selectedSnapIndex < this.state.snapshots.length - 1) {
      this.setState({ selectedSnapIndex: this.state.selectedSnapIndex + 1 });
    }
  };

  takePicture = async () => {
    this.camera.current
      .takePictureAsync({
        base64: true,
      })
      .then(data => {
        target_image = 'data:image/jpg;base64,' + data.base64;
        new_snapshot = {
          date: this.formatDate(new Date()),
          source: '',
          target_image: target_image,
          imageId: this.state.image.id,
          userId: this.state.user.id,
        };
        this.props.navigation.push('NewSnapshot', {
          image: this.state.image,
          user: this.state.user,
          snapshot: new_snapshot,
        });
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

  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <Root>
          <View style={{ flex: 1 }}>
            <Camera
              style={{ flex: 1 }}
              type={this.state.type}
              ref={this.camera}
            >
              {/* The Image Overlay */}
              <View
                style={{
                  flex: 1,
                  backgroundColor: 'transparent',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                }}
              >
                {this.state.snapshots.length > 0 && (
                  <Image
                    source={{
                      uri: this.state.snapshots[this.state.selectedSnapIndex]
                        .target_image,
                    }}
                    style={{
                      flex: 1,
                      width: Dimensions.get('window').width,
                      height: Dimensions.get('window').height,
                      resizeMode: 'contain',
                      opacity: this.state.opacity / 100,
                    }}
                  />
                )}
              </View>
              {/* The Slider */}
              <View
                style={{
                  flex: 1,
                  backgroundColor: 'transparent',
                  justifyContent: 'flex-start',
                }}
                onLayout={this.onLayout}
              >
                <Slider
                  minimumValue={0}
                  maximumValue={100}
                  minimumTrackTintColor="#1EB1FC"
                  maximumTractTintColor="#1EB1FC"
                  step={1}
                  value={this.state.opacity}
                  onValueChange={value => this.changeOpacity(value)}
                  style={{
                    ...styles.slider,
                    ...this.state.sliderLayout,
                  }}
                  thumbTintColor="#1EB1FC"
                />
              </View>
              <View
                style={{
                  ...styles.header,
                  width: Dimensions.get('window').width,
                  top: Constants.statusBarHeight,
                  left: 0,
                }}
              >
                <Grid>
                  <Col
                    size={100}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                      alignItems: 'center',
                    }}
                  >
                    <Button transparent onPress={this.navBack}>
                      <Icon name="arrow-back" />
                    </Button>
                    <Button
                      transparent
                      onPress={this.previousSnap}
                      disabled={this.state.selectedSnapIndex === 0}
                    >
                      <Icon name="arrowleft" type="AntDesign" />
                    </Button>
                    <Text
                      style={{
                        color: 'blue',
                        fontSize: 20,
                        fontWeight: 'bold',
                      }}
                    >
                      {this.state.selectedSnapIndex + 1}
                    </Text>
                    <Button
                      transparent
                      onPress={this.nextSnap}
                      disabled={
                        !(
                          this.state.selectedSnapIndex <
                          this.state.snapshots.length - 1
                        )
                      }
                    >
                      <Icon name="arrowright" type="AntDesign" />
                    </Button>
                    <Button
                      iconRight
                      transparent
                      primary
                      onPress={this.showActionSheet}
                    >
                      <Icon
                        style={styles.optionIcons}
                        size={10}
                        type="SimpleLineIcons"
                        name="options"
                      />
                    </Button>
                  </Col>
                </Grid>
              </View>
              <View
                style={{
                  ...styles.footer,
                  width: Dimensions.get('window').width,
                  top: Dimensions.get('window').height - 100,
                  left: 0,
                }}
              >
                <Grid>
                  <Col
                    size={100}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Button transparent onPress={this.takePicture}>
                      <Icon
                        name="ios-radio-button-on"
                        type="Ionicons"
                        style={{ size: 100 }}
                      />
                    </Button>
                  </Col>
                </Grid>
              </View>
            </Camera>
          </View>
        </Root>
      );
    }
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
  slider: {
    flex: 1,
    alignSelf: 'center',
  },
  header: {
    backgroundColor: 'transparent',
    height: 20,
    position: 'absolute',
  },
  footer: {
    backgroundColor: 'transparent',
    height: 20,
    position: 'absolute',
  },
});
