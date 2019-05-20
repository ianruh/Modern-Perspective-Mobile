import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Share,
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
  Item,
  Input,
  Toast,
} from 'native-base';
import Carousel, { ParallaxImage } from 'react-native-snap-carousel';
import Divider from '../components/Divider';
import UserCard from '../components/UserCard';
import Backend from '../data/backend';
import { Location, Permissions, MapView } from 'expo';
import { Marker } from 'react-native-maps';

export default class NewImageScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    image: null,
    user: null,
    snapshot: null,
    titleValid: true,
    descriptionValid: true,
    sourceValid: true,
  };

  navBack = () => {
    this.props.navigation.goBack();
  };

  onSave = () => {
    const state = this.state;
    debugger;
    if (
      this.state.titleValid &&
      this.state.descriptionValid &&
      this.state.sourceValid
    ) {
      Backend.newImage({ ...this.state.image, userId: this.state.user.id })
        .then(newImage => {
          Backend.newSnapshot({
            ...this.state.snapshot,
            imageId: newImage.id,
            userId: this.state.user.id,
          }).then(newSnapshot => {
            this.props.navigation.navigate('Image', {
              imageId: newImage.id,
              image: newImage,
              user: this.state.user,
            });
          });
        })
        .catch(error => {
          Toast.show({
            text: 'Post Failed, idk why.',
            buttonText: 'Okay!',
            type: 'warning',
          });
        });
    } else {
      Toast.show({
        text: 'Please fill in the fields.',
        buttonText: 'Ok',
      });
    }
  };

  componentDidMount() {
    this.mapView = React.createRef();
    const imageUri = this.props.navigation.getParam('imageUri', '');
    const user = this.props.navigation.getParam('user', '');
    const image = {
      description: '',
      title: '',
      lat: 0,
      lng: 0,
      userId: user.userId,
    };
    const snapshot = {
      date: this.formatDate(new Date()),
      source: '',
      target_image: imageUri,
      imageId: null,
      userId: user.userId,
    };
    this.setState({ image, user, snapshot });
    this._getLocationPermission();
  }

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

  _getLocationPermission = async () => {
    const permission = await Permissions.getAsync(Permissions.LOCATION);
    if (permission.status !== 'granted') {
      const newPermission = await Permissions.askAsync(Permissions.LOCATION);
      if (newPermission.status === 'granted') {
        this._getLocation();
      }
    } else {
      this._getLocation();
    }
  };

  _getLocation = async () => {
    let location = await Location.getCurrentPositionAsync({
      enableHighAccuracy: true,
    });
    // debugger;
    this.setState({
      image: {
        ...this.state.image,
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      },
    });
  };

  titleHandler = text => {
    this.setState({
      image: {
        ...this.state.image,
        title: text,
      },
      titleValid: !!text,
    });
  };

  descriptionHandler = text => {
    this.setState({
      image: {
        ...this.state.image,
        description: text,
      },
      descriptionValid: !!text,
    });
  };

  sourceHandler = text => {
    this.setState({
      snapshot: {
        ...this.state.snapshot,
        source: text,
      },
      sourceValid: !!text,
    });
  };

  render() {
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={this.navBack}>
              <Text>Cancel</Text>
            </Button>
          </Left>
          <Body>
            <Title>New Image</Title>
          </Body>
          <Right>
            <Button transparent onPress={this.onSave}>
              <Text>Save</Text>
            </Button>
          </Right>
        </Header>
        <ScrollView style={styles.container}>
          {this.state.image && (
            <Grid>
              <Row>
                <Image
                  source={{ uri: this.state.snapshot.target_image }}
                  style={{ height: 200, width: styles.windowSize.width }}
                />
              </Row>
              <Row style={styles.content}>
                <Item
                  underline
                  style={styles.inputItem}
                  error={!this.state.titleValid}
                >
                  <Input
                    placeholder="Title"
                    value={this.state.image.title}
                    onChangeText={this.titleHandler}
                    autoCapitalize="words"
                    autoFocus
                    style={styles.title}
                  />
                </Item>
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
                  <Item
                    underline
                    error={!this.state.descriptionValid}
                    style={styles.inputItem}
                  >
                    <Input
                      placeholder="Description"
                      value={this.state.image.description}
                      onChangeText={this.descriptionHandler}
                      autoCapitalize="sentences"
                      style={styles.description}
                      multiline
                    />
                  </Item>
                )}
              </Row>
              <Divider />
              <Row>
                {this.state.image && (
                  <Item
                    underline
                    error={!this.state.sourceValid}
                    style={styles.inputItem}
                  >
                    <Input
                      placeholder="Image Source"
                      value={this.state.snapshot.source}
                      onChangeText={this.sourceHandler}
                      autoCapitalize="sentences"
                      style={styles.description}
                      multiline
                    />
                  </Item>
                )}
              </Row>
              <Divider />
              <Row>
                {this.state.image && this.state.image.lat != 0 && (
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
                    ref={this.mapView}
                  >
                    {this.state.image.lat !== 0 && (
                      <Marker
                        coordinate={{
                          latitude: this.state.image.lat,
                          longitude: this.state.image.lng,
                        }}
                        title=""
                        description=""
                      />
                    )}
                  </MapView>
                )}
              </Row>
            </Grid>
          )}
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
  },
  optionIcons: {
    fontSize: 20,
  },
  description: {
    padding: 10,
    paddingTop: 20,
    paddingBottom: 20,
  },
  inputItem: {
    width: '100%',
    padding: 10,
  },
});
