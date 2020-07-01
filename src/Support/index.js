import React from 'react';
import {
  SafeAreaView,
  TextInput,
  ScrollView,
  Dimensions,
  View,
  Text,
  StatusBar,
  Image,
  FlatList,
  TouchableOpacity,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ico from 'react-native-vector-icons/MaterialIcons';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

import {SliderBox} from 'react-native-image-slider-box';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
export default class Support extends React.Component {
  state = {
    check: false,
  };
  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <View
          style={{
            backgroundColor: '#efefef',
            flex: 1,
            justifyContent: 'center',
          }}>
          <View
            style={{
              height: '10%',
              flexDirection: 'row',
              paddingHorizontal: 10,
              backgroundColor: 'white',
            }}>
            <View style={{flexDirection: 'row', alignSelf: 'center'}}>
              <TouchableWithoutFeedback
                style={{
                  height: 42,
                  width: 42,
                  borderRadius: 360,
                  marginLeft: -3.5,
                  backgroundColor: 'white',
                  justifyContent: 'center',
                  alignSelf: 'center',
                }}
                onPress={() => this.props.navigation.goBack()}>
                <View
                  style={{
                    height: 35,
                    width: 35,
                    borderRadius: 360,
                    elevation: 2,
                    backgroundColor: 'white',
                    justifyContent: 'center',
                    alignSelf: 'center',
                  }}>
                  <Image
                    source={require('../assets/a1.png')}
                    style={{
                      width: 18,
                      height: 18,
                      padding: 5,
                      alignSelf: 'center',
                      alignItems: 'center',
                      borderRadius: 360,
                      backgroundColor: 'white',
                      elevation: 2,
                    }}
                  />
                </View>
              </TouchableWithoutFeedback>
              <Text
                style={{
                  fontSize: 20,
                  paddingLeft: 10,
                  alignSelf: 'center',
                }}>
                HELP
              </Text>
            </View>
          </View>

          <ScrollView style={{height: '90%', paddingHorizontal: 10}}>
            <TouchableWithoutFeedback
              onPress={() => this.props.navigation.navigate('History')}>
              <View
                style={{
                  height: 120,
                  backgroundColor: 'white',
                  marginTop: 10,
                  elevation: 2,
                  borderRadius: 5,
                  flexDirection: 'row',
                  paddingHorizontal: 15,
                  justifyContent: 'space-between',
                }}>
                <View
                  style={{
                    backgroundColor: '#fbfbfb',
                    justifyContent: 'center',
                    alignSelf: 'center',
                    height: 80,
                    width: 80,
                    borderRadius: 360,
                  }}>
                  <Image
                    source={require('../assets/paper.png')}
                    style={{
                      height: 35,
                      width: 35,
                      alignSelf: 'center',
                      resizeMode: 'contain',
                      tintColor: '#ea0016',
                    }}
                  />
                </View>
                <View
                  style={{
                    justifyContent: 'center',
                    height: 100,
                    width: '50%',
                    alignSelf: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: 18,
                      color: 'black',
                      fontWeight: 'bold',
                    }}>
                    My Orders
                  </Text>
                  <Text
                    numberOfLines={2}
                    style={{
                      fontSize: 11,
                    }}>
                    View and Manage your orders and Bookings.
                  </Text>
                </View>

                <View
                  style={{
                    height: 35,
                    width: 35,
                    borderRadius: 360,
                    backgroundColor: '#fceae8',
                    justifyContent: 'center',
                    alignSelf: 'center',
                  }}>
                  <Image
                    source={require('../assets/arrow.png')}
                    style={{
                      width: 21,
                      height: 21,
                      padding: 5,
                      alignSelf: 'center',
                      alignItems: 'center',
                      borderRadius: 360,
                      tintColor: '#ea0016',
                      resizeMode: 'contain',
                    }}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              onPress={() => this.props.navigation.navigate('Chat')}>
              <View
                style={{
                  height: 120,
                  backgroundColor: 'white',
                  marginTop: 10,
                  borderRadius: 5,
                  flexDirection: 'row',
                  paddingHorizontal: 15,
                  justifyContent: 'space-between',
                  elevation: 2,
                  marginBottom: 10,
                }}>
                <View
                  style={{
                    backgroundColor: '#fbfbfb',
                    justifyContent: 'center',
                    alignSelf: 'center',
                    height: 80,
                    width: 80,
                    borderRadius: 360,
                  }}>
                  <Image
                    source={require('../assets/comment.png')}
                    style={{
                      height: 35,
                      width: 35,
                      alignSelf: 'center',
                      resizeMode: 'contain',
                      tintColor: '#ea0016',
                    }}
                  />
                </View>
                <View
                  style={{
                    justifyContent: 'center',
                    height: 100,
                    width: '50%',
                    alignSelf: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: 18,
                      color: 'black',
                      fontWeight: 'bold',
                    }}>
                    Chat With Us
                  </Text>
                  <Text
                    numberOfLines={2}
                    style={{
                      fontSize: 11,
                    }}>
                    Get support from our new automated assistance.
                  </Text>
                </View>

                <View
                  style={{
                    height: 35,
                    width: 35,
                    borderRadius: 360,
                    backgroundColor: '#fceae8',
                    justifyContent: 'center',
                    alignSelf: 'center',
                  }}>
                  <Image
                    source={require('../assets/arrow.png')}
                    style={{
                      width: 21,
                      height: 21,
                      padding: 5,
                      alignSelf: 'center',
                      alignItems: 'center',
                      borderRadius: 360,
                      tintColor: '#ea0016',
                      resizeMode: 'contain',
                    }}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
}
