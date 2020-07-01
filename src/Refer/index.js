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
  Share,
  Clipboard,
  ToastAndroid,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ico from 'react-native-vector-icons/MaterialIcons';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

import {SliderBox} from 'react-native-image-slider-box';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {connect} from 'react-redux';

const mapStateToProps = state => {
  return {
    referalCode: state.referalCode,
  };
};

class Refer extends React.Component {
  state = {
    check: false,
    tohome: false,
  };

  onShare = async () => {
    try {
      const result = await Share.share({
        message:
          'Inviting you to NEEDS Market, a division of Le Millennia Supermart, and a pioneer in online grocery shopping in Gurgaon. Download Now!!! APP STORE: https://apps.apple.com/us/app/needs-supermarket/id1511210707?ls=1 / PLAY STORE: https://play.google.com/store/apps/details?id=com.needssupermarket  REFERRAL CODE: ' +
          this.props.referalCode.code,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  copyToClipboard = string => {
    Clipboard.setString(string);
    ToastAndroid.showWithGravity(
      'Copied to clipboard',
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );
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
              paddingTop: 5,
            }}>
            <TouchableWithoutFeedback
              style={{
                height: 42,
                width: 42,
                borderRadius: 360,
                marginLeft: -3.5,
                backgroundColor: 'white',
                justifyContent: 'center',
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
            <View
              style={{
                height: 42,
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  fontSize: 20,
                  paddingLeft: 10,
                  alignSelf: 'center',
                }}>
                INVITE FRIENDS
              </Text>
            </View>
          </View>
          <View
            style={{
              height: '90%',
              backgroundColor: 'white',
              paddingHorizontal: 23,
              justifyContent: 'center',
            }}>
            <Image
              source={require('../assets/ref.png')}
              style={{
                marginTop: 30,
                height: '30%',
                width: '80%',
                resizeMode: 'contain',
                alignSelf: 'center',
              }}
            />
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 22,
                alignSelf: 'center',
                marginTop: 30,
              }}>
              Invite Friends
            </Text>
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 22,
                alignSelf: 'center',
              }}>
              Get Awesome Gifts
            </Text>
            <Text
              style={{
                fontSize: 12,
                width: '80%',
                alignSelf: 'center',
                marginTop: 5,
                textAlign: 'center',
                fontFamily: 'sans-serif-thin',
                color: 'black',
              }}>
              Download and Referral credits will be utilised ro give a 5%
              discount on you orders
            </Text>
            <View style={{marginTop: 50}}>
              <Text
                style={{
                  fontSize: 12,
                  marginTop: 5,
                  color: '#a1a1a1',
                }}>
                YOUR CODE
              </Text>
              <TouchableOpacity
                onPress={() =>
                  this.copyToClipboard(this.props.referalCode.code)
                }
                style={{
                  height: 50,
                  justifyContent: 'space-between',
                  backgroundColor: '#f1f1f1',
                  borderRadius: 5,
                  flexDirection: 'row',
                  paddingHorizontal: 10,
                }}>
                <View />
                <Text
                  style={{
                    color: '#EA0016',
                    fontFamily: 'sans-serif-condensed',
                    fontSize: 20,
                    alignSelf: 'center',
                    paddingLeft: 12,
                  }}>
                  {this.props.referalCode.code}
                </Text>
                <Image
                  source={require('../assets/cs.png')}
                  style={{
                    height: 25,
                    width: 25,
                    borderRadius: 360,
                    alignSelf: 'center',
                    resizeMode: 'contain',
                  }}
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() => this.onShare()}
              style={{
                height: 42,
                backgroundColor: '#EA0016',
                alignSelf: 'center',
                width: 180,
                justifyContent: 'center',
                borderRadius: 5,
                marginTop: 30,
                elevation: 5,
              }}>
              <Text
                style={{
                  color: 'white',
                  fontFamily: 'sans-serif-condensed',
                  fontSize: 18,
                  alignSelf: 'center',
                }}>
                Invite Friends
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

export default connect(mapStateToProps)(Refer);
