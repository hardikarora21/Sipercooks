import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  Image,
  TextInput,
  FlatList,
  Picker,
  RefreshControl,
  Modal,
  ToastAndroid,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ico from 'react-native-vector-icons/MaterialIcons';
import ParallaxHeader from './ParallexHeader';
import Axios from 'axios';
import LoadingView from './LoadingView';
import {createStringWithFirstLetterCapital} from '../Shared/functions';

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
import {
  fetchSubSubCategoriesUrl,
  fetchSubCategoryProductsUrl,
  fetchSubSubCategoryProductsUrl,
} from '../../Config/Constants';

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

  addOneItemToCart: (newProduct, first) =>
    dispatch(addOneItemToCart(newProduct, first)),
  deleteAllItemsFromCart: () => dispatch(deleteAllItemsFromCart()),
  deleteOneItemFromCart: index => dispatch(deleteOneItemFromCart(index)),
  increaseProductCount: (productId, variantSelectedByCustomer) =>
    dispatch(increaseProductCount(productId, variantSelectedByCustomer)),
  decreaseProductCount: (productId, variantSelectedByCustomer) =>
    dispatch(decreaseProductCount(productId, variantSelectedByCustomer)),
});

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;
const IS_IPHONE_X = SCREEN_HEIGHT === 812 || SCREEN_HEIGHT === 896;
const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? (IS_IPHONE_X ? 44 : 20) : 0;
const HEADER_HEIGHT = Platform.OS === 'ios' ? (IS_IPHONE_X ? 88 : 64) : 64;
const NAV_BAR_HEIGHT = HEADER_HEIGHT - STATUS_BAR_HEIGHT;

