import React from 'react';

import {
  View,
  Dimensions,
  StyleSheet,
  TextInput,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
const DH = Dimensions.get('window').height;
import {getDay, getMonth} from '../Shared/functions';

export default class Buysubscription extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Days: [1, 2, 3],
      allSubCategoryProducts: [],
      scrollto: undefined,
      data2: [],
    };
  }

  componentDidMount() {
    this.sevendays = this.sevendays.bind(this);
    if (this.props.route.params.day) {
      var Dy = this.props.route.params.day;
      this.sevendays();
      this.setState({scrollto: Dy});
    }
  }
  sevendays = () => {
    var y = 0;
    var date = new Date();
    var currentdate = date.getDate();
    var currentday = date.getDay();
    if (currentday && currentdate)
      for (let index = 0; index < 7; index++) {
        let d = currentdate + index;
        let dy = currentday + index;
        if (dy > 6) {
          dy = 0 + y;
          y = y + 1;
        }
        return this.state.Days.push({date: d, day: getDay(dy)});
      }

    console.log('state------> ' + JSON.stringify(this.state.Days));
  };
  render() {
    var am = this.props.route.params.Amount;
    return (
      <View style={{flex: 1, backgroundColor: '#efefef'}}>
        <View
          style={{
            height: DH / 11,
            flexDirection: 'row',
            paddingLeft: 10,
            justifyContent: 'space-between',
            paddingRight: 10,
            backgroundColor: 'white',
          }}>
          <View
            style={{
              flexDirection: 'row',
              height: 50,
              alignSelf: 'center',
            }}>
            <TouchableWithoutFeedback
              style={{
                marginLeft: -13.5,
                marginTop: 2,
                height: 42,
                width: 42,
                borderRadius: 360,
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
                    justifyContent: 'center',
                    borderRadius: 360,
                    backgroundColor: 'white',
                    elevation: 2,
                  }}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
          <Text
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              paddingLeft: 10,
              fontSize: 20,
              alignSelf: 'center',
            }}>
            SUBSCRIPTION CHECKOUT
          </Text>
        </View>
        <View
          style={{
            height: 100,
            backgroundColor: 'white',
            paddingHorizontal: 15,
            marginTop: 10,
            marginBottom: 8.5,
            paddingVertical: 10,
          }}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={{flexDirection: 'row'}}></View>
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
                <Text style={{fontSize: 10, alignSelf: 'center'}}>CHANGE</Text>
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
            {'Custom Address :'}
          </Text>
        </View>
        <View
          style={{
            height: 60,
            paddingTop: 20,
            paddingHorizontal: 10,
            backgroundColor: 'white',
            marginTop: 10,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Text>Starting Date for Subscription :</Text>
          <Text style={{fontWeight: 'bold', color: '#ea0016'}}>
            {this.props.route.params.startDate}
            {' , '}
            {this.props.route.params.startDay}
          </Text>
        </View>
        <View
          style={{
            height: 60,
            paddingTop: 20,
            paddingHorizontal: 10,
            backgroundColor: 'white',
            marginTop: 10,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Text>Number of Days for Subscription :</Text>
          <Text style={{fontWeight: 'bold', color: '#ea0016'}}>
            {this.props.route.params.PlanDays} Days
          </Text>
        </View>
        <View
          style={{
            height: 60,
            paddingTop: 20,
            paddingHorizontal: 10,
            backgroundColor: 'white',
            marginTop: 10,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Text>Total Price To be Paid : </Text>
          <Text style={{fontWeight: 'bold', color: '#ea0016'}}>
            Rs. {this.props.route.params.Amount}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() =>
            this.props.navigation.navigate('PaymentOptions', {
              walletData: '0',
              body: '',
              amountToBePaidALongWithTip: 0,
              amountToBePaid: am,
              tipAmount: 0,
              cartTotal: 0,
              promoDiscount: 0,
            })
          }>
          <View
            style={{
              height: 45,
              borderRadius: 12,
              width: Dimensions.get('window').width / 1.5,
              alignSelf: 'center',
              backgroundColor: '#ea0016',
              marginTop: 25,
              justifyContent: 'center',
            }}>
            <Text
              style={{
                alignSelf: 'center',
                color: 'white',
                fontSize: 14,
                fontWeight: 'bold',
              }}>
              BUY SUBSCRIPTION
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}
