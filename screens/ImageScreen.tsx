import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Share,
  TouchableOpacity,
  Image,
} from 'react-native';
import {
  Container,
  Header,
  Left,
  Body,
  Right,
  Title,
  Grid,
  Row,
  Icon,
  Button,
  ActionSheet,
} from 'native-base';
import Carousel, { ParallaxImage } from 'react-native-snap-carousel';
import Divider from '../components/Divider';
import { MapView, Marker } from 'expo';
import UserCard from '../components/UserCard';
import Backend from '../data/backend';
import FullImage from '../components/FullImage';
import CameraScreen from './CameraScreen';
import Storage from '../data/storage';
import NewSnapshotModal from '../components/NewSnapshotModal';
import {
  Snapshot as SnapshotModel,
  User as UserModel,
  Image as ImageModel,
} from '../data/models';
import { throws } from 'assert';

interface Props extends React.Props<any> {
  navigation: any;
}

interface State {
  image: ImageModel;
  user: UserModel;
  snapshots: SnapshotModel[];
  modalVisible: boolean;
  modalIndex: number;
  cameraVisible: boolean;
  newSnapshotVisible: boolean;
  isSaved: boolean;
  newSnapshot: SnapshotModel;
}

export default class ImageScreen extends React.Component<Props, State> {
  static navigationOptions = {
    header: null,
  };

  state = {
    image: null,
    user: null,
    snapshots: [],
    modalVisible: false,
    modalIndex: 0,
    cameraVisible: false,
    newSnapshotVisible: false,
    isSaved: false,
    newSnapshot: null,
  };

  renderSnapshot = ({ item, index }) => {
    return (
      <TouchableOpacity onPress={() => this.onImagePress(index)}>
        <View>
          <Image
            source={{
              uri:
                this.state.snapshots[index] &&
                this.state.snapshots[index].targetImage
                  ? this.state.snapshots[index].targetImage
                  : 'data:image/jpg;base64,',
            }}
            style={{ width: styles.windowSize.width, height: 200 }}
          />
        </View>
      </TouchableOpacity>
    );
  };

  onImagePress = index => {
    this.setState({ modalVisible: true, modalIndex: index });
  };

  shareOption = () => {
    Share.share({
      message: 'Share Image',
    });
  };

  navBack = () => {
    this.props.navigation.goBack();
  };

  showMoreActionSheet = () => {
    const BUTTONS = ['Share', 'Save', 'Flag', 'Cancel'];
    const CANCEL_INDEX = 3;

    ActionSheet.show(
      {
        options: BUTTONS,
        cancelButtonIndex: CANCEL_INDEX,
        title: 'Options',
      },
      buttonIndex => {}
    );
  };

  showNewActionSheet = () => {
    const BUTTONS = ['New Snapshot', 'New Blend', 'Cancel'];
    const CANCEL_INDEX = 2;

    ActionSheet.show(
      {
        options: BUTTONS,
        cancelButtonIndex: CANCEL_INDEX,
        title: 'New Item',
      },
      buttonIndex => {
        switch (buttonIndex) {
          case 0:
            this.newSnapshot();
            break;
          case 1:
            this.newBlend();
            break;
        }
      }
    );
  };

  newSnapshot = () => {
    this.setState({ cameraVisible: true });
  };

  newBlend = () => {
    this.props.navigation.push('Blend', {
      image: this.state.image,
      user: this.state.user,
      snapshots: this.state.snapshots,
    });
  };

  componentDidMount = async () => {
    const imageId = this.props.navigation.getParam('imageId', '');
    Backend.getImage(imageId).then(async imageWeird => {
      const image: any = imageWeird;
      await this.setState({ snapshots: [] });
      image.snapshots.forEach(id => {
        this.loadSnapshot(id);
      });
      this.setState({ image });
      Backend.getUser(image.userId).then(userWeird => {
        const user: any = userWeird;
        this.setState({ user });
      });
    });
    Storage.hasImage(imageId).then(result => {
      this.setState({ isSaved: result });
    });
  };

  loadSnapshot = async id => {
    const snapshot = await Backend.getSnapshot(id);
    const snapshots = this.state.snapshots.concat([snapshot]);
    this.setState({
      snapshots,
    });
  };

  closeCamera = () => {
    this.setState({ cameraVisible: false });
  };

