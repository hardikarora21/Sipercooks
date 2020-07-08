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
  ImageBackground,
  Alert,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Button,
  ToastAndroid,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Theme from '../../../styles/theme';
import style from '../../../../style';
import Layout from '../../../styles/layout';
import Axios from 'axios';
// import RNOtpVerify from 'react-native-otp-verify';
import SmsRetriever from 'react-native-sms-retriever';
import {otpVerificationUrl} from '../../../../Config/Constants';
var Querystringified = require('querystringify');

import {validatePhoneNumberUrl} from '../../../../Config/Constants';

import {connect} from 'react-redux';
import {
  loginSuccess,
  loginFail,
  skipLogin,
} from '../../../Redux/Auth/ActionCreatore';

const mapStateToProps = state => {
  return {
    cart: state.cart,
    defaultVariants: state.defaultVariants,
    login: state.login,
  };
};

const mapDispatchToProps = dispatch => ({
  skipLoginForNow: () => dispatch(skipLoginForNow()),
  loginSuccess: userData => dispatch(loginSuccess(userData)),
  loginFail: () => dispatch(loginFail()),
  skipLogin: () => dispatch(skipLogin()),
});

const EVENT_TYPES = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  OTP_START: 'OTP_START',
  OTP_SUCCESS: 'OTP_SUCCESS',
  OTP_FAILURE: 'OTP_FAILURE',
};

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      check: false,
      toAddress: false,
      mobile: '',
      showModal: false,
      firstCode: '',
      secondCode: '',
      thirdCode: '',
      fourthCode: '',
      fifthCode: '',
      sixthCode: '',
      code: '',
      resendOtp: 1,
      showlogin: false,
      Keyboard: false,
    };
  }

  componentWillUnmount() {
    // if (Platform.OS == 'android') {
    //   SmsRetriever.removeSmsListener();
    // }
  }

  moveToSecond(text) {
    this.setState({firstCode: text});
    this.refs.input2.focus();
  }
  moveToThird(text) {
    this.setState({secondCode: text});
    this.refs.input3.focus();
  }
  moveToFourth(text) {
    this.setState({thirdCode: text});
    this.refs.input4.focus();
  }
  moveToFifth(text) {
    this.setState({fourthCode: text});
    this.refs.input5.focus();
  }
  moveToSixth(text) {
    this.setState({fifthCode: text});
    this.refs.input6.focus();
  }
  moveToNext(text) {
    this.setState({sixthCode: text});
    let one = this.state.firstCode.toString();
    let two = this.state.secondCode.toString();
    let three = this.state.thirdCode.toString();
    let four = this.state.fourthCode.toString();
    let five = this.state.fifthCode.toString();
    let six = text.toString();
    let code = +''.concat(one, two, three, four, five, six);
    this.setState({code: code});
  }

  async validatePhoneNumber(phoneNumber) {
    console.log('Validating phone number');
    var phoneno = /^\d{10}$/;

    if (phoneNumber.length < 10) {
      ToastAndroid.showWithGravity(
        'Please Enter a Valid Phone Number For OTP Verification.',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
    } else if (!phoneno.test(parseInt(phoneNumber))) {
      ToastAndroid.showWithGravity(
        'Please Enter a Valid Phone Number For OTP Verification.',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
    } else {
      let supplierID = 59;
      var url = validatePhoneNumberUrl(supplierID, phoneNumber);
      await Axios.get(url)
        .then(resp => {
          this.setState({showModal: true});
          console.log('Responce from server =====================', resp);
        })
        .catch(err => {
          console.log('error =====================', err.message);
        });
    }
  }

  validateOTP = async requestObject => {
    console.log('requestObject in otp', requestObject);
    if (!requestObject.otp) {
      ToastAndroid.showWithGravity(
        'Please enter the OTP.',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
      return;
    }
    var body = {
      username: requestObject.phoneNo + '/1',
      password: requestObject.otp,
      grant_type: 'password',
    };
    let data_res = Querystringified.stringify(body);
    var url = otpVerificationUrl();
    console.log('Body for url------------>', body);

    await Axios.post(
      'http://ec2-3-6-120-2.ap-south-1.compute.amazonaws.com/oauth/token',
      data_res,
      {
        headers: {
          Authorization: 'Basic VVNFUl9DVVNUT01FUl9BUFA6cGFzc3dvcmQ=',
          'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
        withCredentials: true,
      },
    )
      .then(response => {
        console.log('login response', response);
        console.log('response.data.accessToken', response.data.access_token);

        var userObject = {
          accessToken: response.data.access_token,
          refreshToken: response.data.refresh_token,
          userId: response.data.userId.toString(),
          loginCount: response.data.loginCount.toString(),
          hasSelectedAddress: false,
        };

        if (response.data.personName != null) {
          userObject.userName = response.data.personName;
        } else {
          userObject.userName = this.state.mobile;
        }

        this.setState({showModal: false});
        this.props.loginSuccess(userObject);
        this.props.navigation.navigate('Address', {
          fromLogin: true,
        });
      })
      .catch(err => {
        console.log('error kapil', JSON.stringify(err));
        this.props.loginFail();
        ToastAndroid.showWithGravity(
          'Login failed',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
      });

    // console.log('usserId', this.props.login.userId);
  };

  updateHashKeyOnServer(hashCodeKey) {
    console.log('dfghvbjknlm', hashCodeKey);
    var url = Config.API_LOGIN + '/api/v3/notification';
    var body = {
      hashCodeKey: hashCodeKey,
      notificationSubType: 20,
      notificationType: 4,
      supplier: Config.SUPPLIER_ID,
    };
    Axios.patch(url, body)
      .then(response => {
        console.log('sucessfully sent', response);
      })
      .catch(error => {
        console.log('Error', error);
      });
  }

  _onSmsListenerPressed = async () => {
    console.log('SMS listner started==============================');
    try {
      const registered = await SmsRetriever.startSmsRetriever();
      if (registered) {
        console.log('SMS listner registerd=================================');
        SmsRetriever.addSmsListener(event => {
          console.log('Listning for message ================================');
          console.log(event.message);
          SmsRetriever.removeSmsListener();
          console.log('Removed SMS listenr==============================');
        });
      }
    } catch (error) {
      console.log('error in sms listner', JSON.stringify(error));
    }
  };

  onSmsListenerPressed = async () => {
    // RNOtpVerify.getHash()
    //   .then(p => {
    //     console.log('App code is ', p);
    //     this.updateHashKeyOnServer(p[0]);
    //   })
    //   .catch(console.log);

    try {
      const registered = await SmsRetriever.startSmsRetriever();
      if (registered) {
        SmsRetriever.addSmsListener(event => {
          console.log(event);
          if (event.message == undefined) {
          } else {
            var msgArray = event.message.split(' ');
            const messageData = {
              otp: event.message.split(' ')[msgArray.length - 3],
              firstCode: event.message
                .split(' ')
                [msgArray.length - 3].toString()
                .split('')[0]
                .toString(),
              secondCode: event.message
                .split(' ')
                [msgArray.length - 3].toString()
                .split('')[1]
                .toString(),
              thirdCode: event.message
                .split(' ')
                [msgArray.length - 3].toString()
                .split('')[2]
                .toString(),
              fourthCode: event.message
                .split(' ')
                [msgArray.length - 3].toString()
                .split('')[3]
                .toString(),
              fifthCode: event.message
                .split(' ')
                [msgArray.length - 3].toString()
                .split('')[4]
                .toString(),
              sixthCode: event.message
                .split(' ')
                [msgArray.length - 3].toString()
                .split('')[5]
                .toString(),
            };
            console.log(messageData);
            // this.forceUpdate();
            // this.props.usecase.validateOTP(this.props.data);
            SmsRetriever.removeSmsListener();
          }
        });
      }
    } catch (error) {
      console.log(JSON.stringify(error));
    }
  };

  render() {
    if (this.state.toAddress == false) {
      return (
        <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
          <View
            style={{
              width: Dimensions.get('window').width,
              height: Dimensions.get('window').height,
              justifyContent: 'space-between',
            }}>
            <ImageBackground
              style={{
                width: Dimensions.get('window').width,
                height: Dimensions.get('window').height,
                justifyContent: 'space-between',
              }}
              imageStyle={{
                width: Dimensions.get('window').width,
                height: Dimensions.get('window').height,
                resizeMode: 'cover',
                tintColor: 'white',
              }}
              // source={require('../../../assets/back.png')}
            >
              <View
                style={{
                  width: '100%',
                  height: '100%',
                  paddingHorizontal: 23,
                }}>
                <StatusBar
                  barStyle={'dark-content'}
                  backgroundColor={'#fceae8'}
                />
                {this.state.Keyboard == false ? (
                  <View
                    style={{
                      height: '82%',
                      width: '100%',
                      justifyContent: 'center',
                    }}>
                    <Image
                      style={{
                        height: 300,
                        width: '100%',
                        resizeMode: 'contain',
                        alignSelf: 'center',
                        marginTop: '9%',
                      }}
                      source={require('../../../assets/llog.png')}
                    />
                  </View>
                ) : (
                  <View
                    style={{
                      height: '52%',
                      width: '100%',
                      justifyContent: 'center',
                    }}>
                    <Image
                      style={{
                        height: 300,
                        width: '100%',
                        resizeMode: 'contain',
                        alignSelf: 'center',
                      }}
                      source={require('../../../assets/llog.png')}
                    />
                  </View>
                )}
                <View
                  style={{
                    justifyContent: 'space-between',
                    height: '18%',
                  }}>
                  {this.state.showlogin == false ? (
                    <View>
                      <TouchableOpacity
                        onPress={() => {
                          ToastAndroid.showWithGravity(
                            'Login Skipped.',
                            ToastAndroid.SHORT,
                            ToastAndroid.CENTER,
                          );
                          this.props.skipLogin();
                        }}
                        style={{
                          height: 50,
                          width: Dimensions.get('window').width / 1.25,
                          backgroundColor: '#ef5854',
                          alignSelf: 'center',
                          marginBottom: 12,
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderRadius: 50,
                        }}>
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: 'bold',
                            color: 'white',
                          }}>
                          Skip Login & Explore
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => this.setState({showlogin: true})}
                        style={{
                          height: 50,
                          width: Dimensions.get('window').width / 1.25,
                          backgroundColor: '#ffdbd3',
                          alignSelf: 'center',
                          marginBottom: 12,
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderRadius: 50,
                        }}>
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: 'bold',
                            color: 'black',
                          }}>
                          Login
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View
                      style={{
                        marginBottom: 40,
                        justifyContent: 'center',
                        alignSelf: 'flex-end',
                        marginTop: -15,
                      }}>
                      <Text
                        style={{
                          color: 'black',
                          alignSelf: 'center',
                          textAlign: 'center',
                        }}>
                        Sign up and shop at your Dependable Neighbourhood Store
                      </Text>
                      <View
                        style={{
                          height: 50,
                          marginTop: 15,
                          borderRadius: 5,
                          overflow: 'hidden',
                          borderColor: '#a7a7a7',
                          width: '100%',
                          backgroundColor: 'white',
                          justifyContent: 'center',
                          flexDirection: 'row',
                          elevation: 15,
                        }}>
                        <Text
                          style={{
                            color: '#e1e1e1',
                            backgroundColor: 'white',
                            paddingHorizontal: 10,
                            fontSize: 15,
                            alignSelf: 'center',
                            textAlign: 'right',
                            width: '20%',
                          }}>
                          +91{'  '}
                        </Text>
                        <View
                          style={{
                            alignSelf: 'center',
                            height: 30,
                            width: 1,
                            backgroundColor: '#e1e1e1',
                          }}
                        />
                        <TextInput
                          keyboardType={'number-pad'}
                          maxLength={10}
                          onResponderStart={() =>
                            this.setState({Keyboard: true})
                          }
                          onAccessibilityAction={() =>
                            this.setState({Keyboard: false})
                          }
                          placeholder={'Mobile Number'}
                          placeholderTextColor={'#e1e1e1'}
                          onChangeText={txt => this.setState({mobile: txt})}
                          style={{
                            width: '55%',

                            fontSize: 15,
                            height: 50,
                            alignSelf: 'center',
                            justifyContent: 'center',
                            paddingLeft: 10,
                          }}
                        />
                        {this.state.mobile.length === 10 ? (
                          <TouchableOpacity
                            onPress={() => {
                              if (Platform.OS == 'ios') {
                                this.state.check
                                  ? this.validatePhoneNumber(this.state.mobile)
                                  : Alert.alert(
                                      `Please Accept Terms & Conditions`,
                                      'By clicking on check box you indicate that you have read and agree to the terms of the NEEDS Market',
                                    );
                              } else {
                                if (this.state.check) {
                                  // this._onSmsListenerPressed();
                                  this.validatePhoneNumber(this.state.mobile);
                                } else {
                                  Alert.alert(
                                    `Please Accept Terms & Conditions`,
                                    'By clicking on check box you indicate that you have read and agree to the terms of the NEEDS Market',
                                  );
                                }
                              }
                            }}
                            style={{
                              backgroundColor: '#EA0016',
                              width: '25%',
                              borderRadius: 3,
                              marginRight: 4,
                              height: 46,
                              alignSelf: 'center',
                              justifyContent: 'center',
                            }}>
                            <Image
                              source={require('../../../assets/arrow.png')}
                              style={{
                                width: 20,
                                height: 28,
                                resizeMode: 'contain',
                                alignSelf: 'center',
                                tintColor: 'white',
                              }}
                            />
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity
                            style={{
                              backgroundColor: '#efefef',
                              width: '25%',
                              borderRadius: 3,
                              marginRight: 4,
                              height: 46,

                              alignSelf: 'center',
                              justifyContent: 'center',
                            }}>
                            <Image
                              source={require('../../../assets/arrow.png')}
                              style={{
                                width: 20,
                                height: 28,
                                resizeMode: 'contain',
                                alignSelf: 'center',
                                tintColor: '#a7a7a7',
                              }}
                            />
                          </TouchableOpacity>
                        )}
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          marginTop: 15,
                          justifyContent: 'center',
                        }}>
                        {this.state.check == false ? (
                          <Icon
                            name={'checkbox-blank-outline'}
                            onPress={() => this.setState({check: true})}
                            color={'#ea0016'}
                            size={20}
                          />
                        ) : (
                          <Icon
                            name={'checkbox-marked'}
                            onPress={() => this.setState({check: false})}
                            color={'#ea0016'}
                            size={20}
                          />
                        )}

                        <Text
                          style={{
                            alignSelf: 'center',
                            paddingLeft: 10,
                            textAlign: 'center',
                            color: 'black',
                          }}>
                          I Accept all the Terms and Conditions.
                        </Text>
                      </View>
                      {this.state.Keyboard == true ? (
                        <Text
                          style={{
                            alignSelf: 'center',
                            textAlign: 'center',
                            color: '#a7a7a7',
                            marginTop: 55,
                            fontWeight: 'bold',
                          }}>
                          Note : Login is required for Order Placing.
                        </Text>
                      ) : null}
                      {this.state.Keyboard == true ? (
                        <Text
                          style={{
                            alignSelf: 'center',
                            textAlign: 'center',
                            color: 'black',
                            marginTop: 15,
                          }}>
                          Unable to Login ?{' '}
                          <Text
                            style={{
                              alignSelf: 'center',
                              textAlign: 'center',
                              color: '#ea0016',
                              marginTop: 15,
                              fontFamily: 'sans-serif-condensed',
                            }}>
                            {' '}
                            Contact Our Support
                          </Text>
                        </Text>
                      ) : null}
                      {this.state.Keyboard == true ? (
                        <TouchableOpacity
                          onPress={() => {
                            ToastAndroid.showWithGravity(
                              'Login Skipped.',
                              ToastAndroid.SHORT,
                              ToastAndroid.CENTER,
                            );
                            this.props.skipLogin();
                          }}
                          style={{
                            height: 50,
                            width: Dimensions.get('window').width / 1.25,
                            backgroundColor: '#ef5854',
                            alignSelf: 'center',
                            marginBottom: 12,
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: 50,
                            marginTop: 50,
                          }}>
                          <Text
                            style={{
                              fontSize: 14,
                              fontWeight: 'bold',
                              color: 'white',
                            }}>
                            Skip Login & Explore
                          </Text>
                        </TouchableOpacity>
                      ) : null}
                    </View>
                  )}
                </View>
              </View>
            </ImageBackground>
          </View>
          <Modal
            animationType="fade"
            transparent={true}
            visible={this.state.showModal}
            onShow={() => this.setState({showModal: true})}
            onRequestClose={() => {
              this.setState({showModal: false});
            }}>
            <KeyboardAvoidingView
              behavior={Platform.OS == 'ios' ? 'padding' : 'padding'}
              style={[{flex: 1, backgroundColor: Theme.colors.placeholder}]}>
              <TouchableOpacity activeOpacity={1} style={style.tranparentView}>
                <View style={[style.menuWrapper, {flex: 1}]}>
                  <View style={style.menuIcon}>
                    <Icon
                      name="close"
                      color={Theme.colors.primary}
                      size={20}
                      onPress={() => {
                        this.setState({showModal: false});
                        if (Platform.OS == 'android') {
                          SmsRetriever.removeSmsListener();
                        }
                      }}
                    />
                  </View>
                  <View style={[Layout.contentCenter, style.menuContainer]}>
                    <Text style={[]}>Waiting for OTP</Text>
                    <Text style={[, style.margin]}>
                      We have sent a 6 digit OTP on
                    </Text>
                    <View style={[Layout.row, style.rowContainer]}>
                      <Text style={[]}>+91 </Text>
                      <Text style={[{marginRight: 15}]}>
                        {this.state.mobile}
                      </Text>

                      <Button
                        title="Edit"
                        titleStyle={[, style.textButton]}
                        buttonStyle={[style.editButtonContainer]}
                        containerStyle={[
                          Layout.contentCenter,
                          style.editButtonContainer,
                        ]}
                        // onPress={() => Router.navigate('Login')}
                      />
                    </View>
                    <View
                      style={[
                        style.verticalMargin,
                        Layout.row,
                        Layout.selfCenter,
                      ]}>
                      <TextInput
                        style={style.input}
                        underlineColorAndroid="transparent"
                        onChangeText={text => {
                          this.moveToSecond(text);
                        }}
                        keyboardType="numeric"
                        maxLength={1}
                        textAlign="center"
                      />
                      <TextInput
                        style={style.input}
                        ref="input2"
                        keyboardType="numeric"
                        maxLength={1}
                        onChangeText={text => {
                          this.moveToThird(text);
                        }}
                        textAlign="center"
                        underlineColorAndroid="transparent"
                      />
                      <TextInput
                        style={style.input}
                        ref="input3"
                        keyboardType="numeric"
                        maxLength={1}
                        onChangeText={text => {
                          this.moveToFourth(text);
                        }}
                        underlineColorAndroid="transparent"
                        textAlign="center"
                      />

                      <TextInput
                        style={style.input}
                        ref="input4"
                        keyboardType="numeric"
                        maxLength={1}
                        onChangeText={text => {
                          this.moveToFifth(text);
                        }}
                        textAlign="center"
                        underlineColorAndroid="transparent"
                      />
                      <TextInput
                        style={style.input}
                        ref="input5"
                        keyboardType="numeric"
                        maxLength={1}
                        onChangeText={text => {
                          this.moveToSixth(text);
                        }}
                        underlineColorAndroid="transparent"
                        textAlign="center"
                      />
                      <TextInput
                        style={style.input}
                        ref="input6"
                        keyboardType="numeric"
                        onChangeText={text => {
                          this.moveToNext(text);
                        }}
                        maxLength={1}
                        underlineColorAndroid="transparent"
                        textAlign="center"
                      />
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        if (this.state.code === '') {
                          return;
                        }
                        this.validateOTP({
                          phoneNo: this.state.mobile,
                          otp: this.state.code,
                        });
                      }}
                      style={[
                        style.VerifyButtonContainer,
                        {justifyContent: 'center', alignItems: 'center'},
                      ]}>
                      <Text style={[{color: 'white'}]}>Verify</Text>
                    </TouchableOpacity>
                    <View style={[Layout.selfCenter, Layout.row]}>
                      <Text>Didn't get the code ? </Text>
                      {this.state.resendOtp ? (
                        <TouchableOpacity>
                          <Text
                            style={[style.TextPrimary]}
                            onPress={() =>
                              this.validatePhoneNumber(this.state.mobile)
                            }>
                            Tap to Resend
                          </Text>
                        </TouchableOpacity>
                      ) : (
                        <Text style={[, style.TextPrimary]}>{''}</Text>
                      )}
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            </KeyboardAvoidingView>
          </Modal>
        </SafeAreaView>
      );
    } else if (this.state.toAddress == true) {
      return this.props.navigation.navigate('Address');
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
