import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import { Container, Header, Left, Body, Right, Title } from 'native-base';
import ImageCardLarge from '../components/ImageCardLarge';
import Backend from '../data/backend';

export default class LinksScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  render() {
    const image = Backend.getImage();
    const user = Backend.getUser();
    return (
      <Container>
        <Header>
          <Left />
          <Body>
            <Title>Nearby</Title>
          </Body>
          <Right />
        </Header>
        <ScrollView style={styles.container}>
          <ImageCardLarge
            title={image.title}
            coverImage={image.snapshots[0].snapImage}
            user={user}
          />
        </ScrollView>
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
