import React from 'react';
import { Platform } from 'react-native';
import {
  createStackNavigator,
  createBottomTabNavigator,
} from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import MainScreen from '../screens/MainScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ImageScreen from '../screens/ImageScreen';
import ProfileScreen from '../screens/ProfileScreen';
import BlendStylesScreen from '../screens/BlendStylesScreen';

const HomeStack = createStackNavigator({
  Home: HomeScreen,
});

HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-information-circle${focused ? '' : '-outline'}`
          : 'md-information-circle'
      }
    />
  ),
};

const MainStack = createStackNavigator({
  Main: MainScreen,
  Image: ImageScreen,
  Profile: ProfileScreen,
  Blend: BlendStylesScreen,
});

MainStack.navigationOptions = {
  tabBarLabel: 'Near',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name="ios-locate" />
  ),
};

const SettingsStack = createStackNavigator({
  Settings: SettingsScreen,
});

SettingsStack.navigationOptions = {
  tabBarLabel: 'Settings',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-options' : 'md-options'}
    />
  ),
};

export default createBottomTabNavigator({
  MainStack,
  HomeStack,
  SettingsStack,
});
