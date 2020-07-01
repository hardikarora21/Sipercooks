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
  ActivityIndicator,
  RefreshControl,
  ToastAndroid,
} from 'react-native';
import Ic from 'react-native-vector-icons/Fontisto';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  mainWalletBalance,
  promoWalletBalance,
  promoWalletAndMainWalletBalance,
  userTransactionsInWallet,
} from '../../Config/Constants';
import {createStringWithFirstLetterCapital, getDate} from '../Shared/functions';

import {connect} from 'react-redux';
import {logOut} from '../Redux/Auth/ActionCreatore';
import Axios from 'axios';

const SCREEN_WIDTH = Dimensions.get('window').width;

const mapStateToProps = state => {
  return {
    cart: state.cart,
    defaultVariants: state.defaultVariants,
    login: state.login,
  };
};

const mapDispatchToProps = dispatch => ({
  logOut: () => dispatch(logOut()),
});

class Wallet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isWalletBalanceLoading: false,
      walletbalanncedata: {
        promoCanUsedInPercent: 0,
        promoWalletAmount: 0,
        walletAmount: 0,
      },
      isTransactionsLoading: false,
      transactionsData: [],
    };
  }

  componentDidMount() {
    this.getPromoWalletAndMainWalletBalance(this.props.login.userId);
    this.getCustomerTransactions(this.props.login.userId);
  }

  getPromoWalletAndMainWalletBalance = async customerId => {
    this.setState({isWalletBalanceLoading: true});

    var url = promoWalletAndMainWalletBalance(customerId);

    await Axios.get(url, {
      headers: {
        Authorization: 'bearer ' + '',
        'Content-type': 'application/json',
      },
      timeout: 15000,
    })
      .then(response => {
        console.log('All Wallet data->', response.data);
        // [0].balancePont
        this.setState({
          walletbalanncedata: response.data,
          isWalletBalanceLoading: false,
        });
      })
      .catch(error => {
        this.setState({isWalletBalanceLoading: false});
        console.log('Error', error.message);
      });
  };

  getCustomerTransactions = async customerId => {
    this.setState({isTransactionsLoading: true});

    var url = userTransactionsInWallet(customerId);

    await Axios.get(url, {
      headers: {
        Authorization: 'bearer ' + '',
        'Content-type': 'application/json',
      },
      timeout: 15000,
    })
      .then(response => {
        console.log('All Transactions data->', response.data.object);
        // [0].balancePont
        this.setState({
          transactionsData: response.data.object,
          isTransactionsLoading: false,
        });
      })
      .catch(error => {
        this.setState({isTransactionsLoading: false});
        console.log('Error', error.message);
      });
  };

  render() {
    const totalNoOfTrans = this.state.transactionsData.length;
    const threeMostRecentTransactions = [
      this.state.transactionsData[totalNoOfTrans - 1],
      this.state.transactionsData[totalNoOfTrans - 2],
      this.state.transactionsData[totalNoOfTrans - 3],
    ];
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        {/* {this.props.login.skippedLogin ? ( */}

        <View style={{flex: 1, backgroundColor: '#efefef'}}>
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
            <Text
              style={{
                fontSize: 20,
                alignSelf: 'center',
                paddingLeft: 10,
              }}>
              My Wallet
            </Text>
          </View>

          {this.props.login.skippedLogin ? (
            <View style={{flex: 1, flexDirection: 'column'}}>
              <View style={{marginVertical: 20}}>
                <Image
                  style={{
                    height: 200,
                    width: 200,
                    alignSelf: 'center',
                    color: '#efefef',
                  }}
                  source={require('../assets/noLogin.png')}
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
                  You are not logged in
                </Text>
              </View>
              <View style={{marginVertical: 20}}>
                <Text
                  style={{
                    alignSelf: 'center',
                    color: '#a7a7a7',
                    fontSize: 15,
                  }}>
                  Please login to access your wallet.
                </Text>
              </View>
              <View style={{marginVertical: 20, width: SCREEN_WIDTH}}>
                <TouchableOpacity
                  onPress={() => this.props.logOut()}
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
                    LOGIN
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <ScrollView
              style={{height: '90%'}}
              showsVerticalScrollIndicator={false}>
              <View
                style={{
                  height: 180,
                  width: Dimensions.get('window').width,
                  backgroundColor: '#FFFBDE',
                  zIndex: 1,
                }}>
                <Text
                  style={{
                    color: 'black',
                    textAlign: 'right',
                    paddingRight: 10,
                    fontSize: 22,
                    marginTop: 25,
                    fontWeight: 'bold',
                  }}>
                  Rs.
                  {!this.state.isWalletBalanceLoading ? (
                    this.state.walletbalanncedata.walletAmount
                  ) : (
                    <View style={{height: 15, width: 15}}>
                      <ActivityIndicator size={15} color="#f00" />
                    </View>
                  )}
                </Text>
                <Text
                  style={{
                    color: '#a7a7a7',
                    textAlign: 'right',
                    paddingRight: 10,
                    fontSize: 14,
                    fontWeight: 'bold',
                  }}>
                  WALLET BALANCE
                </Text>
              </View>
              <View
                style={{
                  height: 150,
                  backgroundColor: 'white',
                  marginHorizontal: 10,
                  zIndex: 10,
                  marginTop: -75,
                  elevation: 2,
                  borderRadius: 4,
                  justifyContent: 'center',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingHorizontal: 10,
                    alignSelf: 'center',
                    paddingBottom: 15,
                    borderBottomWidth: 1,
                    borderBottomColor: '#efefef',
                  }}>
                  <View
                    style={{
                      height: 50,
                      width: 50,
                      marginRight: 10,
                      borderRadius: 360,
                    }}>
                    <Image
                      source={require('../assets/india.png')}
                      style={{
                        height: 50,
                        width: 50,
                        alignSelf: 'center',
                        resizeMode: 'contain',
                      }}
                    />
                  </View>
                  <View
                    style={{
                      height: 40,
                      justifyContent: 'space-between',
                      width: '80%',
                      alignSelf: 'center',
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        width: '100%',
                        justifyContent: 'space-between',
                      }}>
                      <Text
                        style={{
                          color: 'black',
                          textAlign: 'right',
                          fontSize: 15,
                          fontWeight: 'bold',
                        }}>
                        My Cash
                      </Text>
                      <Text
                        style={{
                          color: 'black',
                          textAlign: 'right',
                          paddingRight: 10,
                          fontSize: 15,
                          fontWeight: 'bold',
                        }}>
                        Rs.0
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        width: '100%',
                        marginTop: 2,
                        justifyContent: 'space-between',
                      }}>
                      <Text
                        style={{
                          color: 'white',
                          fontSize: 10,
                          backgroundColor: 'darkgreen',
                          fontWeight: 'bold',
                          paddingHorizontal: 3,
                          borderRadius: 20,
                        }}>
                        USE UNRESTRICTED
                      </Text>
                      <Text
                        style={{
                          color: 'skyblue',
                          textAlign: 'right',
                          paddingRight: 10,
                          fontSize: 10,
                          fontWeight: 'bold',
                        }}>
                        How to earn more ?
                      </Text>
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingHorizontal: 10,
                    alignSelf: 'center',
                    marginTop: 15,
                  }}>
                  <View
                    style={{
                      height: 50,
                      width: 50,
                      marginRight: 10,
                      borderRadius: 360,
                    }}>
                    <Image
                      source={require('../assets/rew.png')}
                      style={{
                        height: 50,
                        width: 50,
                        alignSelf: 'center',
                        resizeMode: 'contain',
                        tintColor: 'purple',
                      }}
                    />
                  </View>
                  <View
                    style={{
                      height: 40,
                      justifyContent: 'space-between',
                      width: '80%',
                      alignSelf: 'center',
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        width: '100%',
                        justifyContent: 'space-between',
                      }}>
                      <Text
                        style={{
                          color: 'black',
                          textAlign: 'right',
                          fontSize: 15,
                          fontWeight: 'bold',
                        }}>
                        Reward Bonus
                      </Text>
                      <Text
                        style={{
                          color: 'black',
                          textAlign: 'right',
                          paddingRight: 10,
                          fontSize: 15,
                          fontWeight: 'bold',
                        }}>
                        Rs.
                        {!this.state.isWalletBalanceLoading ? (
                          this.state.walletbalanncedata.promoWalletAmount
                        ) : (
                          <View style={{height: 15, width: 15}}>
                            <ActivityIndicator size={15} color="#f00" />
                          </View>
                        )}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        width: '100%',
                        marginTop: 2,
                        justifyContent: 'space-between',
                      }}>
                      <Text
                        style={{
                          color: 'white',
                          fontSize: 10,
                          backgroundColor: 'darkgray',
                          fontWeight: 'bold',
                          paddingHorizontal: 3,
                          borderRadius: 20,
                        }}>
                        USE WITH RESTRICTED
                      </Text>
                      <Text
                        style={{
                          color: 'skyblue',
                          textAlign: 'right',
                          paddingRight: 10,
                          fontSize: 10,
                          fontWeight: 'bold',
                        }}>
                        How to earn more ?
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              <View
                style={{
                  backgroundColor: 'white',
                  height: 150,
                  paddingHorizontal: 10,
                  marginTop: 10,
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    color: 'black',
                    fontWeight: 'bold',
                    fontSize: 15,
                  }}>
                  Earn More Wallet Balance
                </Text>
                <Text style={{color: 'black', fontSize: 12}}>
                  A new way to earn and get discounts.
                </Text>
                <TouchableWithoutFeedback>
                  <View
                    style={{
                      height: 70,
                      width: '68%',
                      marginTop: 10,
                      backgroundColor: 'white',
                      elevation: 2,
                      borderRadius: 4,
                      justifyContent: 'space-evenly',
                      flexDirection: 'row',
                    }}>
                    <View
                      style={{
                        width: '35%',
                        justifyContent: 'center',
                        alignSelf: 'center',
                        height: '80%',
                        backgroundColor: '#FFFBDE',

                        borderRadius: 4,
                      }}>
                      <Image
                        style={{
                          height: '80%',
                          width: '80%',
                          alignSelf: 'center',
                          resizeMode: 'contain',
                        }}
                        source={require('../assets/money.png')}
                      />
                    </View>
                    <View
                      style={{
                        width: '60%',
                        justifyContent: 'center',
                        alignSelf: 'center',
                        height: '80%',
                        borderRadius: 4,
                      }}>
                      <Text style={{color: 'black', fontSize: 12}}>
                        GET ICICI CREDIT CARD
                      </Text>
                      <Text style={{color: 'black', fontSize: 10}}>
                        For 2x earning & much more
                      </Text>
                      <View style={{flexDirection: 'row', marginTop: 10}}>
                        <Image
                          source={require('../assets/india.png')}
                          style={{
                            height: 9,
                            width: 9,
                            resizeMode: 'contain',
                            marginRight: 5,
                            alignSelf: 'center',
                          }}
                        />
                        <Text
                          style={{
                            color: 'skyblue',
                            fontSize: 10,
                            fontWeight: 'bold',
                          }}>
                          APPLY & EARN
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </View>
              <View
                style={{
                  marginTop: 10,
                  backgroundColor: 'white',
                  paddingHorizontal: 10,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginVertical: 15,
                  }}>
                  <Text
                    style={{
                      color: 'black',
                      fontWeight: 'bold',
                      fontSize: 15,
                    }}>
                    Wallet Transactions
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      if (this.state.transactionsData.length === 0) {
                        ToastAndroid.showWithGravity(
                          "You don't have any transactions",
                          ToastAndroid.SHORT,
                          ToastAndroid.CENTER,
                        );
                        return;
                      }
                      this.props.navigation.navigate('Transactions', {
                        transactions: this.state.transactionsData,
                      });
                    }}>
                    <Text
                      style={{
                        color: '#ea0016',
                        fontSize: 12,
                        alignSelf: 'center',
                        paddingTop: 4,
                      }}>
                      VIEW ALL
                    </Text>
                  </TouchableOpacity>
                </View>

                {!this.state.isTransactionsLoading ? (
                  this.state.transactionsData.length > 0 ? (
                    threeMostRecentTransactions.map((item, index) => {
                      return (
                        <View
                          key={index}
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          }}>
                          <View
                            style={{
                              justifyContent: 'space-evenly',
                              height: 60,
                              alignSelf: 'center',
                            }}>
                            <Text
                              style={{
                                fontSize: 10,
                                fontWeight: 'bold',
                                color: 'darkgray',
                              }}>
                              {getDate(item.createdDate)}
                            </Text>
                            <View
                              style={{
                                width: 30,
                                height: 30,
                                justifyContent: 'center',
                                backgroundColor: '#fce8ea',
                                borderRadius: 360,
                              }}>
                              <Icon
                                name={'wallet'}
                                color={'#a7a7a7'}
                                size={15}
                                style={{alignSelf: 'center'}}
                              />
                            </View>
                          </View>
                          <View
                            style={{
                              alignSelf: 'center',
                              height: 60,
                              width: '60%',
                              marginLeft: -10,
                              justifyContent: 'space-evenly',
                            }}>
                            <Text
                              style={{
                                fontSize: 14,
                                paddingTop: 16,
                                color: 'black',
                              }}>
                              {item.accountingEntryType === 'CREDIT'
                                ? 'Reard Bonus Credited'
                                : 'Reward Bonus Debited'}
                            </Text>
                          </View>
                          <View
                            style={{
                              alignSelf: 'center',
                              height: 60,
                              marginTop: 16,
                              justifyContent: 'center',
                            }}>
                            <Text
                              style={{
                                fontSize: 14,
                                alignSelf: 'center',
                                fontWeight: 'bold',
                                color:
                                  item.accountingEntryType === 'CREDIT'
                                    ? 'green'
                                    : 'red',
                              }}>
                              {item.accountingEntryType === 'CREDIT'
                                ? '+ '
                                : '- '}
                              Rs.{item.userRequestAmount}
                            </Text>
                            <Text
                              style={{
                                fontSize: 10,
                                alignSelf: 'center',
                                fontWeight: 'bold',
                                color: '#afafaf',
                                // color:
                                //   item.accountingEntryType === 'CREDIT'
                                //     ? 'green'
                                //     : 'red',
                              }}>
                              {'Balance Rs.' + item.balancePont}
                            </Text>
                          </View>
                        </View>
                      );
                    })
                  ) : (
                    <View>
                      <Image
                        source={require('../assets/noTransactions.png')}
                        style={{height: 100, width: 100, alignSelf: 'center'}}
                      />
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: '700',
                          color: '#afafaf',
                          alignSelf: 'center',
                          marginVertical: 15,
                        }}>
                        You have not made any transactions.
                      </Text>
                    </View>
                  )
                ) : (
                  [1, 2, 3].map((item, index) => {
                    return (
                      <View
                        key={index}
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <View
                          style={{
                            justifyContent: 'space-evenly',
                            height: 60,
                            alignSelf: 'center',
                          }}>
                          <View
                            style={{backgroundColor: '#efefef', minWidth: 50}}>
                            <Text>{/* 30 May 2020 */}</Text>
                          </View>
                          <View
                            style={{
                              width: 30,
                              height: 30,
                              justifyContent: 'center',
                              backgroundColor: '#fce8ea',
                              borderRadius: 360,
                            }}
                          />
                        </View>
                        <View
                          style={{
                            alignSelf: 'center',
                            height: 20,
                            width: '60%',
                            marginLeft: -10,
                            justifyContent: 'space-evenly',
                            backgroundColor: '#efefef',
                          }}
                        />
                        <View style={{height: 60}}>
                          <View
                            style={{
                              alignSelf: 'center',
                              height: 20,
                              marginTop: 16,
                              justifyContent: 'center',
                              backgroundColor: '#efefef',
                            }}
                          />
                        </View>
                      </View>
                    );
                  })
                )}
              </View>
              <View
                style={{
                  height: 250,
                  marginBottom: 10,
                  marginTop: 10,
                  backgroundColor: 'white',
                  paddingHorizontal: 10,
                }}>
                <Text
                  style={{
                    color: 'black',
                    fontWeight: 'bold',
                    fontSize: 15,
                    paddingTop: 15,
                  }}>
                  FAQs
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    borderBottomWidth: 1,
                    borderBottomColor: '#efefef',
                    paddingBottom: 10,
                    marginTop: 10,
                  }}>
                  <Text
                    style={{
                      color: 'darkgray',
                      fontSize: 14,
                      alignSelf: 'center',
                    }}>
                    How much to check My Needs Cash ?
                  </Text>
                  <Icon
                    name={'chevron-down'}
                    size={23}
                    color={'gray'}
                    style={{alignSelf: 'center'}}
                  />
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    borderBottomWidth: 1,
                    borderBottomColor: '#efefef',
                    paddingBottom: 10,
                    marginTop: 10,
                  }}>
                  <Text
                    style={{
                      color: 'darkgray',
                      fontSize: 14,
                      alignSelf: 'center',
                    }}>
                    What is the best mode of Payment ?
                  </Text>
                  <Icon
                    name={'chevron-down'}
                    size={23}
                    color={'gray'}
                    style={{alignSelf: 'center'}}
                  />
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    borderBottomWidth: 1,
                    borderBottomColor: '#efefef',
                    paddingBottom: 10,
                    marginTop: 10,
                  }}>
                  <Text
                    style={{
                      color: 'darkgray',
                      fontSize: 14,
                      alignSelf: 'center',
                    }}>
                    What is the use of Needs Cash ?
                  </Text>
                  <Icon
                    name={'chevron-down'}
                    size={23}
                    color={'gray'}
                    style={{alignSelf: 'center'}}
                  />
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    borderBottomWidth: 1,
                    borderBottomColor: '#efefef',
                    paddingBottom: 10,
                    marginTop: 10,
                  }}>
                  <Text
                    style={{
                      color: 'darkgray',
                      fontSize: 14,
                      alignSelf: 'center',
                    }}>
                    How to Use Promo codes ?
                  </Text>
                  <Icon
                    name={'chevron-down'}
                    size={23}
                    color={'gray'}
                    style={{alignSelf: 'center'}}
                  />
                </View>
              </View>
            </ScrollView>
          )}
        </View>
      </SafeAreaView>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Wallet);
