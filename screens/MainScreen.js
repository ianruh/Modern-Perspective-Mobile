import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { ExpoLinksView } from '@expo/samples';
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

export default class MainScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    images: null,
    hasCameraPermission: null,
    user: null,
  };

  async componentDidMount() {
    Backend.getUser(1).then(user => {
      this.setState({ user });
    });
    Backend.queryImages(null).then(images => {
      this.setState({ images });
    });
  }

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
    const { cancelled, uri } = await Expo.ImagePicker.launchImageLibraryAsync();
    if (!cancelled && this.state.user) {
      FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingTypes.Base64,
      }).then(base64String => {
        this.props.navigation.push('NewImage', {
          user: this.state.user,
          imageUri: 'data:image/jpg;base64,' + base64String,
        });
      });
    }
  };

  render() {
    return (
      <Root>
        <Container>
          <Header>
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
                <Icon
                  size={10}
                  style={styles.optionIcons}
                  type="AntDesign"
                  name="plus"
                />
              </Button>
            </Right>
          </Header>
          {this.state.images && (
            <Content>
              {this.state.images.map(item => {
                return (
                  <ImageCardLarge
                    imageId={item}
                    key={item}
                    navigation={this.props.navigation}
                  />
                );
              })}
            </Content>
          )}
          {!this.state.images && <Text>Loading...</Text>}
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
});
