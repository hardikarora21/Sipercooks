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
  KeyboardAvoidingView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ico from 'react-native-vector-icons/MaterialIcons';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import Icons from 'react-native-vector-icons/Entypo';
import {SliderBox} from 'react-native-image-slider-box';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
export default class Chat extends React.Component {
  state = {
    check: false,
    data: [{sent: false, text: 'Hello User, We are here to help you.....'}],
    defaultTxt: undefined,
  };
  ShowChat = () => {
    var len = this.state.data.length;
    if (len % 2 == 0 && this.state.defaultTxt != '') {
      setTimeout(() => {
        if (this.state.data.length == 2) {
          this.state.data.push({
            check: !this.state.check,
            text: 'Can you please elaborate the issue',
          });
          this.setState({check: !this.state.check});
        } else if (this.state.data.length == 4) {
          this.state.data.push({
            check: !this.state.check,
            text: 'Sorry to hear that',
          });
          this.setState({check: !this.state.check});
        } else if (this.state.data.length == 6) {
          this.state.data.push({
            check: !this.state.check,
            text: 'We are reviewing you issue',
          });
          this.setState({check: !this.state.check});
        } else if (this.state.data.length == 8) {
          this.state.data.push({
            check: !this.state.check,
            text:
              'We have successfully found outs the reason behind your issue',
          });
          this.setState({check: !this.state.check});
        } else if (this.state.data.length == 10) {
          this.state.data.push({
            check: !this.state.check,
            text: 'Just give us some time to resolve your issue',
          });
          this.setState({check: !this.state.check});
        } else {
          this.state.data.push({
            check: !this.state.check,
            text: 'Wait we are still resolving it ',
          });
          this.setState({check: !this.state.check});
        }
      }, 900);
    }
  };
  storechat = () => {
    if (this.state.defaultTxt != '') {
      this.state.data.push({
        check: !this.state.check,
        text: this.state.defaultTxt,
      });
      this.setState({defaultTxt: undefined, check: !this.state.check});
    } else {
      this.setState({defaultTxt: undefined});
    }
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
              height: Dimensions.get('window').height / 10,
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
                CHAT WITH US
              </Text>
            </View>
          </View>
          <View
            style={{
              height: 16,
              width: 50,
              backgroundColor: '#fbfbfb',
              justifyContent: 'center',
              alignSelf: 'center',
              marginTop: 15,
              borderRadius: 5,
              elevation: 1.5,
            }}>
            <Text
              style={{
                fontSize: 10,
                textAlign: 'center',
                color: '#a7a7a7',
              }}>
              TODAY
            </Text>
          </View>

          <FlatList
            showsVerticalScrollIndicator={false}
            data={this.state.data}
            style={{
              height: Dimensions.get('window').height / 1.31,
              paddingHorizontal: 10,
            }}
            scrollEnabled={true}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => (
              <View
                style={[
                  item.check
                    ? {
                        backgroundColor: 'lightblue',
                        paddingHorizontal: 10,
                        borderTopEndRadius: 10,
                        borderTopLeftRadius: 10,
                        borderBottomLeftRadius: 10,
                        alignSelf: 'flex-end',
                      }
                    : {
                        backgroundColor: '#fbfbfb',
                        paddingHorizontal: 10,
                        borderTopEndRadius: 10,
                        borderTopLeftRadius: 10,
                        borderBottomRightRadius: 10,
                        alignSelf: 'flex-start',
                      },
                  {
                    maxHeight: 500,
                    minHeight: 0,
                    flexGrow: 1,
                    flexShrink: 0,
                    marginVertical: 10,
                    width: Dimensions.get('window').width / 1.2,
                    elevation: 1.5,
                  },
                ]}>
                <Text style={{paddingTop: 10}}>{item.text}</Text>
                <Text
                  style={{
                    fontSize: 10,
                    paddingVertical: 4,
                    textAlign: 'right',
                    color: '#a7a7a7',
                  }}>
                  8:00
                </Text>
              </View>
            )}
          />
          <View
            style={{
              height: Dimensions.get('window').height / 10,
              flexDirection: 'row',
              paddingHorizontal: 10,
              backgroundColor: 'white',
              justifyContent: 'space-evenly',
            }}>
            <TextInput
              placeholder="  Type your Message here..."
              defaultValue={this.state.defaultTxt}
              onChangeText={txt => this.setState({defaultTxt: txt})}
              onSubmitEditing={() => {
                this.storechat(), this.ShowChat();
              }}
              placeholderTextColor="#c7cbd1"
              style={{
                width: Dimensions.get('screen').width / 1.25,
                borderRadius: 12,
                marginLeft: 8,
                alignSelf: 'center',
                paddingLeft: 10,
                borderColor: '#efefef',
                borderWidth: 2,
                height: '80%',
              }}></TextInput>
            <Icons
              name={'mic'}
              color="#c7cbd1"
              size={30}
              style={{alignSelf: 'center', marginLeft: 10}}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }
}