class Productlisting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      filterModalVisible: false,
      firstRun: true,
      subSubCategoryIndex: -1,
      subSubCategories: [],
      subSubCategoriesLoading: false,
      allSubCategoryProductsLoading: false,
      isPaginating: false,
      allSubCategoryProducts: [], //this holds all products form a subcategory
      currentPageForPagination: 1,
      fetchingAll: false, //this state check if the data being fetched is all products in a subCategory or products of a subSubCategory
      currentSubSubCategoryId: 0, //this holda the subSubCategoryId for the subSubCategory which is selected in sliding tabs panel
      datasub: [],
    };
  }

  componentDidMount() {
    // console.log('Current Variants', this.props.variants.variants);
    const {subcatid} = this.props.route.params.catsup;
    if (this.props.route.params.catsup) {
      var id = this.props.route.params.catsup;
      this.fetchSubSubCategories(id);
      this.fetchAllProductsInThisSubcategory(id, 0);
      Axios.get(
        'http://ec2-3-7-159-160.ap-south-1.compute.amazonaws.com/api/v3/stores/subscription/package/supplier/' +
          id,
      )
        .then(response => {
          console.log('CategoryCategory', response);
          this.setState({datasub: response.data.object});

          // return response;
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  }

  componentWillUnmount() {
    this.props.deleteAllDefaultVarinats();
  }

  // function to fetch subSubCategories from server it takes subCategory id which is passed from the homecomponent dropdownItems as a prarmeter to the route.
  fetchSubSubCategories = async subCatId => {
    var url = fetchSubSubCategoriesUrl(subCatId);

    this.setState({subSubCategoriesLoading: true, fetchingAll: true}),
      await Axios.get(url, {
        headers: {
          Authorization: 'bearer ' + ' ',
          'Content-type': 'application/json',
        },
      })
        .then(response => {
          console.log(
            ' Sub sub cat from server on prodictlisting',
            response.data.object,
          );
          this.setState({
            subSubCategoriesLoading: false,
            subSubCategories: response.data.object,
          });
        })
        .catch(err => {
          this.setState({subSubCategoriesLoading: false});
          console.log(err);
        });
  };

  fetchAllProductsInThisSubcategory = async (subCatId, pageNum, num) => {
    var url = fetchSubCategoryProductsUrl(pageNum, subCatId);

    if (this.state.firstRun) {
      this.setState({firstRun: false});
      this.props.deleteAllDefaultVarinats();
    }

    num === 1
      ? this.setState({allSubCategoryProductsLoading: true})
      : this.setState({isPaginating: true}),
      await Axios.get(
        'http://ec2-3-7-159-160.ap-south-1.compute.amazonaws.com/api/v3/stores/products/supplier/' +
          subCatId,
        {
          headers: {
            Authorization: 'bearer ' + ' ',
            'Content-type': 'application/json',
          },
        },
      )
        .then(response => {
          console.log(
            ' SubSubCategory products from server on prodictlisting',
            response.data.object,
          );
          this.setState({
            allSubCategoryProductsLoading: false,
            isPaginating: false,
            allSubCategoryProducts: [
              ...this.state.allSubCategoryProducts,
              ...response.data.object,
            ],
            // productsList: response.data.object,
          });

          this.props.createDefaultVariants(response.data.object);
        })
        .catch(err => {
          this.setState({allSubCategoryProductsLoading: false});
          console.log(err);
        });
  };
  fetchAllProductsInThisSubcategory1 = async (subCatId, pageNum) => {
    var url = fetchSubCategoryProductsUrl(pageNum, subCatId);

    if (this.state.firstRun) {
      this.setState({firstRun: false});
      this.props.deleteAllDefaultVarinats();
    }

    pageNum === 1
      ? this.setState({allSubCategoryProductsLoading: true})
      : this.setState({isPaginating: true}),
      await Axios.get(
        'http://ec2-3-7-159-160.ap-south-1.compute.amazonaws.com/api/v3/stores/products/supplier/' +
          subCatId +
          '?categoryId=' +
          pageNum,
        {
          headers: {
            Authorization: 'bearer ' + ' ',
            'Content-type': 'application/json',
          },
        },
      )
        .then(response => {
          console.log(
            ' SubSubCategory products from server on prodictlisting',
            response.data.object,
          );
          this.setState({
            allSubCategoryProductsLoading: false,
            isPaginating: false,
            allSubCategoryProducts: [
              ...this.state.allSubCategoryProducts,
              ...response.data.object,
            ],
            // productsList: response.data.object,
          });

          this.props.createDefaultVariants(response.data.object);
        })
        .catch(err => {
          this.setState({allSubCategoryProductsLoading: false});
          console.log(err);
        });
  };

  fetchProductsFromThisSubSubcategory = async (
    subSubCatId,
    subCatId,
    pageNum,
  ) => {
    var url = fetchSubSubCategoryProductsUrl(pageNum, subCatId, subSubCatId);
    this.setState({currentSubSubCategoryId: subSubCatId});

    pageNum === 1
      ? this.setState({allSubCategoryProductsLoading: true})
      : this.setState({isPaginating: true}),
      await Axios.get(url, {
        headers: {
          Authorization: 'bearer ' + ' ',
          'Content-type': 'application/json',
        },
      })
        .then(response => {
          console.log(
            ' SubSubCategory products from server on prodictlisting',
            response.data.object,
          );
          this.setState({
            allSubCategoryProductsLoading: false,
            isPaginating: false,
            allSubCategoryProducts: [
              ...this.state.allSubCategoryProducts,
              ...response.data.object,
            ],
            // productsList: response.data.object,
          });
          this.props.createDefaultVariants(response.data.object);
        })
        .catch(err => {
          this.setState({allSubCategoryProductsLoading: false});
          console.log(err);
        });
  };

  setSubSubCategoryIndex = index => {
    this.setState({subSubCategoryIndex: index});
  };

  renderStickyHeader = () => {
    return (
      <View style={{flex: 1, height: 40}}>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          // showsVerticalScrollIndicator={false}
          // style={{maxHeight: '100%'}}
        >
          <TouchableOpacity
            onPress={() => {
              this.setSubSubCategoryIndex(-1);
              this.setState({
                fetchingAll: true,
                currentPageForPagination: 1,
                allSubCategoryProducts: [],
              });

              const {subcatid} = this.props.route.params.catsup;
              this.props.deleteAllDefaultVarinats();
              this.fetchAllProductsInThisSubcategory1(
                this.props.route.params.catsup,
                '',
              );
            }}
            style={{
              borderBottomColor:
                this.state.subSubCategoryIndex === -1 ? '#EA0016' : '#fff',
              borderBottomWidth: 3,
              maxHeight: 40,
            }}>
            <View style={styles.tabStyle}>
              <Text
                style={{
                  color:
                    this.state.subSubCategoryIndex === -1 ? '#EA0016' : '#000',
                  fontWeight: '700',
                  fontSize: 12,
                  paddingVertical: 10,
                  paddingHorizontal: 15,
                }}>
                ALL
              </Text>
            </View>
          </TouchableOpacity>
          {this.state.subSubCategoriesLoading
            ? [1, 2, 3, 4, 5].map((item, index) => {
                return (
                  <View
                    key={index}
                    style={[
                      styles.tabStyle,
                      {
                        maxHeight: 30,
                        minWidth: 70,
                        marginHorizontal: 10,
                        backgroundColor: '#efefef',
                      },
                    ]}
                  />
                );
              })
            : this.state.subSubCategories.map((item, index) => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      const {subcatid} = this.props.route.params;
                      this.setSubSubCategoryIndex(index);
                      this.setState({
                        fetchingAll: false,
                        currentPageForPagination: 1,
                        allSubCategoryProducts: [],
                      });
                      this.props.deleteAllDefaultVarinats();
                      this.fetchAllProductsInThisSubcategory1(
                        this.props.route.params.catsup,
                        item.id,
                        0,
                      );
                    }}
                    style={{
                      borderBottomColor:
                        this.state.subSubCategoryIndex === index
                          ? '#EA0016'
                          : '#fff',
                      borderBottomWidth: 3,
                      maxHeight: 40,
                    }}>
                    <View key={index} style={styles.tabStyle}>
                      <Text
                        style={{
                          color:
                            this.state.subSubCategoryIndex === index
                              ? '#EA0016'
                              : '#000',
                          fontWeight: '700',
                          fontSize: 12,
                          paddingVertical: 10,
                          paddingHorizontal: 15,
                        }}>
                        {item.name}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
        </ScrollView>
      </View>
    );
  };

  renderContent = () => {
    return (
      <>
        <View
          style={{
            backgroundColor: '#efefef',
            minHeight: '81%',
          }}>
          {this.state.allSubCategoryProductsLoading ? (
            <LoadingView viewType="manyView" />
          ) : this.state.allSubCategoryProducts.length > 0 ? (
            <>
              <FlatList
                style={{paddingTop: 10}}
                data={this.state.allSubCategoryProducts}
                showsVerticalScrollIndicator={false}
                // refreshControl={
                //   <RefreshControl
                //     progressBackgroundColor="#EA0016"
                //     colors={['#fff']}
                //     refreshing={this.state.allSubCategoryProductsLoading}
                //     onRefresh={() => {
                //       this.setState({
                //         currentPageForPagination: 1,
                //         allSubCategoryProducts: [],
                //       });
                //       const {subcatid} = this.props.route.params;

                //       if (this.state.fetchingAll) {
                //         // this.setSubSubCategoryIndex(-1);
                //         this.setState({
                //           fetchingAll: true,
                //         });
                //         this.fetchAllProductsInThisSubcategory(subcatid, 1);
                //       } else {
                //         this.setState({
                //           fetchingAll: false,
                //         });
                //         this.fetchProductsFromThisSubSubcategory(
                //           this.state.currentSubSubCategoryId,
                //           subcatid,
                //           1,
                //         );
                //       }
                //     }}
                //   />
                // }
                progressViewOffset={80}
                numColumns={2}
                progressBackgroundColor="#EA0016"
                colors={['#fff']}
                onEndReached={() => {
                  const {subcatid} = this.props.route.params;
                  this.state.fetchingAll
                    ? this.fetchAllProductsInThisSubcategory(
                        subcatid,
                        this.state.currentPageForPagination + 1,
                      )
                    : this.fetchProductsFromThisSubSubcategory(
                        this.state.currentSubSubCategoryId,
                        subcatid,
                        this.state.currentPageForPagination + 1,
                      );
                  this.setState({
                    currentPageForPagination:
                      this.state.currentPageForPagination + 1,
                  });
                }}
                onEndReachedThreshold={0.3}
                renderItem={({item, index}) => (
                  <View
                    style={{
                      height: 230,
                      backgroundColor: 'white',
                      paddingBottom: 10,
                      borderRadius: 8,
                      marginBottom: 2,
                      borderRadius: 5,
                      width: Dimensions.get('window').width / 2 - 15,
                      marginLeft: 10,
                      marginTop: 10,
                      elevation: 2,
                      overflow: 'hidden',
                    }}>
                    <TouchableWithoutFeedback onPress={() => {}}>
                      <View
                        style={{
                          height: 130,
                          width: '100%',
                          overflow: 'hidden',
                        }}>
                        <Image
                          style={{
                            height: '100%',
                            width: '100%',
                            resizeMode: 'cover',
                            alignSelf: 'center',
                            zIndex: 1,
                          }}
                          source={
                            item &&
                            item.productListings &&
                            item.productListings[0].medias[0]
                              ? {
                                  uri:
                                    item.productListings[0].medias[0].mediaUrl,
                                }
                              : require('../assets/foodbg.png')
                          }
                        />
                      </View>
                    </TouchableWithoutFeedback>

                    {item.productListings[0].sellingPrice -
                      item.productListings[0].mrp <
                    0 ? (
                      <View
                        style={{
                          height: 17,
                          borderTopRightRadius: 2,
                          borderBottomRightRadius: 2,
                          width: '52%',
                          zIndex: 10,

                          position: 'absolute',
                          backgroundColor: 'black',
                          marginTop: 18,
                          justifyContent: 'center',
                        }}>
                        <Text
                          style={{
                            fontSize: 10,
                            alignSelf: 'center',
                            color: 'white',
                          }}
                          numberOfLines={1}>
                          Rs.{' '}
                          {item.productListings[0].mrp -
                            item.productListings[0].sellingPrice}{' '}
                          OFF
                        </Text>
                      </View>
                    ) : null}
                    <View
                      style={{
                        width: '96%',
                        justifyContent: 'space-between',
                        height: 60,
                      }}>
                      <Text
                        style={{
                          fontSize: 14,
                          paddingTop: 15,
                          fontWeight: 'bold',
                          paddingLeft: 8,
                        }}
                        numberOfLines={1}>
                        {item.product && item.product.name
                          ? item.product.name.toUpperCase()
                          : item.name.toUpperCase()}
                      </Text>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignSelf: 'center',
                          justifyContent: 'space-between',
                          width: '96%',
                          marginTop: 10,
                        }}>
                        <View style={{alignSelf: 'center', marginLeft: 5}}>
                          <Text
                            style={{
                              fontSize: 15,
                              fontWeight: 'bold',
                              alignSelf: 'center',
                            }}>
                            Rs.{' '}
                            {item &&
                            item.productListings &&
                            item.productListings[0].sellingPrice
                              ? parseInt(item.productListings[0].sellingPrice)
                              : item.sellingPrice}
                          </Text>
                          {item &&
                          item.productListings &&
                          item.productListings[0].sellingPrice -
                            item.productListings[0].mrp <
                            0 ? (
                            <Text
                              style={{
                                fontSize: 8.5,
                                color: '#a7a7a7',
                              }}>
                              MRP{' '}
                              <Text
                                style={{
                                  fontSize: 8.5,
                                  textDecorationLine: 'line-through',
                                  color: '#a7a7a7',
                                }}
                                numberOfLines={1}>
                                Rs.{' '}
                                {item &&
                                item.productListings &&
                                item.productListings[0].sellingPrice -
                                  item.productListings[0].mrp <
                                  0
                                  ? parseInt(item.productListings[0].mrp)
                                  : ''}
                              </Text>
                            </Text>
                          ) : null}

                          {/* <Image
                    style={{height: 20, width: 20}}
                    source={require('../assets/wishlist.png')}
                  /> */}
                        </View>
                        {this.props.cart.cart.findIndex(
                          x =>
                            x.id === item.id &&
                            x.variantSelectedByCustome ===
                              this.props.defaultVariants.defaultVariants[index],
                        ) === -1 ? (
                          <TouchableOpacity
                            onPress={() => {
                              var cartLength = this.props.cart.cart.length;
                              var currentItem = item;
                              currentItem.productCountInCart = 1;
                              currentItem.variantSelectedByCustome = this.props.defaultVariants.defaultVariants[
                                index
                              ];
                              // currentItem.priceOfVariantSelectedByCustomer =
                              //   item.productListings.findIndex(
                              //     x =>
                              //       x.variantValues[0] ===
                              //       this.props.defaultVariants.defaultVariants[
                              //         index
                              //       ],
                              //   ) === -1
                              //     ? item.productListings[0].sellingPrice
                              //     : item.productListings[
                              //         item.productListings.findIndex(
                              //           x =>
                              //             x.variantValues[0] ===
                              //             this.props.defaultVariants
                              //               .defaultVariants[index],
                              //         )
                              //       ].sellingPrice;

                              this.props.addOneItemToCart(
                                currentItem,
                                cartLength > 0
                                  ? this.props.cart.cart[0]
                                  : 'Empty',
                              );
                            }}>
                            <Text
                              style={{
                                borderWidth: 1,
                                paddingHorizontal: 18,
                                paddingVertical: 4,
                                borderColor: '#e1e1e1',
                                fontSize: 12,
                                fontWeight: 'bold',
                              }}>
                              ADD
                            </Text>
                          </TouchableOpacity>
                        ) : (
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
                                  this.props.defaultVariants.defaultVariants[
                                    index
                                  ],
                                )
                              }>
                              <Icon
                                name={'minus'}
                                style={{
                                  alignSelf: 'center',
                                  height: 25,
                                  width: 20,
                                  paddingVertical: 4,
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
                                        this.props.defaultVariants
                                          .defaultVariants[index],
                                  )
                                ].productCountInCart
                              }
                            </Text>
                            <TouchableOpacity
                              onPress={() =>
                                this.props.increaseProductCount(
                                  item.id,
                                  this.props.defaultVariants.defaultVariants[
                                    index
                                  ],
                                )
                              }>
                              <Icon
                                name={'plus'}
                                style={{
                                  alignSelf: 'center',
                                  height: 25,
                                  width: 20,
                                  paddingLeft: 1.5,
                                  paddingVertical: 5,
                                }}
                                color={'#EA0016'}
                                size={15}
                              />
                            </TouchableOpacity>
                          </View>
                        )}
                      </View>
                    </View>
                  </View>
                )}
                keyExtractor={(item, index) => index.toString()}
              />
              {/* {this.state.isPaginating &&
                this.state.currentPageForPagination > 1 && (
                  <LoadingView viewType="oneView" />
                )} */}
            </>
          ) : (
            <Text
              style={{
                alignSelf: 'center',
                marginTop: 25,
                fontWeight: 'bold',
                color: '#a7a7a7',
                fontSize: 21,
              }}>
              No Product Available
            </Text>
          )}
          {}
        </View>
        <Modal
          visible={this.state.filterModalVisible}
          animationType={'slide'}
          transparent={true}>
          <View
            style={{
              backgroundColor: 'transparent',
              flex: 1,
              justifyContent: 'flex-end',
            }}>
            <TouchableOpacity
              style={{
                opacity: 0.5,
                backgroundColor: 'black',
                height: Dimensions.get('window').height / 0.5,
              }}
              onPress={() => this.setState({showmodal: false})}>
              <View
                style={{
                  opacity: 0.5,
                  backgroundColor: 'black',
                  height: Dimensions.get('window').height / 0.5,
                }}
              />
            </TouchableOpacity>

            <View
              style={{
                backgroundColor: '#efefef',
                height: Dimensions.get('window').height / 1.5,
              }}>
              <View style={{height: '90%'}}>
                {this.state.filterDropdown == false ? (
                  <View
                    style={{
                      marginTop: 10,
                      borderRadius: 5,
                      marginHorizontal: 10,
                      paddingHorizontal: 23,
                      backgroundColor: 'white',
                      height: 65,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <View style={{alignSelf: 'center'}}>
                      <Text style={{fontSize: 18, fontWeight: 'bold'}}>
                        Discount
                      </Text>
                      <Text
                        style={{
                          fontSize: 10,
                          fontFamily: 'sans-serif-thin',
                          color: 'black',
                        }}>
                        Grocery Store or Grocery Shop as Retail
                      </Text>
                    </View>
                    <Icon
                      onPress={() => this.setState({filterDropdown: true})}
                      name={'chevron-down'}
                      style={{alignSelf: 'center'}}
                      size={28}
                    />
                  </View>
                ) : (
                  <View
                    style={{
                      height: 190,
                      backgroundColor: '#FFFBDE',
                      marginTop: 15,

                      elevation: 1.5,
                      marginHorizontal: 10,
                      borderRadius: 5,
                      paddingHorizontal: 23,
                      justifyContent: 'space-evenly',
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        height: 65,
                      }}>
                      <View style={{alignSelf: 'center'}}>
                        <Text style={{fontSize: 18, fontWeight: 'bold'}}>
                          DISCOUNT
                        </Text>
                        <Text
                          style={{
                            fontSize: 10,
                            fontFamily: 'sans-serif-thin',
                            color: 'black',
                          }}>
                          Grocery Store or Grocery Shop as Retail
                        </Text>
                      </View>
                      <Icon
                        onPress={() => this.setState({filterDropdown: false})}
                        name={'chevron-up'}
                        style={{alignSelf: 'center'}}
                        size={28}
                      />
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        width: '100%',
                        justifyContent: 'space-between',
                      }}>
                      <Text style={{fontSize: 14}}>10% Discount</Text>
                      <Icon
                        style={{alignSelf: 'center'}}
                        name={'checkbox-marked'}
                        color={'#EA0016'}
                        size={15}
                      />
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        width: '100%',
                        justifyContent: 'space-between',
                      }}>
                      <Text style={{fontSize: 14}}>20% Discount</Text>
                      <Icon
                        style={{alignSelf: 'center'}}
                        name={'checkbox-blank-outline'}
                        color={'#EA0016'}
                        size={15}
                      />
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        width: '100%',
                        justifyContent: 'space-between',
                      }}>
                      <Text style={{fontSize: 14}}>30% Discount</Text>
                      <Icon
                        style={{alignSelf: 'center'}}
                        name={'checkbox-blank-outline'}
                        color={'#EA0016'}
                        size={15}
                      />
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        width: '100%',
                        justifyContent: 'space-between',
                      }}>
                      <Text style={{fontSize: 14}}>40% Discount</Text>
                      <Icon
                        style={{
                          alignSelf: 'center',
                          overflow: 'hidden',
                        }}
                        name={'checkbox-blank-outline'}
                        color={'#EA0016'}
                        size={15}
                      />
                    </View>
                  </View>
                )}
                <View
                  style={{
                    marginTop: 10,
                    borderRadius: 5,
                    marginHorizontal: 10,
                    paddingHorizontal: 23,
                    backgroundColor: 'white',
                    height: 65,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <View style={{alignSelf: 'center'}}>
                    <Text style={{fontSize: 18, fontWeight: 'bold'}}>
                      Brand
                    </Text>
                    <Text
                      style={{
                        fontSize: 10,
                        fontFamily: 'sans-serif-thin',
                        color: 'black',
                      }}>
                      Grocery Store or Grocery Shop as Retail
                    </Text>
                  </View>
                  <Icon
                    name={'chevron-down'}
                    style={{alignSelf: 'center'}}
                    size={28}
                  />
                </View>
                <View
                  style={{
                    marginTop: 10,
                    borderRadius: 5,
                    marginHorizontal: 10,
                    paddingHorizontal: 23,
                    backgroundColor: 'white',
                    height: 65,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <View style={{alignSelf: 'center'}}>
                    <Text style={{fontSize: 18, fontWeight: 'bold'}}>
                      Price
                    </Text>
                    <Text
                      style={{
                        fontSize: 10,
                        fontFamily: 'sans-serif-thin',
                        color: 'black',
                      }}>
                      Grocery Store or Grocery Shop as Retail
                    </Text>
                  </View>
                  <Icon
                    name={'chevron-down'}
                    style={{alignSelf: 'center'}}
                    size={28}
                  />
                </View>
              </View>

              <View
                style={{
                  height: '10%',
                  backgroundColor: 'white',
                  elevation: 5,
                  flexDirection: 'row',
                  justifyContent: 'space-evenly',
                }}>
                <View
                  style={{
                    height: '60%',
                    borderWidth: 1,
                    borderColor: '#EA0016',
                    flexDirection: 'row',
                    width: 80,
                    justifyContent: 'space-evenly',
                    backgroundColor: '#efefef',
                    borderRadius: 50,
                    paddingHorizontal: 10,
                    alignSelf: 'center',
                  }}>
                  <Icon
                    name="reload"
                    size={15}
                    style={{alignSelf: 'center'}}
                    color="black"
                  />
                  <Text
                    onPress={() => this.setState({filterModalVisible: false})}
                    style={{
                      fontSize: 10,
                      fontWeight: 'bold',
                      alignSelf: 'center',
                    }}>
                    RESET
                  </Text>
                </View>
                <View
                  style={{
                    height: '60%',
                    borderWidth: 1,
                    borderColor: '#EA0016',
                    flexDirection: 'row',
                    width: 80,
                    justifyContent: 'space-evenly',
                    backgroundColor: '#efefef',
                    borderRadius: 50,
                    paddingHorizontal: 10,
                    alignSelf: 'center',
                  }}>
                  <Icon
                    name="login-variant"
                    size={15}
                    style={{alignSelf: 'center'}}
                    color="black"
                  />
                  <Text
                    onPress={() => this.setState({filterModalVisible: false})}
                    style={{
                      fontSize: 10,
                      fontWeight: 'bold',
                      alignSelf: 'center',
                    }}>
                    APPLY
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </>
    );
  };

  renderHeader = subcategoryName => {
    return (
      <View style={{flex: 1, flexDirection: 'column', paddingTop: 10}}>
        <View style={styles.header}>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <TouchableWithoutFeedback
              style={styles.goBackTouchable}
              onPress={() => this.props.navigation.goBack()}>
              <View style={styles.goBackView}>
                <Image
                  source={require('../assets/a1.png')}
                  style={styles.goBackImage}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
          <View style={{flex: 6}}>
            <Text numberOfLines={1} style={styles.headerTitle}>
              {'      '} {this.props.route.params.catname}
            </Text>
          </View>
          <View style={{flex: 3}}>
            {this.state.datasub.length > 0 ? (
              <TouchableWithoutFeedback
                style={{}}
                onPress={() =>
                  this.props.navigation.navigate('Subscription', {
                    cat_name: this.props.route.params.catname,
                    ca_id: this.props.route.params.catsup,
                  })
                }>
                <View
                  style={{
                    borderWidth: 1,
                    paddingHorizontal: 5,
                    justifyContent: 'center',
                    borderRadius: 10,
                    borderColor: 'blue',
                    alignSelf: 'center',
                    marginTop: 5,
                  }}>
                  <Text
                    style={{fontSize: 12, alignSelf: 'center', color: 'blue'}}>
                    Subscription
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            ) : null}
            {/* <TouchableOpacity
              onPress={() => this.setState({filterModalVisible: true})}
              style={{alignSelf: 'center', height: 25, width: 25}}> */}

            {/* </TouchableOpacity> */}
          </View>
        </View>
        <View
          style={{flex: 1, marginHorizontal: (SCREEN_WIDTH / 40) * 2}}></View>
        <View
          style={{
            justifyContent: 'space-between',
            height: 80,
            width: Dimensions.get('window').width,
            marginLeft: 10,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingRight: 10,
            }}>
            {/* <View
              style={{
                borderWidth: 1,
                justifyContent: 'center',
                alignSelf: 'center',
                borderColor: 'blue',
                paddingHorizontal: 10,
                borderRadius: 20,
              }}>
              <Text
                numberOfLines={2}
                style={{
                  fontSize: 14,
                  textAlign: 'center',
                  alignSelf: 'center',
                  color: 'blue',
                }}>
                
              </Text>
            </View> */}
          </View>

          <View style={{flexDirection: 'row', marginTop: 5, paddingLeft: 10}}>
            <View
              style={{
                flexDirection: 'row',
                width: '60%',
                alignSelf: 'center',
              }}>
              <Icon
                name={'star'}
                size={12}
                color={'#ea0016'}
                style={{alignSelf: 'center'}}
              />
              <Icon
                name={'star'}
                size={12}
                color={'#ea0016'}
                style={{alignSelf: 'center'}}
              />
              <Icon
                name={'star'}
                size={12}
                color={'#ea0016'}
                style={{alignSelf: 'center'}}
              />
              <Icon
                name={'star'}
                size={12}
                color={'#ea0016'}
                style={{alignSelf: 'center'}}
              />
              <Icon
                name={'star'}
                size={12}
                color={'#a7a7a7'}
                style={{alignSelf: 'center'}}
              />
              <Text
                style={{
                  fontSize: 12,
                  color: '#a7a7a7',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  paddingLeft: 5,
                }}>
                4
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: '#e1e1e1',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  paddingLeft: 5,
                }}>
                (1036 Reviews)
              </Text>
            </View>

            <Icon
              name={'clock'}
              size={12}
              color={'blue'}
              style={{alignSelf: 'center', paddingLeft: 15}}
            />
            <Text
              style={{
                fontSize: 12,
                color: 'blue',
                textAlign: 'right',
                fontWeight: 'bold',
                paddingLeft: '1%',
                alignSelf: 'center',
              }}>
              35 mins
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 5,
              marginBottom: 10,
              paddingLeft: 10,
            }}>
            <View
              style={{
                flexDirection: 'row',
                width: '60%',
                alignSelf: 'center',
              }}>
              <Text
                numberOfLines={1}
                style={{
                  fontSize: 12,
                  color: '#a7a7a7',
                  textAlign: 'left',
                  fontWeight: 'bold',
                }}>
                Mithai, Fastfood, JunkFood, North-Indian
              </Text>
            </View>
            <Icon
              name={'pin'}
              size={12}
              color={'blue'}
              style={{alignSelf: 'center', paddingLeft: 15}}
            />
            <Text
              style={{
                fontSize: 12,
                color: 'blue',
                textAlign: 'right',
                fontWeight: 'bold',
                paddingLeft: '1%',
                alignSelf: 'center',
              }}>
              Live Tracking
            </Text>
          </View>
        </View>
      </View>
    );
  };

  render() {
    console.disableYellowBox = true;
    const {subCatname} = this.props.route.params;

    return (
      <View style={styles.container}>
        <ParallaxHeader
          headerMinHeight={0}
          headerMaxHeight={150}
          extraScrollHeight={10}
          navbarColor="#fff"
          title={this.renderHeader(subCatname)}
          titleStyle={styles.titleStyle}
          backgroundColor="#fff"
          backgroundImageScale={1.2}
          renderContentAtIndexZero={this.renderStickyHeader}
          renderContentAtIndexOne={this.renderContent}
          containerStyle={styles.container}
          contentContainerStyle={styles.contentContainer}
          innerContainerStyle={styles.container}
          scrollViewProps={{
            onScrollBeginDrag: () => console.log('onScrollBeginDrag'),
            onScrollEndDrag: () => console.log('onScrollEndDrag'),
            stickyHeaderIndices: [0],
            showsVerticalScrollIndicator: false,
          }}
          // swipeToRefreshProps={{name: "hola"}}
          alwaysShowTitle={false}
          alwaysShowNavBar={false}
        />
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Productlisting);

const styles = StyleSheet.create({
  header: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: (SCREEN_WIDTH / 40) * 2,
    marginTop: 15,
  },
  goBackTouchable: {
    marginLeft: -13.5,
    marginTop: 2,
    height: 42,
    width: 42,
    borderRadius: 360,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  goBackView: {
    height: 35,
    width: 35,
    borderRadius: 360,
    borderWidth: 1,
    borderColor: '#ededed',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  goBackImage: {
    width: 18,
    height: 18,
    padding: 5,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 360,
    backgroundColor: 'white',
  },
  headerTitle: {
    fontSize: 20,
    alignSelf: 'center',
    paddingLeft: 10,
    width: SCREEN_WIDTH - 130,
  },
  textInputView: {
    flexDirection: 'row',
    marginHorizontal: 10,
    paddingHorizontal: 10,
    backgroundColor: 'white',
    height: 42,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ededed',
    width: (SCREEN_WIDTH / 40) * 36,
  },
  headerTextInput: {
    paddingLeft: 5,
    marginLeft: 5,
    alignSelf: 'center',
    height: 40,
    minWidth: 300,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
  navContainer: {
    height: HEADER_HEIGHT,
    // marginHorizontal: 10,
  },
  statusBar: {
    height: STATUS_BAR_HEIGHT,
    backgroundColor: 'transparent',
  },
  navBar: {
    height: NAV_BAR_HEIGHT,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'transparent',
  },
  titleStyle: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
