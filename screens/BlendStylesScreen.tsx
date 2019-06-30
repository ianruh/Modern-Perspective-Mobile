import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
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
import {
  User as UserModel,
  Snapshot as SnapshotModel,
  Image as ImageModel,
} from '../data/models';
import OpacityBlendModal from './blendModals/OpacityBlend';

interface Props extends React.Props<any> {
  navigation: any;
}

interface State {
  user: UserModel;
  image: ImageModel;
  opacityVisible: boolean;
  snapshots: SnapshotModel[];
}

export default class BlendStylesScreen extends React.Component<Props, State> {
  static navigationOptions = {
    header: null,
  };

  state = {
    user: null,
    image: null,
    snapshots: [],
    opacityVisible: false,
  };

  navBack = () => {
    this.props.navigation.goBack();
  };

  componentDidMount() {
    const user = this.props.navigation.getParam('user', null);
    const image = this.props.navigation.getParam('image', null);
    const snapshots = this.props.navigation.getParam('snapshots', null);
    this.setState({ user, image, snapshots });
  }

  opacityOverlayPressed = () => {
    this.setState({ opacityVisible: true });
  };

  closeOpacityBlend = () => {
    this.setState({ opacityVisible: false });
  };

  sideBySidePressed = () => {};

  halfAndHalfPressed = () => {};

  BlendModals = () => {
    return (
      <View>
        {this.state.opacityVisible && (
          <OpacityBlendModal
            user={this.state.user}
            image={this.state.image}
            snapshots={this.state.snapshots}
            visible={this.state.opacityVisible}
            close={this.closeOpacityBlend}
            onNewBlend={_ => {}}
          />
        )}
      </View>
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
            <Title>
              {this.state.user ? this.state.user.name : 'Loading ...'}
            </Title>
          </Body>
          <Right />
        </Header>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
          }}
        >
          <TouchableOpacity onPress={this.opacityOverlayPressed}>
            <View style={styles.blendOption}>
              <Text> Opacity Overlay </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.sideBySidePressed}>
            <View style={styles.blendOption}>
              <Text> Side By Side </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.halfAndHalfPressed}>
            <View style={styles.blendOption}>
              <Text> Half and Half </Text>
            </View>
          </TouchableOpacity>
        </View>
        <this.BlendModals />
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
  blendOption: {
    height: 40,
    alignSelf: 'flex-start',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#cccccc',
    borderRadius: 7,
    shadowOffset: { width: 3, height: 3 },
    margin: 6,
    padding: 10,
  },
});
