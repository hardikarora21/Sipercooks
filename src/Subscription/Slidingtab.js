import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {createMaterialTopTabNavigator} from 'react-navigation-tabs';
class Current1 extends React.Component {
  render() {
    return null;
  }
}
class Upcoming2 extends React.Component {
  render() {
    return null;
  }
}
class Current extends React.Component {
  render() {
    return null;
  }
}
class Upcoming extends React.Component {
  render() {
    return null;
  }
}
const TABS = createMaterialTopTabNavigator(
  {
    Current1: {
      screen: Current,
      navigationOptions: {tabBarLabel: 'Lunch'},
    },
    Upcoming2: {
      screen: Upcoming,
      navigationOptions: {tabBarLabel: 'Dinner'},
    },
  },
  {
    tabBarOptions: {
      labelStyle: {
        fontSize: 15,
        fontWeight: 'bold',
        textAlignVertical: 'center',
      },
      indicatorStyle: {
        backgroundColor: 'black',
        height: 3.5,
      },
      inactiveTintColor: 'black',
      activeTintColor: 'black',
      style: {
        backgroundColor: 'white',
        paddingBottom: 0,
        marginBottom: 0,
        elevation: 0,
        height: 50,
      },
    },
  },
);
export default createAppContainer(TABS);
