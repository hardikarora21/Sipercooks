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
  Permission,
  PermissionsAndroid,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';
import {connect} from 'react-redux';
import Ic from 'react-native-vector-icons/Fontisto';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {updateuserProfileUrl, getUserProfile} from '../../Config/Constants';
import {
  loginSuccess,
  loginFail,
  getUserData,
} from '../Redux/Auth/ActionCreatore';
import Axios from 'axios';
var Querystringified = require('querystringify');

const mapStateToProps = state => {
  return {
    cart: state.cart,
    defaultVariants: state.defaultVariants,
    login: state.login,
    user: state.user,
  };
};

const mapDispatchToProps = dispatch => ({
  skipLoginForNow: () => dispatch(skipLoginForNow()),
  loginSuccess: userData => dispatch(loginSuccess(userData)),
  loginFail: () => dispatch(loginFail()),
  getUserData: customerId => dispatch(getUserData(customerId)),
});

class Setting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      description: '',
      email: '',
      getuserDataLoading: false,
      userData: {},
      updatingUserProfile: false,
    };
  }

  componentDidMount() {
    this.getuserData(this.props.login.userId);
  }

  getuserData = async customerId => {
    this.setState({getuserDataLoading: true});

    const url = getUserProfile(customerId);

    await Axios.get(url, {
      headers: {
        Authorization: 'bearer ' + '',
        'Content-type': 'application/json',
      },
      timeout: 15000,
    })
      .then(response => {
        console.log('User Profile ->', response.data.object[0]);
        this.setState({
          getuserDataLoading: false,
          userData: response.data.object[0],
        });
      })
      .catch(err => {
        this.setState({getuserDataLoading: false});
        console.log(err.message);
      });
  };

  postUserData = async customerId => {
    this.setState({updatingUserProfile: true});
    const url = updateuserProfileUrl(customerId);

    const {firstName, lastName, phoneNumber, description, email} = this.state;

    if (
      firstName === '' &&
      lastName === '' &&
      phoneNumber === '' &&
      description === '' &&
      email === ''
    ) {
      this.setState({updatingUserProfile: false});
      ToastAndroid.showWithGravity(
        'Please enter your info.',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
      return;
    }

    var dataToBeUploaded = this.state.userData;
    this.state.firstName === ''
      ? null
      : (dataToBeUploaded.firstName = this.state.firstName);
    this.state.lastName === ''
      ? null
      : (dataToBeUploaded.lastName = this.state.lastName);
    this.state.phoneNumber === ''
      ? null
      : (dataToBeUploaded.phoneNumber = this.state.phoneNumber);

    const emailRe = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (
      this.state.email !== '' &&
      emailRe.test(String(this.state.email).toLowerCase())
    ) {
      dataToBeUploaded.emailId = this.state.email;
    } else if (this.state.email !== '') {
      this.setState({updatingUserProfile: false});
      ToastAndroid.showWithGravity(
        'Please enter a valid email.',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
      return;
    }

    const stringifiedDataToBeUploaded = JSON.stringify(dataToBeUploaded);
    console.log('Data to be uploaded', dataToBeUploaded);
    console.log('Data to be uploaded', stringifiedDataToBeUploaded);
    // dataToBeUploaded.description = this.state.description;

    await Axios.put(url, stringifiedDataToBeUploaded, {
      headers: {
        Authorization: 'Bearer ' + this.props.login.accessToken,
        'Content-Type': 'application/json',
      },
    })
      .then(resp => {
        console.log(resp);
        if (resp.data.status) {
          this.setState({
            firstName: '',
            lastName: '',
            phoneNumber: '',
            description: '',
            email: '',
          });
          this.setState({updatingUserProfile: false});
          this.props.getUserData(this.props.login.userId);
          ToastAndroid.showWithGravity(
            'Profile Updated.',
            ToastAndroid.SHORT,
            ToastAndroid.CENTER,
          );
        }
      })
      .catch(err => {
        console.log(err.message);
        this.setState({updatingUserProfile: false});
      });
  };

  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        {this.state.updatingUserProfile && (
          <ActivityIndicator
            size={35}
            color="#EA0016"
            style={{
              position: 'absolute',
              alignSelf: 'center',
              top: 300,
              zIndex: 1000,
            }}
          />
        )}
        <View style={{flex: 1, backgroundColor: 'white'}}>
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
                    // elevation: 2,
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
              Settings
            </Text>
          </View>

          <ScrollView
            style={{height: '90%'}}
            showsVerticalScrollIndicator={false}>
            <View
              style={{
                backgroundColor: 'white',
                paddingHorizontal: 10,
                justifyContent: 'space-evenly',
                height: 70,
              }}>
              <Text
                style={{
                  fontSize: 14,
                  color: '#a7a7a7',
                }}>
                Profile Photo
              </Text>
              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                }}>
                <View
                  style={{
                    height: 35,
                    width: 35,
                    backgroundColor: '#fceae8',
                    borderRadius: 360,
                    alignSelf: 'center',
                  }}
                />
                <View
                  style={{
                    paddingLeft: 10,
                    width: '85%',
                    borderBottomColor: '#e7e7e7',
                    borderBottomWidth: 1,
                    justifyContent: 'center',
                    marginHorizontal: 10,
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      // this.requestCameraPermission();
                    }}>
                    <Text
                      style={{
                        fontSize: 12,
                        color: '#ea0016',
                        fontWeight: 'bold',
                      }}>
                      ADD IMAGE
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View
              style={{
                backgroundColor: 'white',
                paddingHorizontal: 10,
                justifyContent: 'space-evenly',
                height: 70,
                marginTop: 10,
              }}>
              <Text
                style={{
                  fontSize: 14,
                  color: '#a7a7a7',
                }}>
                First Name
              </Text>
              <TextInput
                style={{
                  borderBottomColor: '#e7e7e7',
                  borderBottomWidth: 1,
                  fontSize: 12,
                  paddingBottom: 0,
                  height: 40,
                }}
                value={this.state.firstName}
                onChangeText={text => {
                  this.setState({firstName: text});
                }}
                placeholderTextColor="#e1e1e1"
                placeholder="First Name"
                blurOnSubmit={true}
              />
            </View>
            <View
              style={{
                backgroundColor: 'white',
                paddingHorizontal: 10,
                justifyContent: 'space-evenly',
                height: 70,
                marginTop: 10,
              }}>
              <Text
                style={{
                  fontSize: 14,
                  color: '#a7a7a7',
                }}>
                Last Name
              </Text>
              <TextInput
                style={{
                  borderBottomColor: '#e7e7e7',
                  borderBottomWidth: 1,
                  fontSize: 12,
                  paddingBottom: 0,
                  height: 40,
                }}
                value={this.state.lastName}
                onChangeText={text => {
                  this.setState({lastName: text});
                }}
                placeholderTextColor="#e1e1e1"
                placeholder="Last Name"
                blurOnSubmit={true}
              />
            </View>
            <View
              style={{
                backgroundColor: 'white',
                paddingHorizontal: 10,
                justifyContent: 'space-evenly',
                height: 70,
                marginTop: 10,
              }}>
              <Text
                style={{
                  fontSize: 14,
                  color: '#a7a7a7',
                }}>
                Phone Number
              </Text>
              <TextInput
                editable={false}
                style={{
                  borderBottomColor: '#e7e7e7',
                  borderBottomWidth: 1,
                  fontSize: 12,
                  paddingBottom: 0,
                  height: 40,
                }}
                value={this.state.phoneNumber}
                onChangeText={text => {
                  this.setState({phoneNumber: text});
                }}
                placeholderTextColor="#e1e1e1"
                placeholder={
                  this.state.userData.phoneNo
                    ? this.state.userData.phoneNo
                    : 'Phone Number'
                }
                blurOnSubmit={true}
              />
            </View>
            <View
              style={{
                backgroundColor: 'white',
                paddingHorizontal: 10,
                justifyContent: 'space-evenly',
                height: 70,
                marginTop: 10,
              }}>
              <Text
                style={{
                  fontSize: 14,
                  color: '#a7a7a7',
                }}>
                Email
              </Text>
              <TextInput
                style={{
                  borderBottomColor: '#e7e7e7',
                  borderBottomWidth: 1,
                  fontSize: 12,
                  paddingBottom: 0,
                  height: 40,
                }}
                value={this.state.email}
                onChangeText={text => {
                  this.setState({email: text});
                }}
                placeholderTextColor="#e1e1e1"
                placeholder="example@example.com"
                blurOnSubmit={true}
                keyboardType="email-address"
              />
            </View>
            <View
              style={{
                backgroundColor: 'white',
                paddingHorizontal: 10,
                justifyContent: 'space-evenly',
                height: 70,
                marginTop: 10,
              }}>
              <Text
                style={{
                  fontSize: 14,
                  color: '#a7a7a7',
                }}>
                Description
              </Text>
              <TextInput
                style={{
                  borderBottomColor: '#e7e7e7',
                  borderBottomWidth: 1,
                  fontSize: 12,
                  paddingBottom: 0,
                  height: 40,
                }}
                value={this.state.description}
                onChangeText={text => {
                  this.setState({description: text});
                }}
                maxLength={150}
                placeholderTextColor="#e1e1e1"
                placeholder="Tell us about you ( not more than 150 characters)"
                blurOnSubmit={true}
              />
            </View>
            <TouchableOpacity
              onPress={() => {
                this.postUserData(this.props.login.userId);
              }}
              style={{
                height: 40,
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
                Save Changes
              </Text>
            </TouchableOpacity>
            {/* <TouchableOpacity
              onPress={() => this.props.logOut()}
              style={{
                height: 40,
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
                Logout
              </Text>
            </TouchableOpacity> */}
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Setting);
