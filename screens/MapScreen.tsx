import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  TextInput,
  PanResponder,
  GestureResponderEvent,
} from 'react-native';
import { MapView, Marker, Location, Permissions } from 'expo';
import Carousel from 'react-native-snap-carousel';
import { Image as ImageModel } from '../data/models';
import Backend from '../data/backend';
import ImageCardLarge from '../components/ImageCardLarge';
import { LatLng } from 'react-native-maps';
import { Icon } from 'native-base';

interface Props extends React.Props<any> {
  navigation: any;
}

interface State {
  location: { lat: number; lng: number };
  mapRegion: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  locationAvail: boolean;
  images: string[];
  markers: {
    id: string;
    lat: number;
    lng: number;
    title: string;
  }[];
  selectedImage: string;
  scrollPosition: number;
  scrollDown: boolean;
}

export default class HomeScreen extends React.Component<Props, State> {
  static navigationOptions = {
    header: null,
  };

  state = {
    location: {
      lat: 0,
      lng: 0,
    },
    mapRegion: {
      latitude: 0,
      longitude: 0,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    },
    locationAvail: false,
    images: null,
    markers: [],
    selectedImage: '',
    scrollPosition: 0,
    scrollDown: true,
  };

  componentDidMount() {
    this.getCurrentLocation();

    Backend.queryImages(null)
      .then(images => {
        this.setState({ images, selectedImage: images[0] });
      })
      .catch(error => {
        console.log(error);
      });
  }

  getCurrentLocation = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        locationAvail: false,
      });
    }

    let location = await Location.getCurrentPositionAsync({});
    this.setState({
      locationAvail: true,
      location: {
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      },
    });
  };

  handleMapRegionChange = mapRegion => {
    this.setState({ mapRegion });
  };

  onImageFocused = index => {
    this.setState({ selectedImage: this.state.images[index] });
    this.moveMapToMarker(index);
  };

  moveMapToMarker = index => {
    const marker = this.state.markers.find(marker => {
      return marker.id == this.state.images[index];
    });

    const viewArea = 0.75;
    if (marker && this.state.mapRegion) {
      if (
        !(
          Math.abs(marker.lat - this.state.mapRegion.latitude) <
            viewArea * this.state.mapRegion.latitudeDelta &&
          Math.abs(marker.lng - this.state.mapRegion.longitude) <
            viewArea * this.state.mapRegion.longitudeDelta
        )
      ) {
        var region = this.state.mapRegion;
        region.latitude = marker.lat;
        region.longitude = marker.lng;
        this.map.animateToRegion(region, 2000);
      }
    }
  };

  _renderItem = ({ item, index }) => {
    return (
      <View style={{ width: 300, height: 200 }}>
        <ImageCardLarge
          imageId={item}
          key={item}
          navigation={this.props.navigation}
          hideUser
          height={175}
          onLoad={async image => {
            this.addMarker(item, image, index);
          }}
        />
      </View>
    );
  };

  addMarker = async (id: string, image: ImageModel, index: number) => {
    const marker = {
      id,
      lat: image.lat,
      lng: image.lng,
      title: image.title,
    };
    var markers = this.state.markers;
    this.setState({ markers: markers.concat([marker]) }, () => {
      if (index == 0) {
        this.onImageFocused(index);
      }
    });
  };

  renderMarker = data => {
    const latlng: LatLng = {
      latitude: data.lat,
      longitude: data.lng,
    };
    return (
      <MapView.Marker
        coordinate={latlng}
        title={data.title}
        key={data.id}
        pinColor={this.state.selectedImage == data.id ? 'blue' : 'red'}
      />
    );
  };

  _carousel = null;
  map = null;
  dragHandle = null;

  render() {
    return (
      <View style={styles.container}>
        <MapView
          style={{
            // height: styles.windowSize.width,
            // width: styles.windowSize.width,
            flex: 1,
          }}
          initialRegion={{
            latitude: 40.73061,
            longitude: -73.935242,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          onRegionChange={this.handleMapRegionChange}
          ref={ref => {
            this.map = ref;
          }}
        >
          {this.state.markers &&
            this.state.markers.map(data => this.renderMarker(data))}
        </MapView>
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
          pointerEvents="box-none"
        >
          <View
            style={{
              width: '90%',
              height: 50,
              backgroundColor: 'white',
              borderRadius: 5,
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              margin: 20,
              padding: 15,
              shadowColor: 'black',
            }}
          >
            <TextInput
              style={{ height: 40 }}
              onChangeText={text => {}}
              value={''}
              placeholder="Search"
            />
          </View>
          <View
            style={{
              width: '100%',
              height: 210,
              position: 'relative',
            }}
            pointerEvents="box-none"
          >
            <View
              style={{
                position: 'absolute',
                top: this.state.scrollPosition,
                left: 0,
                flexDirection: 'column',
                justifyContent: 'space-around',
                alignItems: 'center',
                height: 210,
                width: '100%',
              }}
            >
              <View
                {...this.dragResponder.panHandlers}
                ref={ref => {
                  this.dragHandle = ref;
                }}
                style={{
                  width: '100%',
                  padding: 3,
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Icon type="MaterialIcons" name="drag-handle" />
              </View>
              <View style={{ width: '100%', height: 200 }}>
                {this.state.images && (
                  <Carousel
                    ref={c => {
                      this._carousel = c;
                    }}
                    data={this.state.images}
                    renderItem={this._renderItem}
                    sliderWidth={styles.windowSize.width}
                    sliderHeight={200}
                    itemWidth={300}
                    itemHeight={200}
                    layout={'default'}
                    onSnapToItem={this.onImageFocused}
                  />
                )}
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }

  dragResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt: GestureResponderEvent, gestureState) => {
      return true;
    },
    onPanResponderMove: (evt, gestureState) => {
      const position = this.state.scrollDown
        ? gestureState.dy
        : 185 + gestureState.dy;
      if (position < 186 && position > 0) {
        this.setState({
          scrollPosition: position,
        });
      } else if (position < 0) {
        this.setState({
          scrollPosition: -5 * Math.sqrt(Math.abs(position)),
        });
      }
    },
    onPanResponderTerminationRequest: (evt, gestureState) => true,
    onPanResponderRelease: (evt, gestureState) => {
      const position = this.state.scrollDown
        ? gestureState.dy
        : 185 + gestureState.dy;
      if (position > 100) {
        this.setState({ scrollPosition: 185, scrollDown: false });
      } else {
        this.setState({ scrollPosition: 0, scrollDown: true });
      }
    },
    onPanResponderTerminate: (evt, gestureState) => {
      const position = this.state.scrollDown
        ? gestureState.dy
        : 185 + gestureState.dy;
      if (position > 100) {
        this.setState({ scrollPosition: 185, scrollDown: false });
      } else {
        this.setState({ scrollPosition: 0, scrollDown: true });
      }
    },
  });
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  windowSize: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});
