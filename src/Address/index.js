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
  StyleSheet,
  ActivityIndicator,
  BackHandler,
  Alert,
  ToastAndroid,
} from 'react-native';
import Ic from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Axios from 'axios';
import {
  deliveriblityCheckUrl,
  getNearestStoreUrl,
  fetchCategoriesUrl,
} from '../../Config/Constants';
import {
  getuserAddresses,
  addSelectedAddress,
  addressSelected,
  addNearestSupplier,
  deleteNearestSupplier,
} from '../Redux/Auth/ActionCreatore';

import {connect} from 'react-redux';

const mapStateToProps = state => {
  return {
    cart: state.cart,
    defaultVariants: state.defaultVariants,
    login: state.login,
    addresses: state.addresses,
  };
};

const mapDispatchToProps = dispatch => ({
  getuserAddresses: customerId => dispatch(getuserAddresses(customerId)),
  addSelectedAddress: address => dispatch(addSelectedAddress(address)),
  addressSelected: () => dispatch(addressSelected()),
  addNearestSupplier: nearestSupplierId =>
    dispatch(addNearestSupplier(nearestSupplierId)),
  deleteNearestSupplier: () => dispatch(deleteNearestSupplier()),
});

class Address extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isAddressesLoading: false,
      customerAddresses: [],
      networkError: false,
      develireblityCheckModelShown: false,
      develireblityCheckLoading: false,
      deleveriblityCheckData: [],
      selectedAddress: null,
    };
  }

  findNearestStore = async (lattitude, longitude, supplierId) => {
    var url = getNearestStoreUrl(supplierId, lattitude, longitude);
    await Axios.get(url, {
      headers: {
        Authorization: 'bearer ' + '',
        'Content-type': 'application/json',
      },
      timeout: 15000,
    })
      .then(resp => {
        console.log(
          'Nearesr supplies data=================================================================================================================================>',
          resp.data.object,
        );
        var indexOfNearestSupplier = 0;
        var minimumDistance = 0;
        resp.data.object.map((item, index) => {
          if (index === 0) {
            indexOfNearestSupplier = 0;
            minimumDistance = item.distance;
          } else {
            if (item.distance < minimumDistance) {
              minimumDistance = item.distance;
              indexOfNearestSupplier = index;
            }
          }
        });
        var nearestSupplierData = [resp.data.object[indexOfNearestSupplier]];
        this.props.addNearestSupplier(nearestSupplierData);
      })
      .catch(error => {
        console.log(
          'Error in fetching nearest supplier=================================>',
          error.message,
        );
      });
  };

  checkDeliveriblity = async slelectedAddress => {
    this.setState({
      develireblityCheckLoading: true,
    });
    var url = fetchCategoriesUrl();

    console.log(slelectedAddress.latitude, slelectedAddress.longitude, url);
    console.log(
      'ttt-->' +
        url +
        '1/' +
        slelectedAddress.latitude +
        '/' +
        slelectedAddress.longitude,
    );
    await Axios.get(
      url + '1/' + slelectedAddress.latitude + '/' + slelectedAddress.longitude,
      {
        headers: {
          Authorization: 'bearer ' + '',
          'Content-type': 'application/json',
        },
        timeout: 15000,
      },
    )
      .then(response => {
        console.log('Deliveriblity check data->', response.data.object);
        this.setState({
          develireblityCheckLoading: false,
          deleveriblityCheckData: response.data.object,
        });
        if (response.data.object.length == 0) {
          this.setState({develireblityCheckModelShown: true});
        } else {
          ToastAndroid.show('Dilevery Address Selected', ToastAndroid.LONG);
          this.setState({develireblityCheckModelShown: false});
          if (this.props.addresses.userAddresses.length === 1) {
            this.props.navigation.navigate('Setting').then(() => {
              this.props.addSelectedAddress(slelectedAddress);

              if (this.props.login.hasSelectedAddress) {
                this.props.navigation.goBack();
              } else this.props.addressSelected();
            });
          } else {
            this.props.addSelectedAddress(slelectedAddress);

            if (this.props.login.hasSelectedAddress) {
              this.props.navigation.goBack();
            } else this.props.addressSelected();
          }
        }
      })
      .catch(error => {
        console.log('Error', error);
      });
  };

  componentDidMount() {
    console.log(
      'This is the address selected by the user on address screen linne 101 ===================',
      this.props.addresses.selectedAddress,
    );
    var data = {
      currentSelectedAddress: this.props.addresses.selectedAddress,
      userId: this.props.login.userId,
    };
    this.props.getuserAddresses(data);
  }
  render() {
    return (
      <SafeAreaView style={{backgroundColor: 'white'}}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{backgroundColor: '#efefef'}}>
            <StatusBar barStyle={'dark-content'} backgroundColor={'white'} />
            {this.state.develireblityCheckLoading ? (
              <View
                style={{
                  position: 'absolute',
                  alignSelf: 'center',
                  zIndex: 1000,
                  marginTop: 300,
                }}>
                <ActivityIndicator size={30} color="#ea0016" />
              </View>
            ) : null}
            <View
              style={{
                height: 65,
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
                  backgroundColor: 'white',
                  justifyContent: 'center',
                  alignSelf: 'center',
                  marginTop: 2,
                }}
                onPress={() =>
                  ToastAndroid.show(
                    'Please Select One Address',
                    ToastAndroid.LONG,
                  )
                }>
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
                  height: '100%',
                  width: Dimensions.get('window').width - 42,
                  justifyContent: 'space-evenly',
                  marginLeft: 10,
                  alignSelf: 'center',
                }}>
                <Text
                  style={{
                    color: 'black',
                    fontSize: 20,
                    paddingLeft: 4,
                  }}>
                  SET DELIVERY LOCATION
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={{
                height: 65,
                backgroundColor: 'white',
                flexDirection: 'row',
                width: '100%',
                paddingHorizontal: 18,
                alignSelf: 'center',
                marginTop: 0.8,
                marginBottom: 10,
              }}
              onPress={() => {
                this.props.navigation.navigate('AddAddress');
              }}>
              <View style={{flexDirection: 'row'}}>
                <Ic
                  name={'my-location'}
                  size={20}
                  color={'red'}
                  style={{alignSelf: 'center'}}
                />
                <View
                  style={{
                    justifyContent: 'center',
                    alignSelf: 'center',
                    marginLeft: 10,
                  }}>
                  <Text
                    style={{
                      color: 'red',
                      fontSize: 14,
                      fontWeight: 'bold',
                    }}>
                    Current Location
                  </Text>
                  <Text
                    style={{
                      color: 'red',
                      fontSize: 12,
                    }}>
                    Using GPS
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
            <View
              style={{
                paddingHorizontal: 10,
                backgroundColor: 'white',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 15,
                  paddingBottom: 15,
                  borderBottomColor: 'white',
                }}>
                <Text
                  style={{
                    fontSize: 12,
                    paddingLeft: 25,
                    alignSelf: 'center',
                    color: 'gray',
                  }}>
                  SAVED ADDRESSES
                </Text>
              </View>
            </View>
            {this.props.addresses.userAddresses.length > 0 &&
            !this.props.addresses.addressesLoading
              ? this.props.addresses.userAddresses
                  .slice(0)
                  .reverse()
                  .map((item, index) => {
                    return (
                      <TouchableOpacity
                        key={index}
                        onPress={() => {
                          this.setState({selectedAddress: item});
                          this.checkDeliveriblity(
                            // item.latitude,
                            // item.longitude,
                            item,
                          );
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            backgroundColor: 'white',
                            borderBottomColor: '#efefef',
                            justifyContent: 'space-evenly',
                          }}>
                          {item.addressOf === 'Work' ? (
                            <Image
                              source={require('../assets/work.png')}
                              style={{
                                height: 20,
                                width: 20,
                                resizeMode: 'contain',
                                alignSelf: 'center',
                                marginTop: -5,
                              }}
                            />
                          ) : null}
                          {item.addressOf === 'Office' ? (
                            <Image
                              source={require('../assets/work.png')}
                              style={{
                                height: 20,
                                width: 20,
                                resizeMode: 'contain',
                                alignSelf: 'center',
                                marginTop: -5,
                              }}
                            />
                          ) : null}
                          {item.addressOf === 'Home' ? (
                            <Image
                              source={require('../assets/home.png')}
                              style={{
                                height: 20,
                                width: 20,
                                resizeMode: 'contain',
                                alignSelf: 'center',
                                marginTop: -5,
                              }}
                            />
                          ) : null}
                          {item.addressOf === 'Other' ? (
                            <Image
                              source={require('../assets/others.png')}
                              style={{
                                height: 20,
                                width: 20,
                                resizeMode: 'contain',
                                alignSelf: 'center',
                                marginTop: -5,
                              }}
                            />
                          ) : null}
                          <View
                            style={{
                              width: '80%',
                              borderBottomWidth: 1,
                              // backgroundColor: 'white',
                              alignSelf: 'center',
                              paddingTop: 15,
                              paddingBottom: 15,
                              borderBottomColor: '#efefef',
                              justifyContent: 'space-between',
                            }}>
                            <Text
                              style={{
                                fontSize: 15,
                                fontWeight: 'bold',
                              }}>
                              {item.addressOf}
                            </Text>
                            <Text
                              style={{
                                fontSize: 10,
                                color: '#a7a7a7',
                              }}>
                              {item.addressLine1}
                            </Text>
                            <Text
                              style={{
                                fontSize: 10,
                                color: '#a7a7a7',
                              }}>
                              {item.addressLine2}
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    );
                  })
              : null}

            {/* Blank View at the bottom of the addresses list*/}

            <View
              style={{
                flexDirection: 'row',
                backgroundColor: 'white',
                borderBottomColor: '#efefef',
                justifyContent: 'space-evenly',
                MaxHeight: 7,
              }}>
              <View
                style={{
                  backgroundColor: 'white',
                  alignSelf: 'center',
                  paddingTop: 15,
                  paddingBottom: 15,
                }}
              />
            </View>
          </View>
        </ScrollView>

        <Modal
          visible={this.state.develireblityCheckModelShown}
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
                height: 500,
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
                      height: '40%',
                      width: '60%',
                      alignSelf: 'center',
                      resizeMode: 'contain',
                    }}
                    source={require('../assets/llog.png')}
                  />
                  <View style={{paddingHorizontal: 15, height: 170}}>
                    <Text
                      style={{
                        fontSize: 18,
                        color: 'black',
                        fontWeight: 'bold',
                        alignSelf: 'center',
                        textAlign: 'center',
                        marginTop: 10,
                      }}>
                      welcome to Super Cooks
                    </Text>

                    <Text
                      style={{
                        fontSize: 12,
                        color: 'black',
                        alignSelf: 'center',
                        textAlign: 'center',
                        marginVertical: 10,
                        marginHorizontal: 15,
                      }}>
                      'We do not have home delivery service to your location,
                      but you could still place an order and SELF PICK-UP from
                      our Address{'\n'}We would reach out to you whenever we
                      open a store in your vicinity and start home delivery
                      services'
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      width: '60%',
                      justifyContent: 'space-evenly',
                      alignSelf: 'flex-end',
                      marginHorizontal: 30,
                      height: 50,
                    }}>
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({develireblityCheckModelShown: false});
                      }}>
                      <View
                        style={{
                          justifyContent: 'center',
                          height: 30,
                          width: 60,
                          borderRadius: 4,
                          marginVertical: 10,
                          marginHorizontal: 20,
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
                        if (this.state.develireblityCheckLoading) {
                          return;
                        } else {
                          this.setState({develireblityCheckModelShown: false});
                          this.props.addSelectedAddress(
                            this.state.selectedAddress,
                          );
                          if (this.props.login.hasSelectedAddress) {
                            this.props.navigation.goBack();
                          } else this.props.addressSelected();
                          this.props.deleteNearestSupplier();
                        }
                        console.log(
                          'Address selected by user=====================================================',
                          JSON.stringify(this.props.addresses.selectedAddress),
                        );
                      }}>
                      <View
                        style={{
                          backgroundColor: '#ea0016',
                          justifyContent: 'center',
                          height: 50,
                          width: 130,
                          borderRadius: 4,
                          paddingHorizontal: 10,
                          paddingVertical: 5,
                        }}>
                        <Text
                          numberOfLines={2}
                          style={{
                            fontSize: 14,
                            color: 'white',
                            fontWeight: 'bold',
                            alignSelf: 'center',
                            textAlign: 'center',
                          }}>
                          Order with self pick up
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
      </SafeAreaView>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Address);

const styles = StyleSheet.create({
  modalView: {
    margin: 20,
    marginTop: 60,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
