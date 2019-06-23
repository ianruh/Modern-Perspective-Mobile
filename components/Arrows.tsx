import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Icon } from 'native-base';
import { Tool } from '../data/Models';

interface Props extends React.Props<any> {
  style?: any;
  centerIcon: {
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
  centerPressed?: () => void;
  visible: boolean;
  tool: Tool;
}

export default class Arrows extends React.Component<Props, any> {
  render() {
    return (
      <View
        style={{
          ...this.props.style,
          position: 'relative',
          width: 150,
          height: 150,
        }}
      >
        {this.props.visible && (
          <View style={{ flex: 1 }}>
            {/* Up */}
            {!this.props.tool.noVertical && (
              <TouchableOpacity
                style={{ position: 'absolute', top: 0, left: 50 }}
                onPress={this.props.tool.upPressed}
              >
                <View
                  style={{
                    backgroundColor: 'rgba(128,128,128,0.7)',
                    borderTopLeftRadius: 25,
                    borderTopRightRadius: 25,
                    width: 50,
                    height: 65,
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    paddingTop: 7,
                  }}
                >
                  <Icon name="ios-arrow-up" type="Ionicons" />
                </View>
              </TouchableOpacity>
            )}
            {/* Left */}
            {!this.props.tool.noHorizontal && (
              <TouchableOpacity
                style={{ position: 'absolute', top: 50, left: 0 }}
                onPress={this.props.tool.leftPressed}
              >
                <View
                  style={{
                    backgroundColor: 'rgba(128,128,128,0.7)',
                    borderTopLeftRadius: 25,
                    borderBottomLeftRadius: 25,
                    width: 65,
                    height: 50,
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    paddingLeft: 10,
                  }}
                >
                  <Icon name="ios-arrow-back" type="Ionicons" />
                </View>
              </TouchableOpacity>
            )}
            {/* Right */}
            {!this.props.tool.noHorizontal && (
              <TouchableOpacity
                style={{ position: 'absolute', top: 50, left: 85 }}
                onPress={this.props.tool.rightPressed}
              >
                <View
                  style={{
                    backgroundColor: 'rgba(128,128,128,0.7)',
                    borderTopRightRadius: 25,
                    borderBottomRightRadius: 25,
                    width: 65,
                    height: 50,
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    paddingRight: 10,
                  }}
                >
                  <Icon name="ios-arrow-forward" type="Ionicons" />
                </View>
              </TouchableOpacity>
            )}
            {/* Down */}
            {!this.props.tool.noVertical && (
              <TouchableOpacity
                style={{ position: 'absolute', top: 85, left: 50 }}
                onPress={this.props.tool.downPressed}
              >
                <View
                  style={{
                    backgroundColor: 'rgba(128,128,128,0.7)',
                    borderBottomLeftRadius: 25,
                    borderBottomRightRadius: 25,
                    width: 50,
                    height: 65,
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    paddingBottom: 10,
                  }}
                >
                  <Icon name="ios-arrow-down" type="Ionicons" />
                </View>
              </TouchableOpacity>
            )}
            {/* Center */}
            <TouchableOpacity
              style={{ position: 'absolute', top: 40, left: 40 }}
              onPress={this.props.centerPressed}
            >
              <View
                style={{
                  backgroundColor: 'rgba(128,128,128,1)',
                  borderRadius: 35,
                  width: 70,
                  height: 70,
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Icon
                  name={this.props.centerIcon.name}
                  type={this.props.centerIcon.type}
                />
              </View>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }
}
