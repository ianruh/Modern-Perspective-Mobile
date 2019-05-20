import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

export default class Divider extends React.Component {
  render() {
    return <View style={styles.divider} />;
  }
}

const styles = StyleSheet.create({
  divider: {
    backgroundColor: '#9e9e9e',
    width: Dimensions.get('window').width,
    height: StyleSheet.hairlineWidth,
  },
});
