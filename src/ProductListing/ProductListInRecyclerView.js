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
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ico from 'react-native-vector-icons/MaterialIcons';
import ParallaxHeader from './ParallexHeader';
import Axios from 'axios';
import LoadingView from './LoadingView';
import {createStringWithFirstLetterCapital} from '../Shared/functions';
import {RecyclerListView, LayoutProvider, DataProvider} from 'recyclerlistview';

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

  addOneItemToCart: newProduct => dispatch(addOneItemToCart(newProduct)),
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
    };
  }

  componentDidMount() {
    // console.log('Current Variants', this.props.variants.variants);
    const {subcatid} = this.props.route.params;
    const {subCatname} = this.props.route.params;
    // console.log({subcatid, subCatname});
    this.fetchSubSubCategories(subcatid);
    this.fetchAllProductsInThisSubcategory(subcatid, 1);
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

  fetchAllProductsInThisSubcategory = async (subCatId, pageNum) => {
    var url = fetchSubCategoryProductsUrl(pageNum, subCatId);

    if (this.state.firstRun) {
      this.setState({firstRun: false});
      this.props.deleteAllDefaultVarinats();
    }

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
          var dataWithTypeVariable = [];
          response.data.object.map((item, index) => {
            item.type = 'NORMAL';
            dataWithTypeVariable.push(item);
          });
          this.setState({
            allSubCategoryProductsLoading: false,
            isPaginating: false,
            allSubCategoryProducts: [
              ...this.state.allSubCategoryProducts,
              ...dataWithTypeVariable,
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
              const {subcatid} = this.props.route.params;
              this.props.deleteAllDefaultVarinats();
              this.fetchAllProductsInThisSubcategory(subcatid, 1);
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
                      this.fetchProductsFromThisSubSubcategory(
                        this.state.subSubCategories[index].id,
                        subcatid,
                        1,
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

  layoutProvider = new LayoutProvider(
    i => {
      var dataProvider = new DataProvider((r1, r2) => {
        return r1 !== r2;
      }).cloneWithRows(this.state.allSubCategoryProducts);
      return dataProvider.getDataForIndex(i).type;
    },
    (type, dim) => {
      switch (type) {
        case 'NORMAL':
          dim.width = SCREEN_WIDTH;
          dim.height = 100;
          break;
        default:
          dim.width = SCREEN_WIDTH;
          dim.height = 100;
          break;
      }
    },
  );

  renderContent = () => {
    var dataProvider = new DataProvider((r1, r2) => {
      return r1 !== r2;
    }).cloneWithRows(this.state.allSubCategoryProducts);

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
              {/* <FlatList
                style={{paddingTop: 10}}
                data={this.state.allSubCategoryProducts}
                showsVerticalScrollIndicator={false}
                progressViewOffset={80}
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
                      height: 160,
                      backgroundColor: 'white',
                      flexDirection: 'row',
                      paddingVertical: 16,
                      borderRadius: 5,
                      marginBottom: 2,
                      borderRadius: 5,
                    }}>
                    <View
                      style={{
                        height: '100%',
                        width: '35%',
                        overflow: 'hidden',
                      }}>
                      {(item.productListings.findIndex(
                        x =>
                          x.variantValues[0] ===
                          this.props.defaultVariants.defaultVariants[index],
                      ) === -1
                        ? item.productListings[0].mrp
                        : item.productListings[
                            item.productListings.findIndex(
                              x =>
                                x.variantValues[0] ===
                                this.props.defaultVariants.defaultVariants[
                                  index
                                ],
                            )
                          ].mrp) -
                        (item.productListings.findIndex(
                          x =>
                            x.variantValues[0] ===
                            this.props.defaultVariants.defaultVariants[index],
                        ) === -1
                          ? item.productListings[0].sellingPrice
                          : item.productListings[
                              item.productListings.findIndex(
                                x =>
                                  x.variantValues[0] ===
                                  this.props.defaultVariants.defaultVariants[
                                    index
                                  ],
                              )
                            ].sellingPrice) >
                      0 ? (
                        <View
                          style={{
                            height: 17,
                            borderTopLeftRadius: 2,
                            borderBottomLeftRadius: 2,
                            width: '60%',
                            zIndex: 10,
                            marginLeft: 5,
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
                            {(
                              (((item.productListings.findIndex(
                                x =>
                                  x.variantValues[0] ===
                                  this.props.defaultVariants.defaultVariants[
                                    index
                                  ],
                              ) === -1
                                ? item.productListings[0].mrp
                                : item.productListings[
                                    item.productListings.findIndex(
                                      x =>
                                        x.variantValues[0] ===
                                        this.props.defaultVariants
                                          .defaultVariants[index],
                                    )
                                  ].mrp) -
                                (item.productListings.findIndex(
                                  x =>
                                    x.variantValues[0] ===
                                    this.props.defaultVariants.defaultVariants[
                                      index
                                    ],
                                ) === -1
                                  ? item.productListings[0].sellingPrice
                                  : item.productListings[
                                      item.productListings.findIndex(
                                        x =>
                                          x.variantValues[0] ===
                                          this.props.defaultVariants
                                            .defaultVariants[index],
                                      )
                                    ].sellingPrice)) /
                                (item.productListings.findIndex(
                                  x =>
                                    x.variantValues[0] ===
                                    this.props.defaultVariants.defaultVariants[
                                      index
                                    ],
                                ) === -1
                                  ? item.productListings[0].mrp
                                  : item.productListings[
                                      item.productListings.findIndex(
                                        x =>
                                          x.variantValues[0] ===
                                          this.props.defaultVariants
                                            .defaultVariants[index],
                                      )
                                    ].mrp)) *
                              100
                            ).toFixed(2)}{' '}
                            % OFF
                          </Text>
                        </View>
                      ) : null}

                      <Image
                        style={{
                          height: '96%',
                          width: '80%',
                          resizeMode: 'cover',
                          alignSelf: 'center',
                          zIndex: 1,
                        }}
                        source={
                          item.medias &&
                          item.medias[0] &&
                          item.medias[0].mediaUrl
                            ? {
                                // uri: item.productListings[0].medias[0].mediaUrl,
                                uri: item.medias[0].mediaUrl,
                              }
                            : require('../assets/foodbg.png')
                        }
                      />
                    </View>

                    <View
                      style={{width: '65%', justifyContent: 'space-evenly'}}>
                      <TouchableOpacity
                        onPress={() =>
                          this.props.navigation.navigate('Productdetails', {
                            fromWhere: 'productListing',
                            product: item,
                          })
                        }>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginLeft: -6,
                            paddingRight: 10,
                          }}>
                          <View style={{marginLeft: 3, width: '69%'}}>
                            <Text
                              style={{
                                fontSize: 14,

                                textAlign: 'left',

                                color: 'black',
                              }}
                              numberOfLines={1}>
                              {item.brand.name}
                            </Text>

                            <Text
                              style={{
                                fontSize: 14,
                                paddingTop: 5,
                                fontWeight: '600',
                              }}
                              numberOfLines={2}>
                              {item.name}
                            </Text>
                          </View>
                          <View style={{}}>
                            <Text
                              style={{
                                fontSize: 15,
                                fontWeight: 'bold',
                                alignSelf: 'center',
                                marginRight: 15,
                              }}>
                              Rs.{' '}
                              {item.productListings.findIndex(
                                x =>
                                  x.variantValues[0] ===
                                  this.props.defaultVariants.defaultVariants[
                                    index
                                  ],
                              ) === -1
                                ? item.productListings[0].sellingPrice
                                : item.productListings[
                                    item.productListings.findIndex(
                                      x =>
                                        x.variantValues[0] ===
                                        this.props.defaultVariants
                                          .defaultVariants[index],
                                    )
                                  ].sellingPrice}
                            </Text>
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
                                {item.productListings.findIndex(
                                  x =>
                                    x.variantValues[0] ===
                                    this.props.defaultVariants.defaultVariants[
                                      index
                                    ],
                                ) === -1
                                  ? item.productListings[0].mrp
                                  : item.productListings[
                                      item.productListings.findIndex(
                                        x =>
                                          x.variantValues[0] ===
                                          this.props.defaultVariants
                                            .defaultVariants[index],
                                      )
                                    ].mrp}
                              </Text>
                            </Text>
                          </View>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                          <Text
                            style={{
                              fontSize: 10,
                              color: 'darkgray',
                              alignSelf: 'center',
                              paddingTop: 3,
                              // paddingLeft: 8,
                            }}
                            numberOfLines={1}>
                            {item.productListings.findIndex(
                              x =>
                                x.variantValues[0] ===
                                this.props.defaultVariants.defaultVariants[
                                  index
                                ],
                            ) === -1
                              ? 'SKU Code: ' +
                                item.productListings[0].sellingPrice
                              : 'SKU Code: ' +
                                item.productListings[
                                  item.productListings.findIndex(
                                    x =>
                                      x.variantValues[0] ===
                                      this.props.defaultVariants
                                        .defaultVariants[index],
                                  )
                                ].skuCode}
                          </Text>
                        </View>
                      </TouchableOpacity>

                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          paddingRight: 20,
                          paddingLeft: 20,
                        }}>
                        <View
                          style={{
                            height: 28,
                            borderColor: '#e1e1e1',
                            justifyContent: 'center',
                            width: 100,
                            borderRadius: 2,
                          }}>
                          {item.variantValues[0].variant ===
                          'NO VARIANT' ? null : (
                            <View
                              style={{
                                alignSelf: 'center',
                                height: 28,
                                width: 137,
                                justifyContent: 'center',
                                borderWidth: 1,
                                borderColor: '#e1e1e1',
                              }}>
                              <Picker
                                style={{
                                  alignSelf: 'center',
                                  height: 26,
                                  width: 135,
                                }}
                                selectedValue={
                                  this.props.defaultVariants.defaultVariants[
                                    index
                                  ]
                                }
                                onValueChange={(itemValue, itemIndex) => {
                                  this.props.editDefaultVariant(
                                    itemValue,
                                    index,
                                  );
                                }}
                                key={0}
                                itemStyle={{
                                  marginLeft: 10,
                                  fontSize: 10,
                                  alignSelf: 'center',
                                  fontWeight: 'bold',
                                }}>
                                {item.variantValues[0].variantValue.map(
                                  (item, index) => {
                                    return (
                                      <Picker.Item
                                        value={item}
                                        label={item}
                                        key={index}
                                      />
                                    );
                                  },
                                )}
                              </Picker>
                            </View>
                          )}
                        </View>
                        {this.props.cart.cart.findIndex(
                          x =>
                            x.id === item.id &&
                            x.variantSelectedByCustome ===
                              this.props.defaultVariants.defaultVariants[index],
                        ) === -1 ? (
                          <TouchableOpacity
                            onPress={() => {
                              var currentItem = item;
                              currentItem.productCountInCart = 1;
                              currentItem.variantSelectedByCustome = this.props.defaultVariants.defaultVariants[
                                index
                              ];
                              currentItem.priceOfVariantSelectedByCustomer =
                                item.productListings.findIndex(
                                  x =>
                                    x.variantValues[0] ===
                                    this.props.defaultVariants.defaultVariants[
                                      index
                                    ],
                                ) === -1
                                  ? item.productListings[0].sellingPrice
                                  : item.productListings[
                                      item.productListings.findIndex(
                                        x =>
                                          x.variantValues[0] ===
                                          this.props.defaultVariants
                                            .defaultVariants[index],
                                      )
                                    ].sellingPrice;
                              this.props.addOneItemToCart(currentItem);
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
              /> */}
              <RecyclerListView
                rowRenderer={(type, item) => {
                  console.log(
                    'Here is item from recycler view==================================================================================================================================================================================================================================================================================================================================================================================================================================================',
                    item,
                  );
                  // var {item} = data;
                  return (
                    <View
                      style={{
                        height: 160,
                        backgroundColor: 'white',
                        flexDirection: 'row',
                        paddingVertical: 16,
                        borderRadius: 5,
                        marginBottom: 2,
                        borderRadius: 5,
                      }}>
                      <View
                        style={{
                          height: '100%',
                          width: '35%',
                          overflow: 'hidden',
                        }}>
                        {(item.productListings.findIndex(
                          x =>
                            x.variantValues[0] ===
                            this.props.defaultVariants.defaultVariants[index],
                        ) === -1
                          ? item.productListings[0].mrp
                          : item.productListings[
                              item.productListings.findIndex(
                                x =>
                                  x.variantValues[0] ===
                                  this.props.defaultVariants.defaultVariants[
                                    index
                                  ],
                              )
                            ].mrp) -
                          (item.productListings.findIndex(
                            x =>
                              x.variantValues[0] ===
                              this.props.defaultVariants.defaultVariants[index],
                          ) === -1
                            ? item.productListings[0].sellingPrice
                            : item.productListings[
                                item.productListings.findIndex(
                                  x =>
                                    x.variantValues[0] ===
                                    this.props.defaultVariants.defaultVariants[
                                      index
                                    ],
                                )
                              ].sellingPrice) >
                        0 ? (
                          <View
                            style={{
                              height: 17,
                              borderTopLeftRadius: 2,
                              borderBottomLeftRadius: 2,
                              width: '60%',
                              zIndex: 10,
                              marginLeft: 5,
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
                              {(
                                (((item.productListings.findIndex(
                                  x =>
                                    x.variantValues[0] ===
                                    this.props.defaultVariants.defaultVariants[
                                      index
                                    ],
                                ) === -1
                                  ? item.productListings[0].mrp
                                  : item.productListings[
                                      item.productListings.findIndex(
                                        x =>
                                          x.variantValues[0] ===
                                          this.props.defaultVariants
                                            .defaultVariants[index],
                                      )
                                    ].mrp) -
                                  (item.productListings.findIndex(
                                    x =>
                                      x.variantValues[0] ===
                                      this.props.defaultVariants
                                        .defaultVariants[index],
                                  ) === -1
                                    ? item.productListings[0].sellingPrice
                                    : item.productListings[
                                        item.productListings.findIndex(
                                          x =>
                                            x.variantValues[0] ===
                                            this.props.defaultVariants
                                              .defaultVariants[index],
                                        )
                                      ].sellingPrice)) /
                                  (item.productListings.findIndex(
                                    x =>
                                      x.variantValues[0] ===
                                      this.props.defaultVariants
                                        .defaultVariants[index],
                                  ) === -1
                                    ? item.productListings[0].mrp
                                    : item.productListings[
                                        item.productListings.findIndex(
                                          x =>
                                            x.variantValues[0] ===
                                            this.props.defaultVariants
                                              .defaultVariants[index],
                                        )
                                      ].mrp)) *
                                100
                              ).toFixed(2)}{' '}
                              % OFF
                            </Text>
                          </View>
                        ) : null}

                        <Image
                          style={{
                            height: '96%',
                            width: '80%',
                            resizeMode: 'cover',
                            alignSelf: 'center',
                            zIndex: 1,
                          }}
                          source={
                            item.medias &&
                            item.medias[0] &&
                            item.medias[0].mediaUrl
                              ? {
                                  // uri: item.productListings[0].medias[0].mediaUrl,
                                  uri: item.medias[0].mediaUrl,
                                }
                              : require('../assets/foodbg.png')
                          }
                        />
                      </View>

                      <View
                        style={{width: '65%', justifyContent: 'space-evenly'}}>
                        <TouchableOpacity
                          onPress={() =>
                            this.props.navigation.navigate('Productdetails', {
                              fromWhere: 'productListing',
                              product: item,
                            })
                          }>
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              marginLeft: -6,
                              paddingRight: 10,
                            }}>
                            <View style={{marginLeft: 3, width: '69%'}}>
                              <Text
                                style={{
                                  fontSize: 14,

                                  textAlign: 'left',

                                  color: 'black',
                                }}
                                numberOfLines={1}>
                                {item.brand.name}
                              </Text>

                              <Text
                                style={{
                                  fontSize: 14,
                                  paddingTop: 5,
                                  fontWeight: '600',
                                }}
                                numberOfLines={2}>
                                {item.name}
                              </Text>
                            </View>
                            <View style={{}}>
                              <Text
                                style={{
                                  fontSize: 15,
                                  fontWeight: 'bold',
                                  alignSelf: 'center',
                                  marginRight: 15,
                                }}>
                                Rs.{' '}
                                {item.productListings.findIndex(
                                  x =>
                                    x.variantValues[0] ===
                                    this.props.defaultVariants.defaultVariants[
                                      index
                                    ],
                                ) === -1
                                  ? item.productListings[0].sellingPrice
                                  : item.productListings[
                                      item.productListings.findIndex(
                                        x =>
                                          x.variantValues[0] ===
                                          this.props.defaultVariants
                                            .defaultVariants[index],
                                      )
                                    ].sellingPrice}
                              </Text>
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
                                  {item.productListings.findIndex(
                                    x =>
                                      x.variantValues[0] ===
                                      this.props.defaultVariants
                                        .defaultVariants[index],
                                  ) === -1
                                    ? item.productListings[0].mrp
                                    : item.productListings[
                                        item.productListings.findIndex(
                                          x =>
                                            x.variantValues[0] ===
                                            this.props.defaultVariants
                                              .defaultVariants[index],
                                        )
                                      ].mrp}
                                </Text>
                              </Text>
                            </View>
                          </View>
                          <View style={{flexDirection: 'row'}}>
                            <Text
                              style={{
                                fontSize: 10,
                                color: 'darkgray',
                                alignSelf: 'center',
                                paddingTop: 3,
                                // paddingLeft: 8,
                              }}
                              numberOfLines={1}>
                              {item.productListings.findIndex(
                                x =>
                                  x.variantValues[0] ===
                                  this.props.defaultVariants.defaultVariants[
                                    index
                                  ],
                              ) === -1
                                ? 'SKU Code: ' +
                                  item.productListings[0].sellingPrice
                                : 'SKU Code: ' +
                                  item.productListings[
                                    item.productListings.findIndex(
                                      x =>
                                        x.variantValues[0] ===
                                        this.props.defaultVariants
                                          .defaultVariants[index],
                                    )
                                  ].skuCode}
                            </Text>
                          </View>
                        </TouchableOpacity>

                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            paddingRight: 20,
                            paddingLeft: 20,
                          }}>
                          <View
                            style={{
                              height: 28,
                              borderColor: '#e1e1e1',
                              justifyContent: 'center',
                              width: 100,
                              borderRadius: 2,
                            }}>
                            {item.variantValues[0].variant ===
                            'NO VARIANT' ? null : (
                              <View
                                style={{
                                  alignSelf: 'center',
                                  height: 28,
                                  width: 137,
                                  justifyContent: 'center',
                                  borderWidth: 1,
                                  borderColor: '#e1e1e1',
                                }}>
                                <Picker
                                  style={{
                                    alignSelf: 'center',
                                    height: 26,
                                    width: 135,
                                  }}
                                  selectedValue={
                                    this.props.defaultVariants.defaultVariants[
                                      index
                                    ]
                                  }
                                  onValueChange={(itemValue, itemIndex) => {
                                    this.props.editDefaultVariant(
                                      itemValue,
                                      index,
                                    );
                                  }}
                                  key={0}
                                  itemStyle={{
                                    marginLeft: 10,
                                    fontSize: 10,
                                    alignSelf: 'center',
                                    fontWeight: 'bold',
                                  }}>
                                  {item.variantValues[0].variantValue.map(
                                    (item, index) => {
                                      return (
                                        <Picker.Item
                                          value={item}
                                          label={item}
                                          key={index}
                                        />
                                      );
                                    },
                                  )}
                                </Picker>
                              </View>
                            )}
                          </View>
                          {this.props.cart.cart.findIndex(
                            x =>
                              x.id === item.id &&
                              x.variantSelectedByCustome ===
                                this.props.defaultVariants.defaultVariants[
                                  index
                                ],
                          ) === -1 ? (
                            <TouchableOpacity
                              onPress={() => {
                                var currentItem = item;
                                currentItem.productCountInCart = 1;
                                currentItem.variantSelectedByCustome = this.props.defaultVariants.defaultVariants[
                                  index
                                ];
                                currentItem.priceOfVariantSelectedByCustomer =
                                  item.productListings.findIndex(
                                    x =>
                                      x.variantValues[0] ===
                                      this.props.defaultVariants
                                        .defaultVariants[index],
                                  ) === -1
                                    ? item.productListings[0].sellingPrice
                                    : item.productListings[
                                        item.productListings.findIndex(
                                          x =>
                                            x.variantValues[0] ===
                                            this.props.defaultVariants
                                              .defaultVariants[index],
                                        )
                                      ].sellingPrice;
                                this.props.addOneItemToCart(currentItem);
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
                  );
                }}
                dataProvider={dataProvider}
                layoutProvider={this.layoutProvider}
                // onScroll={this.checkRefetch}
                // renderFooter={this.renderFooter}
                // scrollViewProps={{
                // refreshControl: (
                // <RefreshControl
                //   refreshing={loading}
                //   onRefresh={async () => {
                //   this.setState({ loading: true });
                //   analytics.logEvent('Event_Stagg_pull_to_refresh');
                //   await refetchQueue();
                //   this.setState({ loading: false });
                //     }}
                //   />
                //   )
                // }}
              />
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
      <View style={{flex: 1, flexDirection: 'column'}}>
        <View style={styles.header}>
          <View style={{felx: 1}}>
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
          <View style={{flex: 8}}>
            <Text numberOfLines={1} style={styles.headerTitle}>
              {createStringWithFirstLetterCapital(subcategoryName)}
            </Text>
          </View>
          <View style={{flex: 1}}>
            {/* <TouchableOpacity
              onPress={() => this.setState({filterModalVisible: true})}
              style={{alignSelf: 'center', height: 25, width: 25}}> */}
            <Image
              style={{
                height: 25,
                alignSelf: 'center',
                width: 25,
                resizeMode: 'contain',
              }}
              source={require('../assets/p2.png')}
            />
            {/* </TouchableOpacity> */}
          </View>
        </View>
        <View style={{flex: 1, marginHorizontal: (SCREEN_WIDTH / 40) * 2}}>
          <TouchableWithoutFeedback
            onPress={() => this.props.navigation.navigate('Search')}>
            <View style={styles.textInputView}>
              <Ico
                name={'search'}
                style={{alignSelf: 'center', color: 'gray'}}
                size={18}
              />
              <TextInput
                editable={false}
                style={styles.headerTextInput}
                placeholder={'Search'}
                placeholderTextColor="gray"
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    );
  };

  render() {
    const {subCatname} = this.props.route.params;

    return (
      <View style={styles.container}>
        <ParallaxHeader
          headerMinHeight={0}
          headerMaxHeight={130}
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Productlisting);

const styles = StyleSheet.create({
  header: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: (SCREEN_WIDTH / 40) * 2,
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
