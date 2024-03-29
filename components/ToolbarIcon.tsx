import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Icon } from 'native-base';

interface Props extends React.Props<any> {
  index?: number;
  onPress: (index) => void;
  selected?: boolean;
  children?: any;
  disabled?: boolean;
  icon: {
    name: string;
    type?:
      | 'AntDesign'
      | 'Entypo'
      | 'EvilIcons'
      | 'Feather'
      | 'FontAwesome'
      | 'FontAwesome5'
      | 'Foundation'
      | 'Ionicons'
      | 'MaterialCommunityIcons'
      | 'MaterialIcons'
      | 'Octicons'
      | 'SimpleLineIcons'
      | 'Zocial';
  };
}

export default class ToolbarIcon extends React.Component<Props, any> {
  render() {
    return (
      <View style={{ position: 'relative' }}>
        <TouchableOpacity
          onPress={() => {
            if (!this.props.disabled) {
              this.props.onPress(this.props.index);
            }
          }}
          style={{ flexDirection: 'row', alignItems: 'center' }}
          disabled={this.props.disabled}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              width: 40,
              height: 40,
              backgroundColor: this.props.selected ? 'grey' : 'transparent',
              borderRadius: 8,
            }}
          >
            <Icon
              name={this.props.icon.name}
              type={this.props.icon.type}
              color={this.props.disabled ? 'grey' : 'black'}
            />
          </View>
        </TouchableOpacity>
        {this.props.selected && this.props.children}
      </View>
    );
  }
}
