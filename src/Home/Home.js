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
  Modal,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ico from 'react-native-vector-icons/MaterialIcons';
import Axios from 'axios';
import {SliderBox} from 'react-native-image-slider-box';

import {createStringWithFirstLetterCapital} from '../Shared/functions';
import {
  fetchCategoriesUrl,
  fetchSubCategoriesUrl,
} from '../../Config/Constants';

import {connect} from 'react-redux';
import {deleteAllDefaultVarinats} from '../Redux/Cart/ActionCreators';
import {profileVisitedOnes, logOut} from '../Redux/Auth/ActionCreatore';
import Brands from './Brands';
const mapStateToProps = state => {
  return {
    cart: state.cart,
    defaultVariants: state.defaultVariants,
    login: state.login,
    visitedProfileOnes: state.visitedProfileOnes,
    addresses: state.addresses,
    nearestSupplier: state.nearestSupplier,
  };
};

const mapDispatchToProps = dispatch => ({
  deleteAllDefaultVarinats: () => dispatch(deleteAllDefaultVarinats()),
  profileVisitedOnes: () => dispatch(profileVisitedOnes()),
  logOut: () => dispatch(logOut()),
});

class Home extends React.Component {
  state = {
    images: [],
    data: [
      {name: 'Britania', image: require('../assets/i1.jpg')},
      {name: 'Amul', image: require('../assets/i2.jpg')},
      {name: 'Nestle', image: require('../assets/i3.png')},
      // {name: 'Pepsi', image: require('../assets/i4.png')},
      // {name: 'ITC', image: require('../assets/i5.jpeg')},
    ],
    subCategoryData: [],
    categoryData: [],
    selectdata: [],
    show_DropdownElements: false,
    current_dropdown_index: -1,
    showmodal: false,
    heightforDropdown: 0,
    isCategoryDataLoading: false,
    isLoading: false,
  };

  componentDidMount() {
    // console.log(
    //   'Redux data from home screen ===========================================================================>',
    //   this.props.visitedProfileOnes.hasVisited,
    //   +'\n' + JSON.stringify(this.props.addresses.selectedAddress),
    //   +'\n' + this.props.nearestSupplier.supplierIdWithMinDist,
    // );
    if (
      !this.props.visitedProfileOnes.hasVisited &&
      this.props.addresses.userAddresses.length === 1
    ) {
      this.props.navigation.navigate('Setting');
      this.props.profileVisitedOnes();
    }
    this.setState({showmodal: true});
    this.getCategoryDataFromServer();
    this.props.deleteAllDefaultVarinats();
    this.getBanners();
  }

  getBanners = async () => {
    await Axios.get(
      'http://ec2-3-7-159-160.ap-south-1.compute.amazonaws.com/api/v3/account/banner/supplier/1',
      {
        headers: {
          Authorization: 'bearer ' + '',
          'Content-type': 'application/json',
        },
      },
    ).then(response => {
      const Arr = response.data.object;
      for (let index = 0; index < Arr.length; index++) {
        var D = Arr[index].bannerImageUrl;
        this.state.images.push(D);
      }
      console.log('banner data  --> ' + this.state.images);
    });
  };
  getCategoryDataFromServer = async () => {
    this.setState({isCategoryDataLoading: true});
    console.log('inside getCategoryDataFromServer');
    var self = this;

    var url = fetchCategoriesUrl();
    if (this.props.login.skippedLogin == false) {
      url =
        url +
        '1/' +
        this.props.addresses.selectedAddress.latitude +
        '/' +
        this.props.addresses.selectedAddress.longitude;
    }
    await Axios.get(url, {
      headers: {
        Authorization: 'bearer ' + '',
        'Content-type': 'application/json',
      },
      timeout: 15000,
    })
      .then(function(response) {
        console.log('Category data->', response.data.object);
        self.setState({
          categoryData: response.data.object,
          isCategoryDataLoading: false,
        });
        for (let index = 0; index < self.state.categoryData.length; index++) {
          self.state.selectdata.push(index);
        }
      })
      .catch(error => {
        if (!error.status) {
          this.setState({networkError: true, isCategoryDataLoading: false});
        }
        console.log('Error', error);
      });

    console.log('select data-> ', this.state.selectdata);
  };

