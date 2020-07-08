import React from 'react';
import {
  SafeAreaView,
  Dimensions,
  ScrollView,
  View,
  Text,
  StatusBar,
  Image,
  FlatList,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Animated,
} from 'react-native';
import Ic from 'react-native-vector-icons/Fontisto';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Axios from 'axios';
import {connect} from 'react-redux';
import {userOrdersUrl} from '../../Config/Constants';
import {createStringWithAllLettersCapital, getDate} from '../Shared/functions';

const SCREEN_WIDTH = Dimensions.get('window').width;

const mapStateToProps = state => {
  return {
    cart: state.cart,
    defaultVariants: state.defaultVariants,
    login: state.login,
  };
};

class History extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOrderDetailsLoading: false,
      orderDetails: [],
      networkError: null,
      data: [
        {
          name: 'NEEDS/20-21/001',
          customAddress: 'Address 1',
          googleAddress:
            '2nd cross road, Tawarkere Main Road, Rammampa Layout,Btm Layout, Bengaluru, 560029',
        },
        {
          name: 'NEEDS/20-21/002',
          customAddress: 'Address 1',
          googleAddress:
            '2nd cross road, Tawarkere Main Road, Rammampa Layout,Btm Layout, Bengaluru, 560029',
        },
        {
          name: 'NEEDS/20-21/003',
          customAddress: 'Address 1',
          googleAddress:
            '2nd cross road, Tawarkere Main Road, Rammampa Layout,Btm Layout, Bengaluru, 560029',
        },
        {
          name: 'NEEDS/20-21/004',
          customAddress: 'Address 1',
          googleAddress:
            '2nd cross road, Tawarkere Main Road, Rammampa Layout,Btm Layout, Bengaluru, 560029',
        },
      ],
      currentPageForPagination: 1,
    };
  }

  render_History = ({item}) => {
    return (
      <View
        style={{
          backgroundColor: 'white',
          width: Dimensions.get('screen').width,
          alignSelf: 'center',
          height: 235,
          justifyContent: 'space-evenly',
          marginTop: 8,
          borderRadius: 5,
          paddingLeft: 10,
          padding: 5,
        }}>
        <View style={{flexDirection: 'row', height: '30%'}}>
          <View
            style={{
              alignSelf: 'flex-start',
              width: '70%',
              height: '90%',
            }}>
            <Text
              style={[
                {color: 'black', fontWeight: '100'},
                {fontWeight: 'bold', fontSize: 16},
              ]}>
              {item.prefix + item.id + item.suffix}
            </Text>

            <Text
              style={[{color: '#a7a7a7'}, {fontSize: 11}]}
              numberOfLines={3}>
              Google Address -{' '}
              {item.addresses[0].addressLine1 +
                ', ' +
                item.addresses[0].addressLine2 +
                ', ' +
                item.addresses[0].addressState +
                ', ' +
                item.addresses[0].pincode}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() =>
              this.props.navigation.navigate('OrderSummery', {
                orderData: item,
              })
            }>
            <View
              style={{
                flexDirection: 'row',
                paddingVertical: 2,
                alignSelf: 'center',
              }}>
              <Text
                style={{
                  fontWeight: '100',
                  borderColor: '#ea0016',
                  borderWidth: 1,
                  color: 'black',
                  alignSelf: 'center',
                  fontSize: 12,
                  paddingHorizontal: 8,
                  borderRadius: 15,
                  textAlign: 'center',
                  paddingTop: 2,
                }}>
                PRODUCTS
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View
          style={{
            height: '33%',
            borderBottomWidth: 0.5,
            borderBottomColor: '#efefef',
            justifyContent: 'center',
            flexDirection: 'row',
          }}>
          <View
            style={{
              width: '33%',
              justifyContent: 'flex-start',
              alignSelf: 'center',
            }}>
            <Text style={[{color: 'black', fontWeight: '100'}, {fontSize: 12}]}>
              PAYMENT
            </Text>
            <Text style={[{color: '#a7a7a7'}, {fontSize: 12}]}>
              {createStringWithAllLettersCapital(item.paymentMode)}
            </Text>
            <Text style={[{color: '#a7a7a7'}, {fontSize: 12}]}>{}</Text>
          </View>
          <View
            style={{
              width: '33%',
              justifyContent: 'flex-start',
              alignSelf: 'center',
            }}>
            <Text style={[{color: 'black', fontWeight: '100'}, {fontSize: 12}]}>
              TYPE
            </Text>
            <Text style={[{color: '#a7a7a7'}, {fontSize: 12}]}>
              {item.deliveryType}
            </Text>
            <Text style={[{color: '#a7a7a7'}, {fontSize: 12}]}>{}</Text>
          </View>
          <TouchableOpacity
            style={{
              width: '33%',
              justifyContent: 'flex-start',
              alignSelf: 'center',
            }}>
            <Text
              style={[{color: '#ea0016', fontWeight: '100'}, {fontSize: 12}]}>
              CANCEL ORDER
            </Text>
            <Text style={[{color: '#a7a7a7'}, {fontSize: 12}]}>{}</Text>
          </TouchableOpacity>
          {/* <View
            style={{
              width: '33%',
              justifyContent: 'flex-start',
              alignSelf: 'center',
            }}>
            <Text style={[{color: 'black', fontWeight: '100'}, {fontSize: 12}]}>
              ORDER STATUS
            </Text>
            <Text style={[{color: '#a7a7a7'}, {fontSize: 12}]}>
              {createStringWithAllLettersCapital(item.state.description)}
            </Text>
            <Text style={[{color: '#a7a7a7'}, {fontSize: 12}]}>{}</Text>
          </View> */}
        </View>
        <View
          style={{
            justifyContent: 'center',
            height: '28%',
            borderBottomColor: '#efefef',
            flexDirection: 'row',
          }}>
          <View
            style={{
              width: '33%',
              justifyContent: 'flex-start',
              alignSelf: 'center',
            }}>
            <Text style={[{color: 'black', fontWeight: '100'}, {fontSize: 12}]}>
              DATE/TIME
            </Text>
            <Text style={[{color: '#a7a7a7'}, {fontSize: 12}]}>
              {getDate(item.requiredDate)}
            </Text>
          </View>
          <View
            style={{
              width: '33%',
              justifyContent: 'flex-start',
              alignSelf: 'center',
            }}>
            <Text style={[{color: 'black', fontWeight: '100'}, {fontSize: 12}]}>
              ORDER DATE
            </Text>
            <Text style={[{color: '#a7a7a7'}, {fontSize: 12}]}>
              {getDate(item.createdDate)}
            </Text>
          </View>
          <View
            style={{
              width: '33%',
              justifyContent: 'flex-start',
              alignSelf: 'center',
            }}>
            <Text style={[{color: 'black', fontWeight: '100'}, {fontSize: 12}]}>
              AMOUNT
            </Text>
            <Text style={[{color: '#a7a7a7'}, {fontSize: 12}]}>
              Rs. {item.orderAmount}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  componentDidMount() {
    this.getOrderDetails(this.props.login.userId);
  }

  getOrderDetails = async customerId => {
    this.setState({isOrderDetailsLoading: true});
    console.log('inside get order details');

    var url = userOrdersUrl(customerId);

    await Axios.get(url, {
      headers: {
        Authorization: 'bearer ' + '',
        'Content-type': 'application/json',
      },
      timeout: 15000,
    })
      .then(response => {
        console.log('Order data->', response.data);
        this.setState({
          orderDetails: response.data,
          isOrderDetailsLoading: false,
        });
      })
      .catch(error => {
        if (!error.status) {
          this.setState({networkError: true, isOrderDetailsLoading: false});
        }
        console.log('Error', error);
      });
  };

  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <View style={{flex: 1, backgroundColor: '#efefef'}}>
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
                alignSelf: 'center',
                paddingLeft: 10,
              }}>
              My Orders
            </Text>
          </View>

          <View style={{height: '90%'}}>
            {this.state.isOrderDetailsLoading ? (
              <View>
                <Text
                  style={{
                    alignSelf: 'center',
                    marginTop: 25,
                    fontWeight: 'bold',
                    color: '#a7a7a7',
                    fontSize: 21,
                  }}>
                  Loading...
                </Text>
              </View>
            ) : this.state.orderDetails.length < 1 &&
              !this.state.isOrderDetailsLoading ? (
              <View style={{flex: 1, flexDirection: 'column'}}>
                <View style={{marginVertical: 20}}>
                  <Image
                    style={{
                      height: 200,
                      width: 200,
                      alignSelf: 'center',
                      color: '#efefef',
                    }}
                    source={require('../assets/noOrders.png')}
                  />
                </View>
                <View style={{marginVertical: 20}}>
                  <Text
                    style={{
                      alignSelf: 'center',
                      fontWeight: 'bold',
                      color: '#a7a7a7',
                      fontSize: 21,
                    }}>
                    You have not ordered anything...
                  </Text>
                </View>
                <View style={{marginVertical: 20}}>
                  <Text
                    style={{
                      alignSelf: 'center',
                      // fontWeight: 'bold',
                      color: '#a7a7a7',
                      fontSize: 15,
                    }}>
                    Check out our wide verity of products.
                  </Text>
                </View>
                <View
                  style={{marginVertical: 20, justifyContent: 'flex-start'}}>
                  <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('Home')}
                    style={{
                      alignSelf: 'center',
                      borderColor: '#ea0016',
                      borderWidth: 1,
                      padding: 10,
                      width: (SCREEN_WIDTH / 3) * 2,
                      // marginVertical: 50,
                      // marginHorizontal: 70,
                    }}>
                    <Text
                      numberOfLines={1}
                      style={{
                        color: '#ea0016',
                        fontWeight: '700',
                        alignSelf: 'center',
                      }}>
                      PLACE FIRST ORDER
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={{flex: 2}} />
              </View>
            ) : (
              <FlatList
                showsVerticalScrollIndicator={false}
                data={this.state.orderDetails.slice(0).reverse()}
                renderItem={this.render_History}
                keyExtractor={(item, index) => index.toString()}
              />
            )}
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

export default connect(mapStateToProps)(History);
