import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {
  Container,
  Header,
  Left,
  Body,
  Right,
  Title,
  Button,
  Icon,
  Root,
  ActionSheet,
  Content,
} from 'native-base';
import ImageCardLarge from '../components/ImageCardLarge';
import Backend from '../data/backend';
import { ImagePicker, Permissions, FileSystem } from 'expo';
import NewImageModal from '../components/NewImageModal';

interface Props extends React.Props<any> {
  navigation: any;
}

export default class MainScreen extends React.Component<Props, any> {
  static navigationOptions = {
    header: null,
  };

  state = {
    images: null,
    hasCameraPermission: null,
    user: null,
    refreshing: false,
    newImageModalVisible: false,
    newImageUri: null,
  };

  subs = [];

  async componentDidMount() {
    this.subs = [
      this.props.navigation.addListener('didFocus', payload =>
        this.componentDidFocus(payload)
      ),
    ];

    Backend.getUser('1')
      .then(user => {
        this.setState({ user });
      })
      .catch(error => {
        console.log(error);
      });
    Backend.queryImages(null)
      .then(images => {
        this.setState({ images });
      })
      .catch(error => {
        console.log(error);
      });
  }

  componentDidFocus = data => {
    Backend.queryImages(null)
      .then(images => {
        this.setState({ images });
      })
      .then(() => {
        this.setState({ refreshing: false });
      })
      .catch(error => {
        console.log(error);
      });
  };

  refresh = () => {
    this.setState({ refreshing: true }, () => this.componentDidFocus(null));
  };

  showActionSheet = () => {
    const BUTTONS = ['From Photos', 'Cancel'];
    const CANCEL_INDEX = 1;

    ActionSheet.show(
      {
        options: BUTTONS,
        cancelButtonIndex: CANCEL_INDEX,
        title: 'New Image',
      },
      this._getPermission
    );
  };

  _getPermission = async buttonIndex => {
    if (buttonIndex === 0) {
      const permission = await Permissions.getAsync(Permissions.CAMERA_ROLL);
      if (permission.status !== 'granted') {
        const newPermission = await Permissions.askAsync(
          Permissions.CAMERA_ROLL
        );
        if (newPermission.status === 'granted') {
          this.pickImage();
        }
      } else {
        this.pickImage();
      }
    }
  };

  pickImage = async () => {
    const { cancelled, uri } = await ImagePicker.launchImageLibraryAsync();
    if (!cancelled && this.state.user) {
      FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingTypes.Base64,
      }).then(base64String => {
        this.setState({
          newImageUri: 'data:image/jpg;base64,' + base64String,
          newImageModalVisible: true,
        });
      });
    }
  };

  closeNewImageModal = () => {
    this.setState({
      newImageModalVisible: false,
    });
  };

  render() {
    return (
      <Root>
        <Container>
          <Header style={styles.header}>
            <Left />
            <Body>
              <Title>Nearby</Title>
            </Body>
            <Right>
              <Button
                iconRight
                transparent
                primary
                onPress={this.showActionSheet}
              >
                <Icon style={styles.optionIcons} type="AntDesign" name="plus" />
              </Button>
            </Right>
          </Header>
          {this.state.newImageModalVisible && (
            <NewImageModal
              visible={this.state.newImageModalVisible}
              user={this.state.user}
              navigation={this.props.navigation}
              imageUri={this.state.newImageUri}
              close={this.closeNewImageModal}
            />
          )}
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.refresh}
              />
            }
          >
            {this.state.images && this.state.images.length != 0 && (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  flexWrap: 'wrap',
                }}
              >
                {this.state.images.map(item => {
                  return (
                    <ImageCardLarge
                      imageId={item}
                      key={item}
                      navigation={this.props.navigation}
                      hideUser
                      height={250}
                    />
                  );
                })}
              </View>
            )}
            {this.state.images && this.state.images.length == 0 && (
              <View
                style={{
                  flex: 1,
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: Dimensions.get('window').height - 200,
                }}
              >
                <Text> It doesn't look like you have any images.</Text>
                <Text> Go online to view and save some images.</Text>
              </View>
            )}
            {!this.state.images && (
              <View
                style={{
                  flex: 1,
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: Dimensions.get('window').height,
                }}
              >
                <ActivityIndicator size="large" />
              </View>
            )}
          </ScrollView>
        </Container>
      </Root>
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
  optionIcons: {},
  header: {
    backgroundColor: '#fff',
  },
});
