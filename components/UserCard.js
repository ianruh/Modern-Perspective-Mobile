import React from 'react';
import { Thumbnail } from 'native-base';
import { Text, TouchableOpacity, View } from 'react-native';

export default class UserCard extends React.Component {
  navToProfile = () => {
    this.props.navigation.push('Profile', {
      user: this.props.user,
      userId: this.props.user.userId,
    });
  };

  render() {
    return (
      <TouchableOpacity
        onPress={this.props.navigation ? this.navToProfile : () => {}}
      >
        <View
          style={{
            margin: 10,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}
        >
          <Thumbnail source={{ uri: this.props.user.thumbnail }} />
          <Text style={{ paddingLeft: 30 }}>{this.props.user.name}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}
