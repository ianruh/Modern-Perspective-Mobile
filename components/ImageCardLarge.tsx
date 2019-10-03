import React from 'react';
import { Image, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import {
  Container,
  Content,
  Card,
  CardItem,
  Thumbnail,
  Text,
  Button,
  Icon,
  Left,
  Body,
  Right,
  ActionSheet,
  Root,
  Grid,
  Col,
  Row,
} from 'native-base';
import Divider from './Divider';
import UserCard from './UserCard';
import Backend from '../data/backend';
import { BlurView } from 'expo';
import { Image as ImageModel } from '../data/models';

interface Props extends React.Props<any> {
  navigation: any;
  imageId: string;
  hideUser?: boolean;
  height: number;
  onLoad?: (ImageModel) => void;
}

export class ImageCardLarge extends React.Component<Props, any> {
  state = {
    clicked: 0,
    image: null,
    user: null,
    coverImage: null,
  };

  componentDidMount() {
    Backend.getImage(this.props.imageId)
      .then(imageStrict => {
        this.setState({ image: imageStrict });
        if (this.props.onLoad) {
          this.props.onLoad(imageStrict);
        }
        const image: any = imageStrict;
        Backend.getUser(image.userId)
          .then(user => {
            this.setState({ user });
          })
          .catch(error => {
            console.log(error);
          });
        Backend.getSnapshot(image.snapshots['0'])
          .then(snapshot => {
            const snap: any = snapshot;
            this.setState({
              coverImage: snap.targetImage,
            });
          })
          .catch(error => {
            console.log(error);
          });
      })
      .catch(error => {
        console.log(error);
      });
  }

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

  navToImage = () =>
    this.props.navigation.push('Image', {
      imageId: this.props.imageId,
    });

  render() {
    // debugger;
    return (
      <View
        style={{
          flexGrow: 1,
          flexShrink: 0,
          flexBasis: 300,
        }}
      >
        <View style={{ position: 'relative' }}>
          {!this.state.image && (
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                flex: 1,
                opacity: 0.3,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <ActivityIndicator size="small" color="#00ff00" />
            </View>
          )}
          <View
            style={{ margin: 10, borderRadius: 10, backgroundColor: 'grey' }}
          >
            <TouchableOpacity onPress={this.navToImage}>
              <View
                style={{
                  position: 'relative',
                  height: this.props.height,
                  flex: 1,
                  backgroundColor: 'transparent',
                  borderTopLeftRadius: 10,
                  borderTopRightRadius: 10,
                }}
              >
                <View
                  style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    top: 0,
                    left: 0,
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    zIndex: 1,
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,
                  }}
                >
                  <BlurView
                    tint="dark"
                    intensity={60}
                    style={{
                      height: 60,
                      width: '100%',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      backgroundColor: 'transparent',
                      borderTopLeftRadius: 10,
                      borderTopRightRadius: 10,
                    }}
                  >
                    <View
                      style={{
                        paddingLeft: 15,
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10,
                      }}
                    >
                      <Text style={{ fontWeight: 'bold', color: 'white' }}>
                        {this.state.image && this.state.image.title}
                      </Text>
                      <Text note style={{ color: 'white' }}>
                        {this.state.image &&
                          this.state.image.description.substring(0, 30) + '...'}
                      </Text>
                    </View>
                    <Button
                      iconRight
                      transparent
                      primary
                      onPress={this.showActionSheet}
                    >
                      <Icon type="SimpleLineIcons" name="options-vertical" />
                    </Button>
                  </BlurView>

                  {!this.props.hideUser && this.state.user && (
                    <View>
                      <UserCard
                        user={this.state.user}
                        navigation={this.props.navigation}
                      />
                    </View>
                  )}
                </View>
                <Image
                  source={{
                    uri: this.state.coverImage
                      ? this.state.coverImage
                      : 'data:image/jpg;base64,',
                  }}
                  style={{
                    height: this.props.height,
                    width: '100%',
                    flex: 1,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    zIndex: 0,
                    borderRadius: 10,
                  }}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

export default ImageCardLarge;
