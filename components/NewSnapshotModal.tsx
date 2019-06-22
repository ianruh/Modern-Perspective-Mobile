import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  Dimensions,
  Image,
  View,
  Modal,
  ActivityIndicator,
} from 'react-native';
import {
  Container,
  Header,
  Left,
  Body,
  Right,
  Title,
  Button,
  Root,
  Grid,
  Row,
  Item,
  Input,
} from 'native-base';
import Backend from '../data/backend';
import {
  User as UserModel,
  Snapshot as SnapshotModel,
  Image as ImageModel,
} from '../data/models';
import Cache from '../data/cache';

interface Props extends React.Props<any> {
  visible: boolean;
  image: ImageModel;
  snapshot: SnapshotModel;
  user: UserModel;
  close: () => void;
}

interface State {
  image: ImageModel;
  snapshot: SnapshotModel;
  user: UserModel;
  validSource: boolean;
  loading: boolean;
}

export default class NewSnapshotModal extends React.Component<Props, State> {
  static navigationOptions = {
    header: null,
  };

  state = {
    image: null,
    snapshot: null,
    user: null,
    validSource: true,
    loading: false,
  };

  async componentDidMount() {
    // const image = this.props.navigation.getParam('image', null);
    const image = this.props.image;
    // const snapshot = this.props.navigation.getParam('snapshot', null);
    const snapshot = this.props.snapshot;
    // const user = this.props.navigation.getParam('user', null);
    const user = this.props.user;
    this.setState({ image, snapshot, user });
  }

  navBack = () => {
    this.props.close();
  };

  onSave = async () => {
    if (this.state.validSource) {
      this.setState({ loading: true });
      await Backend.newSnapshot({
        ...this.state.snapshot,
        imageId: this.state.image.id,
        userId: this.state.user.id,
      }).then(async newSnapshot => {
        await Cache.clearCache();
        this.setState({ loading: false });
        this.props.close();
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
      <Modal
        animationType="slide"
        visible={this.props.visible}
        transparent={true}
        supportedOrientations={['portrait', 'landscape']}
      >
        <View style={{ position: 'relative', flex: 1, zIndex: 0 }}>
          {this.state.loading && (
            <View
              style={{
                position: 'absolute',
                flexDirection: 'column',
                flex: 1,
                top: 0,
                left: 0,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(128,128,128,0.2)',
                zIndex: 1,
              }}
            >
              <ActivityIndicator size="large" />
            </View>
          )}
          <View
            style={{
              position: 'absolute',
              flex: 1,
              top: 0,
              left: 0,
              zIndex: 0,
            }}
          >
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
                          source={{ uri: this.state.snapshot.targetImage }}
                          style={{
                            height: 200,
                            width: styles.windowSize.width,
                          }}
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
          </View>
        </View>
      </Modal>
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
