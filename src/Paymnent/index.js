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
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {FlatList} from 'react-native-gesture-handler';

import {
  getMonth,
  getDay,
  getCurrentTimeinHours,
  findCartTotal,
} from '../Shared/functions';

import {connect} from 'react-redux';

import {
  editDefaultVariant,
  deleteAllItemsFromCart,
  deleteOneItemFromCart,
  increaseProductCount,
  decreaseProductCount,
} from '../Redux/Cart/ActionCreators';

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
const nineOClock = startOfDay.getTime() + 9 * 60 * 60 * 1000;
const twentyOClock = startOfDay.getTime() + 20 * 60 * 60 * 1000;
const nineteenOClock = startOfDay.getTime() + 19 * 60 * 60 * 1000;
const nineteenThirtyOClock = startOfDay.getTime() + 19.5 * 60 * 60 * 1000;
const eighteenOClock = startOfDay.getTime() + 18 * 60 * 60 * 1000;
const fifteenOClock = startOfDay.getTime() + 15 * 60 * 60 * 1000;
const twentyOneOClock = startOfDay.getTime() + 21.5 * 60 * 60 * 1000;

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

const mapDispatchToProps = dispatch => ({});

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
      modelText: '',
      isTemperaryModelShown1: false,
    };
  }

  componentDidMount() {
    console.log(
      'HEar is the nearest supplier =========',
      JSON.stringify(this.props.nearestSupplier.supplierIdWithMinDist),
    );

    console.log('Here is now', new Date().getTime());
    console.log('Here is startOfDay', startOfDay);
    console.log('Here is nineOClock', nineOClock);
    console.log('Here is twentyOClock', twentyOClock);
    console.log('Here is nineteenOClock', nineteenOClock);
    console.log('Here is nineteenThirtyOClock', nineteenThirtyOClock);
    console.log('Here is eighteenOClock', eighteenOClock);
    console.log('Here is fifteenOClock', fifteenOClock);
    console.log('Here is twentyOneOClock', twentyOneOClock);
    console.log('User data', this.props.user);
  }

  renderHomeDeliveryTimeSlots = () => {
    var now = new Date().getTime();
    if (this.state.selectedDay === 0) {
      if (now < nineOClock || now > nineteenThirtyOClock) {
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
      } else if (now < nineOClock || now > eighteenOClock) {
        return (
          <>
            <TouchableOpacity
              onPress={() =>
                this.setState({
                  SelectedTimeSlotForHomeDelivery: 0,
                  hasSelectedTimeSlotForHomeDelivery: true,
                })
              }>
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
      } else if (now < nineOClock || now > fifteenOClock) {
        return (
          <>
            <TouchableOpacity
              onPress={() =>
                this.setState({
                  SelectedTimeSlotForHomeDelivery: 0,
                  hasSelectedTimeSlotForHomeDelivery: true,
                })
              }>
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
              onPress={() =>
                this.setState({
                  SelectedTimeSlotForHomeDelivery: 1,
                  hasSelectedTimeSlotForHomeDelivery: true,
                })
              }>
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
              onPress={() =>
                this.setState({
                  SelectedTimeSlotForHomeDelivery: 0,
                  hasSelectedTimeSlotForHomeDelivery: true,
                })
              }>
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
              onPress={() =>
                this.setState({
                  SelectedTimeSlotForHomeDelivery: 1,
                  hasSelectedTimeSlotForHomeDelivery: true,
                })
              }>
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
              onPress={() =>
                this.setState({
                  SelectedTimeSlotForHomeDelivery: 2,
                  hasSelectedTimeSlotForHomeDelivery: true,
                })
              }>
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
            onPress={() =>
              this.setState({
                SelectedTimeSlotForHomeDelivery: 0,
                hasSelectedTimeSlotForHomeDelivery: true,
              })
            }>
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
            onPress={() =>
              this.setState({
                SelectedTimeSlotForHomeDelivery: 1,
                hasSelectedTimeSlotForHomeDelivery: true,
              })
            }>
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
            onPress={() =>
              this.setState({
                SelectedTimeSlotForHomeDelivery: 2,
                hasSelectedTimeSlotForHomeDelivery: true,
              })
            }>
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
  };

  renderSelfPickupTimeSlots = () => {
    var now = new Date().getTime();
    if (this.state.selectedDay === 0) {
      if (now < nineOClock || now > twentyOClock) {
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
      } else if (now < nineOClock || now > nineteenOClock) {
        return (
          <>
            <TouchableOpacity
              onPress={() =>
                this.setState({
                  SelectedTimeSlotForSelfPickup: 0,
                  hasSelectedTimeSlotForSelfPickup: true,
                })
              }>
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
        // if (now < nineOClock || now > fifteenOClock)
        return (
          <>
            <TouchableOpacity
              onPress={() =>
                this.setState({
                  SelectedTimeSlotForSelfPickup: 0,
                  hasSelectedTimeSlotForSelfPickup: true,
                })
              }>
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
              onPress={() =>
                this.setState({
                  SelectedTimeSlotForSelfPickup: 1,
                  hasSelectedTimeSlotForSelfPickup: true,
                })
              }>
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
              onPress={() =>
                this.setState({
                  SelectedTimeSlotForSelfPickup: 2,
                  hasSelectedTimeSlotForSelfPickup: true,
                })
              }>
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
            onPress={() =>
              this.setState({
                SelectedTimeSlotForSelfPickup: 0,
                hasSelectedTimeSlotForSelfPickup: true,
              })
            }>
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
            onPress={() =>
              this.setState({
                SelectedTimeSlotForSelfPickup: 1,
                hasSelectedTimeSlotForSelfPickup: true,
              })
            }>
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
            onPress={() =>
              this.setState({
                SelectedTimeSlotForSelfPickup: 2,
                hasSelectedTimeSlotForSelfPickup: true,
              })
            }>
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

  deliveryOrConvineanceFeeCalculator = () => {
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
          convenianceFee = Math.round(cartTotal / 100);
        } else if (pickUpTimeSlot === 1) {
          convenianceFee = Math.round(cartTotal / 200);
        } else if (pickUpTimeSlot === 3) {
          convenianceFee = 0;
        }
      } else {
        convenianceFee = 0;
      }
      return convenianceFee;
    }
  };

  navigateToSuccess = (
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
  ) => {
    console.log({
      orderAmount: amountToBePaid,
      orderDate: orderDate,
      deliveryDate: deliveryDate,
      cartData: this.props.cart.cart,
      paymentMode: paymentMode,
      discount: discount,
      promoDiscount: promoDiscount,
      cartTotalAmount: cartTotal,
      deliveryOrPickup: deliveryType,
      selectedTimeSlot: timeSlot,
      deliveryAddress: selectedAddress,
      specialInstructions: this.state.specialInstructions,
    });
    this.setState({
      modelText: {
        orderAmount: amountToBePaid,
        orderDate: orderDate,
        deliveryDate: deliveryDate,
        paymentMode: paymentMode,
        discount: discount,
        promoDiscount: promoDiscount,
        cartTotalAmount: cartTotal,
        deliveryOrPickup: deliveryType,
        selectedTimeSlot: timeSlot,
        specialInstructions: this.state.specialInstructions,
        deliveryAddress: selectedAddress,
        cartData: this.props.cart.cart,
      },
      // isTemperaryModelShown: true,
    });
    // this.props.navigation.navigate('Success', {
    //   orderAmount: amountToBePaid,
    //   orderDate: orderDate,
    //   deliveryDate: deliveryDate,
    //   cartData: this.props.cart.cart,
    //   paymentMode: paymentMode,
    //   discount: discount,
    //   promoDiscount: promoDiscount,
    //   cartTotalAmount: cartTotal,
    //   deliveryOrPickup: '',
    //   selectedTimeSlot: '',
    //   deliveryAddress: '',
    //   specialInstructions: this.state.specialInstructions,
    // });
  };

  handleOrderFinish = (cartTotal, deliveryOrConvenianceFee) => {
    const discount = 0;
    const promoDiscount = 0;
    const deliveryDay = this.state.selectedDay;
    if (this.state.deliveryType === 0) {
      const distance = this.props.nearestSupplier.supplierIdWithMinDist[0]
        .distance;
      if (this.state.hasSelectedTimeSlotForHomeDelivery) {
        const deliveryTimeSlot = this.state.SelectedTimeSlotForHomeDelivery;
        if (distance <= 1) {
          if (cartTotal - discount - promoDiscount < 300) {
            toast('Minimum order amount is 300');
            return;
          }
        }
        if (distance <= 2 && distance > 1) {
          if (cartTotal - discount - promoDiscount < 400) {
            toast('Minimum order amount is 400');
            return;
          }
        }
        if (distance <= 3 && distance > 2) {
          if (cartTotal - discount - promoDiscount < 500) {
            toast('Minimum order amount is 500');
            return;
          }
        }
        if (distance <= 4 && distance > 3) {
          if (cartTotal - discount - promoDiscount < 600) {
            toast('Minimum order amount is 600');
            return;
          }
        }
        if (distance <= 5 && distance > 4) {
          if (cartTotal - discount - promoDiscount < 700) {
            toast('Minimum order amount is 700');
            return;
          }
        }
        if (distance <= 6 && distance > 5) {
          if (cartTotal - discount - promoDiscount < 800) {
            toast('Minimum order amount is 800');
            return;
          }
        }
        if (distance > 6) {
          if (cartTotal - discount - promoDiscount < 1000) {
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
          cartTotal + deliveryOrConvenianceFee - discount - promoDiscount,
          new Date(),
          this.state.selectedDeliveryDate,
          this.state.paymentMode,
          discount,
          promoDiscount,
          cartTotal,
          'Home Delivery',
          timeSlot,
          this.props.addresses.selectedAddress,
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
          cartTotal + deliveryOrConvenianceFee - discount - promoDiscount,
          new Date(),
          this.state.selectedDeliveryDate,
          this.state.paymentMode,
          discount,
          promoDiscount,
          cartTotal,
          'Self Pickup',
          timeSlot,
          this.props.addresses.selectedAddress,
        );
      } else {
        toast('Please select a pickup time slot');
        return;
      }
    }
  };

  render() {
    const deliveryOrConvineanceFee = this.deliveryOrConvineanceFeeCalculator();
    const cartTotal = findCartTotal(this.props.cart.cart);
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
                height: 150,
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
              <TouchableOpacity
                onPress={() => this.setState({isTemperaryModelShown1: true})}>
                <View
                  style={{
                    height: 40,
                    justifyContent: 'flex-start',
                    backgroundColor: '#fbfbfb',
                    borderRadius: 5,
                    flexDirection: 'row',
                    width: '50%',
                    borderStyle: 'dotted',
                    borderBottomWidth: 0.5,
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
                      paddingLeft: 2,
                    }}>
                    ADD SPECIAL INSTRUCTIONS
                  </Text>
                </View>
              </TouchableOpacity>

              {/* <View
                style={{
                  height: 70,
                  borderColor: '#a7a7a7',
                  borderRadius: 5,
                  borderWidth: 1,
                  marginTop: 15,
                  overflow: 'scroll',
                }}>
                <TextInput
                  style={{
                    width: SCREEN_WIDTH / 1.08,
                    height: 70,

                    overflow: 'visible',
                    alignSelf: 'flex-start',
                  }}
                  numberOfLines={5}
                  value={this.state.specialInstructions}
                  onChangeText={text => {
                    this.setState({specialInstructions: text});
                  }}
                  multiline={true}
                  placeholder={'Write special instructions'}
                />
              </View> */}
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
                    <View></View>
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
                    <View></View>
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
                height: 240,
                backgroundColor: '#FFFBDE',
                marginTop: 10,
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

              <View style={{height: 120, justifyContent: 'space-evenly'}}>
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
                  <Text style={{fontSize: 14}}>- Rs. 0</Text>
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
                  Rs. {cartTotal + deliveryOrConvineanceFee}
                </Text>
              </View>
            </View>
            
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
                } else {
                  this.handleOrderFinish(cartTotal, deliveryOrConvineanceFee);
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
            style={{flex: 3, backgroundColor: '#000', opacity: 0.2}}
            onPress={() => {
              this.setState({
                isTemperaryModelShown: !this.state.isTemperaryModelShown,
              });
            }}
          />
          <View
            style={{
              backgroundColor: '#fff',
              flex: 1,
              justifyContent: 'flex-end',
              borderRadius: 10,
              paddingVertical: 20,
            }}>
            <TouchableOpacity
              onPress={() => {
                this.setState({
                  paymentMode: 'COD',
                  isTemperaryModelShown: false,
                });
              }}
              style={{
                flex: 1,
                margin: 10,
                padding: 20,
                borderRadius: 10,
                justifyContent: 'center',
                borderColor:
                  this.state.paymentMode === 'COD' ? '#EA0016' : '#aaa',
                borderWidth: 2,
              }}>
              <Text>COD</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.setState({
                  paymentMode: 'ONLINE PAYMENT',
                  isTemperaryModelShown: false,
                });
              }}
              style={{
                flex: 1,
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
              <Text>ONLINE PAYMENT</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.setState({
                  paymentMode: 'WALLET',
                  isTemperaryModelShown: false,
                });
              }}
              style={{
                flex: 1,
                margin: 10,
                padding: 20,
                borderRadius: 10,
                justifyContent: 'center',
                borderColor:
                  this.state.paymentMode === 'WALLET' ? '#EA0016' : '#aaa',
                borderWidth: 2,
              }}>
              <Text>WALLET</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </SafeAreaView>
    );
  }
}

export default connect(mapStateToProps)(Checkout);
