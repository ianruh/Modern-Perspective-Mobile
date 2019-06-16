import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Share,
  TouchableOpacity,
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

interface Props extends React.Props<any> {
  navigation: any;
}

export default class ImageScreen extends React.Component<Props, any> {
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
    isSaved: false,
  };

  renderSnapshot = ({ item, index }, parallaxProps) => {
    return (
      <TouchableOpacity onPress={() => this.onImagePress(index)}>
        <View>
          <ParallaxImage
            source={{
              uri:
                this.state.snapshots[index] &&
                this.state.snapshots[index].targetImage
                  ? this.state.snapshots[index].targetImage
                  : 'data:image/jpg;base64,',
            }}
            containerStyle={{ width: styles.windowSize.width, height: 200 }}
            style={{ width: styles.windowSize.width, height: 200 }}
            parallaxFactor={0.2}
            {...parallaxProps}
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
        this.setState({ clicked: BUTTONS[buttonIndex] });
      }
    );
  };

  newSnapshot = () => {
    this.setState({ cameraVisible: true });
  };

  componentDidMount() {
    const imageId = this.props.navigation.getParam('imageId', '');
    Backend.getImage(imageId).then(imageWeird => {
      const image: any = imageWeird;
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
    // const image: any = await Backend.getImage(imageId);
    // const user: any = await Backend.getUser(image.userId);
    // debugger;
    // // const user = this.props.navigation.getParam('user', '');
    // image.snapshots.forEach(id => {
    //   this.loadSnapshot(id);
    // });
    // this.setState({ image, user });
  }

  loadSnapshot = id => {
    Backend.getSnapshot(id).then(snapshot => {
      const snapshots = this.state.snapshots.concat([snapshot]);
      this.setState({
        snapshots,
      });
    });
  };

  closeCamera = () => {
    this.setState({ cameraVisible: false });
  };

  saveImage = async () => {
    if (this.state.isSaved) {
      Storage.removeImage(this.state.image.id);
      this.state.snapshots.forEach(snapshot => {
        Storage.removeSnapshot(snapshot.id);
      });
      this.setState({ isSaved: false });
    } else {
      Storage.storeImage(this.state.image).then(() => {});
      this.state.snapshots.forEach(async snapshot => {
        Storage.storeSnapshot(snapshot);
      });
      this.setState({ isSaved: true });
    }
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
              onPress={this.showActionSheet}
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
        <CameraScreen
          close={this.closeCamera}
          navigation={this.props.navigation}
          image={this.state.image}
          user={this.state.user}
          snapshots={this.state.snapshots}
          visible={this.state.cameraVisible}
        />
        <ScrollView style={styles.container}>
          <Grid>
            <Row>
              {this.state.image && (
                <Carousel
                  data={this.state.image.snapshots}
                  renderItem={this.renderSnapshot}
                  hasParallaxImages={true}
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
              <Button iconLeft transparent primary onPress={this.newSnapshot}>
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
