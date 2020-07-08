import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ToastAndroid,
  Modal,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';
import {List} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import RazorpayCheckout from 'react-native-razorpay';
import {cartPostUrl} from '../../Config/Constants';
import Axios from 'axios';
import {connect} from 'react-redux';
import {deleteAllItemsFromCart} from '../Redux/Cart/ActionCreators';
// import {getUserOrders} from '../Redux/Auth/ActionCreatore';

const mapStateToProps = state => {
  return {
    defaultVariants: state.defaultVariants,
    cart: state.cart,
    login: state.login,
    user: state.user,
    nearestSupplier: state.nearestSupplier,
    addresses: state.addresses,
    walletData: state.walletData,
  };
};

const mapDispatchToProps = dispatch => ({
  deleteAllItemsFromCart: () => dispatch(deleteAllItemsFromCart()),
  // getUserOrders: customerId => dispatch(getUserOrders(customerId)),
});

function toast(message) {
  // Alert.alert(message);
  ToastAndroid.showWithGravity(
    message,
    ToastAndroid.SHORT,
    ToastAndroid.CENTER,
  );
}

class PaymentOptions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isWalletOpen: false,
      isCardOpen: false,
      isBankOpen: false,
      isCodOpen: false,
      paymentMode: '',
      uploadingOrderDataToServer: false,
      confermationModalVisible: false,
    };
  }

  componentDidMount() {
    // this.props.getUserOrders(this.props.login.userId);
  }

  handleProceed = paymentMode => {
    const {body} = this.props.route.params;
    const {amountToBePaidALongWithTip} = this.props.route.params;
    if (paymentMode === 'COD') {
      console.log('placing order', paymentMode);
      this.setState({confermationModalVisible: true});
      // Alert.alert(
      //   `Have you checked your order?`,
      //   ``,
      //   [
      //     {
      //       text: 'Cancel',
      //       onPress: () => console.log('Cancel Pressed'),
      //       style: 'cancel',
      //     },
      //     {
      //       text: 'Place Order',
      //       onPress: () => {
      //         this.postDataToServer(body, 0, 'COD');
      //       },
      //     },
      //     ,
      //   ],
      //   {cancelable: false},
      // );
    } else if (paymentMode === 'ONLINE') {
      this.startRazorpay(0, 0, amountToBePaidALongWithTip, body);
      console.log('placing order', paymentMode);
    } else if (paymentMode === 'wallet') {
      console.log('placing order', paymentMode);
      this.handleWalletPayment(amountToBePaidALongWithTip, body);
    }
  };

  startRazorpay = (
    clubbedPayment,
    walletAmount,
    finalOrderAmount,
    dataToBePostedOnServer,
  ) => {
    if (clubbedPayment === 1) {
      var newAmount = finalOrderAmount - walletAmount;
      // newAmount = newAmount.toFixed(2)
      newAmount = Math.round(newAmount * 100) / 100;

      newAmount = newAmount * 100;
      var options = {
        description: 'Payment For Order',
        image: 'https://i.ibb.co/z8vLzxB/asdfa.jpg',
        currency: 'INR',
        key: 'rzp_live_SOgPs8jiYRFTOw',
        amount: newAmount,
        name: 'Super Cooks',
        Theme: {color: '#F30'},
      };
      RazorpayCheckout.open(options)
        .then(data => {
          // handle success
          alert(`Success: ${data.razorpay_payment_id}`);
          // this.removeBalanceFromWallet(walletAmount);
          // if (walletAmount != 0) {
          //post data to server
          this.postDataToServer(dataToBePostedOnServer, walletAmount, 'ONLINE');
          // } else {
          //   console.log('Posting data on server from clubbed razor payment');
          // this.postOrderDataOnServer();
          // }
        })
        .catch(error => {
          // handle failure
          // console.log('error', error);
          alert(`Error: ${error.code} | ${error.description}`);
        });
    } else {
      var newAmount = finalOrderAmount;
      newAmount = Math.round(newAmount * 100) / 100;
      newAmount = newAmount * 100;
      var options = {
        description: 'Payment For Order',
        image: 'https://i.ibb.co/z8vLzxB/asdfa.jpg',
        currency: 'INR',
        key: 'rzp_live_SOgPs8jiYRFTOw',
        amount: newAmount,
        name: 'Super Cooks',
        Theme: {color: '#F30'},
      };
      RazorpayCheckout.open(options)
        .then(data => {
          // handle success
          alert(`Success: ${data.razorpay_payment_id}`);
          this.postDataToServer(dataToBePostedOnServer, 0, 'ONLINE');
        })
        .catch(error => {
          // handle failure
          // console.log('error', error);
          alert(`Error: ${error.code} | ${error.description}`);
        });
    }
  };

  handleWalletPayment = (finalOrderAmount, dataToBePostedOnServer) => {
    const walletData = ''; ///change by hardik
    var walletAmount = 0;
    if (walletAmount < finalOrderAmount) {
      Alert.alert(
        `You do not have enough wallet balance!`,
        `You have ₹ ${walletAmount} in your wallet.\nDo you want to recharge your wallet or pay the remaining amount using online payment?`,
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: 'Recharge',
            onPress: () => {
              this.props.navigation.navigate('WalletRecharge');
            },
          },
          {
            text: 'Online',
            onPress: () => {
              this.startRazorpay(
                1,
                walletAmount,
                finalOrderAmount,
                dataToBePostedOnServer,
              );
            },
          },
          ,
        ],
        {cancelable: false},
      );
    } else {
      this.postDataToServer(dataToBePostedOnServer, finalOrderAmount, 'wallet');
    }
  };

  postDataToServer = async (
    dataToBePosted,
    mainWalletDeductionAmount,
    paymentMethod,
  ) => {
    const {cartTotal} = this.props.route.params;
    const {promoDiscount} = this.props.route.params;
    var updatedDAta = dataToBePosted;
    console.log('Posting this data on server', dataToBePosted);
    updatedDAta.mainWallet = mainWalletDeductionAmount;
    updatedDAta.paymentMode = paymentMethod;
    console.log('Here is updated data', updatedDAta);

    const url = cartPostUrl();
    console.log(url);
    this.setState({uploadingOrderDataToServer: true});

    await Axios.post(url, updatedDAta, {
      headers: {
        Authorization: 'Bearer ' + this.props.login.accessToken,
        'Content-Type': 'application/json',
      },
    })
      .then(resp => {
        console.log('Here is cart response', resp, '00000000000000000');
        this.setState({uploadingOrderDataToServer: false});
        toast(resp.data.message);
        // this.props.getUserOrders(this.props.login.userId);
        this.props.navigation.navigate('Success', {
          orderData: updatedDAta,
          promoDiscount: promoDiscount,
          cartTotal: cartTotal,
          serverResp: resp,
        });
        this.props.deleteAllItemsFromCart();
      })
      .catch(err => {
        console.log(err);
        this.setState({uploadingOrderDataToServer: false});
      });
  };

  render() {
    const {amountToBePaidALongWithTip} = this.props.route.params;
    const walletData = '';
    const {amountToBePaid} = this.props.route.params;
    const {tipAmount} = this.props.route.params;

    return (
      <View style={styles.container}>
        <View
          style={{
            height: '14%',
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
              PAYMENTS
            </Text>
            <Text
              style={{
                fontSize: 20,
                alignSelf: 'center',
                paddingLeft: 10,
                color: '#7a7a7a',
              }}
            />
          </View>
        </View>

        {this.state.uploadingOrderDataToServer && (
          <View
            style={{
              position: 'absolute',
              zIndex: 1000,
              alignSelf: 'center',
              marginTop: 300,
            }}>
            <ActivityIndicator size={30} color="#ea0016" />
          </View>
        )}
        <View style={styles.paymentOptinosHeaderView}>
          <View style={{flex: 2}}>
            <Text style={styles.paymentOptionsHeaderText}>Payment Options</Text>
          </View>
          <View style={{flex: 1}}>
            <View style={{flex: 1, flexDirection: 'row'}}>
              <View style={{flex: 1}}>
                <Icon name={'lock'} size={20} color="#589445" />
              </View>
              <View style={{flex: 5, paddingTop: 3}}>
                <Text style={styles.safeAndSecure}>Safe and secure</Text>
              </View>
            </View>
          </View>
        </View>
        <List.Accordion
          left={props => (
            <List.Icon
              {...props}
              icon="credit-card"
              color={this.state.isCardOpen ? '#ea0016' : '#333'}
            />
          )}
          style={styles.accordianHeader}
          title="Credit/Debit/ATM Card"
          expanded={this.state.isCardOpen}
          onPress={() => {
            this.setState({
              isWalletOpen: false,
              isCardOpen: !this.state.isCardOpen,
              isBankOpen: false,
              isCodOpen: false,
              paymentMode: 'ONLINE',
            });
          }}
          titleStyle={{
            color: '#333',
          }}>
          <View style={{paddingVertical: 20}}>
            <Text style={{fontSize: 18, paddingVertical: 10}}>
              {'Amount To be Paid : Rs. ' + amountToBePaidALongWithTip}
            </Text>
            {tipAmount > 0 && (
              <>
                <Text style={{fontSize: 18, paddingVertical: 10}}>
                  {'Order amount : Rs. ' + amountToBePaid}
                </Text>
                <Text style={{fontSize: 18, paddingVertical: 10}}>
                  {'Tip : Rs. ' + tipAmount}
                </Text>
              </>
            )}
            <Text
              style={{
                fontSize: 10,
                fontWeight: 'bold',
                color: 'darkgray',
                paddingVertical: 10,
              }}>
              Place Order with your credit/debit/ATM card
            </Text>
            <TouchableOpacity
              style={{
                height: 50,
                width: Dimensions.get('window').width / 2,
                backgroundColor: '#EA0016',
                borderRadius: 5,
                justifyContent: 'center',
              }}>
              <Text
                onPress={() => this.handleProceed('ONLINE')}
                style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                  alignSelf: 'center',
                  color: 'white',
                }}>
                PROCEED
              </Text>
            </TouchableOpacity>
          </View>
        </List.Accordion>
        <List.Accordion
          left={props => (
            <List.Icon
              {...props}
              icon="bank"
              color={this.state.isBankOpen ? '#ea0016' : '#333'}
            />
          )}
          style={styles.accordianHeader}
          title="Net Banking"
          expanded={this.state.isBankOpen}
          onPress={() => {
            this.setState({
              isWalletOpen: false,
              isCardOpen: false,
              isBankOpen: !this.state.isBankOpen,
              isCodOpen: false,
              paymentMode: 'ONLINE',
            });
          }}
          titleStyle={{
            color: '#333',
          }}>
          <View style={{paddingVertical: 20}}>
            <Text style={{fontSize: 18, paddingVertical: 10}}>
              {'Amount To be Paid : Rs. ' + amountToBePaidALongWithTip}
            </Text>
            {tipAmount > 0 && (
              <>
                <Text style={{fontSize: 18, paddingVertical: 10}}>
                  {'Order amount : Rs. ' + amountToBePaid}
                </Text>
                <Text style={{fontSize: 18, paddingVertical: 10}}>
                  {'Tip : Rs. ' + tipAmount}
                </Text>
              </>
            )}
            <Text
              style={{
                fontSize: 10,
                fontWeight: 'bold',
                color: 'darkgray',
                paddingVertical: 10,
              }}>
              Place Order with Net banking
            </Text>
            <TouchableOpacity
              style={{
                height: 50,
                width: Dimensions.get('window').width / 2,
                backgroundColor: '#EA0016',
                borderRadius: 5,
                justifyContent: 'center',
              }}>
              <Text
                onPress={() => this.handleProceed('ONLINE')}
                style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                  alignSelf: 'center',
                  color: 'white',
                }}>
                PROCEED
              </Text>
            </TouchableOpacity>
          </View>
        </List.Accordion>
        <List.Accordion
          left={props => (
            <List.Icon
              {...props}
              icon="wallet"
              color={this.state.isWalletOpen ? '#ea0016' : '#333'}
            />
          )}
          style={styles.accordianHeader}
          title="Wallet"
          expanded={this.state.isWalletOpen}
          onPress={() => {
            this.setState({
              isWalletOpen: !this.state.isWalletOpen,
              isCardOpen: false,
              isBankOpen: false,
              isCodOpen: false,
              paymentMode: 'wallet',
            });
          }}
          titleStyle={{
            color: '#333',
          }}>
          <View style={{paddingVertical: 20}}>
            <Text style={{fontSize: 18, paddingVertical: 10}}>
              {'Amount To be Paid : Rs. ' + amountToBePaidALongWithTip}
            </Text>
            {tipAmount > 0 && (
              <>
                <Text style={{fontSize: 18, paddingVertical: 10}}>
                  {'Order amount : Rs. ' + amountToBePaid}
                </Text>
                <Text style={{fontSize: 18, paddingVertical: 10}}>
                  {'Tip : Rs. ' + tipAmount}
                </Text>
              </>
            )}
            <Text style={{fontSize: 14, paddingVertical: 10}}>
              {'Wallet balance : Rs. ' + walletData.walletAmount}
            </Text>
            <Text
              style={{
                fontSize: 10,
                fontWeight: 'bold',
                color: 'darkgray',
                paddingVertical: 10,
              }}>
              Place Order with Wallet
            </Text>
            <TouchableOpacity
              style={{
                height: 50,
                width: Dimensions.get('window').width / 2,
                backgroundColor: '#EA0016',
                borderRadius: 5,
                justifyContent: 'center',
              }}>
              <Text
                onPress={() => this.handleProceed('wallet')}
                style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                  alignSelf: 'center',
                  color: 'white',
                }}>
                PROCEED
              </Text>
            </TouchableOpacity>
          </View>
        </List.Accordion>
        <List.Accordion
          left={props => (
            <List.Icon
              {...props}
              icon="cash-marker"
              color={this.state.isCodOpen ? '#ea0016' : '#333'}
            />
          )}
          style={styles.accordianHeader}
          title="COD"
          expanded={this.state.isCodOpen}
          onPress={() => {
            this.setState({
              isWalletOpen: false,
              isCardOpen: false,
              isBankOpen: false,
              isCodOpen: !this.state.isCodOpen,
              paymentMode: 'COD',
            });
          }}
          titleStyle={{
            color: '#333',
          }}>
          <View style={{paddingVertical: 20}}>
            <Text style={{fontSize: 18, paddingVertical: 10}}>
              {'Amount To be Paid : Rs. ' + amountToBePaidALongWithTip}
            </Text>
            {tipAmount > 0 && (
              <>
                <Text style={{fontSize: 18, paddingVertical: 10}}>
                  {'Order amount : Rs. ' + amountToBePaid}
                </Text>
                <Text style={{fontSize: 18, paddingVertical: 10}}>
                  {'Tip : Rs. ' + tipAmount}
                </Text>
              </>
            )}
            <Text
              style={{
                fontSize: 10,
                fontWeight: 'bold',
                color: 'darkgray',
                paddingVertical: 10,
              }}>
              Place Order with Payment Mode Cash On Delivery
            </Text>
            <TouchableOpacity
              style={{
                height: 50,
                width: Dimensions.get('window').width / 2,
                backgroundColor: '#EA0016',
                borderRadius: 5,
                justifyContent: 'center',
              }}>
              <Text
                onPress={() => this.handleProceed('COD')}
                style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                  alignSelf: 'center',
                  color: 'white',
                }}>
                PROCEED
              </Text>
            </TouchableOpacity>
          </View>
        </List.Accordion>
        <Modal
          visible={this.state.confermationModalVisible}
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
              onPress={() => this.setState({confermationModalVisible: false})}>
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
                height: Dimensions.get('window').height / 1.7,
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
                      height: '44%',
                      width: '88%',
                      alignSelf: 'center',
                      resizeMode: 'contain',
                    }}
                    source={require('../assets/llog.png')}
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
                      Have you checked your order?
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        color: 'black',
                        alignSelf: 'center',
                        textAlign: 'center',
                        marginVertical: 10,
                      }}>
                      Please verify your order before confirming.
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
                      onPress={() =>
                        this.setState({confermationModalVisible: false})
                      }>
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
                        const {body} = this.props.route.params;
                        this.postDataToServer(body, 0, 'COD');
                        this.setState({confermationModalVisible: false});
                      }}>
                      <View
                        style={{
                          backgroundColor: '#ea0016',
                          justifyContent: 'center',
                          height: 30,
                          // width: 60,
                          borderRadius: 4,
                          paddingHorizontal: 10,
                          paddingVertical: 10,
                        }}>
                        <Text
                          style={{
                            fontSize: 15,
                            color: 'white',
                            fontWeight: 'bold',
                            alignSelf: 'center',
                          }}>
                          Confirm
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
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PaymentOptions);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  paymentOptionsHeaderText: {
    fontSize: 17,
    fontWeight: '700',
  },
  paymentOptinosHeaderView: {
    alignItems: 'center',
    backgroundColor: '#f3f3f3',
    padding: 25,
    flexDirection: 'row',
  },
  accordianHeader: {backgroundColor: '#fff', marginBottom: 1},
  safeAndSecure: {
    fontSize: 13,
  },
});