  getSubCategoriesByCategoryIdFromServer = async categoryId => {
    console.log('Start Getting sub category from server');
    var url = fetchSubCategoriesUrl(categoryId);
    await Axios.get(url, {
      headers: {
        Authorization: 'bearer ' + ' ',
        'Content-type': 'application/json',
      },
    })
      .then(response => {
        console.log('getSubCategoriesByCategoryIdFromServer', response.data);
        this.setState({
          subCategoryData: response.data.object,
          show_DropdownElements: true,
        });
      })
      .catch(error => {
        console.log('Error', error.message);
      });
  };

  render_Dropdown = ({item, index}) => {
    // if (
    //   this.state.current_dropdown_index != this.state.selectdata[index] &&
    //   this.state.data3.length == this.state.selectdata.length
    // ) {
    return (
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.navigate('Productlist', {
            catsup: item.id,
            catname: item.firstName,
          })
        }>
        <View
          style={[
            this.state.current_dropdown_index == this.state.selectdata[index]
              ? {backgroundColor: '#FFFBDE'}
              : {backgroundColor: 'white'},
            {
              marginTop: 0.5,
              alignSelf: 'center',
              width: Dimensions.get('window').width,
              borderRadius: 5,
              height: 115,

              justifyContent: 'space-evenly',
            },
          ]}>
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              height: 100,
              justifyContent: 'space-between',
              paddingHorizontal: '4%',
            }}>
            <View
              style={{
                height: 107,
                width: '30%',
                borderRadius: 5,
                alignSelf: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
              }}>
              <Image
                style={{
                  height: '95%',
                  width: '95%',
                  resizeMode: 'cover',
                  borderRadius: 5,
                  alignSelf: 'center',
                }}
                source={
                  item && item.logoUrl
                    ? {uri: item.logoUrl}
                    : require('../assets/foodbg.png')
                }
              />
            </View>
            <View
              style={{
                paddingHorizontal: 10,
                width: '70%',
                alignSelf: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 14,
                }}>
                {item.firstName}
              </Text>
              <Text
                numberOfLines={1}
                style={{
                  fontSize: 8,
                }}>
                {item.supplierType}
              </Text>

              <Text
                style={{
                  fontSize: 10,
                  paddingTop: 10,
                }}>
                {item.storeList &&
                item.storeList[0] &&
                item.storeList[0].addressLine1
                  ? ' ' + '\n' + ' '
                  : ' ' + '\n' + ' '}
                {'\n'}
                {item.storeList &&
                item.storeList[0] &&
                item.storeList[0].deliverDistance
                  ? item.storeList[0].deliverDistance + ' '
                  : null}
                km away
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 10,
                  width: '90%',
                  justifyContent: 'space-between',
                }}>
                <Icon
                  name={'star'}
                  size={12}
                  color={'#a7a7a7'}
                  style={{alignSelf: 'center'}}></Icon>
                <Text
                  style={{
                    fontSize: 10,
                    color: '#a7a7a7',
                    textAlign: 'center',
                    fontWeight: 'bold',
                  }}>
                  4
                </Text>
                <View
                  style={{
                    backgroundColor: '#a7a7a7',
                    alignSelf: 'center',
                    borderRadius: 360,
                    height: 4,
                    width: 4,
                  }}
                />
                <Text
                  style={{
                    fontSize: 10,
                    color: '#a7a7a7',
                    textAlign: 'center',
                    fontWeight: 'bold',
                  }}>
                  30 mins
                </Text>
                <View
                  style={{
                    backgroundColor: '#a7a7a7',
                    alignSelf: 'center',
                    borderRadius: 360,
                    height: 4,
                    width: 4,
                  }}
                />
                <Text
                  style={{
                    fontSize: 10,
                    color: '#a7a7a7',
                    textAlign: 'center',
                    fontWeight: 'bold',
                  }}>
                  Rs. {item.minOrderValue} for one
                </Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
    //   } else {
    //     if (this.state.current_dropdown_index == this.state.selectdata[index])
    //       return (
    //         <View
    //           style={{
    //             marginTop: 10,
    //             alignSelf: 'center',
    //             width: Dimensions.get('window').width,
    //             borderRadius: 5,
    //             flexShrink: 1,
    //             flexGrow: 1,
    //             maxHeight: 1700,
    //             backgroundColor: '#FFFBDE',
    //           }}>
    //           <View
    //             style={{
    //               flexDirection: 'row',
    //               width: '100%',
    //               height: 105,
    //               justifyContent: 'space-evenly',
    //             }}>
    //             <View
    //               style={{
    //                 height: '98%',
    //                 width: '20%',
    //                 alignSelf: 'center',
    //                 borderRadius: 5,
    //               }}>
    //               <Image
    //                 style={{
    //                   height: '100%',
    //                   width: '100%',
    //                   resizeMode: 'contain',
    //                   marginLeft: 5,
    //                 }}
    //                 source={
    //                   item.media && item.media.mediaUrl
    //                     ? {uri: item.media.mediaUrl}
    //                     : require('../assets/foodbg.png')
    //                 }
    //               />
    //             </View>
    //             <View
    //               style={{
    //                 paddingHorizontal: 10,
    //                 width: '60%',
    //                 alignSelf: 'center',
    //               }}>
    //               <Text
    //                 style={{
    //                   fontWeight: 'bold',
    //                   fontSize: 15,
    //                 }}>
    //                 {item.name}
    //               </Text>
    //               <Text
    //                 numberOfLines={2}
    //                 style={{
    //                   fontSize: 8,
    //                 }}>
    //                 {item.description}
    //               </Text>
    //             </View>
    //             <Icon
    //               name={'chevron-up'}
    //               size={33}
    //               onPress={() =>
    //                 this.setState({current_dropdown_index: null, data1: []})
    //               }
    //               style={{alignSelf: 'center', paddingTop: 16}}
    //             />
    //           </View>
    //           <View
    //             style={{
    //               flexShrink: 1,
    //               flexGrow: 1,
    //               width: Dimensions.get('window').width,
    //               maxHeight: 1500,
    //             }}>
    //             {this.state.show_DropdownElements ? (
    //               <FlatList
    //                 style={{
    //                   alignSelf: 'center',
    //                   width: Dimensions.get('window').width,
    //                 }}
    //                 contentContainerStyle={{justifyContent: 'space-between'}}
    //                 numColumns={3}
    //                 showsVerticalScrollIndicator={false}
    //                 renderItem={this.render_Dropdownitems}
    //                 data={this.state.data1}
    //                 keyExtractor={(item, index) => index.toString()}
    //               />
    //             ) : (
    //               <View style={{height: 105, justifyContent: 'center'}}>
    //                 <ActivityIndicator color={'#ea0016'} size={30} />
    //               </View>
    //             )}
    //           </View>
    //         </View>
    //       );
    //   }
  };
  render_brands = ({item}) => {
    return (
      <TouchableOpacity
        style={{
          marginTop: 15,
          backgroundColor: 'white',
          height: 70,
          width: Dimensions.get('window').width / 5.1,
          justifyContent: 'center',
          paddingVertical: 2.5,
          borderRadius: 5,
        }}>
        <View
          style={{
            flexDirection: 'row',
            height: 65,
            width: Dimensions.get('window').width / 5.2,
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              justifyContent: 'space-evenly',
              height: 65,
              width: '100%',
            }}>
            <View
              style={{
                height: '50%',
                width: '100%',
                backgroundColor: 'white',
                borderRadius: 3,
              }}>
              <Image
                style={{height: '100%', width: '100%', resizeMode: 'contain'}}
                source={item.image}
              />
            </View>
            <Text
              style={{
                fontSize: 11,
                alignSelf: 'center',
                color: 'black',
              }}>
              {item.name}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  render_Dropdownitems = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.navigate('Productlist', {
            subcatid: item.id,
            subCatname: item.name,
          })
        }>
        <View
          style={{
            flexDirection: 'row',
            height: 126,
            width: Dimensions.get('window').width / 3.2,
            justifyContent: 'space-between',
            backgroundColor: 'white',
            borderRadius: 3,
            marginBottom: 1,
            marginLeft: 1,
            paddingVertical: 5,
          }}>
          <View
            style={{
              justifyContent: 'space-evenly',
              height: 116,
              width: '100%',
            }}>
            <View
              style={{
                height: '10%',
                width: '80%',
                alignSelf: 'center',
              }}>
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 8,
                  textAlign: 'center',
                  alignSelf: 'center',
                  color: '#ea0016',
                }}>
                {index + 1}0% Off
              </Text>
            </View>
            <View
              style={{
                height: '60%',
                width: '100%',
                backgroundColor: 'white',
              }}>
              <Image
                style={{height: '100%', width: '100%', resizeMode: 'contain'}}
                source={
                  item.media && item.media.mediaUrl
                    ? {uri: item.media.mediaUrl}
                    : require('../assets/foodbg.png')
                }
              />
            </View>
            <View
              style={{
                width: '100%',
                height: '10%',
                paddingBottom: 5,
                paddingHorizontal: 10,
              }}>
              <Text
                numberOfLines={2}
                style={{
                  fontWeight: 'bold',
                  fontSize: 8,
                  textAlign: 'center',
                  alignSelf: 'center',
                }}>
                {item.id}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  render() {
    console.disableYellowBox = true;
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <StatusBar backgroundColor={'#fbfbfb'} barStyle={'dark-content'} />

        <View style={{backgroundColor: '#efefef', flex: 1}}>
          <View
            style={{
              height: '10%',
              elevation: 0.5,
              backgroundColor: 'white',
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 10,
              width: '100%',
              paddingTop: 5,
            }}>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                onPress={() => {
                  if (this.props.login.loginSuccess) {
                    this.props.navigation.navigate('Address', {
                      fromLogin: false,
                    });
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
                  height: 30,
                  width: 30,
                  marginTop: 10,
                }}>
                <Image
                  style={{
                    height: 20,
                    width: 20,
                    resizeMode: 'contain',
                  }}
                  source={require('../assets/ccc.png')}
                />
              </TouchableOpacity>

              <View
                style={{
                  marginLeft: 2,
                  marginTop: 5,
                }}>
                <Text
                  style={{
                    color: 'black',
                    fontWeight: 'bold',
                    fontSize: 22,
                  }}>
                  Home
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    alignSelf: 'center',
                    marginLeft: -30,
                    marginTop: 2,
                    color: 'gray',
                  }}>
                  Sector 33, Gurugram, Haryana
                </Text>
              </View>
            </View>
            <TouchableWithoutFeedback
              onPress={() => this.props.navigation.navigate('Search')}
              style={{
                height: 35,
                width: 35,
                alignSelf: 'center',
                justifyContent: 'center',
              }}>
              <View
                style={{
                  height: 35,
                  width: 35,
                  alignSelf: 'center',
                  justifyContent: 'center',
                  borderRadius: 360,
                  elevation: 2,
                  backgroundColor: 'white',
                }}>
                <Ico
                  name={'search'}
                  size={20}
                  style={{
                    alignSelf: 'center',
                    height: 20,

                    width: 20,
                    resizeMode: 'contain',
                    borderRadius: 360,
                  }}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={this.state.isCategoryDataLoading}
                onRefresh={this.getCategoryDataFromServer}
                progressViewOffset={80}
                progressBackgroundColor="#EA0016"
                colors={['#fff']}
              />
            }>
            <View style={{backgroundColor: 'white', paddingVertical: 10}}>
              <View
                style={{
                  height: 150,
                  alignSelf: 'center',
                  justifyContent: 'flex-start',
                  marginHorizontal: 10,
                  borderRadius: 5,
                  overflow: 'hidden',
                  width: Dimensions.get('window').width / 1.05,
                }}>
                <SliderBox
                  circleLoop
                  autoplay={true}
                  images={this.state.images}
                />
              </View>
            </View>
            <View style={{marginTop: 10}}>
              <Brands />
            </View>
         

            <View
              style={{
                height: 350,
                marginTop: 10,
                paddingBottom: 10,
                backgroundColor: 'white',
                paddingHorizontal: 13,
                justifyContent: 'space-evenly',
              }}>
              <View
                style={{
                  width: '100%',
                  alignSelf: 'center',
                }}>
                <Text
                  style={{
                    fontWeight: 'bold',
                    fontSize: 20,
                  }}>
                  Newly Launched
                </Text>
                <View style={{flexDirection: 'row'}}>
                  <Text
                    style={{
                      fontSize: 10,
                      color: '#a7a7a7',
                    }}>
                    Newly Launched Products for{' '}
                  </Text>
                  <Image
                    style={{
                      height: 15,
                      width: 50,
                      resizeMode: 'contain',
                      marginTop: -2.1,
                    }}
                    source={require('../assets/llog.png')}
                  />
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  height: '30%',
                  justifyContent: 'space-between',
                }}>
                <View
                  style={{
                    width: '48%',
                    height: '90%',
                    borderRadius: 5,
                  }}>
                  <Image
                    style={{
                      height: '100%',
                      width: '100%',
                      resizeMode: 'contain',
                      borderRadius: 5,
                    }}
                    source={require('../assets/image1.png')}
                  />
                  <Text
                    style={{
                      fontSize: 14,
                      marginTop: 5,
                      paddingLeft: 2,
                    }}>
                    Direct Farm to Kitchen
                  </Text>
                </View>
                <View
                  style={{
                    width: '48%',
                    height: '90%',
                    borderRadius: 5,
                  }}>
                  <Image
                    style={{
                      height: '100%',
                      width: '100%',
                      resizeMode: 'contain',
                      borderRadius: 5,
                    }}
                    source={require('../assets/image2.png')}
                  />
                  <Text
                    style={{
                      fontSize: 14,
                      marginTop: 5,
                      paddingLeft: 2,
                    }}>
                    100% Safe & Secure
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 10,
                  width: '100%',
                  height: '30%',
                  marginBottom: 10,
                  justifyContent: 'space-between',
                }}>
                <View
                  style={{
                    width: '48%',
                    height: '90%',
                    borderRadius: 5,
                  }}>
                  <Image
                    style={{
                      height: '100%',
                      width: '100%',
                      resizeMode: 'contain',
                      borderRadius: 5,
                    }}
                    source={require('../assets/image3.png')}
                  />
                  <Text
                    style={{
                      fontSize: 14,
                      marginTop: 5,
                      paddingLeft: 2,
                    }}>
                    Stored in controlled environment
                  </Text>
                </View>
                <View
                  style={{
                    width: '48%',
                    height: '90%',
                    borderRadius: 5,
                  }}>
                  <Image
                    style={{
                      height: '100%',
                      width: '100%',
                      resizeMode: 'contain',
                      borderRadius: 5,
                    }}
                    source={require('../assets/image4.png')}
                  />
                  <Text
                    style={{
                      fontSize: 14,
                      marginTop: 5,
                      paddingLeft: 2,
                    }}>
                    Discounted greens item
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={{
                paddingTop: 10,
                backgroundColor: 'white',
                paddingBottom: 7,
              }}>
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 20,
                  marginLeft: '4%',
                }}>
                Nearby Foodpoints
              </Text>
              <Text
                style={{
                  fontSize: 10,
                  marginLeft: '4.2%',
                }}>
                Nearest restaurant to your location
              </Text>
            </View>
            {this.state.isCategoryDataLoading ? (
              <FlatList
                extraData={this.state.selectdata}
                data={[1, 2, 3, 4]}
                renderItem={() => {
                  return (
                    <View
                      style={[
                        {
                          backgroundColor: '#fff',
                          marginTop: 10,
                          alignSelf: 'center',
                          width: Dimensions.get('window').width,
                          borderRadius: 5,
                          height: 105,
                          padding: 7,
                          justifyContent: 'space-evenly',
                          alignItems: 'center',
                        },
                      ]}>
                      <View style={{flex: 1, flexDirection: 'row'}}>
                        <View
                          style={{
                            flex: 3,
                            backgroundColor: '#efefef',
                            margin: 5,
                          }}
                        />
                        <View
                          style={{
                            flex: 10,
                            backgroundColor: '#efefef',
                            margin: 5,
                            marginVertical: 30,
                          }}
                        />
                      </View>
                    </View>
                  );
                }}
                keyExtractor={(item, index) => index.toString()}
              />
            ) : (
              <FlatList
                extraData={this.state.selectdata}
                data={this.state.categoryData}
                renderItem={this.render_Dropdown}
                keyExtractor={(item, index) => index.toString()}
              />
            )}
            {/* HERO COMPONENT */}

            <View style={{marginBottom: 25, marginTop: 25, marginLeft: 15}}>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'sans-serif',
                }}>
                Made With Love
              </Text>
              <Text
                style={{
                  fontWeight: '600',
                  fontSize: 15,
                }}>
                Powered By Krenai
              </Text>
            </View>
          </ScrollView>
          <Modal
            visible={this.state.showmodal}
            animationType={'fade'}
            transparent={true}>
            <View
              style={{
                backgroundColor: 'transparent',
                flex: 1,
              }}>
              <TouchableOpacity
                style={{
                  opacity: 0.5,
                  backgroundColor: 'black',
                  height: Dimensions.get('window').height / 6,
                }}
                onPress={() => this.setState({showmodal: false})}>
                <View
                  style={{
                    opacity: 0.5,
                    backgroundColor: 'black',
                    height: Dimensions.get('window').height / 4,
                  }}
                />
              </TouchableOpacity>

              <View
                style={{
                  justifyContent: 'center',
                  height: Dimensions.get('window').height / 1.5,
                  width: '100%',
                  flexDirection: 'row',
                }}>
                <View
                  style={{
                    opacity: 0.6,
                    backgroundColor: 'black',
                    width: '10%',
                    height: '100%',
                  }}
                />
                <View
                  style={{
                    opacity: 1,
                    backgroundColor: 'black',
                    height: '100%',
                    width: '80%',
                  }}>
                  <View
                    style={{
                      height: '100%',
                      width: '100%',
                      backgroundColor: 'white',
                      borderRadius: 5,
                      justifyContent: 'space-evenly',
                    }}>
                    <Image
                      style={{
                        height: '50%',
                        width: '100%',
                        alignSelf: 'center',
                        resizeMode: 'contain',
                      }}
                      source={require('../assets/ref.png')}
                    />
                    <View style={{paddingHorizontal: 15}}>
                      <Text
                        style={{
                          fontSize: 18,
                          color: 'black',
                          fontWeight: 'bold',
                          alignSelf: 'center',
                          textAlign: 'center',
                          marginTop: 10,
                        }}>
                        Earn cash by inviting friends
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          color: 'black',
                          alignSelf: 'center',
                          textAlign: 'center',
                          marginVertical: 10,
                        }}>
                        Users invited 3 friends on average to use Needs last
                        month. Invite your friends whe they complete their first
                        Order.
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        width: '60%',
                        justifyContent: 'space-evenly',
                        alignSelf: 'flex-end',
                      }}>
                      <TouchableOpacity
                        onPress={() => this.setState({showmodal: false})}>
                        <View
                          style={{
                            justifyContent: 'center',
                            height: 30,
                            width: 60,
                            borderRadius: 4,
                          }}>
                          <Text
                            style={{
                              fontSize: 15,
                              color: '#ea0016',
                              fontWeight: 'bold',
                              alignSelf: 'center',
                            }}>
                            Cancel
                          </Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          this.props.navigation.navigate('Refer'),
                            this.setState({showmodal: false});
                        }}>
                        <View
                          style={{
                            backgroundColor: '#ea0016',
                            justifyContent: 'center',
                            height: 30,
                            width: 60,
                            borderRadius: 4,
                          }}>
                          <Text
                            style={{
                              fontSize: 15,
                              color: 'white',
                              fontWeight: 'bold',
                              alignSelf: 'center',
                            }}>
                            Invite
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                <View
                  style={{
                    opacity: 0.6,
                    backgroundColor: 'black',
                    width: '10%',
                    height: '100%',
                  }}
                />
              </View>
              <TouchableOpacity
                style={{
                  opacity: 0.5,
                  backgroundColor: 'black',
                  height: Dimensions.get('window').height / 5,
                }}
                onPress={() => this.setState({showmodal: false})}>
                <View
                  style={{
                    opacity: 0.5,
                    backgroundColor: 'black',
                    height: Dimensions.get('window').height / 5,
                  }}
                />
              </TouchableOpacity>
            </View>
          </Modal>
        </View>
      </SafeAreaView>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
