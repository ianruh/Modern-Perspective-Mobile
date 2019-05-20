import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Share,
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
import { MapView } from 'expo';
import UserCard from '../components/UserCard';
import Backend from '../data/backend';

export default class ImageScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    image: null,
    user: null,
    snapshots: [],
  };

  renderSnapshot = ({ item, index }, parallaxProps) => {
    return (
      <View>
        <ParallaxImage
          source={{
            uri:
              this.state.snapshots[index] &&
              this.state.snapshots[index].target_image
                ? this.state.snapshots[index].target_image
                : 'data:image/jpg;base64,',
          }}
          containerStyle={{ width: styles.windowSize.width, height: 200 }}
          style={{ width: styles.windowSize.width, height: 200 }}
          parallaxFactor={0.4}
          {...parallaxProps}
        />
      </View>
    );
  };

  shareOption = () => {
    Share.share({
      message:
        'React Native | A framework for building native apps using React',
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
    this.props.navigation.push('CameraPush', {
      image: this.state.image,
      snapshots: this.state.snapshots,
      user: this.state.user,
    });
  };

  componentDidMount() {
    const image = this.props.navigation.getParam('image', '');
    const user = this.props.navigation.getParam('user', '');
    if (this.state.image) {
      image.snapshots.map(id => {
        this.loadSnapshot(id);
      });
      this.setState({ image, user });
    } else {
      Backend.getImage(this.props.navigation.getParam('imageId', '0')).then(
        image => {
          Backend.getUser(image.userId).then(user => {
            this.setState({ user });
          });
          image.snapshots.map(id => {
            this.loadSnapshot(id);
          });
          this.setState({ image });
        }
      );
    }
  }

  loadSnapshot = id => {
    Backend.getSnapshot(id).then(snapshot => {
      const snapshots = this.state.snapshots.concat([snapshot]);
      this.setState({
        snapshots,
      });
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
              onPress={this.showActionSheet}
            >
              <Icon
                style={styles.optionIcons}
                size={10}
                type="SimpleLineIcons"
                name="options-vertical"
              />
            </Button>
          </Right>
        </Header>
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
              <Button iconRight transparent primary>
                <Icon
                  style={styles.optionIcons}
                  type="MaterialIcons"
                  name="bookmark-border"
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
                />
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
