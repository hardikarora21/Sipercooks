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
  BackHandler,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ico from 'react-native-vector-icons/MaterialIcons';
import {getMonth, getDay, findCartTotal} from '../Shared/functions';
import {StackActions} from '@react-navigation/native';
import {connect} from 'react-redux';

import {SliderBox} from 'react-native-image-slider-box';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';

const currentdate = new Date();

function getAMPMHour(hour, minutes) {
  if (hour > 12) {
    hour = hour - 12 + ':' + minutes + ' PM';
  } else hour = hour + ':' + minutes + ' AM';
  return hour;
}

const mapStateToProps = state => {
  return {
    cart: state.cart,
    defaultVariants: state.defaultVariants,
    login: state.login,
  };
};

class Success extends React.Component {
  state = {
    check: false,
    tohome: false,
  };

  backHandler = () => {
    this.props.navigation.dispatch(StackActions.popToTop());
    // this.props.navigation.navigate('Home')
  };

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.backHandler);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.backHandler);
  }

  render() {
    const {orderData} = this.props.route.params;
    const {promoDiscount} = this.props.route.params;
    const {cartTotal} = this.props.route.params;
    const {serverResp} = this.props.route.params;
    console.log('Here is cartTotal from Success Page', cartTotal);
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
              justifyContent: 'space-between',
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
              onPress={() => this.backHandler()}>
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
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('History')}
              style={{
                height: 42,
                width: 25,
                justifyContent: 'center',
              }}>
              <Image
                style={{
                  height: 25,
                  width: 25,
                  alignSelf: 'center',
                  resizeMode: 'contain',
                  marginRight: 20,
                }}
                source={require('../assets/product.png')}
              />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={{height: '90%'}}
            showsVerticalScrollIndicator={false}>
            <View
              style={{
                height: 250,
                zIndex: 1,
                backgroundColor: 'white',
              }}>
              <View
                style={{
                  justifyContent: 'center',
                  height: 90,

                  width: 90,
                  borderRadius: 360,
                  backgroundColor: '#efefef',
                  alignSelf: 'center',
                }}>
                <Image
                  style={{
                    height: 70,
                    width: 70,
                    resizeMode: 'contain',
                    alignSelf: 'center',
                  }}
                  source={require('../assets/check.png')}
                />
              </View>
              <Text
                style={{
                  fontWeight: 'bold',
                  marginTop: 5,
                  fontSize: 18,
                  alignSelf: 'center',
                }}>
                Rs. {orderData.orderAmount}
              </Text>
              <Text
                style={{
                  backgroundColor: '#efefef',
                  paddingHorizontal: 8,
                  borderRadius: 20,
                  paddingVertical: 6,
                  textAlign: 'center',
                  marginTop: 5,
                  fontSize: 14,
                  alignSelf: 'center',
                }}>
                {orderData.paymentMode}
              </Text>
            </View>

            <View
              style={{
                height: 240,
                backgroundColor: '#FFFBDE',
                marginTop: -50,
                zIndex: 10,
                marginHorizontal: 10,
                elevation: 1.5,
                paddingHorizontal: 23,
                justifyContent: 'space-evenly',
                borderRadius: 5,
              }}>
              <View>
                <Text style={{fontSize: 18, fontWeight: 'bold'}}>ORDER</Text>
                <Text
                  style={{
                    fontSize: 10,
                    color: '#a7a7a7',
                  }}>
                  {currentdate.getDate() +
                    '/' +
                    (currentdate.getMonth() + 1) +
                    '/' +
                    currentdate.getFullYear() +
                    ' | ' +
                    getAMPMHour(
                      currentdate.getHours(),
                      currentdate.getMinutes(),
                    )}
                </Text>
              </View>
              <View style={{height: 120, justifyContent: 'space-evenly'}}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={{fontSize: 14}}>Item Total</Text>
                  <Text style={{fontSize: 14}}>Rs. {cartTotal}</Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={{fontSize: 14, color: '#EA0016'}}>
                    {orderData.deliveryType === 'SELF-PICKUP'
                      ? 'Conveniance Fee'
                      : 'Delivery Fee'}
                  </Text>
                  <Text style={{fontSize: 14, color: '#EA0016'}}>
                    Rs.{' '}
                    {orderData.deliveryType === 'SELF-PICKUP'
                      ? orderData.convenienceFee
                      : orderData.deliveryCharges}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={{fontSize: 14}}>
                    Promo Discount {`\n`}
                    <Text
                      style={{
                        fontSize: 10,
                        color: '#a7a7a7',
                        width: '40%',
                      }}
                      numberOfLines={2}>
                      Download and Referral credits will be utilised to{`\n`}
                      give 5% discount on your orders
                    </Text>
                  </Text>
                  <Text style={{fontSize: 14}}>- Rs. {promoDiscount}</Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    borderBottomWidth: 1,
                    borderBottomColor: 'white',
                    paddingBottom: 16,
                  }}>
                  <Text style={{fontSize: 14}}>Discount</Text>
                  <Text style={{fontSize: 14}}>-Rs. 0</Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text style={{fontSize: 14, fontWeight: 'bold'}}>To Pay</Text>
                <Text style={{fontSize: 14, fontWeight: 'bold'}}>
                  Rs. {orderData.orderAmount}
                </Text>
              </View>
            </View>
            <View
              style={{
                height: 190,
                backgroundColor: '#FFFBDE',
                marginTop: 4.5,
                elevation: 1.5,
                marginHorizontal: 10,
                borderRadius: 5,
                paddingHorizontal: 23,
                justifyContent: 'space-evenly',
              }}>
              <View>
                <Text style={{fontSize: 18, fontWeight: 'bold'}}>
                  {orderData.deliveryType === 'SELF-PICKUP'
                    ? 'PICKUP'
                    : 'DELIVERY'}
                </Text>
                {/* <Text
                  style={{
                    fontSize: 10,
                    color: '#a7a7a7',
                  }}>
                  ORDER ID: 123321
                </Text> */}
              </View>
              <View>
                <Text style={{fontSize: 14}}>
                  {getDay(orderData.requiredDate.getDay()) +
                    ' ' +
                    orderData.requiredDate.getDate() +
                    ' ' +
                    getMonth(orderData.requiredDate.getMonth())}
                </Text>
                <Text
                  style={{
                    fontSize: 8,
                    color: '#a7a7a7',
                  }}>
                  Dilevery Date
                </Text>
              </View>
              <View>
                <Text style={{fontSize: 14}}>
                  {orderData.requiredTimeString}
                </Text>
                <Text
                  style={{
                    fontSize: 8,
                    color: '#a7a7a7',
                  }}>
                  Dilevery TimeSlot
                </Text>
              </View>
              <View>
                <Text style={{fontSize: 14}}>Address</Text>
                <Text
                  style={{
                    fontSize: 8,
                    color: '#a7a7a7',
                  }}>
                  {orderData.addresses[0].addressLine1 +
                    '\n' +
                    orderData.addresses[0].addressLine2}
                </Text>
              </View>
            </View>
            <Text
              style={{
                fontSize: 12,
                width: Dimensions.get('window').width / 1.2,
                alignSelf: 'center',
                marginTop: 15,
                textAlign: 'center',
                fontFamily: 'sans-serif-thin',
                color: 'black',
              }}>
              Download and Referral credits will be utilised ro give a 5%
              discount on you orders Download and Referral credits will be
              utilised ro give a 5% discount on you orders Download and Referral
              credits will be utilised ro give a 5% discount on you orders
            </Text>
            <View
              style={{
                height: 40,
                alignSelf: 'center',
                width: Dimensions.get('window').width,
                justifyContent: 'space-between',
                flexDirection: 'row',
                paddingHorizontal: 10,
                marginBottom: 10,
                marginTop: 50,
              }}>
              <Image
                source={require('../assets/llog.png')}
                style={{
                  height: 60,
                  width: 60,
                  alignSelf: 'center',
                  resizeMode: 'contain',
                }}
              />

              <View style={{flexDirection: 'row'}}>
                <Text
                  onPress={() => this.props.navigation.navigate('Refer')}
                  style={{
                    backgroundColor: 'white',
                    paddingHorizontal: 14,
                    borderRadius: 20,
                    paddingVertical: 8,
                    textAlign: 'center',
                    fontSize: 12,
                    alignSelf: 'center',
                    borderWidth: 1,
                    borderColor: '#EA0016',
                  }}>
                  Invite Friends
                </Text>
                <Text
                  style={{
                    backgroundColor: 'white',
                    paddingHorizontal: 14,
                    borderRadius: 20,
                    paddingVertical: 8,
                    textAlign: 'center',
                    fontSize: 12,
                    marginLeft: 10,
                    alignSelf: 'center',
                    borderWidth: 1,
                    borderColor: '#EA0016',
                  }}>
                  Share Recipt
                </Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
}

export default connect(mapStateToProps)(Success);
