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
  Card,
  CardItem,
  Button,
  Icon,
  Content,
  Root,
} from 'native-base';
import ImageCardLarge from '../components/ImageCardLarge';
import Backend from '../data/backend';
import UserCard from '../components/UserCard';
import Divider from '../components/Divider';

export default class MainScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    user: null,
    images: [],
    snapshots: [],
  };

  navBack = () => {
    this.props.navigation.goBack();
  };

  componentDidMount() {
    const user = this.props.navigation.getParam('user', null);
    const userId = this.props.navigation.getParam('userId', 0);
    if (user) {
      this.setState({ user });
    } else {
      Backend.getUser(userId).then(user => {
        this.setState({ user });
      });
    }
  }

  loadImages = () => {
    this.state.user.images.forEach(imageId => {
      Backend.getImage(imageId).then(image => {
        const images = this.state.images.concat([image]);
        this.setState({ images }, this.loadSnapshots);
      });
    });
  };

  loadSnapshots = () => {
    if (this.state.images.length === this.state.user.images.length) {
      this.state.user.snapshots.forEach(snapshotId => {
        var alreadyIncluded = false;
        this.state.images.forEach(image => {
          if (image.snapshots.includes(snapshotId)) {
            alreadyIncluded = true;
          }
        });
        if (!alreadyIncluded) {
          Backend.getSnapshot(snapshotId).then(snapshot => {
            const snapshots = this.state.snapshots.concat([snapshot]);
            this.setState({ snapshots });
          });
        }
      });
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
            <Title>
              {this.state.user ? this.state.user.name : 'Loading ...'}
            </Title>
          </Body>
          <Right />
        </Header>
        <Content>
          {this.state.user && (
            <ScrollView style={styles.container}>
              <Card>
                <CardItem>
                  <UserCard user={this.state.user} />
                </CardItem>
              </Card>

              {this.state.user.images.map(imageId => {
                return (
                  <ImageCardLarge
                    imageId={imageId}
                    key={imageId}
                    navigation={this.props.navigation}
                    hideUser
                  />
                );
              })}
            </ScrollView>
          )}
        </Content>
      </Container>
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
