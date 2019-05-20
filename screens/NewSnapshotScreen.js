import React from 'react';
import { ScrollView, StyleSheet, Text, Dimensions, Image } from 'react-native';
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
  Grid,
  Row,
  Item,
  Input,
} from 'native-base';
import ImageCardLarge from '../components/ImageCardLarge';
import Backend from '../data/backend';
import { ImagePicker, Permissions, FileSystem } from 'expo';

export default class NewSnapshotScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    image: null,
    snapshot: null,
    user: null,
    validSource: true,
  };

  async componentDidMount() {
    const image = this.props.navigation.getParam('image', null);
    const snapshot = this.props.navigation.getParam('snapshot', null);
    const user = this.props.navigation.getParam('user', null);
    this.setState({ image, snapshot, user });
  }

  navBack = () => {
    this.props.navigation.navigate('Home');
  };

  onSave = () => {
    if (this.state.validSource) {
      const state = this.state;
      debugger;
      Backend.newSnapshot({
        ...this.state.snapshot,
        imageId: this.state.image.id,
        userId: this.state.user.id,
      }).then(newSnapshot => {
        this.props.navigation.navigate('Image', {
          imageId: this.state.image.id,
          image: this.state.image,
          user: this.state.user,
        });
      });
    }
  };

  sourceHandler = text => {
    this.setState({
      snapshot: {
        ...this.state.snapshot,
        source: text,
      },
      validSource: !!text,
    });
  };

  render() {
    return (
      <Root>
        <Container>
          <Header>
            <Left>
              <Button transparent onPress={this.navBack}>
                <Text>Cancel</Text>
              </Button>
            </Left>
            <Body>
              <Title>New Snapshot</Title>
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
                    error={!this.state.validSource}
                  >
                    <Input
                      placeholder="Source"
                      value={this.state.snapshot.source}
                      onChangeText={this.sourceHandler}
                      autoCapitalize="sentences"
                      autoFocus
                    />
                  </Item>
                </Row>
              </Grid>
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
  windowSize: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  content: {
    backgroundColor: '#fff',
  },
  inputItem: {
    width: '100%',
    padding: 10,
  },
});
