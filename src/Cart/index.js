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
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {FlatList} from 'react-native-gesture-handler';

import {findCartTotal} from '../Shared/functions';

import {connect} from 'react-redux';

import {
  editDefaultVariant,
  deleteAllItemsFromCart,
  deleteOneItemFromCart,
  increaseProductCount,
  decreaseProductCount,
} from '../Redux/Cart/ActionCreators';
import {logOut} from '../Redux/Auth/ActionCreatore';

const SCREEN_WIDTH = Dimensions.get('window').width;

const mapStateToProps = state => {
  return {
    cart: state.cart,
    defaultVariants: state.defaultVariants,
    login: state.login,
    addresses: state.addresses,
  };
};

const mapDispatchToProps = dispatch => ({
  editDefaultVariant: (newVariant, indexOfProduct) =>
    dispatch(editDefaultVariant(newVariant, indexOfProduct)),

  deleteAllItemsFromCart: () => dispatch(deleteAllItemsFromCart()),
  deleteOneItemFromCart: index => dispatch(deleteOneItemFromCart(index)),
  increaseProductCount: (productId, variantSelectedByCustomer) =>
    dispatch(increaseProductCount(productId, variantSelectedByCustomer)),
  decreaseProductCount: (productId, variantSelectedByCustomer) =>
    dispatch(decreaseProductCount(productId, variantSelectedByCustomer)),
  logOut: () => dispatch(logOut()),
});

