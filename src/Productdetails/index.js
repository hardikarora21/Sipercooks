import React from 'react';
import {
  StyleSheet,
  ScrollView,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  TouchableWithoutFeedback,
  SafeAreaView,
  ToastAndroid,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {cos} from 'react-native-reanimated';
import {getProductByNameAndId} from '../../Config/Constants';
import Axios from 'axios';

import {connect} from 'react-redux';
import {
  createDefaultVariants,
  deleteAllDefaultVarinats,
  editDefaultVariant,
  addOneItemToCart,
  deleteAllItemsFromCart,
  deleteOneItemFromCart,
  increaseProductCount,
  decreaseProductCount,
} from '../Redux/Cart/ActionCreators';

const mapStateToProps = state => {
  return {
    cart: state.cart,
    defaultVariants: state.defaultVariants,
  };
};

const mapDispatchToProps = dispatch => ({
  createDefaultVariants: allProducts =>
    dispatch(createDefaultVariants(allProducts)),
  deleteAllDefaultVarinats: () => dispatch(deleteAllDefaultVarinats()),
  editDefaultVariant: (newVariant, indexOfProduct) =>
    dispatch(editDefaultVariant(newVariant, indexOfProduct)),

  addOneItemToCart: newProduct => dispatch(addOneItemToCart(newProduct)),
  deleteAllItemsFromCart: () => dispatch(deleteAllItemsFromCart()),
  deleteOneItemFromCart: index => dispatch(deleteOneItemFromCart(index)),
  increaseProductCount: (productId, variantSelectedByCustomer) =>
    dispatch(increaseProductCount(productId, variantSelectedByCustomer)),
  decreaseProductCount: (productId, variantSelectedByCustomer) =>
    dispatch(decreaseProductCount(productId, variantSelectedByCustomer)),
});

class Productdetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeProductListingArr: [],
      indexOfSelectedVariant: 0,
      product: [],
      productLoading: false,
    };
  }

  componentDidMount() {
    this.checkScreen();
  }

  checkScreen = () => {
    const {fromWhere} = this.props.route.params;
    let {product} = this.props.route.params;

    if (fromWhere === 'productListing') {
      var productListingActiveArr = [];
      product.productListings.map((item, index) => {
        if (index === 0) {
          productListingActiveArr.push({isActive: true});
        } else {
          productListingActiveArr.push({isActive: false});
        }
      });
      this.setState({
        activeProductListingArr: productListingActiveArr,
        product: product,
      });
    } else if (fromWhere === 'Search' || fromWhere === 'Cart') {
      console.log('From serach or cart');
      const productId = product.id;
      const productName = product.name;
      console.log({productId, productName});
      this.getProductUsingNameAndId(productId, productName);
    }
  };

  getProductUsingNameAndId = async (productId, productName) => {
    this.setState({productLoading: true});
    var url = getProductByNameAndId(productName, productId);

    await Axios.get(url, {
      headers: {
        Authorization: 'bearer ' + ' ',
        'Content-type': 'application/json',
      },
    })
      .then(resp => {
        console.log(
          'Product from server on product detail===>',
          resp.data.object,
        );
        var productListingActiveArr = [];
        var product = resp.data.object;
        product[0].productListings.map((item, index) => {
          if (index === 0) {
            productListingActiveArr.push({isActive: true});
          } else {
            productListingActiveArr.push({isActive: false});
          }
        });
        this.setState({
          productLoading: false,
          activeProductListingArr: productListingActiveArr,
          product: resp.data.object[0],
        });
        // this.forceUpdate();
      })
      .catch(err => {
        console.log(err.message);
      });
  };

  handlePress = indexOfVarinat => {
    console.log('Inside handle press New Active index state');
    if (this.state.activeProductListingArr.length > 0) {
      var currentActiveState = this.state.activeProductListingArr;
      var newActiveIndex = [];
      currentActiveState.map((item, index) => {
        if (index === indexOfVarinat) {
          if (currentActiveState[index].isActive) {
            this.setState({indexOfSelectedVariant: indexOfVarinat});
            newActiveIndex.push({
              isActive: currentActiveState[index].isActive,
            });
          } else {
            this.setState({indexOfSelectedVariant: indexOfVarinat});
            newActiveIndex.push({
              isActive: !currentActiveState[index].isActive,
            });
          }
        } else {
          newActiveIndex.push({isActive: false});
        }
      });
      this.setState({activeProductListingArr: newActiveIndex});
      console.log('New Active index state =====', newActiveIndex);
    } else {
      return;
    }
  };

  render() {
    const {product} = this.state;
    console.log(
      'Selected Variant =============>',
      this.state.indexOfSelectedVariant,
    );
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
              justifyContent: 'space-between',
            }}>
            <TouchableWithoutFeedback
              style={{
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
          {this.state.productLoading ? null : (
            <Image
              style={{
                height: '50%',
                resizeMode: 'contain',
                backgroundColor: 'white',
                zIndex: 1,
              }}
              source={
                product.medias &&
                product.medias[0] &&
                product.medias[0].mediaUrl
                  ? {
                      uri: product.medias[0].mediaUrl,
                    }
                  : require('../assets/foodbg.png')
              }
            />
          )}
          <ScrollView
            style={{
              marginTop: -10,
              zIndex: 5,
              backgroundColor: 'white',
            }}
            showsVerticalScrollIndicator={false}>
            <View
              style={{
                backgroundColor: '#efefef',
                borderTopLeftRadius: 25,
                borderTopRightRadius: 25,
                paddingHorizontal: 15,
                minHeight: 234,
              }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '800',
                  marginTop: 15,
                }}
                numberOfLines={1}>
                {item.name}
              </Text>

              {product.productListings &&
                product.productListings.map((item, index) => {
                  return (
                    <TouchableWithoutFeedback
                      key={index}
                      onPress={() => {
                        this.handlePress(index);
                      }}>
                      <View
                        style={[
                          this.state.activeProductListingArr.length > 0
                            ? this.state.activeProductListingArr[index].isActive
                              ? {borderColor: 'lightgreen'}
                              : {borderColor: '#e1e1e1'}
                            : null,
                          {
                            flexDirection: 'row',
                            width: Dimensions.get('window').width / 1.09,
                            marginTop: 10,
                            backgroundColor: 'white',
                            borderRadius: 5,
                            borderWidth: 1,
                            paddingHorizontal: 8,
                            paddingVertical: 8,
                            justifyContent: 'space-between',
                          },
                        ]}>
                        <Text
                          style={{
                            fontSize: 16,
                            color: '#2196f3',
                            alignSelf: 'center',
                            fontWeight: 'bold',
                          }}
                          numberOfLines={1}>
                          {item.variantValues[0]}
                        </Text>
                        <Text
                          style={{
                            fontSize: 14,
                            color: '#2196f3',
                            textDecorationLine: 'line-through',
                            fontFamily: 'sans-serif-thin',
                            alignSelf: 'center',
                          }}
                          numberOfLines={1}>
                          {'MRP Rs. ' + item.mrp}
                        </Text>
                        <Text
                          style={{
                            fontSize: 14,
                            color: '#2196f3',
                            fontWeight: 'bold',
                            alignSelf: 'center',
                          }}
                          numberOfLines={1}>
                          {'Rs. ' + item.sellingPrice}
                        </Text>

                        {this.state.activeProductListingArr.length > 0 ? (
                          this.state.activeProductListingArr[index].isActive ? (
                            <Icon
                              name={'circle-slice-8'}
                              onPress={() => {
                                this.handlePress(index);
                              }}
                              style={{alignSelf: 'center'}}
                              color={'#2196f3'}
                            />
                          ) : (
                            <Icon
                              name={'circle-outline'}
                              onPress={() => this.setState({sel: true})}
                              style={{alignSelf: 'center'}}
                            />
                          )
                        ) : null}
                      </View>
                    </TouchableWithoutFeedback>
                  );
                })}
              <Text
                style={{
                  fontSize: 11,
                  color: 'gray',
                  marginTop: 10,
                  paddingVertical: 5,
                  // alignSelf: 'center',
                  textAlign: 'justify',
                }}>
                {product.description}
              </Text>
            </View>
          </ScrollView>

          <TouchableOpacity
            onPress={() => {
              if (this.state.indexOfSelectedVariant === null) {
                ToastAndroid.showWithGravity(
                  'Please Select a variant',
                  ToastAndroid.SHORT,
                  ToastAndroid.CENTER,
                );
                return;
              }
              if (
                this.props.cart.cart.findIndex(
                  x =>
                    x.id === product.id &&
                    x.variantSelectedByCustome ===
                      product.productListings[this.state.indexOfSelectedVariant]
                        .variantValues[0],
                ) !== -1
              ) {
                return;
              }
              var currentItem = product;
              currentItem.productCountInCart = 1;
              currentItem.variantSelectedByCustome =
                product.productListings[
                  this.state.indexOfSelectedVariant
                ].variantValues[0];
              currentItem.priceOfVariantSelectedByCustomer =
                product.productListings[
                  this.state.indexOfSelectedVariant
                ].sellingPrice;
              console.log('Item to be added =====>', currentItem);
              this.props.addOneItemToCart(currentItem);
            }}
            style={{
              zIndex: 10,
              backgroundColor: 'white',
              width: '76%',
              height: '8%',
              alignSelf: 'center',
              borderRadius: 20,
              borderTopRightRadius: 5,
              overflow: 'hidden',
              justifyContent: 'space-evenly',
              marginVertical: 10,
              borderWidth: 2,
              borderColor: '#2196f3',
              flexDirection: 'row',
            }}>
            <View
              style={{
                backgroundColor: '#2196f3',
                width: '100%',
                height: '100%',
                alignSelf: 'center',
                justifyContent: 'space-evenly',
                flexDirection: 'row',
              }}>
              {this.props.cart.cart.findIndex(
                x =>
                  x.id === product.id &&
                  x.variantSelectedByCustome ===
                    product.productListings[this.state.indexOfSelectedVariant]
                      .variantValues[0],
              ) === -1 ? (
                <Text
                  style={{
                    fontSize: 14,
                    color: 'white',
                    alignSelf: 'center',
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}
                  numberOfLines={1}>
                  Add To Cart
                </Text>
              ) : (
                <View
                  style={{
                    height: 30,
                    width: 80,
                    borderRadius: 8,
                    backgroundColor: '#8fcdff',
                    justifyContent: 'space-between',
                    overflow: 'hidden',
                    borderWidth: 1,
                    borderColor: 'white',
                    flexDirection: 'row',
                    alignSelf: 'center',
                  }}>
                  <Icon
                    name={'minus'}
                    style={{
                      alignSelf: 'center',
                      backgroundColor: '#2196f3',
                      height: 35,
                      width: 20,
                      paddingVertical: 10,
                      paddingLeft: 3,
                    }}
                    color={'white'}
                    size={15}
                    onPress={() =>
                      this.props.decreaseProductCount(
                        product.id,
                        product.productListings[
                          this.state.indexOfSelectedVariant
                        ].variantValues[0],
                      )
                    }
                  />
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
                            x.id === product.id &&
                            x.variantSelectedByCustome ===
                              product.productListings[
                                this.state.indexOfSelectedVariant
                              ].variantValues[0],
                        )
                      ].productCountInCart
                    }
                  </Text>
                  <Icon
                    onPress={() =>
                      this.props.increaseProductCount(
                        product.id,
                        product.productListings[
                          this.state.indexOfSelectedVariant
                        ].variantValues[0],
                      )
                    }
                    name={'plus'}
                    style={{
                      alignSelf: 'center',
                      backgroundColor: '#2196f3',
                      height: 35,
                      width: 20,
                      paddingVertical: 10,
                      paddingLeft: 3,
                    }}
                    color={'white'}
                    size={15}
                  />
                </View>
              )}
              <View
                style={{
                  height: '80%',
                  width: 55,
                  alignSelf: 'center',
                  backgroundColor: 'white',
                  justifyContent: 'center',
                  borderTopRightRadius: 5,
                  borderTopLeftRadius: 20,
                  borderBottomLeftRadius: 20,
                  borderBottomRightRadius: 20,
                }}>
                {this.state.addit == false || this.state.value < 1 ? (
                  <Image
                    style={{
                      height: 25,
                      width: 25,
                      alignSelf: 'center',
                      resizeMode: 'contain',
                      tintColor: '#2196f3',
                      backgroundColor: 'white',
                      padding: 10,
                    }}
                    source={require('../assets/p1.png')}
                  />
                ) : (
                  <Image
                    style={{
                      height: 25,
                      width: 25,
                      alignSelf: 'center',
                      resizeMode: 'contain',
                      tintColor: '#2196f3',
                      backgroundColor: 'white',
                      padding: 10,
                    }}
                    source={require('../assets/wishlist.png')}
                  />
                )}
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Productdetails);
