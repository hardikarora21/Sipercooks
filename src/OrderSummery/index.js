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
  TouchableWithoutFeedback,
  TouchableOpacity,
  Animated,
} from 'react-native';
import {findCartTotal} from '../Shared/functions';
import Ic from 'react-native-vector-icons/Fontisto';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
export default class OrderSummery extends React.Component {
  componentDidMount() {
    const {orderData} = this.props.route.params;
    console.log('OrderData from order summery screen', orderData);
  }
  render() {
    const {orderData} = this.props.route.params;

    return (
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <View
          style={{flex: 1, backgroundColor: 'white', paddingHorizontal: 10}}>
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
            <Text
              style={{
                fontSize: 20,
                color: 'black',
                paddingLeft: 10,
                fontWeight: 'bold',
                alignSelf: 'center',
              }}>
              Order Summary
            </Text>
          </View>

          <ScrollView
            style={{height: '90%', paddingHorizontal: 10}}
            showsVerticalScrollIndicator={false}>
            <View style={{height: 120, justifyContent: 'center'}}>
              <Text
                style={{
                  fontSize: 14,
                  color: 'black',

                  fontWeight: 'bold',
                }}>
                Needs/20-20/{orderData.id}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: 'black',

                  marginBottom: 10,
                }}
                numberOfLines={2}>
                {orderData.addresses[0].addressLine1 +
                  ', ' +
                  orderData.addresses[0].addressLine2 +
                  ', ' +
                  orderData.addresses[0].addressState +
                  ', ' +
                  orderData.addresses[0].pincode}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: '#a7a7a7',

                  borderTopWidth: 1,
                  borderTopColor: '#efefef',
                  paddingTop: 12,
                }}
                numberOfLines={2}>
                {orderData.state.description}
              </Text>
            </View>
            <View style={{height: 110, marginTop: 10}}>
              <View
                style={{
                  flexDirection: 'row',
                  borderBottomWidth: 1,
                  borderBottomColor: '#efefef',
                  marginBottom: 10,
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={{
                    fontSize: 15,
                    color: 'black',

                    marginVertical: 10,
                    fontWeight: 'bold',
                  }}>
                  Your Order
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: '#ea0016',
                    marginVertical: 10,
                    fontWeight: 'bold',
                    borderWidth: 1,
                    paddingHorizontal: 8,
                    paddingTop: 1.8,
                    borderRadius: 20,
                    borderColor: '#ea0016',
                  }}>
                  Mark As Favourite
                </Text>
              </View>

              {orderData.cartProductRequests.map((item, index) => {
                return (
                  <View>
                    <Text
                      style={{
                        fontSize: 15,
                        color: 'black',
                      }}>
                      {item.productListing.product.name}
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        borderBottomWidth: 1,
                        borderBottomColor: '#efefef',
                        marginBottom: 10,
                        justifyContent: 'space-between',
                      }}>
                      <Text
                        style={{
                          fontSize: 12,
                          color: 'black',
                          marginBottom: 10,
                        }}>
                        {item.quantity} x {item.sellingPrice}
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          color: 'black',
                          marginBottom: 10,
                        }}>
                        Rs.{item.sellingPrice * item.quantity}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  fontSize: 14,
                  color: 'black',
                  fontWeight: '800',
                  marginBottom: 10,
                }}>
                Item Total
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: 'black',
                  marginBottom: 10,
                }}>
                Rs.{orderData.orderAmount}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  fontSize: 12,
                  color: 'black',
                  fontWeight: 'bold',
                  marginBottom: 10,
                }}>
                PROMO CODE-{' '}
                {orderData.coupon ? orderData.coupon : 'NOT APPLIED'}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: 'black',
                  marginBottom: 10,
                }}>
                - Rs.{orderData.couponDiscount}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                //   borderBottomWidth: 1,
                //   borderBottomColor: '#efefef',
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  fontSize: 14,
                  color: 'black',
                  fontWeight: '800',
                  marginBottom: 10,
                }}>
                Dilevery Charge
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: 'black',
                  marginBottom: 10,
                }}>
                Rs.
                {orderData.deliveryCharges !== ''
                  ? orderData.deliveryCharges
                  : 0}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                borderBottomWidth: 1,
                borderBottomColor: '#efefef',
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  fontSize: 14,
                  color: 'black',
                  fontWeight: '800',
                  marginBottom: 10,
                }}>
                Restaurant Packaging Charge
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: 'black',
                  marginBottom: 10,
                }}>
                Rs.{orderData.convenienceFee}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                borderBottomWidth: 1,
                borderBottomColor: '#efefef',
                justifyContent: 'space-between',
                marginTop: 10,
              }}>
              <Text
                style={{
                  fontSize: 14,
                  color: 'black',
                  fontWeight: '800',
                  marginBottom: 10,
                }}>
                Total
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: 'black',
                  marginBottom: 10,
                }}>
                Rs.{orderData.orderAmount}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',

                justifyContent: 'space-between',
                marginTop: 10,
              }}>
              <Text
                style={{
                  fontSize: 14,
                  color: 'black',
                  fontWeight: '800',
                  marginBottom: 10,
                }}>
                Your Savings
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: 'black',
                  marginBottom: 10,
                }}>
                Rs.30.00
              </Text>
            </View>
            <View style={{height: 250, marginTop: 10}}>
              <Text
                style={{
                  fontSize: 15,
                  color: 'black',
                  borderBottomWidth: 1,
                  borderBottomColor: '#efefef',
                  paddingBottom: 10,
                  fontWeight: 'bold',
                }}>
                Order Details
              </Text>
              <Text
                style={{
                  fontSize: 10,
                  color: '#a7a7a7',
                  marginTop: 10,
                }}>
                Order Number
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: 'black',

                  marginBottom: 10,
                }}
                numberOfLines={2}>
                12345681
              </Text>
              <Text
                style={{
                  fontSize: 10,
                  color: '#a7a7a7',
                  marginTop: 10,
                }}>
                Payment
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: 'black',

                  marginBottom: 10,
                }}
                numberOfLines={2}>
                Paid Using - Paytm
              </Text>
              <Text
                style={{
                  fontSize: 10,
                  color: '#a7a7a7',
                  marginTop: 10,
                }}>
                Date
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: 'black',

                  marginBottom: 10,
                }}
                numberOfLines={2}>
                2 June 2020 | 8:00 PM
              </Text>
              <Text
                style={{
                  fontSize: 10,
                  color: '#a7a7a7',
                  marginTop: 10,
                }}>
                Phone Number
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: 'black',

                  marginBottom: 10,
                }}
                numberOfLines={2}>
                812686xxxx
              </Text>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
}