class Cart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addit: true,
      value: 1,
      sel: false,
    };
  }

  componentDidMount() {}

  render_CartData = ({item, index, separators}) => {
    return (
      <View
        style={{
          backgroundColor: 'white',
          height: 105,
          borderTopWidth: 1,
          borderTopColor: '#efefef',
          flexDirection: 'row',
        }}>
        <View style={{width: '30%', justifyContent: 'center', height: '100%'}}>
          <Image
            style={{
              height: '80%',
              width: '80%',
              resizeMode: 'cover',
              alignSelf: 'center',
              borderRadius: 5,
            }}
            source={
              item.medias && item.medias[0] && item.medias[0].mediaUrl
                ? {
                    // uri: item.productListings[0].medias[0].mediaUrl,
                    uri: item.medias[0].mediaUrl,
                  }
                : require('../assets/foodbg.png')
            }
          />
        </View>
        <View
          style={{
            width: '70%',
            height: '100%',
            justifyContent: 'space-evenly',
          }}>
          {item.brand ? (
            <Text
              style={{
                color: 'white',

                fontSize: 8,
                backgroundColor: '#e0848e',
                width: '23%',
                textAlign: 'center',
                borderRadius: 20,
                paddingHorizontal: 8,
                paddingTop: 3.6,
                paddingBottom: 3.6,
                lineHeight: 9,
              }}>
              {item.brand}
            </Text>
          ) : (
            <Text
              style={{
                color: 'white',

                fontSize: 8,
                width: '23%',
                textAlign: 'center',
                borderRadius: 20,
                paddingHorizontal: 8,
                paddingTop: 3.6,
                paddingBottom: 3.6,
                lineHeight: 9,
              }}></Text>
          )}
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate('Productdetails', {
                fromWhere: 'Cart',
                product: {
                  id: item.id,
                  name: item.name,
                },
              });
            }}>
            <Text style={{fontSize: 12, fontWeight: 'bold', marginTop: -10}}>
              {item.product && item.product.name
                ? item.product.name
                : item.name}{' '}
            </Text>
          </TouchableOpacity>
          <View
            style={{
              flexDirection: 'row',
              paddingRight: 23,
              justifyContent: 'space-between',
            }}>
            <View style={{flexDirection: 'row'}}>
              <Text
                style={{
                  fontSize: 14,
                  color: '#EA0016',
                  fontWeight: 'bold',
                  alignSelf: 'center',
                }}
                numberOfLines={1}>
                Rs.
                {item &&
                item.productListings &&
                item.productListings[0].sellingPrice
                  ? item.productListings[0].sellingPrice
                  : item.sellingPrice}
                {'   '}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: '#EA0016',
                  fontFamily: 'sans-serif-thin',
                  alignSelf: 'center',
                }}
                numberOfLines={1}>
                [
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: '#EA0016',
                  textDecorationLine: 'line-through',
                  fontFamily: 'sans-serif-thin',
                  alignSelf: 'center',
                }}
                numberOfLines={1}>
                MRP. Rs.
                {item && item.productListings && item.productListings[0].mrp
                  ? item.productListings[0].mrp
                  : item.mrp}{' '}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: '#EA0016',
                  fontFamily: 'sans-serif-thin',
                  alignSelf: 'center',
                }}
                numberOfLines={1}>
                ]
              </Text>
            </View>
            <View>
              <View
                style={{
                  width: 80,
                  height: 28,
                  overflow: 'hidden',
                  borderWidth: 1,
                  borderColor: '#e1e1e1',
                  flexDirection: 'row',
                }}>
                <TouchableOpacity
                  onPress={() =>
                    this.props.decreaseProductCount(
                      item.id,
                      item.variantSelectedByCustome,
                    )
                  }>
                  <Icon
                    name={'minus'}
                    style={{
                      alignSelf: 'center',
                      height: 28,
                      width: 20,
                      paddingVertical: 7,
                      paddingLeft: 3,
                    }}
                    color={'#EA0016'}
                    size={15}
                  />
                </TouchableOpacity>
                <Text
                  style={{
                    textAlign: 'center',
                    width: 40,
                    alignSelf: 'center',
                    fontWeight: 'bold',
                  }}>
                  {
                    this.props.cart.cart[
                      this.props.cart.cart.findIndex(
                        x =>
                          x.id === item.id &&
                          x.variantSelectedByCustome ===
                            item.variantSelectedByCustome,
                      )
                    ].productCountInCart
                  }
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    this.props.increaseProductCount(
                      item.id,
                      item.variantSelectedByCustome,
                    )
                  }>
                  <Icon
                    name={'plus'}
                    style={{
                      alignSelf: 'center',
                      height: 28,
                      width: 20,
                      paddingLeft: 1.5,
                      paddingVertical: 7,
                    }}
                    color={'#EA0016'}
                    size={15}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };
  render() {
    const {navigation} = this.props;
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
                CART -
              </Text>
              <Text
                style={{
                  fontSize: 20,
                  alignSelf: 'center',
                  paddingLeft: 10,
                  color: '#7a7a7a',
                }}>
                (
                {this.props.cart.cart.length > 0
                  ? this.props.cart.cart.length + ' ' + 'ITEMS'
                  : 'EMPTY'}
                )
              </Text>
            </View>
          </View>

          <ScrollView
            style={{height: '92%'}}
            showsVerticalScrollIndicator={false}>
            <FlatList
              style={{marginTop: 0}}
              data={this.props.cart.cart}
              renderItem={this.render_CartData}
              keyExtractor={(item, index) => index.toString()}
            />
            {this.props.cart.cart.length > 0 ? (
              <></>
            ) : (
              <View style={{flex: 1, flexDirection: 'column'}}>
                <View style={{marginVertical: 20}}>
                  <Image
                    style={{
                      height: 200,
                      width: 200,
                      alignSelf: 'center',
                      color: '#efefef',
                    }}
                    source={require('../assets/empty.png')}
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
                    Cart Empty
                  </Text>
                </View>
                <View style={{marginVertical: 20}}>
                  <Text
                    style={{
                      alignSelf: 'center',
                      color: '#a7a7a7',
                      fontSize: 15,
                    }}>
                    Check out our wide verity of products.
                  </Text>
                </View>
                <View style={{marginVertical: 20, width: SCREEN_WIDTH}}>
                  <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('Home')}
                    style={{
                      borderColor: '#ea0016',
                      borderWidth: 1,
                      padding: 10,
                      marginHorizontal: 70,
                    }}>
                    <Text
                      style={{
                        color: '#ea0016',
                        fontWeight: '700',
                        alignSelf: 'center',
                      }}>
                      BROWSE PRODUCTS
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </ScrollView>

          {this.props.cart.cart.length < 1 ? null : (
            <View style={{flexDirection: 'row', height: '8%'}}>
              <View
                style={{
                  width: '50%',
                  backgroundColor: 'white',
                  justifyContent: 'center',
                  paddingLeft: 10,
                }}>
                <Text
                  style={{
                    color: 'black',
                    fontSize: 11,
                  }}>
                  Amount to be paid
                </Text>
                <Text style={{fontWeight: 'bold', fontSize: 16}}>
                  Rs. {findCartTotal(this.props.cart.cart)}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  if (this.props.login.loginSuccess) {
                    if (this.props.addresses.selectedAddress) {
                      this.props.navigation.navigate('Checkout');
                    } else {
                      Alert.alert(
                        'Please select a delivery address!',
                        'You can access the checkout screen after selecting an address.',
                        [
                          {
                            text: 'Cancel',
                            onPress: () => console.log('Cancel Pressed'),
                            style: 'cancel',
                          },
                          {
                            text: 'Select Address',
                            onPress: () => {
                              this.props.navigation.navigate('Address');
                            },
                          },
                        ],
                        {cancelable: false},
                      );
                    }
                  } else {
                    Alert.alert(
                      'You are not logged in.',
                      'Please login to add a delivery address.',
                      [
                        {
                          text: 'Cancel',
                          onPress: () => console.log('Cancel Pressed'),
                          style: 'cancel',
                        },
                        {
                          text: 'Login now',
                          onPress: () => {
                            this.props.logOut();
                          },
                        },
                      ],
                      {cancelable: false},
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
                  CHECKOUT
                </Text>

                <View />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </SafeAreaView>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
