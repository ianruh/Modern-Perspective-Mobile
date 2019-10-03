import React from 'react';
import { View, Share, StyleSheet, Dimensions } from 'react-native';
import {
  Container,
  Header,
  Left,
  Button,
  Icon,
  Body,
  Title,
  Right,
  ActionSheet,
} from 'native-base';

interface Props extends React.Props<any> {
  navigation: any;
}

interface State {}

export default class CollectionScreen extends React.Component<Props, State> {
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
