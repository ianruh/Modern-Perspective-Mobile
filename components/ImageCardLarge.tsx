import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
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

interface Props extends React.Props<any> {
  navigation: any;
  imageId: string;
  hideUser?: boolean;
}

export class ImageCardLarge extends React.Component<Props, any> {
  state = {
    clicked: 0,
    image: null,
    user: null,
    coverImage: null,
  };

  componentDidMount() {
    Backend.getImage(this.props.imageId).then(imageStrict => {
      this.setState({ image: imageStrict });
      const image: any = imageStrict;
      Backend.getUser(image.userId).then(user => {
        this.setState({ user });
      });
      Backend.getSnapshot(image.snapshots['0']).then(snapshot => {
        const snap: any = snapshot;
        this.setState({
          coverImage: snap.targetImage,
        });
      });
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
      <Root>
        {this.state.image && (
          <Content>
            <Card>
              <CardItem>
                <Grid>
                  <Row>
                    <Col
                      size={80}
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                      }}
                    >
                      <TouchableOpacity onPress={this.navToImage}>
                        <Body>
                          <Text style={{ fontWeight: 'bold' }}>
                            {this.state.image.title}
                          </Text>
                          <Text note>
                            {this.state.image.description.substring(0, 30) +
                              '...'}
                          </Text>
                        </Body>
                      </TouchableOpacity>
                    </Col>

                    <Col
                      size={20}
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                      }}
                    >
                      <Button
                        iconRight
                        transparent
                        primary
                        onPress={this.showActionSheet}
                      >
                        <Icon type="SimpleLineIcons" name="options-vertical" />
                      </Button>
                    </Col>
                  </Row>
                </Grid>
              </CardItem>
              <Divider />
              <CardItem cardBody>
                <Image
                  source={{
                    uri: this.state.coverImage ? this.state.coverImage : '',
                  }}
                  style={{ height: 200, width: null, flex: 1 }}
                />
              </CardItem>
              {!this.props.hideUser && this.state.user && (
                <View>
                  <Divider />
                  <UserCard
                    user={this.state.user}
                    navigation={this.props.navigation}
                  />
                </View>
              )}
            </Card>
          </Content>
        )}
      </Root>
    );
  }
}

export default ImageCardLarge;
