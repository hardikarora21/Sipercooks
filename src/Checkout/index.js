import React from 'react';
import {
  StyleSheet,
  ScrollView,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Dimensions,
  TouchableWithoutFeedback,
  StatusBar,
  SafeAreaView,
  Alert,
  ToastAndroid,
  Modal,
  TouchableHighlight,
  Platform,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {FlatList} from 'react-native-gesture-handler';
import Axios from 'axios';
import {
  promoWalletAndMainWalletBalance,
  cartPostUrl,
  removeBalanceFromPromoWalletUrl,
  supplierId,
  removeBalanceFromMainWalletUrl,
} from '../../Config/Constants';
import RazorpayCheckout from 'react-native-razorpay';

import {
  getMonth,
  getDay,
  getCurrentTimeinHours,
  findCartTotal,
} from '../Shared/functions';

import {connect} from 'react-redux';

import {deleteAllItemsFromCart} from '../Redux/Cart/ActionCreators';

function toast(message) {
  // Alert.alert(message);
  ToastAndroid.showWithGravity(
    message,
    ToastAndroid.SHORT,
    ToastAndroid.CENTER,
  );
}
const SCREEN_WIDTH = Dimensions.get('window').width;
const millisecondsInOneDay = 24 * 60 * 60 * 1000;
const startOfDay = new Date(new Date().setHours(0, 0, 0, 0));
const twelveOClockAtNight = startOfDay.getTime() + 24 * 60 * 60 * 1000;
const twentyOClock = startOfDay.getTime() + 20 * 60 * 60 * 1000;
const nineteenOClock = startOfDay.getTime() + 19 * 60 * 60 * 1000;
const nineteenThirtyOClock = startOfDay.getTime() + 19.5 * 60 * 60 * 1000;
const eighteenOClock = startOfDay.getTime() + 18 * 60 * 60 * 1000;
const fifteenOClock = startOfDay.getTime() + 15 * 60 * 60 * 1000;
const twentyOneOClock = startOfDay.getTime() + 21.5 * 60 * 60 * 1000;
const tenThirtyOClock = startOfDay.getTime() + 10.5 * 60 * 60 * 1000;

const mapStateToProps = state => {
  return {
    defaultVariants: state.defaultVariants,
    cart: state.cart,
    login: state.login,
    user: state.user,
    nearestSupplier: state.nearestSupplier,
    addresses: state.addresses,
  };
};

const mapDispatchToProps = dispatch => ({
  deleteAllItemsFromCart: () => dispatch(deleteAllItemsFromCart()),
});

class Checkout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deliveryType: 0, // 0 means home delivery and 1 means self pickup
      deldata: [1, 2, 3, 4, 5],
      SelectedTimeSlotForHomeDelivery: -1,
      SelectedTimeSlotForSelfPickup: -1,
      fiveDays: [
        {day: new Date(), id: 1},
        {day: new Date(new Date().getTime() + millisecondsInOneDay), id: 2},
        {day: new Date(new Date().getTime() + 2 * millisecondsInOneDay), id: 3},
        {day: new Date(new Date().getTime() + 3 * millisecondsInOneDay), id: 4},
        {day: new Date(new Date().getTime() + 4 * millisecondsInOneDay), id: 5},
      ],
      selectedDay: 0,
      selectedDeliveryDate: new Date(),
      hasSelectedTimeSlotForHomeDelivery: false,
      hasSelectedTimeSlotForSelfPickup: false,
      paymentMode: 'NOT SELECTED',
      specialInstructions: '',
      isTemperaryModelShown: false,
      isTemperaryModelShown1: false,
      walletbalanncedata: [],
      isWalletDataLoading: false,
      promoDiscount: 0,
      uploadingOrderDataToServer: false,
      tipAmount: '',
      isGivingTip: false,
      selectedTipValue: -1,
    };
  }

  componentDidMount() {
    console.log(
      'HEar is the nearest supplier =========',
      JSON.stringify(this.props.nearestSupplier.supplierIdWithMinDist),
    );

    console.log('Here is now', new Date().getTime());
    console.log('Here is startOfDay', startOfDay);
    console.log('Here is twelveOClockAtNight', twelveOClockAtNight);
    console.log('Here is twentyOClock', twentyOClock);
    console.log('Here is nineteenOClock', nineteenOClock);
    console.log('Here is nineteenThirtyOClock', nineteenThirtyOClock);
    console.log('Here is eighteenOClock', eighteenOClock);
    console.log('Here is fifteenOClock', fifteenOClock);
    console.log('Here is twentyOneOClock', twentyOneOClock);
    console.log('User data', this.props.user);
    this.getPromoWalletAndMainWalletBalance();
  }

  renderHomeDeliveryTimeSlots = () => {
    var nowComplete = new Date();
    var now = nowComplete.getTime();
    var currentHour = nowComplete.getHours();
    if (this.state.selectedDay === 0) {
      if (now > nineteenThirtyOClock) {
        return (
          <>
            <TouchableOpacity
              onPress={() => toast('This slot is closed for today')}>
              <View
                style={{
                  height: 50,
                  backgroundColor: '#f8f8f8',
                  marginTop: 1.5,
                  justifyContent: 'flex-start',
                  flexDirection: 'row',
                }}>
                <View
                  style={[
                    this.state.SelectedTimeSlotForHomeDelivery == 0
                      ? {backgroundColor: '#ea0016'}
                      : {backgroundColor: '#efefef'},
                    ,
                    {
                      height: 20,
                      width: 20,
                      borderRadius: 360,
                      alignSelf: 'center',
                      marginLeft: 10,
                    },
                  ]}
                />
                <Text
                  style={[
                    this.state.SelectedTimeSlotForHomeDelivery == 0
                      ? {color: '#ea0016'}
                      : {color: 'black'},
                    {
                      alignSelf: 'center',
                      fontSize: 14,
                      paddingLeft: 15,
                    },
                  ]}>
                  Within 1.5 hour
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => toast('This slot is closed for today')}>
              <View
                style={{
                  height: 50,
                  backgroundColor: '#f8f8f8',
                  marginTop: 1.5,
                  justifyContent: 'flex-start',
                  flexDirection: 'row',
                }}>
                <View
                  style={[
                    this.state.SelectedTimeSlotForHomeDelivery == 1
                      ? {backgroundColor: '#ea0016'}
                      : {backgroundColor: '#efefef'},
                    ,
                    {
                      height: 20,
                      width: 20,
                      borderRadius: 360,
                      alignSelf: 'center',
                      marginLeft: 10,
                    },
                  ]}
                />
                <Text
                  style={[
                    this.state.SelectedTimeSlotForHomeDelivery == 1
                      ? {color: '#ea0016'}
                      : {color: 'black'},
                    {
                      alignSelf: 'center',
                      fontSize: 14,
                      paddingLeft: 15,
                    },
                  ]}>
                  Within 3 Hours
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => toast('This slot is closed for today')}>
              <View
                style={{
                  height: 50,
                  backgroundColor: '#f8f8f8',
                  marginTop: 1.5,
                  justifyContent: 'flex-start',
                  flexDirection: 'row',
                }}>
                <View
                  style={[
                    this.state.SelectedTimeSlotForHomeDelivery == 2
                      ? {backgroundColor: '#ea0016'}
                      : {backgroundColor: '#efefef'},
                    ,
                    {
                      height: 20,
                      width: 20,
                      borderRadius: 360,
                      alignSelf: 'center',
                      marginLeft: 10,
                    },
                  ]}
                />
                <Text
                  style={[
                    this.state.SelectedTimeSlotForHomeDelivery == 2
                      ? {color: '#ea0016'}
                      : {color: 'black'},
                    {
                      alignSelf: 'center',
                      fontSize: 14,
                      paddingLeft: 15,
                    },
                  ]}>
                  Within 4 - 6 Hours
                </Text>
              </View>
            </TouchableOpacity>
          </>
        );
      } else if (now > eighteenOClock) {
        return (
          <>
            <TouchableOpacity
              onPress={() => {
                this.setState({
                  SelectedTimeSlotForHomeDelivery: 0,
                  hasSelectedTimeSlotForHomeDelivery: true,
                });
                if (
                  now < tenThirtyOClock &&
                  this.state.selectedDeliveryDate.getDate() ===
                    this.state.fiveDays[0].day.getDate()
                )
                  toast(
                    'Store opening time is 10:30 AM, products will be deliverd Within 1.5 hour after the store opens',
                  );
              }}>
              <View
                style={{
                  height: 50,
                  backgroundColor: 'white',
                  marginTop: 1.5,
                  justifyContent: 'flex-start',
                  flexDirection: 'row',
                }}>
                <View
                  style={[
                    this.state.SelectedTimeSlotForHomeDelivery == 0
                      ? {backgroundColor: '#ea0016'}
                      : {backgroundColor: '#efefef'},
                    ,
                    {
                      height: 20,
                      width: 20,
                      borderRadius: 360,
                      alignSelf: 'center',
                      marginLeft: 10,
                    },
                  ]}
                />
                <Text
                  style={[
                    this.state.SelectedTimeSlotForHomeDelivery == 0
                      ? {color: '#ea0016'}
                      : {color: 'black'},
                    {
                      alignSelf: 'center',
                      fontSize: 14,
                      paddingLeft: 15,
                    },
                  ]}>
                  Within 1.5 hour
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => toast('This slot is closed for today')}>
              <View
                style={{
                  height: 50,
                  backgroundColor: '#f8f8f8',
                  marginTop: 1.5,
                  justifyContent: 'flex-start',
                  flexDirection: 'row',
                }}>
                <View
                  style={[
                    this.state.SelectedTimeSlotForHomeDelivery == 1
                      ? {backgroundColor: '#ea0016'}
                      : {backgroundColor: '#efefef'},
                    ,
                    {
                      height: 20,
                      width: 20,
                      borderRadius: 360,
                      alignSelf: 'center',
                      marginLeft: 10,
                    },
                  ]}
                />
                <Text
                  style={[
                    this.state.SelectedTimeSlotForHomeDelivery == 1
                      ? {color: '#ea0016'}
                      : {color: 'black'},
                    {
                      alignSelf: 'center',
                      fontSize: 14,
                      paddingLeft: 15,
                    },
                  ]}>
                  Within 3 Hours
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => toast('This slot is closed for today')}>
              <View
                style={{
                  height: 50,
                  backgroundColor: '#f8f8f8',
                  marginTop: 1.5,
                  justifyContent: 'flex-start',
                  flexDirection: 'row',
                }}>
                <View
                  style={[
                    this.state.SelectedTimeSlotForHomeDelivery == 2
                      ? {backgroundColor: '#ea0016'}
                      : {backgroundColor: '#efefef'},
                    ,
                    {
                      height: 20,
                      width: 20,
                      borderRadius: 360,
                      alignSelf: 'center',
                      marginLeft: 10,
                    },
                  ]}
                />
                <Text
                  style={[
                    this.state.SelectedTimeSlotForHomeDelivery == 2
                      ? {color: '#ea0016'}
                      : {color: 'black'},
                    {
                      alignSelf: 'center',
                      fontSize: 14,
                      paddingLeft: 15,
                    },
                  ]}>
                  Within 4 - 6 Hours
                </Text>
              </View>
            </TouchableOpacity>
          </>
        );
      } else if (now > fifteenOClock) {
        return (
          <>
            <TouchableOpacity
              onPress={() => {
                this.setState({
                  SelectedTimeSlotForHomeDelivery: 0,
                  hasSelectedTimeSlotForHomeDelivery: true,
                });
                if (
                  now < tenThirtyOClock &&
                  this.state.selectedDeliveryDate.getDate() ===
                    this.state.fiveDays[0].day.getDate()
                )
                  toast(
                    'Store opening time is 10:30 AM, products will be deliverd Within 1.5 hour after the store opens',
                  );
              }}>
              <View
                style={{
                  height: 50,
                  backgroundColor: 'white',
                  marginTop: 1.5,
                  justifyContent: 'flex-start',
                  flexDirection: 'row',
                }}>
                <View
                  style={[
                    this.state.SelectedTimeSlotForHomeDelivery == 0
                      ? {backgroundColor: '#ea0016'}
                      : {backgroundColor: '#efefef'},
                    ,
                    {
                      height: 20,
                      width: 20,
                      borderRadius: 360,
                      alignSelf: 'center',
                      marginLeft: 10,
                    },
                  ]}
                />
                <Text
                  style={[
                    this.state.SelectedTimeSlotForHomeDelivery == 0
                      ? {color: '#ea0016'}
                      : {color: 'black'},
                    {
                      alignSelf: 'center',
                      fontSize: 14,
                      paddingLeft: 15,
                    },
                  ]}>
                  Within 1.5 hour
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.setState({
                  SelectedTimeSlotForHomeDelivery: 1,
                  hasSelectedTimeSlotForHomeDelivery: true,
                });
                if (
                  now < tenThirtyOClock &&
                  this.state.selectedDeliveryDate.getDate() ===
                    this.state.fiveDays[0].day.getDate()
                )
                  toast(
                    'Store opening time is 10:30 AM, products will be deliverd Within 3 hours after the store opens',
                  );
              }}>
              <View
                style={{
                  height: 50,
                  backgroundColor: 'white',
                  marginTop: 1.5,
                  justifyContent: 'flex-start',
                  flexDirection: 'row',
                }}>
                <View
                  style={[
                    this.state.SelectedTimeSlotForHomeDelivery == 1
                      ? {backgroundColor: '#ea0016'}
                      : {backgroundColor: '#efefef'},
                    ,
                    {
                      height: 20,
                      width: 20,
                      borderRadius: 360,
                      alignSelf: 'center',
                      marginLeft: 10,
                    },
                  ]}
                />
                <Text
                  style={[
                    this.state.SelectedTimeSlotForHomeDelivery == 1
                      ? {color: '#ea0016'}
                      : {color: 'black'},
                    {
                      alignSelf: 'center',
                      fontSize: 14,
                      paddingLeft: 15,
                    },
                  ]}>
                  Within 3 Hours
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => toast('This slot is closed for today')}>
              <View
                style={{
                  height: 50,
                  backgroundColor: '#f8f8f8',
                  marginTop: 1.5,
                  justifyContent: 'flex-start',
                  flexDirection: 'row',
                }}>
                <View
                  style={[
                    this.state.SelectedTimeSlotForHomeDelivery == 2
                      ? {backgroundColor: '#ea0016'}
                      : {backgroundColor: '#efefef'},
                    ,
                    {
                      height: 20,
                      width: 20,
                      borderRadius: 360,
                      alignSelf: 'center',
                      marginLeft: 10,
                    },
                  ]}
                />
                <Text
                  style={[
                    this.state.SelectedTimeSlotForHomeDelivery == 2
                      ? {color: '#ea0016'}
                      : {color: 'black'},
                    {
                      alignSelf: 'center',
                      fontSize: 14,
                      paddingLeft: 15,
                    },
                  ]}>
                  Within 4 - 6 Hours
                </Text>
              </View>
            </TouchableOpacity>
          </>
        );
      } else {
        return (
          <>
            <TouchableOpacity
              onPress={() => {
                this.setState({
                  SelectedTimeSlotForHomeDelivery: 0,
                  hasSelectedTimeSlotForHomeDelivery: true,
                });
                if (
                  now < tenThirtyOClock &&
                  this.state.selectedDeliveryDate.getDate() ===
                    this.state.fiveDays[0].day.getDate()
                )
                  toast(
                    'Store opening time is 10:30 AM, products will be deliverd Within 1.5 hour after the store opens',
                  );
              }}>
              <View
                style={{
                  height: 50,
                  backgroundColor: 'white',
                  marginTop: 1.5,
                  justifyContent: 'flex-start',
                  flexDirection: 'row',
                }}>
                <View
                  style={[
                    this.state.SelectedTimeSlotForHomeDelivery == 0
                      ? {backgroundColor: '#ea0016'}
                      : {backgroundColor: '#efefef'},
                    ,
                    {
                      height: 20,
                      width: 20,
                      borderRadius: 360,
                      alignSelf: 'center',
                      marginLeft: 10,
                    },
                  ]}
                />
                <Text
                  style={[
                    this.state.SelectedTimeSlotForHomeDelivery == 0
                      ? {color: '#ea0016'}
                      : {color: 'black'},
                    {
                      alignSelf: 'center',
                      fontSize: 14,
                      paddingLeft: 15,
                    },
                  ]}>
                  Within 1.5 hour
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.setState({
                  SelectedTimeSlotForHomeDelivery: 1,
                  hasSelectedTimeSlotForHomeDelivery: true,
                });
                if (
                  now < tenThirtyOClock &&
                  this.state.selectedDeliveryDate.getDate() ===
                    this.state.fiveDays[0].day.getDate()
                )
                  toast(
                    'Store opening time is 10:30 AM, products will be deliverd Within 3 hours after the store opens',
                  );
              }}>
              <View
                style={{
                  height: 50,
                  backgroundColor: 'white',
                  marginTop: 1.5,
                  justifyContent: 'flex-start',
                  flexDirection: 'row',
                }}>
                <View
                  style={[
                    this.state.SelectedTimeSlotForHomeDelivery == 1
                      ? {backgroundColor: '#ea0016'}
                      : {backgroundColor: '#efefef'},
                    ,
                    {
                      height: 20,
                      width: 20,
                      borderRadius: 360,
                      alignSelf: 'center',
                      marginLeft: 10,
                    },
                  ]}
                />
                <Text
                  style={[
                    this.state.SelectedTimeSlotForHomeDelivery == 1
                      ? {color: '#ea0016'}
                      : {color: 'black'},
                    {
                      alignSelf: 'center',
                      fontSize: 14,
                      paddingLeft: 15,
                    },
                  ]}>
                  Within 3 Hours
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.setState({
                  SelectedTimeSlotForHomeDelivery: 2,
                  hasSelectedTimeSlotForHomeDelivery: true,
                });
                if (
                  now < tenThirtyOClock &&
                  this.state.selectedDeliveryDate.getDate() ===
                    this.state.fiveDays[0].day.getDate()
                )
                  toast(
                    'Store opening time is 10:30 AM, products will be deliverd Within 4 - 6 hours after the store opens',
                  );
              }}>
              <View
                style={{
                  height: 50,
                  backgroundColor: 'white',
                  marginTop: 1.5,
                  justifyContent: 'flex-start',
                  flexDirection: 'row',
                }}>
                <View
                  style={[
                    this.state.SelectedTimeSlotForHomeDelivery == 2
                      ? {backgroundColor: '#ea0016'}
                      : {backgroundColor: '#efefef'},
                    ,
                    {
                      height: 20,
                      width: 20,
                      borderRadius: 360,
                      alignSelf: 'center',
                      marginLeft: 10,
                    },
                  ]}
                />
                <Text
                  style={[
                    this.state.SelectedTimeSlotForHomeDelivery == 2
                      ? {color: '#ea0016'}
                      : {color: 'black'},
                    {
                      alignSelf: 'center',
                      fontSize: 14,
                      paddingLeft: 15,
                    },
                  ]}>
                  Within 4 - 6 Hours
                </Text>
              </View>
            </TouchableOpacity>
          </>
        );
      }
    } else
      return (
        <>
          <TouchableOpacity
            onPress={() => {
              this.setState({
                SelectedTimeSlotForHomeDelivery: 0,
                hasSelectedTimeSlotForHomeDelivery: true,
              });
              // if (
              //   now < tenThirtyOClock &&
              //   this.state.selectedDeliveryDate.getDate() ===
              //     this.state.fiveDays[0].day.getDate()
              // )
              //   toast(
              //     'Store opening time is 10:30 AM, products will be deliverd Within 1.5 hour after the store opens',
              //   );
            }}>
            <View
              style={{
                height: 50,
                backgroundColor: 'white',
                marginTop: 1.5,
                justifyContent: 'flex-start',
                flexDirection: 'row',
              }}>
              <View
                style={[
                  this.state.SelectedTimeSlotForHomeDelivery == 0
                    ? {backgroundColor: '#ea0016'}
                    : {backgroundColor: '#efefef'},
                  ,
                  {
                    height: 20,
                    width: 20,
                    borderRadius: 360,
                    alignSelf: 'center',
                    marginLeft: 10,
                  },
                ]}
              />
              <Text
                style={[
                  this.state.SelectedTimeSlotForHomeDelivery == 0
                    ? {color: '#ea0016'}
                    : {color: 'black'},
                  {
                    alignSelf: 'center',
                    fontSize: 14,
                    paddingLeft: 15,
                  },
                ]}>
                09 AM - 11 AM
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.setState({
                SelectedTimeSlotForHomeDelivery: 1,
                hasSelectedTimeSlotForHomeDelivery: true,
              });
              // if (
              //   now < tenThirtyOClock &&
              //   this.state.selectedDeliveryDate.getDate() ===
              //     this.state.fiveDays[0].day.getDate()
              // )
              //   toast(
              //     'Store opening time is 10:30 AM, products will be deliverd Within 3 hours after the store opens',
              //   );
            }}>
            <View
              style={{
                height: 50,
                backgroundColor: 'white',
                marginTop: 1.5,
                justifyContent: 'flex-start',
                flexDirection: 'row',
              }}>
              <View
                style={[
                  this.state.SelectedTimeSlotForHomeDelivery == 1
                    ? {backgroundColor: '#ea0016'}
                    : {backgroundColor: '#efefef'},
                  ,
                  {
                    height: 20,
                    width: 20,
                    borderRadius: 360,
                    alignSelf: 'center',
                    marginLeft: 10,
                  },
                ]}
              />
              <Text
                style={[
                  this.state.SelectedTimeSlotForHomeDelivery == 1
                    ? {color: '#ea0016'}
                    : {color: 'black'},
                  {
                    alignSelf: 'center',
                    fontSize: 14,
                    paddingLeft: 15,
                  },
                ]}>
                11 AM - 01 PM
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.setState({
                SelectedTimeSlotForHomeDelivery: 2,
                hasSelectedTimeSlotForHomeDelivery: true,
              });
              // if (
              //   now < tenThirtyOClock &&
              //   this.state.selectedDeliveryDate.getDate() ===
              //     this.state.fiveDays[0].day.getDate()
              // )
              //   toast(
              //     'Store opening time is 10:30 AM, products will be deliverd Within 4 - 6 hours after the store opens',
              //   );
            }}>
            <View
              style={{
                height: 50,
                backgroundColor: 'white',
                marginTop: 1.5,
                justifyContent: 'flex-start',
                flexDirection: 'row',
              }}>
              <View
                style={[
                  this.state.SelectedTimeSlotForHomeDelivery == 2
                    ? {backgroundColor: '#ea0016'}
                    : {backgroundColor: '#efefef'},
                  ,
                  {
                    height: 20,
                    width: 20,
                    borderRadius: 360,
                    alignSelf: 'center',
                    marginLeft: 10,
                  },
                ]}
              />
              <Text
                style={[
                  this.state.SelectedTimeSlotForHomeDelivery == 2
                    ? {color: '#ea0016'}
                    : {color: 'black'},
                  {
                    alignSelf: 'center',
                    fontSize: 14,
                    paddingLeft: 15,
                  },
                ]}>
                01 PM - 03 PM
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              this.setState({
                SelectedTimeSlotForHomeDelivery: 3,
                hasSelectedTimeSlotForHomeDelivery: true,
              });
              // if (
              //   now < tenThirtyOClock &&
              //   this.state.selectedDeliveryDate.getDate() ===
              //     this.state.fiveDays[0].day.getDate()
              // )
              //   toast(
              //     'Store opening time is 10:30 AM, products will be deliverd Within 1.5 hour after the store opens',
              //   );
            }}>
            <View
              style={{
                height: 50,
                backgroundColor: 'white',
                marginTop: 1.5,
                justifyContent: 'flex-start',
                flexDirection: 'row',
              }}>
              <View
                style={[
                  this.state.SelectedTimeSlotForHomeDelivery == 3
                    ? {backgroundColor: '#ea0016'}
                    : {backgroundColor: '#efefef'},
                  ,
                  {
                    height: 20,
                    width: 20,
                    borderRadius: 360,
                    alignSelf: 'center',
                    marginLeft: 10,
                  },
                ]}
              />
              <Text
                style={[
                  this.state.SelectedTimeSlotForHomeDelivery == 3
                    ? {color: '#ea0016'}
                    : {color: 'black'},
                  {
                    alignSelf: 'center',
                    fontSize: 14,
                    paddingLeft: 15,
                  },
                ]}>
                03 PM - 05 PM
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.setState({
                SelectedTimeSlotForHomeDelivery: 4,
                hasSelectedTimeSlotForHomeDelivery: true,
              });
              // if (
              //   now < tenThirtyOClock &&
              //   this.state.selectedDeliveryDate.getDate() ===
              //     this.state.fiveDays[0].day.getDate()
              // )
              //   toast(
              //     'Store opening time is 10:30 AM, products will be deliverd Within 3 hours after the store opens',
              //   );
            }}>
            <View
              style={{
                height: 50,
                backgroundColor: 'white',
                marginTop: 1.5,
                justifyContent: 'flex-start',
                flexDirection: 'row',
              }}>
              <View
                style={[
                  this.state.SelectedTimeSlotForHomeDelivery == 4
                    ? {backgroundColor: '#ea0016'}
                    : {backgroundColor: '#efefef'},
                  ,
                  {
                    height: 20,
                    width: 20,
                    borderRadius: 360,
                    alignSelf: 'center',
                    marginLeft: 10,
                  },
                ]}
              />
              <Text
                style={[
                  this.state.SelectedTimeSlotForHomeDelivery == 4
                    ? {color: '#ea0016'}
                    : {color: 'black'},
                  {
                    alignSelf: 'center',
                    fontSize: 14,
                    paddingLeft: 15,
                  },
                ]}>
                05 PM - 07 PM
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.setState({
                SelectedTimeSlotForHomeDelivery: 5,
                hasSelectedTimeSlotForHomeDelivery: true,
              });
              // if (
              //   now < tenThirtyOClock &&
              //   this.state.selectedDeliveryDate.getDate() ===
              //     this.state.fiveDays[0].day.getDate()
              // )
              //   toast(
              //     'Store opening time is 10:30 AM, products will be deliverd Within 4 - 6 hours after the store opens',
              //   );
            }}>
            <View
              style={{
                height: 50,
                backgroundColor: 'white',
                marginTop: 1.5,
                justifyContent: 'flex-start',
                flexDirection: 'row',
              }}>
              <View
                style={[
                  this.state.SelectedTimeSlotForHomeDelivery == 5
                    ? {backgroundColor: '#ea0016'}
                    : {backgroundColor: '#efefef'},
                  ,
                  {
                    height: 20,
                    width: 20,
                    borderRadius: 360,
                    alignSelf: 'center',
                    marginLeft: 10,
                  },
                ]}
              />
              <Text
                style={[
                  this.state.SelectedTimeSlotForHomeDelivery == 5
                    ? {color: '#ea0016'}
                    : {color: 'black'},
                  {
                    alignSelf: 'center',
                    fontSize: 14,
                    paddingLeft: 15,
                  },
                ]}>
                07 PM - 09 PM
              </Text>
            </View>
          </TouchableOpacity>
        </>
      );
  };

  renderSelfPickupTimeSlots = () => {
    var nowComplete = new Date();
    var now = nowComplete.getTime();
    var currentHour = nowComplete.getHours();
    if (this.state.selectedDay === 0) {
      if (now > twentyOClock) {
        return (
          <>
            <TouchableOpacity
              onPress={() => toast('This slot is closed for today')}>
              <View
                style={{
                  height: 50,
                  backgroundColor: '#f8f8f8',
                  marginTop: 1.5,
                  justifyContent: 'flex-start',
                  flexDirection: 'row',
                }}>
                <View
                  style={[
                    this.state.SelectedTimeSlotForSelfPickup == 0
                      ? {backgroundColor: '#ea0016'}
                      : {backgroundColor: '#efefef'},
                    ,
                    {
                      height: 20,
                      width: 20,
                      borderRadius: 360,
                      alignSelf: 'center',
                      marginLeft: 10,
                    },
                  ]}
                />
                <Text
                  style={[
                    this.state.SelectedTimeSlotForSelfPickup == 0
                      ? {color: '#ea0016'}
                      : {color: 'black'},
                    {
                      alignSelf: 'center',
                      fontSize: 14,
                      paddingLeft: 15,
                    },
                  ]}>
                  Pickup after 1 hour
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => toast('This slot is closed for today')}>
              <View
                style={{
                  height: 50,
                  backgroundColor: '#f8f8f8',
                  marginTop: 1.5,
                  justifyContent: 'flex-start',
                  flexDirection: 'row',
                }}>
                <View
                  style={[
                    this.state.SelectedTimeSlotForSelfPickup == 1
                      ? {backgroundColor: '#ea0016'}
                      : {backgroundColor: '#efefef'},
                    ,
                    {
                      height: 20,
                      width: 20,
                      borderRadius: 360,
                      alignSelf: 'center',
                      marginLeft: 10,
                    },
                  ]}
                />
                <Text
                  style={[
                    this.state.SelectedTimeSlotForSelfPickup == 1
                      ? {color: '#ea0016'}
                      : {color: 'black'},
                    {
                      alignSelf: 'center',
                      fontSize: 14,
                      paddingLeft: 15,
                    },
                  ]}>
                  Pickup after 2 hours
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => toast('This slot is closed for today')}>
              <View
                style={{
                  height: 50,
                  backgroundColor: '#f8f8f8',
                  marginTop: 1.5,
                  justifyContent: 'flex-start',
                  flexDirection: 'row',
                }}>
                <View
                  style={[
                    this.state.SelectedTimeSlotForSelfPickup == 2
                      ? {backgroundColor: '#ea0016'}
                      : {backgroundColor: '#efefef'},
                    ,
                    {
                      height: 20,
                      width: 20,
                      borderRadius: 360,
                      alignSelf: 'center',
                      marginLeft: 10,
                    },
                  ]}
                />
                <Text
                  style={[
                    this.state.SelectedTimeSlotForSelfPickup == 2
                      ? {color: '#ea0016'}
                      : {color: 'black'},
                    {
                      alignSelf: 'center',
                      fontSize: 14,
                      paddingLeft: 15,
                    },
                  ]}>
                  Pickup after 4 hours or next day
                </Text>
              </View>
            </TouchableOpacity>
          </>
        );
      } else if (now > nineteenOClock) {
        return (
          <>
            <TouchableOpacity
              onPress={() => {
                this.setState({
                  SelectedTimeSlotForSelfPickup: 0,
                  hasSelectedTimeSlotForSelfPickup: true,
                });
                if (
                  now < tenThirtyOClock &&
                  this.state.selectedDeliveryDate.getDate() ===
                    this.state.fiveDays[0].day.getDate()
                )
                  toast(
                    'Store opening time is 10:30 AM, you can pick your order after 11:30 AM',
                  );
              }}>
              <View
                style={{
                  height: 50,
                  backgroundColor: 'white',
                  marginTop: 1.5,
                  justifyContent: 'flex-start',
                  flexDirection: 'row',
                }}>
                <View
                  style={[
                    this.state.SelectedTimeSlotForSelfPickup == 0
                      ? {backgroundColor: '#ea0016'}
                      : {backgroundColor: '#efefef'},
                    ,
                    {
                      height: 20,
                      width: 20,
                      borderRadius: 360,
                      alignSelf: 'center',
                      marginLeft: 10,
                    },
                  ]}
                />
                <Text
                  style={[
                    this.state.SelectedTimeSlotForSelfPickup == 0
                      ? {color: '#ea0016'}
                      : {color: 'black'},
                    {
                      alignSelf: 'center',
                      fontSize: 14,
                      paddingLeft: 15,
                    },
                  ]}>
                  Pickup after 1 hour
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => toast('This slot is closed for today')}>
              <View
                style={{
                  height: 50,
                  backgroundColor: '#f8f8f8',
                  marginTop: 1.5,
                  justifyContent: 'flex-start',
                  flexDirection: 'row',
                }}>
                <View
                  style={[
                    this.state.SelectedTimeSlotForSelfPickup == 1
                      ? {backgroundColor: '#ea0016'}
                      : {backgroundColor: '#efefef'},
                    ,
                    {
                      height: 20,
                      width: 20,
                      borderRadius: 360,
                      alignSelf: 'center',
                      marginLeft: 10,
                    },
                  ]}
                />
                <Text
                  style={[
                    this.state.SelectedTimeSlotForSelfPickup == 1
                      ? {color: '#ea0016'}
                      : {color: 'black'},
                    {
                      alignSelf: 'center',
                      fontSize: 14,
                      paddingLeft: 15,
                    },
                  ]}>
                  Pickup after 2 hours
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => toast('This slot is closed for today')}>
              <View
                style={{
                  height: 50,
                  backgroundColor: '#f8f8f8',
                  marginTop: 1.5,
                  justifyContent: 'flex-start',
                  flexDirection: 'row',
                }}>
                <View
                  style={[
                    this.state.SelectedTimeSlotForSelfPickup == 2
                      ? {backgroundColor: '#ea0016'}
                      : {backgroundColor: '#efefef'},
                    ,
                    {
                      height: 20,
                      width: 20,
                      borderRadius: 360,
                      alignSelf: 'center',
                      marginLeft: 10,
                    },
                  ]}
                />
                <Text
                  style={[
                    this.state.SelectedTimeSlotForSelfPickup == 2
                      ? {color: '#ea0016'}
                      : {color: 'black'},
                    {
                      alignSelf: 'center',
                      fontSize: 14,
                      paddingLeft: 15,
                    },
                  ]}>
                  Pickup after 4 hours or next day
                </Text>
              </View>
            </TouchableOpacity>
          </>
        );
      } else {
        return (
          <>
            <TouchableOpacity
              onPress={() => {
                this.setState({
                  SelectedTimeSlotForSelfPickup: 0,
                  hasSelectedTimeSlotForSelfPickup: true,
                });
                if (
                  now < tenThirtyOClock &&
                  this.state.selectedDeliveryDate.getDate() ===
                    this.state.fiveDays[0].day.getDate()
                )
                  toast(
                    'Store opening time is 10:30 AM, you can pick your order after 11:30 AM',
                  );
              }}>
              <View
                style={{
                  height: 50,
                  backgroundColor: 'white',
                  marginTop: 1.5,
                  justifyContent: 'flex-start',
                  flexDirection: 'row',
                }}>
                <View
                  style={[
                    this.state.SelectedTimeSlotForSelfPickup == 0
                      ? {backgroundColor: '#ea0016'}
                      : {backgroundColor: '#efefef'},
                    ,
                    {
                      height: 20,
                      width: 20,
                      borderRadius: 360,
                      alignSelf: 'center',
                      marginLeft: 10,
                    },
                  ]}
                />
                <Text
                  style={[
                    this.state.SelectedTimeSlotForSelfPickup == 0
                      ? {color: '#ea0016'}
                      : {color: 'black'},
                    {
                      alignSelf: 'center',
                      fontSize: 14,
                      paddingLeft: 15,
                    },
                  ]}>
                  Pickup after 1 hour
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.setState({
                  SelectedTimeSlotForSelfPickup: 1,
                  hasSelectedTimeSlotForSelfPickup: true,
                });
                if (
                  now < tenThirtyOClock &&
                  this.state.selectedDeliveryDate.getDate() ===
                    this.state.fiveDays[0].day.getDate()
                )
                  toast(
                    'Store opening time is 10:30 AM, you can pick your order after 12:30 AM',
                  );
              }}>
              <View
                style={{
                  height: 50,
                  backgroundColor: 'white',
                  marginTop: 1.5,
                  justifyContent: 'flex-start',
                  flexDirection: 'row',
                }}>
                <View
                  style={[
                    this.state.SelectedTimeSlotForSelfPickup == 1
                      ? {backgroundColor: '#ea0016'}
                      : {backgroundColor: '#efefef'},
                    ,
                    {
                      height: 20,
                      width: 20,
                      borderRadius: 360,
                      alignSelf: 'center',
                      marginLeft: 10,
                    },
                  ]}
                />
                <Text
                  style={[
                    this.state.SelectedTimeSlotForSelfPickup == 1
                      ? {color: '#ea0016'}
                      : {color: 'black'},
                    {
                      alignSelf: 'center',
                      fontSize: 14,
                      paddingLeft: 15,
                    },
                  ]}>
                  Pickup after 2 hours
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.setState({
                  SelectedTimeSlotForSelfPickup: 2,
                  hasSelectedTimeSlotForSelfPickup: true,
                });
                if (
                  now < tenThirtyOClock &&
                  this.state.selectedDeliveryDate.getDate() ===
                    this.state.fiveDays[0].day.getDate()
                )
                  toast(
                    'Store opening time is 10:30 AM, you can pick your order after 02:30 PM',
                  );
              }}>
              <View
                style={{
                  height: 50,
                  backgroundColor: 'white',
                  marginTop: 1.5,
                  justifyContent: 'flex-start',
                  flexDirection: 'row',
                }}>
                <View
                  style={[
                    this.state.SelectedTimeSlotForSelfPickup == 2
                      ? {backgroundColor: '#ea0016'}
                      : {backgroundColor: '#efefef'},
                    ,
                    {
                      height: 20,
                      width: 20,
                      borderRadius: 360,
                      alignSelf: 'center',
                      marginLeft: 10,
                    },
                  ]}
                />
                <Text
                  style={[
                    this.state.SelectedTimeSlotForSelfPickup == 2
                      ? {color: '#ea0016'}
                      : {color: 'black'},
                    {
                      alignSelf: 'center',
                      fontSize: 14,
                      paddingLeft: 15,
                    },
                  ]}>
                  Pickup after 4 hours or next day
                </Text>
              </View>
            </TouchableOpacity>
          </>
        );
      }
    } else
      return (
        <>
          <TouchableOpacity
            onPress={() => {
              this.setState({
                SelectedTimeSlotForSelfPickup: 0,
                hasSelectedTimeSlotForSelfPickup: true,
              });
              // if (
              //   now < tenThirtyOClock &&
              //   this.state.selectedDeliveryDate.getDate() ===
              //     this.state.fiveDays[0].day.getDate()
              // )
              // toast(
              //   'Store opening time is 10:30 AM, you can pick your order after 11:30 AM',
              // );
            }}>
            <View
              style={{
                height: 50,
                backgroundColor: 'white',
                marginTop: 1.5,
                justifyContent: 'flex-start',
                flexDirection: 'row',
              }}>
              <View
                style={[
                  this.state.SelectedTimeSlotForSelfPickup == 0
                    ? {backgroundColor: '#ea0016'}
                    : {backgroundColor: '#efefef'},
                  ,
                  {
                    height: 20,
                    width: 20,
                    borderRadius: 360,
                    alignSelf: 'center',
                    marginLeft: 10,
                  },
                ]}
              />
              <Text
                style={[
                  this.state.SelectedTimeSlotForSelfPickup == 0
                    ? {color: '#ea0016'}
                    : {color: 'black'},
                  {
                    alignSelf: 'center',
                    fontSize: 14,
                    paddingLeft: 15,
                  },
                ]}>
                )9 AM - 11 AM
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.setState({
                SelectedTimeSlotForSelfPickup: 1,
                hasSelectedTimeSlotForSelfPickup: true,
              });
              // if (
              //   now < tenThirtyOClock &&
              //   this.state.selectedDeliveryDate.getDate() ===
              //     this.state.fiveDays[0].day.getDate()
              // )
              // toast(
              //   'Store opening time is 10:30 AM, you can pick your order after 12:30 AM',
              // );
            }}>
            <View
              style={{
                height: 50,
                backgroundColor: 'white',
                marginTop: 1.5,
                justifyContent: 'flex-start',
                flexDirection: 'row',
              }}>
              <View
                style={[
                  this.state.SelectedTimeSlotForSelfPickup == 1
                    ? {backgroundColor: '#ea0016'}
                    : {backgroundColor: '#efefef'},
                  ,
                  {
                    height: 20,
                    width: 20,
                    borderRadius: 360,
                    alignSelf: 'center',
                    marginLeft: 10,
                  },
                ]}
              />
              <Text
                style={[
                  this.state.SelectedTimeSlotForSelfPickup == 1
                    ? {color: '#ea0016'}
                    : {color: 'black'},
                  {
                    alignSelf: 'center',
                    fontSize: 14,
                    paddingLeft: 15,
                  },
                ]}>
                11 AM - 01 PM
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.setState({
                SelectedTimeSlotForSelfPickup: 2,
                hasSelectedTimeSlotForSelfPickup: true,
              });
              // if (
              //   now < tenThirtyOClock &&
              //   this.state.selectedDeliveryDate.getDate() ===
              //     this.state.fiveDays[0].day.getDate()
              // )
              // toast(
              //   'Store opening time is 10:30 AM, you can pick your order after 02:30 PM',
              // );
            }}>
            <View
              style={{
                height: 50,
                backgroundColor: 'white',
                marginTop: 1.5,
                justifyContent: 'flex-start',
                flexDirection: 'row',
              }}>
              <View
                style={[
                  this.state.SelectedTimeSlotForSelfPickup == 2
                    ? {backgroundColor: '#ea0016'}
                    : {backgroundColor: '#efefef'},
                  ,
                  {
                    height: 20,
                    width: 20,
                    borderRadius: 360,
                    alignSelf: 'center',
                    marginLeft: 10,
                  },
                ]}
              />
              <Text
                style={[
                  this.state.SelectedTimeSlotForSelfPickup == 2
                    ? {color: '#ea0016'}
                    : {color: 'black'},
                  {
                    alignSelf: 'center',
                    fontSize: 14,
                    paddingLeft: 15,
                  },
                ]}>
                01 PM - 03 PM
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              this.setState({
                SelectedTimeSlotForSelfPickup: 3,
                hasSelectedTimeSlotForSelfPickup: true,
              });
              // if (
              //   now < tenThirtyOClock &&
              //   this.state.selectedDeliveryDate.getDate() ===
              //     this.state.fiveDays[0].day.getDate()
              // )
              //   toast(
              //     'Store opening time is 10:30 AM, you can pick your order after 11:30 AM',
              //   );
            }}>
            <View
              style={{
                height: 50,
                backgroundColor: 'white',
                marginTop: 1.5,
                justifyContent: 'flex-start',
                flexDirection: 'row',
              }}>
              <View
                style={[
                  this.state.SelectedTimeSlotForSelfPickup == 3
                    ? {backgroundColor: '#ea0016'}
                    : {backgroundColor: '#efefef'},
                  ,
                  {
                    height: 20,
                    width: 20,
                    borderRadius: 360,
                    alignSelf: 'center',
                    marginLeft: 10,
                  },
                ]}
              />
              <Text
                style={[
                  this.state.SelectedTimeSlotForSelfPickup == 3
                    ? {color: '#ea0016'}
                    : {color: 'black'},
                  {
                    alignSelf: 'center',
                    fontSize: 14,
                    paddingLeft: 15,
                  },
                ]}>
                03 PM - 05 PM
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.setState({
                SelectedTimeSlotForSelfPickup: 4,
                hasSelectedTimeSlotForSelfPickup: true,
              });
              // if (
              //   now < tenThirtyOClock &&
              //   this.state.selectedDeliveryDate.getDate() ===
              //     this.state.fiveDays[0].day.getDate()
              // )
              //   toast(
              //     'Store opening time is 10:30 AM, you can pick your order after 12:30 AM',
              //   );
            }}>
            <View
              style={{
                height: 50,
                backgroundColor: 'white',
                marginTop: 1.5,
                justifyContent: 'flex-start',
                flexDirection: 'row',
              }}>
              <View
                style={[
                  this.state.SelectedTimeSlotForSelfPickup == 4
                    ? {backgroundColor: '#ea0016'}
                    : {backgroundColor: '#efefef'},
                  ,
                  {
                    height: 20,
                    width: 20,
                    borderRadius: 360,
                    alignSelf: 'center',
                    marginLeft: 10,
                  },
                ]}
              />
              <Text
                style={[
                  this.state.SelectedTimeSlotForSelfPickup == 4
                    ? {color: '#ea0016'}
                    : {color: 'black'},
                  {
                    alignSelf: 'center',
                    fontSize: 14,
                    paddingLeft: 15,
                  },
                ]}>
                05 PM - 07 PM
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.setState({
                SelectedTimeSlotForSelfPickup: 5,
                hasSelectedTimeSlotForSelfPickup: true,
              });
              // if (
              //   now < tenThirtyOClock &&
              //   this.state.selectedDeliveryDate.getDate() ===
              //     this.state.fiveDays[0].day.getDate()
              // )
              //   toast(
              //     'Store opening time is 10:30 AM, you can pick your order after 02:30 PM',
              //   );
            }}>
            <View
              style={{
                height: 50,
                backgroundColor: 'white',
                marginTop: 1.5,
                justifyContent: 'flex-start',
                flexDirection: 'row',
              }}>
              <View
                style={[
                  this.state.SelectedTimeSlotForSelfPickup == 5
                    ? {backgroundColor: '#ea0016'}
                    : {backgroundColor: '#efefef'},
                  ,
                  {
                    height: 20,
                    width: 20,
                    borderRadius: 360,
                    alignSelf: 'center',
                    marginLeft: 10,
                  },
                ]}
              />
              <Text
                style={[
                  this.state.SelectedTimeSlotForSelfPickup == 5
                    ? {color: '#ea0016'}
                    : {color: 'black'},
                  {
                    alignSelf: 'center',
                    fontSize: 14,
                    paddingLeft: 15,
                  },
                ]}>
                05 PM - 07 PM
              </Text>
            </View>
          </TouchableOpacity>
        </>
      );
  };

  renderFiveDates = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          this.setState({
            selectedDay: index,
            selectedDeliveryDate: item.day,
            SelectedTimeSlotForHomeDelivery: -1,
            SelectedTimeSlotForSelfPickup: -1,
            hasSelectedTimeSlotForHomeDelivery: false,
            hasSelectedTimeSlotForSelfPickup: false,
          });
          console.log('Selected date: ', item.day);
        }}>
        <View
          style={[
            this.state.selectedDay == index
              ? {backgroundColor: '#ea0016'}
              : {backgroundColor: 'white'},
            {
              width: SCREEN_WIDTH / 5.1,
              marginRight: 1,
              height: 60,

              marginTop: 1.5,
              justifyContent: 'center',
            },
          ]}>
          <Text
            style={[
              this.state.selectedDay == index
                ? {color: 'white'}
                : {color: 'black'},
              {
                fontWeight: 'bold',
                alignSelf: 'center',
                fontSize: 16,
              },
            ]}>
            {getDay(item.day.getDay())}
          </Text>
          <Text
            style={[
              this.state.selectedDay == index
                ? {color: 'white'}
                : {color: 'black'},
              {
                alignSelf: 'center',
                fontSize: 14,
              },
            ]}>
            {item.day.getDate() + ' ' + getMonth(item.day.getMonth())}
            {/* 27 June */}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  getPromoWalletAndMainWalletBalance = async () => {
    var url = promoWalletAndMainWalletBalance(this.props.login.userId);
    this.setState({isWalletDataLoading: true});
    await Axios.get(url, {
      headers: {
        Authorization: 'bearer ' + '',
        'Content-type': 'application/json',
      },
      timeout: 15000,
    })
      .then(response => {
        console.log('All Wallet data->', response.data);
        // [0].balancePont
        this.setState({
          walletbalanncedata: response.data,
          isWalletDataLoading: false,
        });
        var promoDiscount = 0;
        if (response.data.promoWalletAmount != 0) {
          promoDiscount = Math.round(findCartTotal(this.props.cart.cart) / 20);
          this.setState({promoDiscount: promoDiscount});
        } else {
          this.setState({promoDiscount: 0});
        }
      })
      .catch(error => {
        console.log('Error', error.message);
        this.setState({isWalletDataLoading: false});
      });
  };

  deliveryOrConvineanceFeeCalculator = promoDiscount => {
    const cartTotal = findCartTotal(this.props.cart.cart);
    const deliveryDay = this.state.selectedDay;
    if (this.state.deliveryType === 0) {
      if (this.props.nearestSupplier.supplierIdWithMinDist) {
        const distance = this.props.nearestSupplier.supplierIdWithMinDist[0]
          .distance;
        const deliveryTimeSlot = this.state.SelectedTimeSlotForHomeDelivery;
        var deliveryCharge = 0;
        if (deliveryDay === 0) {
          if (distance <= 1 && deliveryTimeSlot === 0) {
            deliveryCharge = 30;
          } else if (distance > 1 && distance <= 2 && deliveryTimeSlot === 0) {
            deliveryCharge = 45;
          } else if (distance > 2 && distance <= 3 && deliveryTimeSlot === 0) {
            deliveryCharge = 60;
          } else if (distance > 3 && distance <= 4 && deliveryTimeSlot === 0) {
            deliveryCharge = 75;
          } else if (distance > 4 && distance <= 5 && deliveryTimeSlot === 0) {
            deliveryCharge = 90;
          } else if (distance > 5 && distance <= 6 && deliveryTimeSlot === 0) {
            deliveryCharge = 100;
          } else if (distance > 6 && deliveryTimeSlot === 0) {
            deliveryCharge = 150;
          } else if (distance <= 1 && deliveryTimeSlot === 1) {
            deliveryCharge = 20;
          } else if (distance > 1 && distance <= 2 && deliveryTimeSlot === 1) {
            deliveryCharge = 30;
          } else if (distance > 2 && distance <= 3 && deliveryTimeSlot === 1) {
            deliveryCharge = 40;
          } else if (distance > 3 && distance <= 4 && deliveryTimeSlot === 1) {
            deliveryCharge = 50;
          } else if (distance > 4 && distance <= 5 && deliveryTimeSlot === 1) {
            deliveryCharge = 60;
          } else if (distance > 5 && distance <= 6 && deliveryTimeSlot === 1) {
            deliveryCharge = 70;
          } else if (distance > 6 && deliveryTimeSlot === 1) {
            deliveryCharge = 100;
          } else if (distance <= 1 && deliveryTimeSlot === 2) {
            deliveryCharge = 0;
          } else if (distance > 1 && distance <= 2 && deliveryTimeSlot === 2) {
            deliveryCharge = 0;
          } else if (distance > 2 && distance <= 3 && deliveryTimeSlot === 2) {
            deliveryCharge = 0;
          } else if (distance > 3 && distance <= 4 && deliveryTimeSlot === 2) {
            deliveryCharge = 0;
          } else if (distance > 4 && distance <= 5 && deliveryTimeSlot === 2) {
            deliveryCharge = 0;
          } else if (distance > 5 && distance <= 6 && deliveryTimeSlot === 2) {
            deliveryCharge = 0;
          } else if (distance > 6 && deliveryTimeSlot === 2) {
            deliveryCharge = 15 * Math.floor(distance);
          }
        } else {
          if (distance <= 6) {
            deliveryCharge = 0;
          } else {
            deliveryCharge = 15 * Math.floor(distance);
          }
        }
        return deliveryCharge;
      } else {
        toast('Home delivery is not available on your address!!');
        this.setState({
          deliveryType: 1,
          hasSelectedTimeSlotForHomeDelivery: false,
          hasSelectedTimeSlotForSelfPickup: false,
          SelectedTimeSlotForHomeDelivery: -1,
          SelectedTimeSlotForSelfPickup: -1,
        });
        deliveryCharge = 0;
        return deliveryCharge;
      }
    } else {
      if (deliveryDay === 0) {
        const pickUpTimeSlot = this.state.SelectedTimeSlotForSelfPickup;
        var convenianceFee = 0;
        if (pickUpTimeSlot === 0) {
          var convFee1 = Math.round(cartTotal / 100);
          if (convFee1 < 30) {
            convenianceFee = 30;
          } else if (convFee1 > 100) {
            convenianceFee = 100;
          } else {
            convenianceFee = convFee1;
          }
        } else if (pickUpTimeSlot === 1) {
          var convFee2 = Math.round(cartTotal / 200);
          if (convFee2 < 20) {
            convenianceFee = 20;
          } else if (convFee2 > 100) {
            convenianceFee = 100;
          } else {
            convenianceFee = convFee2;
          }
        } else if (pickUpTimeSlot === 3) {
          convenianceFee = 0;
        }
      } else {
        convenianceFee = 0;
      }
      return convenianceFee;
    }
  };

  startRazorpay = (
    clubbedPayment,
    walletAmount,
    finalOrderAmount,
    dataToBePostedOnServer,
  ) => {
    if (clubbedPayment === 1) {
      var newAmount = finalOrderAmount - walletAmount;
      // newAmount = newAmount.toFixed(2)
      newAmount = Math.round(newAmount * 100) / 100;

      newAmount = newAmount * 100;
      var options = {
        description: 'Payment For Order',
        image: 'https://i.ibb.co/z8vLzxB/asdfa.jpg',
        currency: 'INR',
        key: 'rzp_live_SOgPs8jiYRFTOw',
        amount: newAmount,
        name: 'NEEDS Market',
        Theme: {color: '#F30'},
      };
      RazorpayCheckout.open(options)
        .then(data => {
          // handle success
          alert(`Success: ${data.razorpay_payment_id}`);
          // this.removeBalanceFromWallet(walletAmount);
          if (walletAmount != 0) {
            //post data to server
            this.postDataToServer(dataToBePostedOnServer, walletAmount);
            // this.removeBalanceFromMainWallet(
            //   walletAmount,
            //   walletAmount,
            //   dataToBePostedOnServer,
            // );
          } else {
            console.log('Posting data on server from clubbed razor payment');
            // this.postOrderDataOnServer();
          }
        })
        .catch(error => {
          // handle failure
          // console.log('error', error);
          alert(`Error: ${error.code} | ${error.description}`);
          this.setState({placeOrderModal: false});
        });
    } else {
      var newAmount = finalOrderAmount;
      newAmount = Math.round(newAmount * 100) / 100;
      newAmount = newAmount * 100;
      var options = {
        description: 'Payment For Order',
        image: 'https://i.ibb.co/z8vLzxB/asdfa.jpg',
        currency: 'INR',
        key: 'rzp_live_SOgPs8jiYRFTOw',
        amount: newAmount,
        name: 'NEEDS Market',
        Theme: {color: '#F30'},
      };
      RazorpayCheckout.open(options)
        .then(data => {
          // handle success
          alert(`Success: ${data.razorpay_payment_id}`);
          // this.postOrderDataOnServer();
          this.postDataToServer(dataToBePostedOnServer, 0);
        })
        .catch(error => {
          // handle failure
          // console.log('error', error);
          alert(`Error: ${error.code} | ${error.description}`);
        });
    }
  };

  handleWalletPayment = (finalOrderAmount, dataToBePostedOnServer) => {
    var walletAmount = 0;
    if (!this.state.isWalletDataLoading) {
      walletAmount = this.state.walletbalanncedata.walletAmount;
      if (walletAmount < finalOrderAmount) {
        Alert.alert(
          `You do not have enough wallet balance!`,
          `You have ₹ ${walletAmount} in your wallet.\nDo you want to recharge your wallet or pay the remaining amount using online payment?`,
          [
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {
              text: 'Recharge',
              onPress: () => {
                Alert.alert('Work in progress!!');
              },
            },
            {
              text: 'Online',
              onPress: () => {
                this.startRazorpay(
                  1,
                  walletAmount,
                  finalOrderAmount,
                  dataToBePostedOnServer,
                );
              },
            },
            ,
          ],
          {cancelable: false},
        );
      } else {
        this.postDataToServer(dataToBePostedOnServer, finalOrderAmount);
        //post data to server
        // this.removeBalanceFromMainWallet(
        //   walletAmount,
        //   finalOrderAmount,
        //   dataToBePostedOnServer,
        // );
      }
    }
  };

  handleOrderFinish = (
    cartTotal,
    deliveryOrConvenianceFee,
    promoDis,
    tipAmount,
  ) => {
    const discount = 0;
    const promoDiscount = promoDis;
    const deliveryDay = this.state.selectedDay;
    if (this.state.deliveryType === 0) {
      const distance = this.props.nearestSupplier.supplierIdWithMinDist[0]
        .distance;
      if (this.state.hasSelectedTimeSlotForHomeDelivery) {
        const deliveryTimeSlot = this.state.SelectedTimeSlotForHomeDelivery;
        if (distance <= 1) {
          if (cartTotal < 300) {
            toast('Minimum order amount is 300');
            return;
          }
        }
        if (distance <= 2 && distance > 1) {
          if (cartTotal < 400) {
            toast('Minimum order amount is 400');
            return;
          }
        }
        if (distance <= 3 && distance > 2) {
          if (cartTotal < 500) {
            toast('Minimum order amount is 500');
            return;
          }
        }
        if (distance <= 4 && distance > 3) {
          if (cartTotal < 600) {
            toast('Minimum order amount is 600');
            return;
          }
        }
        if (distance <= 5 && distance > 4) {
          if (cartTotal < 700) {
            toast('Minimum order amount is 700');
            return;
          }
        }
        if (distance <= 6 && distance > 5) {
          if (cartTotal < 800) {
            toast('Minimum order amount is 800');
            return;
          }
        }
        if (distance > 6) {
          if (cartTotal < 1000) {
            toast('Minimum order amount is 1000');
            return;
          }
        }
        console.log(
          'Order Success, amount to be paid===================>',
          cartTotal + deliveryOrConvenianceFee,
        );
        var timeSlot = 'Not selected time slot';
        if (this.state.SelectedTimeSlotForHomeDelivery === 0) {
          timeSlot = 'Within 1.5 Hour';
        } else if (this.state.SelectedTimeSlotForHomeDelivery === 1) {
          timeSlot = 'Within 3 Hours';
        } else if (this.state.SelectedTimeSlotForHomeDelivery === 2) {
          timeSlot = 'Within 4 - 6 Hours';
        }
        this.navigateToSuccess(
          cartTotal +
            deliveryOrConvenianceFee -
            discount -
            promoDiscount +
            tipAmount,
          new Date(),
          this.state.selectedDeliveryDate,
          this.state.paymentMode,
          discount,
          promoDiscount,
          cartTotal,
          'Home Delivery',
          timeSlot,
          this.props.addresses.selectedAddress,
          deliveryOrConvenianceFee,
        );
        console.log(
          'Order Success, amount to be paid===================>',
          cartTotal + deliveryOrConvenianceFee,
        );
      } else {
        toast('Please select a delivery time slot');
      }
    } else if (this.state.deliveryType === 1) {
      if (this.state.hasSelectedTimeSlotForSelfPickup) {
        console.log(
          'Order success amount to be paid for self pickup order ========',
          cartTotal + deliveryOrConvenianceFee,
          'Delivery date',
          this.state.selectedDeliveryDate,
        );
        var timeSlot = 'Not selected time slot';
        if (this.state.SelectedTimeSlotForSelfPickup === 0) {
          timeSlot = 'After 1 Hour';
        } else if (this.state.SelectedTimeSlotForSelfPickup === 1) {
          timeSlot = 'After 2 Hours';
        } else if (this.state.SelectedTimeSlotForSelfPickup === 2) {
          timeSlot = 'After 4 Hours or next day';
        }
        this.navigateToSuccess(
          cartTotal +
            deliveryOrConvenianceFee -
            discount -
            promoDiscount +
            tipAmount,
          new Date(),
          this.state.selectedDeliveryDate,
          this.state.paymentMode,
          discount,
          promoDiscount,
          cartTotal,
          'Self Pickup',
          timeSlot,
          this.props.addresses.selectedAddress,
          deliveryOrConvenianceFee,
        );
      } else {
        toast('Please select a pickup time slot');
        return;
      }
    }
  };

  navigateToSuccess = async (
    amountToBePaid,
    orderDate,
    deliveryDate,
    paymentMode,
    discount,
    promoDiscount,
    cartTotal,
    deliveryType,
    timeSlot,
    selectedAddress,
    deliveryOrConvenianceFee,
  ) => {
    amountToBePaid = parseInt(amountToBePaid, 10);

    var cartArray = [];
    this.props.cart.cart.map((item, index) => {
      var indexOfVariantInProductListing = 0;
      item.productListings.map((x, y) => {
        if (x.variantValues[0] === item.variantSelectedByCustome) {
          indexOfVariantInProductListing = y;
        }
      });

      var mediaUrl =
        item.medias &&
        item.medias[0] &&
        item.medias[0].mediaUrl &&
        item.medias[0].mediaUrl;

      var oneCartitemToBePosted = {
        productListingId:
          item.productListings[indexOfVariantInProductListing].id,
        productId: item.id,
        productName: item.name,
        sellingPrice: item.priceOfVariantSelectedByCustomer,
        mrp: item.productListings[indexOfVariantInProductListing].mrp,
        productDes: item.description,
        productImage: mediaUrl,
        quantity: item.productCountInCart,
        variantValues: item.variantSelectedByCustome,
        // tax: null,
        maxQuantityPerUser: item.maxOrderQty,
      };
      cartArray.push(oneCartitemToBePosted);
    });

    var timeString = '';
    if (this.state.deliveryType === 0) {
      if (this.state.SelectedTimeSlotForHomeDelivery === 0) {
        timeString = 'Within 1.5 Hour';
      }
      if (this.state.SelectedTimeSlotForHomeDelivery === 1) {
        timeString = 'Within 3 hours';
      }
      if (this.state.SelectedTimeSlotForHomeDelivery === 2) {
        timeString = 'Within 4 - 6 hours';
      }
    }
    if (this.state.deliveryType === 1) {
      if (this.state.SelectedTimeSlotForSelfPickup === 0) {
        timeString = 'After 1 Hour';
      }
      if (this.state.SelectedTimeSlotForSelfPickup === 1) {
        timeString = 'After 2 hours';
      }
      if (this.state.SelectedTimeSlotForSelfPickup === 2) {
        timeString = 'After 4 hours or next day';
      }
    }

    var body = {
      cartProductRequests: cartArray,
      paymentMode: paymentMode,
      orderAmount: amountToBePaid,
      supplier:
        this.state.deliveryType === 0
          ? this.props.nearestSupplier.supplierIdWithMinDist[0].id
          : 59,
      customer: this.props.login.userId,
      orderFrom: Platform.OS === 'ios' ? 'ios' : 'android',
      society: this.props.addresses.selectedAddress.landmark
        ? this.props.addresses.selectedAddress.landmark
        : 'Not Avaliable',

      promoWallet: promoDiscount,
      mainWallet: 0,
      // requiredTime:
      convenienceFee:
        this.state.deliveryType === 0 ? 0 : deliveryOrConvenianceFee,
      deliveryCharges:
        this.state.deliveryType === 0 ? deliveryOrConvenianceFee : 0,
      couponDiscount: 0.0,
      deliveryType:
        this.state.deliveryType === 1 ? 'SELF-PICKUP' : 'HOME-DELIVERY',
      requiredDate: deliveryDate, //doubt
      requiredTimeString: timeString,
      message: this.state.specialInstructions,
      addresses: [
        {
          addressLine1: this.props.addresses.selectedAddress.addressLine1,
          addressLine2: this.props.addresses.selectedAddress.addressLine2,
          addressState: this.props.addresses.selectedAddress.addressState,
          city: this.props.addresses.selectedAddress.city,
          country: this.props.addresses.selectedAddress.country,
          customerId: this.props.login.userId,
          customerName: this.props.user.firstName
            ? this.props.user.firstName
            : this.props.login.userId,
          landmark: this.props.addresses.selectedAddress.landmark,
          latitude: this.props.addresses.selectedAddress.latitude,
          longitude: this.props.addresses.selectedAddress.longitude,
          pincode: this.props.addresses.selectedAddress.pincode,
        },
      ],
    };

    console.log('Here is body of cart upload', body);

    if (paymentMode === 'COD') {
      console.log('placing order', paymentMode);
      Alert.alert(
        `Have you checked your order?`,
        ``,
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: 'Place Order',
            onPress: () => {
              this.postDataToServer(body, 0);
            },
          },
          ,
        ],
        {cancelable: false},
      );
    } else if (paymentMode === 'ONLINE PAYMENT') {
      this.startRazorpay(0, 0, amountToBePaid, body);
      console.log('placing order', paymentMode);
    } else if (paymentMode === 'WALLET') {
      console.log('placing order', paymentMode);
      this.handleWalletPayment(amountToBePaid, body);
    }
    console.log('placing order');
  };

  postDataToServer = async (dataToBePosted, mainWalletDeductionAmount) => {
    var updatedDAta = dataToBePosted;
    console.log('Posting this data on server', dataToBePosted);
    updatedDAta.mainWallet = mainWalletDeductionAmount;
    console.log('Here is updated data', updatedDAta);

    const url = cartPostUrl();
    console.log(url);
    this.setState({uploadingOrderDataToServer: true});

    await Axios.post(url, updatedDAta, {
      headers: {
        Authorization: 'Bearer ' + this.props.login.accessToken,
        'Content-Type': 'application/json',
      },
    })
      .then(resp => {
        console.log('Here is cart response', resp, '00000000000000000');
        this.setState({uploadingOrderDataToServer: false});
        toast(resp.data.message);
        this.props.navigation.navigate('Success', {
          orderData: updatedDAta,
          promoDiscount: this.state.promoDiscount,
          cartTotal: findCartTotal(this.props.cart.cart),
          serverResp: resp,
        });
        this.props.deleteAllItemsFromCart();
      })
      .catch(err => {
        console.log(err);
        this.setState({uploadingOrderDataToServer: false});
      });
  };

  render() {
    const deliveryOrConvineanceFee = this.deliveryOrConvineanceFeeCalculator();
    const cartTotal = findCartTotal(this.props.cart.cart);
    const tipAmount =
      this.state.tipAmount != '' ? parseInt(this.state.tipAmount) : 0;
    // const promoDiscount = this.promoDiscountCalculator(cartTotal);
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        {this.state.uploadingOrderDataToServer && (
          <View
            style={{
              position: 'absolute',
              alignSelf: 'center',
              marginTop: '35%',
              zIndex: 1000,
            }}>
            <ActivityIndicator size={25} color="#ea0016" />
          </View>
        )}
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
                flexDirection: 'row',
                alignSelf: 'center',
              }}>
              <Text
                style={{
                  fontSize: 20,
                  alignSelf: 'center',
                  paddingLeft: 10,
                }}>
                CHECKOUT
              </Text>
              <Text
                style={{
                  fontSize: 20,
                  alignSelf: 'center',
                  paddingLeft: 10,
                  color: '#7a7a7a',
                }}
              />
            </View>
          </View>

          <ScrollView
            style={{height: '92%'}}
            showsVerticalScrollIndicator={false}>
            <View
              style={{
                height: 100,
                backgroundColor: 'white',
                paddingHorizontal: 15,
                marginTop: 10,
                marginBottom: 8.5,
                paddingVertical: 10,
              }}>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <View style={{flexDirection: 'row'}}>
                  {this.props.addresses.selectedAddress.addressOf === 'Work' ? (
                    <Image
                      source={require('../assets/work.png')}
                      style={{
                        height: 20,
                        width: 20,
                        resizeMode: 'contain',
                        alignSelf: 'center',
                      }}
                    />
                  ) : null}
                  {this.props.addresses.selectedAddress.addressOf ===
                  'Office' ? (
                    <Image
                      source={require('../assets/work.png')}
                      style={{
                        height: 20,
                        width: 20,
                        resizeMode: 'contain',
                        alignSelf: 'center',
                      }}
                    />
                  ) : null}
                  {this.props.addresses.selectedAddress.addressOf === 'Home' ? (
                    <Image
                      source={require('../assets/home.png')}
                      style={{
                        height: 20,
                        width: 20,
                        resizeMode: 'contain',
                        alignSelf: 'center',
                      }}
                    />
                  ) : null}
                  {this.props.addresses.selectedAddress.addressOf ===
                  'Other' ? (
                    <Image
                      source={require('../assets/others.png')}
                      style={{
                        height: 20,
                        width: 20,
                        resizeMode: 'contain',
                        alignSelf: 'center',
                      }}
                    />
                  ) : null}
                  <Text
                    style={{
                      fontSize: 20,
                      marginLeft: 10,
                      fontWeight: 'bold',
                      alignSelf: 'center',
                    }}>
                    {this.props.addresses.selectedAddress.addressOf}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate('Address');
                  }}>
                  <View
                    style={{
                      justifyContent: 'center',
                      paddingHorizontal: 5,
                      paddingVertical: 5,
                      borderWidth: 1,
                      borderColor: '#ea0016',
                      borderRadius: 20,
                    }}>
                    <Text style={{fontSize: 10, alignSelf: 'center'}}>
                      CHANGE
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>

              <Text
                style={{
                  fontSize: 10,
                  color: '#a7a7a7',
                  marginTop: 1.5,
                  width: '70%',
                }}
                numberOfLines={6}>
                {'Custom Address :' +
                  this.props.addresses.selectedAddress.addressLine2 +
                  '\n' +
                  this.props.addresses.selectedAddress.addressState +
                  '\n' +
                  this.props.addresses.selectedAddress.pincode}
              </Text>
            </View>
            {this.state.deliveryType == 0 ? (
              <View
                style={{
                  flexDirection: 'row',
                  height: 60,
                  backgroundColor: 'white',
                  marginTop: 1.5,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <TouchableOpacity style={{alignSelf: 'center', zIndex: 10}}>
                  <View
                    style={{
                      height: 40,
                      width: SCREEN_WIDTH / 2,
                      backgroundColor: '#ea0016',
                      alignSelf: 'center',
                      borderRadius: 20,
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexDirection: 'row',
                      paddingHorizontal: 7,
                      zIndex: 10,
                    }}>
                    <View
                      style={{
                        height: 25,
                        width: 25,
                        justifyContent: 'center',
                        borderRadius: 360,
                        backgroundColor: 'white',
                        alignSelf: 'center',
                      }}>
                      <Image
                        style={{
                          height: 15,
                          width: 15,
                          resizeMode: 'contain',
                          alignSelf: 'center',
                          tintColor: '#ea0016',
                        }}
                        source={require('../assets/check.png')}
                      />
                    </View>
                    <Text
                      style={{
                        fontSize: 15,
                        alignSelf: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                      }}>
                      HOME DELIVERY
                    </Text>
                    <View />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.setState({deliveryType: 1})}
                  style={{alignSelf: 'center', zIndex: 1}}>
                  <View
                    style={{
                      height: 40,
                      width: SCREEN_WIDTH / 2,
                      backgroundColor: 'black',
                      alignSelf: 'center',
                      borderRadius: 20,
                      justifyContent: 'space-evenly',
                      alignItems: 'center',
                      flexDirection: 'row',
                      marginLeft: -50,
                    }}>
                    <View
                      style={{
                        backgroundColor: 'white',
                        alignSelf: 'center',
                      }}
                    />
                    <Text
                      style={{
                        fontSize: 10,
                        alignSelf: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                      }}>
                      SELF PICKUP
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            ) : (
              <View
                style={{
                  flexDirection: 'row',
                  height: 60,
                  backgroundColor: 'white',
                  marginTop: 1.5,
                  justifyContent: 'space-evenly',
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  onPress={() => this.setState({deliveryType: 0})}
                  style={{alignSelf: 'center', zIndex: 1}}>
                  <View
                    style={{
                      height: 40,
                      width: SCREEN_WIDTH / 2,
                      backgroundColor: 'black',
                      alignSelf: 'center',
                      borderRadius: 20,
                      justifyContent: 'space-evenly',
                      alignItems: 'center',
                      flexDirection: 'row',
                      marginRight: -50,
                    }}>
                    <Text
                      style={{
                        fontSize: 10,
                        alignSelf: 'center',
                        color: '#a7a7a7',
                        fontWeight: 'bold',
                      }}>
                      HOME DELIVERY
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={{alignSelf: 'center', zIndex: 10}}>
                  <View
                    style={{
                      height: 40,
                      width: SCREEN_WIDTH / 2,
                      backgroundColor: '#ea0016',
                      alignSelf: 'center',
                      borderRadius: 20,
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexDirection: 'row',
                      paddingHorizontal: 7,
                    }}>
                    <View
                      style={{
                        height: 25,
                        width: 25,
                        justifyContent: 'center',
                        borderRadius: 360,
                        backgroundColor: 'white',
                        alignSelf: 'center',
                      }}>
                      <Image
                        style={{
                          height: 15,
                          width: 15,
                          resizeMode: 'contain',
                          alignSelf: 'center',
                          tintColor: '#ea0016',
                        }}
                        source={require('../assets/check.png')}
                      />
                    </View>
                    <Text
                      style={{
                        fontSize: 14,
                        alignSelf: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                      }}>
                      SELF PICKUP
                    </Text>
                    <View />
                  </View>
                </TouchableOpacity>
              </View>
            )}
            <FlatList
              data={this.state.fiveDays}
              horizontal
              style={{marginTop: 10, marginBottom: 8.5}}
              extraData={this.state.deldata}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              renderItem={this.renderFiveDates}
            />

            {this.state.deliveryType === 0
              ? this.renderHomeDeliveryTimeSlots()
              : this.renderSelfPickupTimeSlots()}

            <View
              style={{
                height: 150,
                width: Dimensions.get('window').width / 1.05,
                alignSelf: 'center',
                borderRadius: 5,
                backgroundColor: '#fceae8',
                justifyContent: 'space-evenly',
                marginTop: 10,
                marginBottom: 15,
                overflow: 'hidden',
              }}>
              <View
                style={{
                  height: '70%',
                  flexDirection: 'row',
                  justifyContent: 'space-evenly',
                }}>
                <View
                  style={{
                    height: '100%',
                    width: '20%',
                    justifyContent: 'center',
                    flexDirection: 'row',
                  }}>
                  <View
                    style={{
                      height: 70,
                      width: 70,
                      borderColor: '#ea0016',
                      borderWidth: 1,
                      borderRadius: 360,
                      alignSelf: 'center',
                      marginLeft: 10,
                      overflow: 'hidden',
                    }}>
                    <Image
                      style={{
                        height: '100%',
                        width: '100%',
                        resizeMode: 'contain',
                      }}
                      source={require('../assets/courier.png')}
                    />
                  </View>
                </View>
                <View
                  style={{
                    width: '75%',
                    paddingHorizontal: 10,
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: 'sans-serif',
                      fontWeight: 'bold',
                    }}>
                    Add Tip to support your delivery Hero
                  </Text>
                  <Text
                    style={{
                      fontSize: 10,
                      fontFamily: 'sans-serif',
                      color: 'black',
                    }}>
                    Your Delivery Hero risks his life to deliver your grocery
                    safely in the times if Crises
                  </Text>
                </View>
              </View>
              <View
                style={{
                  height: '30%',
                  backgroundColor: 'white',
                  flexDirection: 'row',
                  elevation: 1,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({
                      tipAmount: '50',
                      isGivingTip: true,
                      selectedTipValue: 1,
                    });
                  }}
                  style={{
                    height: '60%',
                    width: 65,
                    borderColor: '#ea0016',
                    borderWidth: 1,
                    borderRadius: 2,
                    alignSelf: 'center',
                    justifyContent: 'center',
                    marginLeft: 20,
                    backgroundColor:
                      this.state.selectedTipValue === 1 ? '#ea0016' : '#fff',
                  }}>
                  <Text
                    style={{
                      fontSize: 15,
                      fontFamily: 'sans-serif',
                      alignSelf: 'center',
                      color:
                        this.state.selectedTipValue === 1 ? '#fff' : '#000',
                    }}>
                    Rs. 50
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({
                      tipAmount: '75',
                      isGivingTip: true,
                      selectedTipValue: 2,
                    });
                  }}
                  style={{
                    height: '60%',
                    width: 55,
                    borderColor: '#ea0016',
                    borderWidth: 1,
                    borderRadius: 2,
                    alignSelf: 'center',
                    justifyContent: 'center',
                    marginLeft: 20,
                    backgroundColor:
                      this.state.selectedTipValue === 2 ? '#ea0016' : '#fff',
                  }}>
                  <Text
                    style={{
                      fontSize: 15,
                      fontFamily: 'sans-serif',
                      alignSelf: 'center',
                      color:
                        this.state.selectedTipValue === 2 ? '#fff' : '#000',
                    }}>
                    Rs. 75
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({
                      tipAmount: '100',
                      isGivingTip: true,
                      selectedTipValue: 3,
                    });
                  }}
                  style={{
                    height: '60%',
                    width: 65,
                    borderColor: '#ea0016',
                    borderWidth: 1,
                    borderRadius: 2,
                    alignSelf: 'center',
                    justifyContent: 'center',
                    marginLeft: 20,
                    backgroundColor:
                      this.state.selectedTipValue === 3 ? '#ea0016' : '#fff',
                  }}>
                  <Text
                    style={{
                      fontSize: 15,
                      fontFamily: 'sans-serif',
                      alignSelf: 'center',
                      color:
                        this.state.selectedTipValue === 3 ? '#fff' : '#000',
                    }}>
                    Rs. 100
                  </Text>
                </TouchableOpacity>
                <View
                  style={{
                    height: '60%',
                    width: 65,
                    borderColor: '#ea0016',
                    borderWidth: 1,
                    borderRadius: 2,
                    alignSelf: 'center',
                    justifyContent: 'center',
                    marginLeft: 20,
                    backgroundColor: '#fbfbfb',
                  }}>
                  <TextInput
                    placeholder={'Amount'}
                    placeholderTextColor={'#a7a7a7'}
                    value={this.state.tipAmount}
                    keyboardType="numeric"
                    onChangeText={text => {
                      if (text.length > 0) {
                        this.setState({
                          tipAmount: text,
                          isGivingTip: true,
                          selectedTipValue: -1,
                        });
                      } else {
                        this.setState({
                          tipAmount: '',
                          isGivingTip: false,
                          selectedTipValue: -1,
                        });
                      }
                    }}
                    style={{
                      height: 50,
                      color: 'black',
                      alignSelf: 'center',
                      width: 55,
                      fontSize: 13,
                    }}
                  />
                </View>
                {this.state.tipAmount != '' ? (
                  <View style={{height: '60%'}}>
                    <Icon
                      name={'close'}
                      onPress={() =>
                        this.setState({
                          tipAmount: '',
                          selectedTipValue: -1,
                          isGivingTip: false,
                        })
                      }
                      size={15}
                      color="#ea0016"
                      style={{
                        alignSelf: 'center',
                        paddingHorizontal: 15,
                        paddingVertical: 15,
                      }}
                    />
                  </View>
                ) : null}
              </View>
            </View>

            <View
              style={{
                height: 240,
                backgroundColor: '#FFFBDE',
                // marginTop: 10,
                elevation: 1.5,
                paddingHorizontal: 23,
                justifyContent: 'space-evenly',
              }}>
              <View>
                <Text style={{fontSize: 18, fontWeight: 'bold'}}>BILLING</Text>
                <Text
                  style={{
                    fontSize: 10,
                    fontFamily: 'sans-serif-thin',
                    color: 'black',
                  }}>
                  NEEDS MARKET BILLING INFO
                </Text>
              </View>

              <View
                style={{
                  height: this.state.isGivingTip ? 140 : 120,
                  justifyContent: 'space-evenly',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={{fontSize: 14}}>Item Total</Text>
                  <Text style={{fontSize: 14}}>
                    Rs. {findCartTotal(this.props.cart.cart)}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={{fontSize: 14, color: '#EA0016'}}>
                    {this.state.deliveryType === 0
                      ? 'Delivery Fee'
                      : 'Convenience Fee'}
                  </Text>
                  <Text style={{fontSize: 14, color: '#EA0016'}}>
                    Rs. {deliveryOrConvineanceFee}
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
                        fontFamily: 'sans-serif-thin',
                        color: 'black',
                        width: '40%',
                      }}
                      numberOfLines={2}>
                      Download and Referral credits will be utilised to{`\n`}
                      give 5% discount on your orders
                    </Text>
                  </Text>
                  <Text style={{fontSize: 14}}>
                    - Rs. {this.state.promoDiscount}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    // borderBottomWidth: 1,
                    // borderBottomColor: 'white',
                    // paddingBottom: 16,
                  }}>
                  <Text style={{fontSize: 14}}>Discount</Text>
                  <Text style={{fontSize: 14}}>-Rs. 0</Text>
                </View>
                {this.state.isGivingTip && (
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      borderBottomWidth: 1,
                      borderBottomColor: 'white',
                      paddingBottom: 16,
                    }}>
                    <Text style={{fontSize: 14}}>Tip</Text>
                    <Text style={{fontSize: 14}}>
                      Rs. {this.state.tipAmount}
                    </Text>
                  </View>
                )}
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text style={{fontSize: 14, fontWeight: 'bold'}}>To Pay</Text>
                <Text style={{fontSize: 14, fontWeight: 'bold'}}>
                  Rs.{' '}
                  {cartTotal +
                    deliveryOrConvineanceFee -
                    this.state.promoDiscount +
                    tipAmount}
                </Text>
              </View>
            </View>
            <View
              style={{
                backgroundColor: '#fff',
                // marginHorizontal: 10,
                // borderRadius: 5,
                marginTop: 10,
                marginBottom:
                  this.state.specialInstructions.length > 0 ? 0 : 10,
              }}>
              <TouchableOpacity
                onPress={() => this.setState({isTemperaryModelShown1: true})}>
                <View
                  style={{
                    height: 40,
                    justifyContent: 'flex-start',
                    // backgroundColor: '#fbfbfb',
                    borderRadius: 5,
                    flexDirection: 'row',
                    width: '50%',
                    borderStyle: 'dotted',
                    // borderBottomWidth: 0.5,
                    marginTop: 1.5,
                    alignSelf: 'flex-start',
                    borderBottomColor: 'black',
                  }}>
                  <Text
                    style={{
                      color: 'black',
                      fontFamily: 'sans-serif-condensed',
                      fontSize: 12,
                      alignSelf: 'center',
                      paddingLeft: 10,
                    }}>
                    ADD SPECIAL INSTRUCTIONS
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            {this.state.specialInstructions.length > 0 && (
              <View
                style={{
                  backgroundColor: '#fbfbfb',
                  // marginHorizontal: 10,
                  borderRadius: 5,
                  marginBottom: 10,
                }}>
                <Text
                  style={{
                    color: 'black',
                    fontFamily: 'sans-serif-condensed',
                    fontSize: 13,
                    // alignSelf: 'center',
                    paddingLeft: 10,
                    paddingVertical: 10,
                  }}>
                  {this.state.specialInstructions}
                </Text>
              </View>
            )}
          </ScrollView>

          <View style={{flexDirection: 'row', height: '8%'}}>
            <View
              style={{
                width: '50%',
                backgroundColor: 'white',
                justifyContent: 'center',
                paddingLeft: 10,
              }}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    isTemperaryModelShown: !this.state.isTemperaryModelShown,
                  });
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    paddingHorizontal: 5,
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={{
                      color: 'black',
                      fontSize: 11,
                      alignSelf: 'center',
                    }}>
                    PAYMENT OPTIONS
                  </Text>
                  <Icon
                    name={'chevron-down'}
                    size={25}
                    style={{alignSelf: 'center'}}
                  />
                </View>
              </TouchableOpacity>

              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 16,
                  alignSelf: 'flex-start',
                  paddingLeft: 5,
                }}>
                {this.state.paymentMode}
              </Text>
            </View>
            <TouchableOpacity
              // onPress={() => this.props.navigation.navigate('Success')}
              onPress={() => {
                if (this.state.paymentMode === 'NOT SELECTED') {
                  toast('Please select a payment mode');
                  this.setState({
                    isTemperaryModelShown: !this.state.isTemperaryModelShown,
                  });
                } else if (this.state.isWalletDataLoading) {
                  toast('Please wait while we get your wallet info');
                  return;
                } else {
                  this.handleOrderFinish(
                    cartTotal,
                    deliveryOrConvineanceFee,
                    this.state.promoDiscount,
                    tipAmount,
                  );
                }
              }}
              style={{
                width: '50%',
                backgroundColor: '#EA0016',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  color: 'white',
                  alignSelf: 'center',
                  fontWeight: 'bold',
                  fontSize: 18,
                }}>
                FINISH ORDER
              </Text>

              <View />
            </TouchableOpacity>
          </View>
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.isTemperaryModelShown1}>
          <TouchableOpacity
            style={{flex: 3, backgroundColor: '#000', opacity: 0.2}}
            onPress={() => {
              this.setState({
                isTemperaryModelShown1: !this.state.isTemperaryModelShown1,
              });
            }}
          />
          <View
            style={{
              backgroundColor: '#fff',
              flex: 1,
              justifyContent: 'space-between',
              borderRadius: 10,
              paddingVertical: 10,
            }}>
            <View
              style={{
                height: 100,
                borderColor: '#a7a7a7',
                borderRadius: 5,
                borderWidth: 1,
                marginTop: 15,
                overflow: 'hidden',
                marginHorizontal: 10,
              }}>
              <TextInput
                style={{
                  width: SCREEN_WIDTH / 1.08,

                  overflow: 'scroll',
                  height: 100,
                }}
                numberOfLines={5}
                value={this.state.specialInstructions}
                onChangeText={text => {
                  this.setState({specialInstructions: text});
                }}
                multiline={true}
                placeholder={'Write special instructions'}
                textAlignVertical="top"
              />
            </View>
            <TouchableOpacity
              onPress={() => {
                this.setState({
                  isTemperaryModelShown1: false,
                });
              }}
              style={{
                margin: 10,
                padding: 20,
                height: 30,
                borderRadius: 10,
                justifyContent: 'center',
                borderColor: '#EA0016',
                borderWidth: 2,
              }}>
              <Text style={{alignSelf: 'center', color: '#ea0016'}}>
                SUBMIT
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.isTemperaryModelShown}>
          <TouchableOpacity
            style={{
              height: Dimensions.get('window').height / 2,
              backgroundColor: '#000',
              opacity: 0.2,
            }}
            onPress={() => {
              this.setState({
                isTemperaryModelShown: !this.state.isTemperaryModelShown,
              });
            }}
          />
          {this.state.paymentMode != 'NOT SELECTED' ? null : (
            <View
              style={{
                height: Dimensions.get('window').height / 10,
                backgroundColor: '#000',
                opacity: 0.2,
              }}
            />
          )}
          <View
            style={{
              backgroundColor: '#fff',
              height:
                this.state.paymentMode != 'NOT SELECTED'
                  ? Dimensions.get('window').height / 2
                  : Dimensions.get('window').height / 2.5,
              justifyContent: 'flex-start',
              borderRadius: 10,
              paddingVertical: 20,
            }}>
            <TouchableOpacity
              onPress={() => {
                this.setState({
                  paymentMode: 'COD',
                });
              }}
              style={{
                height: 50,
                margin: 10,
                padding: 20,
                borderRadius: 10,
                justifyContent: 'center',
                borderColor:
                  this.state.paymentMode === 'COD' ? '#EA0016' : '#aaa',

                borderWidth: 2,
              }}>
              <Text
                style={{
                  color: this.state.paymentMode === 'COD' ? '#EA0016' : '#aaa',
                }}>
                COD
              </Text>
            </TouchableOpacity>
            {this.state.paymentMode === 'COD' ? (
              <View
                style={{
                  backgroundColor: '#fff',
                  flex: 1,
                  borderRadius: 10,
                  paddingHorizontal: 10,
                }}>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    color: 'black',
                  }}>
                  Amont To be Paid : Rs.{' '}
                  {cartTotal +
                    deliveryOrConvineanceFee -
                    this.state.promoDiscount +
                    tipAmount}
                </Text>

                <Text
                  style={{
                    fontSize: 10,
                    fontWeight: 'bold',
                    color: 'darkgray',
                    paddingVertical: 10,
                  }}>
                  Place Order with Payment Mode Cash On Delivery
                </Text>

                <View
                  style={{
                    height: 50,
                    width: Dimensions.get('window').width / 1.05,
                    backgroundColor: '#EA0016',
                    alignSelf: 'center',
                    borderRadius: 5,
                    justifyContent: 'center',
                  }}>
                  <Text
                    onPress={() =>
                      this.setState({isTemperaryModelShown: false})
                    }
                    style={{
                      fontSize: 20,
                      fontWeight: 'bold',
                      alignSelf: 'center',
                      color: 'white',
                    }}>
                    PROCEED
                  </Text>
                </View>
              </View>
            ) : null}

            <TouchableOpacity
              onPress={() => {
                this.setState({
                  paymentMode: 'ONLINE PAYMENT',
                });
              }}
              style={{
                height: 50,
                margin: 10,
                padding: 20,
                borderRadius: 10,
                justifyContent: 'center',
                borderColor:
                  this.state.paymentMode === 'ONLINE PAYMENT'
                    ? '#EA0016'
                    : '#aaa',
                borderWidth: 2,
              }}>
              <Text
                style={{
                  color:
                    this.state.paymentMode === 'ONLINE PAYMENT'
                      ? '#EA0016'
                      : '#aaa',
                }}>
                ONLINE PAYMENT
              </Text>
            </TouchableOpacity>
            {this.state.paymentMode === 'ONLINE PAYMENT' ? (
              <View
                style={{
                  backgroundColor: '#fff',
                  flex: 1,
                  borderRadius: 10,
                  paddingHorizontal: 10,
                }}>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    color: 'black',
                  }}>
                  Amont To be Paid : Rs.{' '}
                  {cartTotal +
                    deliveryOrConvineanceFee -
                    this.state.promoDiscount +
                    tipAmount}
                </Text>

                <Text
                  style={{
                    fontSize: 10,
                    fontWeight: 'bold',
                    color: 'darkgray',
                    paddingVertical: 10,
                  }}>
                  Place Order with Payment Mode Online Payment
                </Text>

                <View
                  style={{
                    height: 50,
                    width: Dimensions.get('window').width / 1.05,
                    backgroundColor: '#EA0016',
                    alignSelf: 'center',
                    borderRadius: 5,
                    justifyContent: 'center',
                  }}>
                  <Text
                    onPress={() =>
                      this.setState({isTemperaryModelShown: false})
                    }
                    style={{
                      fontSize: 20,
                      fontWeight: 'bold',
                      alignSelf: 'center',
                      color: 'white',
                    }}>
                    PROCEED
                  </Text>
                </View>
              </View>
            ) : null}
            <TouchableOpacity
              onPress={() => {
                this.setState({
                  paymentMode: 'WALLET',
                });
              }}
              style={{
                height: 50,
                margin: 10,
                padding: 20,
                borderRadius: 10,
                justifyContent: 'center',

                borderColor:
                  this.state.paymentMode === 'WALLET' ? '#EA0016' : '#aaa',
                borderWidth: 2,
              }}>
              <Text
                style={{
                  color:
                    this.state.paymentMode === 'WALLET' ? '#EA0016' : '#aaa',
                }}>
                WALLET
              </Text>
            </TouchableOpacity>
            {this.state.paymentMode === 'WALLET' ? (
              <View
                style={{
                  backgroundColor: '#fff',
                  flex: 1,
                  borderRadius: 10,
                  paddingHorizontal: 10,
                }}>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    color: 'black',
                  }}>
                  Amont To be Paid : Rs.{' '}
                  {cartTotal +
                    deliveryOrConvineanceFee -
                    this.state.promoDiscount +
                    tipAmount}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: 'bold',
                    color: 'black',
                  }}>
                  Wallet Balance: Rs.{' '}
                  {this.state.walletbalanncedata.walletAmount}
                </Text>
                <Text
                  style={{
                    fontSize: 10,
                    fontWeight: 'bold',
                    color: 'darkgray',
                    paddingVertical: 5,
                  }}>
                  Place Order with Payment Mode Wallet
                </Text>

                <View
                  style={{
                    height: 50,
                    width: Dimensions.get('window').width / 1.05,
                    backgroundColor: '#EA0016',
                    alignSelf: 'center',
                    borderRadius: 5,
                    justifyContent: 'center',
                  }}>
                  <Text
                    onPress={() =>
                      this.setState({isTemperaryModelShown: false})
                    }
                    style={{
                      fontSize: 20,
                      fontWeight: 'bold',
                      alignSelf: 'center',
                      color: 'white',
                    }}>
                    PROCEED
                  </Text>
                </View>
              </View>
            ) : null}
          </View>
        </Modal>
      </SafeAreaView>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Checkout);
