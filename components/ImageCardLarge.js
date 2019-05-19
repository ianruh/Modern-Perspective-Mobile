import React from 'react';
import { Image } from 'react-native';
import {
  Container,
  Header,
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
} from 'native-base';
import Colors from '../constants/Colors';

var BUTTONS = ['Option 0', 'Option 1', 'Option 2', 'Delete', 'Cancel'];
var CANCEL_INDEX = 4;

export class ImageCardLarge extends React.Component {
  state = {
    clicked: 0,
  };

  showActionSheet = () => {
    ActionSheet.show(
      {
        options: BUTTONS,
        cancelButtonIndex: CANCEL_INDEX,
        title: 'Testing ActionSheet',
      },
      buttonIndex => {
        this.setState({ clicked: BUTTONS[buttonIndex] });
      }
    );
  };

  render() {
    return (
      <Root>
        <Container>
          <Content>
            <Card>
              <CardItem>
                <Left>
                  <Body>
                    <Text style={{ fontWeight: 'bold' }}>
                      {this.props.title}
                    </Text>
                    {/* <Text note>{this.props.user.username}</Text> */}
                  </Body>
                </Left>
                <Right>
                  <Button
                    iconRight
                    transparent
                    primary
                    onPress={this.showActionSheet}
                  >
                    <Icon type="SimpleLineIcons" name="options-vertical" />
                  </Button>
                </Right>
              </CardItem>
              <CardItem cardBody bordered>
                <Image
                  source={{ uri: this.props.coverImage }}
                  style={{ height: 200, width: null, flex: 1 }}
                />
              </CardItem>
              <CardItem>
                <Left>
                  <Thumbnail source={{ uri: this.props.user.thumbnail }} />
                  <Body>
                    <Text>{this.props.user.username}</Text>
                  </Body>
                </Left>
              </CardItem>
            </Card>
          </Content>
        </Container>
      </Root>
    );
  }
}

export default ImageCardLarge;
