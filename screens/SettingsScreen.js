import React from 'react';
import { View } from 'native-base';
import { Switch, Text } from 'react-native';
import Storage from '../data/storage';

export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: 'app.json',
  };

  state = {
    localOnly: false,
  };

  componentDidMount = async () => {
    this.setState({
      localOnly: (await Storage.getSettings()).localOnly,
    });
  };

  changeLocal = () => {
    Storage.setLocalOnly(!this.state.localOnly);
    this.setState({
      localOnly: !this.state.localOnly,
    });
  };

  render() {
    /* Go ahead and delete ExpoConfigView and replace it with your
     * content, we just wanted to give you a quick view of your config */
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'center',
        }}
      >
        <View
          style={{
            width: '100%',
            height: 100,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 15,
          }}
        >
          <Text>Local Data Only</Text>
          <Switch
            value={this.state.localOnly}
            onValueChange={this.changeLocal}
          />
        </View>
      </View>
    );
  }
}
