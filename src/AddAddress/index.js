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
  ToastAndroid,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ico from 'react-native-vector-icons/MaterialIcons';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import GetLocation from 'react-native-get-location';
import RNGooglePlaces from 'react-native-google-places';
import Geocoder from 'react-native-geocoding';
import {gioCoderApiKey} from '../../Config/Constants';
var Querystringified = require('querystringify');
import {uploadAddressUrl} from '../../Config/Constants';
import Axios from 'axios';
import {getuserAddresses} from '../Redux/Auth/ActionCreatore';
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
});

class AddAddress extends React.Component {
  state = {
    tagSelected: 'none',
    address: '',
    latitude: 0,
    longitude: 0,
    completeAddress: '',
    floor: '',
    howToReach: '',
    addressGeoCodedData: '',
    wholeAddress: '',
    locationName: '',
    currentLocation: '',
  };

  componentDidMount() {
    this.getCurrentoaction();
  }

  getCurrentoaction = () => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    })
      .then(location => {
        // console.log('location--> ' + JSON.stringify(location));
        Geocoder.from(location.latitude, location.longitude)
          .then(json => {
            this.setState({
              address: json.results[0].formatted_address,
              addressGeoCodedData: json.results[0],
            });
            console.log('formatted Address :', json.results[0]);
          })
          .catch(error => console.log('error geocds ' + JSON.stringify(error)));
        this.setState({
          longitude: location.longitude,
          latitude: location.latitude,
        });
      })
      .catch(error => {
        console.log('error' + error);
      });
    Geocoder.init(gioCoderApiKey);
  };

  postAddress = async () => {
    if (this.state.completeAddress === '') {
      ToastAndroid.showWithGravity(
        'Please enter Complete Address',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
      return;
    }
    if (this.state.floor === '') {
      ToastAndroid.showWithGravity(
        'Please enter Society name',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
      return;
    }
    if (this.state.tagSelected === 'none') {
      ToastAndroid.showWithGravity(
        'Please tag this address',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
      return;
    }
    const addressCompoennt = this.state.addressGeoCodedData.address_components;
    const addressToBePosted = {
      addressLine1: this.state.address,
      addressLine2: this.state.floor + ', ' + this.state.completeAddress,
      addressOf: this.state.tagSelected,

      addressState:
        addressCompoennt.findIndex(
          x => x.types[0] === 'administrative_area_level_1',
        ) !== -1
          ? addressCompoennt[
              addressCompoennt.findIndex(
                x => x.types[0] === 'administrative_area_level_1',
              )
            ].long_name
          : 'unknown',

      city:
        addressCompoennt.findIndex(
          x => x.types[0] === 'administrative_area_level_2',
        ) !== -1
          ? addressCompoennt[
              addressCompoennt.findIndex(
                x => x.types[0] === 'administrative_area_level_2',
              )
            ].long_name
          : 'unknown',

      country:
        addressCompoennt.findIndex(x => x.types[0] === 'country') !== -1
          ? addressCompoennt[
              addressCompoennt.findIndex(x => x.types[0] === 'country')
            ].long_name
          : 'unknown',

      customerId: this.props.login.userId,
      landmark: this.state.howToReach,
      latitude: this.state.latitude.toString(),
      longitude: this.state.longitude.toString(),
      pincode:
        addressCompoennt[
          addressCompoennt.findIndex(x => x.types[0] === 'postal_code')
        ].long_name,
    };

    console.log(addressToBePosted);
    let data_res = JSON.stringify(addressToBePosted);

    try {
      let response = await Axios.post(uploadAddressUrl, data_res, {
        headers: {
          Authorization: 'Bearer ' + this.props.login.accessToken,
          'Content-Type': 'application/json',
        },
      });
      console.log('Post address response', response);

      var data = {
        currentSelectedAddress: this.props.addresses.selectedAddress,
        userId: this.props.login.userId,
      };
      this.props.getuserAddresses(data);
      // this.props.getuserAddresses(this.props.login.userId);

      ToastAndroid.showWithGravity(
        'Address Added',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
      this.props.navigation.goBack();
      // console.log('response.data.accessToken', response.data.access_token);
    } catch (e) {
      console.log('e', e);
      // this.props.loginFail();
      return;
    }

    console.log(data_res);
  };

  openSearchModal = () => {
    RNGooglePlaces.openAutocompleteModal({country: 'IN'})
      .then(place => {
        console.log('locationNamelocationName', place);
        Geocoder.from(place.location.latitude, place.location.longitude)
          .then(json => {
            this.setState({
              address: json.results[0].formatted_address,
              addressGeoCodedData: json.results[0],
            });
            console.log('formatted Address :', json.results[0]);
          })
          .catch(error => console.log('error geocds ' + JSON.stringify(error)));
        this.setState({
          longitude: place.location.longitude,
          latitude: place.location.latitude,
        });
      })
      .catch(error => console.log(error.message)); // error is a Javascript Error object
  };

  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <View style={{flex: 1, backgroundColor: 'white'}}>
          
          <ScrollView showsVerticalScrollIndicator={false}>
            <MapView
              style={{
                height: Dimensions.get('window').height / 2,
                width: Dimensions.get('window').width,
                justifyContent: 'center',
              }}
              provider={PROVIDER_GOOGLE}
              region={{
                latitude: this.state.latitude,
                longitude: this.state.longitude,
                latitudeDelta: 0.015,
                longitudeDelta: 0.015,
              }}
              followsUserLocation={true}
              showsUserLocation={true}>
              <Image
                source={require('../assets/pin.png')}
                style={{
                  height: 40,
                  width: 40,
                  resizeMode: 'contain',
                  alignSelf: 'center',
                  zIndex: 10,
                  elevation: 10,
                  position: 'absolute',
                  tintColor: 'black',
                }}
              />
            </MapView>
            <View
              style={{
                paddingHorizontal: 20,
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginVertical: 15,
              }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                }}>
                Enter Address Details
              </Text>
            </View>
            <View
              style={{
                paddingHorizontal: 23,
              }}>
              <Text
                style={{
                  fontSize: 10,
                  color: 'gray',
                }}>
                YOUR LOCATION
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 10,
                  borderBottomWidth: 1,
                  borderBottomColor: '#e7e7e7',
                  paddingBottom: 10,
                }}>
                <Image
                  source={require('../assets/location.png')}
                  style={{
                    alignSelf: 'center',
                    height: 15,
                    width: 15,
                    resizeMode: 'contain',
                    marginTop: 2,
                  }}
                />
                {this.state.address == '' ? (
                  <Text
                    style={{
                      fontSize: 15,
                      color: 'gray',
                      paddingLeft: 5,
                      fontWeight: 'bold',
                      alignSelf: 'center',
                      width: '80%',
                    }}
                    numberOfLines={1}>
                    Loading . . .
                  </Text>
                ) : (
                  <Text
                    style={{
                      fontSize: 15,
                      color: 'black',
                      paddingLeft: 5,
                      fontWeight: 'bold',
                      alignSelf: 'center',
                      width: '80%',
                    }}
                    numberOfLines={1}>
                    {this.state.address}
                  </Text>
                )}
                <TouchableOpacity onPress={this.openSearchModal}>
                  <Text
                    style={{
                      fontSize: 14,
                      color: '#EA0016',
                      fontWeight: 'bold',
                      alignSelf: 'center',
                    }}>
                    Change
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={{
                paddingHorizontal: 23,
                marginTop: 10,
                justifyContent: 'center',
              }}>
              <TextInput
                style={{
                  borderBottomColor: '#e7e7e7',
                  borderBottomWidth: 1,
                }}
                value={this.state.completeAddress}
                onChangeText={text => {
                  this.setState({completeAddress: text});
                }}
                placeholder="Your Complete Address"
              />
            </View>
            <View
              style={{
                paddingHorizontal: 23,
                marginTop: 10,
              }}>
              <TextInput
                style={{
                  borderBottomColor: '#e7e7e7',
                  borderBottomWidth: 1,
                }}
                value={this.state.floor}
                onChangeText={text => {
                  this.setState({floor: text});
                }}
                placeholder="Society"
              />
            </View>
            <View
              style={{
                paddingHorizontal: 23,
                marginTop: 10,
                justifyContent: 'center',
              }}>
              <TextInput
                style={{
                  borderBottomColor: '#e7e7e7',
                  borderBottomWidth: 1,
                }}
                value={this.state.howToReach}
                onChangeText={text => {
                  this.setState({howToReach: text});
                }}
                placeholder="Landmark (Optional)*"
              />
            </View>
            <Text
              style={{
                fontSize: 14,
                color: 'gray',
                paddingLeft: 23,
                marginTop: 15,
              }}>
              Tag this Address as
            </Text>
            <View
              style={{
                paddingHorizontal: 23,
                flexDirection: 'row',
                marginTop: 10,
                justifyContent: 'space-between',
                width: Dimensions.get('window').width / 1.3,
              }}>
              <Text
                onPress={() => this.setState({tagSelected: 'Home'})}
                style={[
                  this.state.tagSelected == 'Home'
                    ? {
                        color: 'white',
                        backgroundColor: '#EA0016',
                        fontWeight: 'bold',
                        borderWidth: 1,
                        borderColor: 'white',
                      }
                    : {
                        borderWidth: 1,
                        color: '#a1a1a1',
                        borderColor: '#a1a1a1',
                      },
                  {
                    fontSize: 12,
                    paddingVertical: 4,
                    paddingHorizontal: 8,

                    borderRadius: 5,
                  },
                ]}>
                Home
              </Text>
              <Text
                onPress={() => this.setState({tagSelected: 'Work'})}
                style={[
                  this.state.tagSelected == 'Work'
                    ? {
                        color: 'white',
                        backgroundColor: '#EA0016',
                        fontWeight: 'bold',
                        borderWidth: 1,
                        borderColor: 'white',
                      }
                    : {
                        borderWidth: 1,
                        color: '#a1a1a1',
                        borderColor: '#a1a1a1',
                      },
                  {
                    fontSize: 12,
                    paddingVertical: 4,
                    paddingHorizontal: 8,

                    borderRadius: 5,
                  },
                ]}>
                Work
              </Text>
              <Text
                onPress={() => this.setState({tagSelected: 'Office'})}
                style={[
                  this.state.tagSelected == 'Office'
                    ? {
                        color: 'white',
                        backgroundColor: '#EA0016',
                        fontWeight: 'bold',
                        borderWidth: 1,
                        borderColor: 'white',
                      }
                    : {
                        borderWidth: 1,
                        color: '#a1a1a1',
                        borderColor: '#a1a1a1',
                      },
                  {
                    fontSize: 12,
                    paddingVertical: 4,
                    paddingHorizontal: 8,

                    borderRadius: 5,
                  },
                ]}>
                Office
              </Text>
              <Text
                onPress={() => this.setState({tagSelected: 'Other'})}
                style={[
                  this.state.tagSelected == 'Other'
                    ? {
                        color: 'white',
                        backgroundColor: '#EA0016',
                        fontWeight: 'bold',
                        borderWidth: 1,
                        borderColor: 'white',
                      }
                    : {
                        borderWidth: 1,
                        color: '#a1a1a1',
                        borderColor: '#a1a1a1',
                      },
                  {
                    fontSize: 12,
                    paddingVertical: 4,
                    paddingHorizontal: 8,

                    borderRadius: 5,
                  },
                ]}>
                Other
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => this.postAddress()}
              style={{
                height: 50,
                marginVertical: 25,
                borderRadius: 5,
                width: Dimensions.get('window').width / 1.15,
                alignSelf: 'center',
                justifyContent: 'center',
                backgroundColor: '#EA0016',
              }}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 15,
                  fontWeight: 'bold',
                  alignSelf: 'center',
                }}>
                Save Address
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddAddress);