  saveImage = async () => {
    if (this.state.isSaved) {
      await Storage.removeImage(this.state.image.id);
      this.state.snapshots.forEach(async snapshot => {
        await Storage.removeSnapshot(snapshot.id);
      });
      this.setState({ isSaved: false });
    } else {
      await Storage.storeImage(this.state.image).then(() => {});
      this.state.snapshots.forEach(async snapshot => {
        await Storage.storeSnapshot(snapshot);
      });
      this.setState({ isSaved: true });
    }
  };

  closeNewSnapshotModal = () => {
    this.setState({ newSnapshotVisible: false });
    this.forceUpdate();
  };

  newSnapshotTaken = (snapshot: SnapshotModel) => {
    this.setState({
      cameraVisible: false,
      newSnapshot: snapshot,
      newSnapshotVisible: true,
    });
  };

  render() {
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={this.navBack}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Image</Title>
          </Body>
          <Right>
            <Button
              iconRight
              transparent
              primary
              onPress={this.showMoreActionSheet}
            >
              <Icon
                style={styles.optionIcons}
                type="SimpleLineIcons"
                name="options-vertical"
              />
            </Button>
          </Right>
        </Header>
        <FullImage
          visible={this.state.modalVisible}
          index={this.state.modalIndex}
          snapshots={this.state.snapshots}
          close={() => this.setState({ modalVisible: false })}
        />
        {this.state.cameraVisible && (
          <CameraScreen
            close={this.closeCamera}
            navigation={this.props.navigation}
            image={this.state.image}
            user={this.state.user}
            snapshots={this.state.snapshots}
            visible={this.state.cameraVisible}
            pictureTaken={this.newSnapshotTaken}
          />
        )}
        {this.state.newSnapshotVisible && (
          <NewSnapshotModal
            visible={this.state.newSnapshotVisible}
            image={this.state.image}
            user={this.state.user}
            close={this.closeNewSnapshotModal}
            snapshot={this.state.newSnapshot}
          />
        )}
        <ScrollView style={styles.container}>
          <Grid>
            <Row>
              {this.state.image &&
                this.state.snapshots.length ==
                  this.state.image.snapshots.length && (
                  <Carousel
                    data={this.state.image.snapshots}
                    renderItem={this.renderSnapshot}
                    windowSize={1}
                    sliderWidth={styles.windowSize.width}
                    itemWidth={styles.windowSize.width}
                    itemHeight={200}
                  />
                )}
            </Row>
            <Row style={styles.content}>
              {this.state.image && (
                <Text style={styles.title}>{this.state.image.title}</Text>
              )}
            </Row>
            <Row style={{ justifyContent: 'space-around' }}>
              <Button
                iconLeft
                transparent
                primary
                onPress={this.showNewActionSheet}
              >
                <Icon
                  style={styles.optionIcons}
                  type="AntDesign"
                  name="pluscircleo"
                />
              </Button>
              <Button iconRight transparent primary onPress={this.saveImage}>
                <Icon
                  style={styles.optionIcons}
                  type="MaterialIcons"
                  name={this.state.isSaved ? 'bookmark' : 'bookmark-border'}
                />
              </Button>
              <Button iconRight transparent primary onPress={this.shareOption}>
                <Icon
                  style={styles.optionIcons}
                  type="MaterialIcons"
                  name="share"
                />
              </Button>
            </Row>
            <Divider />
            <Row>
              {this.state.user && (
                <UserCard
                  user={this.state.user}
                  navigation={this.props.navigation}
                />
              )}
            </Row>
            <Divider />
            <Row>
              {this.state.image && (
                <Text style={styles.description}>
                  {this.state.image.description}
                </Text>
              )}
            </Row>
            <Divider />
            <Row>
              {this.state.image && (
                <MapView
                  style={{
                    height: styles.windowSize.width,
                    width: styles.windowSize.width,
                  }}
                  initialRegion={{
                    latitude: this.state.image.lat,
                    longitude: this.state.image.lng,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                  }}
                >
                  {/* {this.state.image.lat !== 0 && (
                    <Marker
                      coordinate={{
                        latitude: this.state.image.lat,
                        longitude: this.state.image.lng,
                      }}
                      title=""
                      description=""
                    />
                  )} */}
                </MapView>
              )}
            </Row>
          </Grid>
        </ScrollView>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  windowSize: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  content: {
    backgroundColor: '#fff',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 24,
    padding: 10,
  },
  optionIcons: {
    fontSize: 20,
  },
  description: {
    padding: 10,
    paddingTop: 20,
    paddingBottom: 20,
  },
});
