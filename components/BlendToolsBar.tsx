import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Icon } from 'native-base';

interface Props extends React.Props<any> {
  children?: any;
}

export default class BlendToolsBar extends React.Component<Props, any> {
  render() {
    return (
      <View
        style={{
          height: 50,
          width: 200,
          borderBottomLeftRadius: 25,
          borderTopLeftRadius: 25,
          backgroundColor: 'rgba(135, 135, 135, 0.5)',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'absolute',
          top: 0,
          left: -205,
          paddingLeft: 15,
        }}
      >
        {this.props.children}
      </View>
    );
  }
}
