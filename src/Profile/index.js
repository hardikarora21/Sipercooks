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
  Alert,
  Share,
} from 'react-native';
import Ic from 'react-native-vector-icons/Fontisto';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {getUserProfile} from '../../Config/Constants';
import Axios from 'axios';
import {connect} from 'react-redux';
import {
  logOut,
  getUserData,
  getReferalCode,
} from '../Redux/Auth/ActionCreatore';
import {deleteAllItemsFromCart} from '../Redux/Cart/ActionCreators';
import ListItem from './ProfilePageItem';

const SCREEN_WIDTH = Dimensions.get('window').width;

const mapStateToProps = state => {
  return {
    cart: state.cart,
    defaultVariants: state.defaultVariants,
    login: state.login,
    user: state.user,
    referalCode: state.referalCode,
  };
};

const mapDispatchToProps = dispatch => ({
  logOut: () => dispatch(logOut()),
  getUserData: customerId => dispatch(getUserData(customerId)),
  deleteAllItemsFromCart: () => dispatch(deleteAllItemsFromCart()),
  getReferalCode: customerId => dispatch(getReferalCode(customerId)),
});

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      getuserDataLoading: false,
      userData: {},
    };
  }

  componentDidMount() {
    console.log('User id from account screen', this.props.login.userId);
    this.props.getUserData(this.props.login.userId);
    this.props.getReferalCode(this.props.login.userId);
  }

  onShare = async referalCode => {
    try {
      const result = await Share.share({
        message:
          'Inviting you to NEEDS Market, a division of Le Millennia Supermart, and a pioneer in online grocery shopping in Gurgaon. Download Now!!! APP STORE: https://apps.apple.com/us/app/needs-supermarket/id1511210707?ls=1 / PLAY STORE: https://play.google.com/store/apps/details?id=com.needssupermarket  REFERRAL CODE: ' +
          referalCode,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  render() {
    const {firstName, lastName, phoneNumber, email} = this.props.user;
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        {this.props.login.skippedLogin ? (
          <View style={{flex: 1, flexDirection: 'column'}}>
            <View style={{marginBottom: 20, marginTop: 70}}>
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
                Please login to access your profile.
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
          <View
            style={{flex: 1, backgroundColor: 'white', paddingHorizontal: 10}}>
            {/* <StatusBar barStyle={'dark-content'} backgroundColor={'white'} /> */}
            <ScrollView showsVerticalScrollIndicator={false}>
              <View
                style={{
                  height: 150,
                  flexDirection: 'row',
                  paddingBottom: 15,
                  borderBottomWidth: 1,
                  borderBottomColor: '#efefef',
                  justifyContent: 'space-between',
                }}>
                <View
                  style={{
                    width: '60%',
                    justifyContent: 'center',
                    alignSelf: 'center',
                  }}>
                  <Text
                    numberOfLines={1}
                    style={{
                      fontSize: 25,
                      color: 'black',
                      fontWeight: 'bold',
                    }}>
                    {firstName && lastName
                      ? firstName + ' ' + lastName
                      : firstName && !lastName
                      ? firstName
                      : !firstName && lastName
                      ? lastName
                      : null}
                  </Text>
                  {email ? (
                    <Text
                      numberOfLines={1}
                      style={{
                        fontSize: 15,
                        color: '#a7a7a7',
                      }}>
                      {email}
                    </Text>
                  ) : (
                    <TouchableOpacity
                      onPress={() => this.props.navigation.navigate('Setting')}>
                      <Text>Add Email</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('Setting')}>
                    <View
                      style={{
                        flexDirection: 'row',
                        paddingTop: 25,
                      }}>
                      <Text
                        style={{
                          fontSize: 10,
                          color: '#ea0016',
                          alignSelf: 'center',
                          fontWeight: 'bold',
                        }}>
                        EDIT PROFILE
                      </Text>
                      <Icon
                        name={'chevron-right'}
                        style={{alignSelf: 'center', paddingLeft: 10}}
                        size={15}
                        color={'#ea0016'}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={{width: '40%', justifyContent: 'center'}}>
                  <View
                    style={{
                      height: '80%',
                      width: '80%',
                      alignSelf: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#fce8ea',
                      borderRadius: 360,
                    }}>
                    <Image
                      source={require('../assets/llog.png')}
                      style={{
                        height: '80%',
                        width: '80%',

                        resizeMode: 'contain',
                        alignSelf: 'center',
                      }}
                    />
                  </View>
                </View>
              </View>
              <View
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: '#efefef',
                  paddingBottom: 15,
                  marginTop: 10,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <TouchableOpacity style={{width: '20%'}}>
                  <View
                    style={{
                      justifyContent: 'space-between',
                      height: 40,
                    }}>
                    <Ic
                      name={'bookmark'}
                      style={{alignSelf: 'center'}}
                      size={20}
                      color={'gray'}
                    />
                    <Text
                      style={{
                        fontSize: 10,
                        color: 'black',
                        alignSelf: 'center',
                      }}>
                      BookMarks
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={{width: '20%'}}>
                  <View
                    style={{
                      justifyContent: 'space-between',
                      height: 40,
                    }}>
                    <Ic
                      name={'bell'}
                      style={{alignSelf: 'center'}}
                      size={20}
                      color={'gray'}
                    />
                    <Text
                      style={{
                        fontSize: 10,
                        color: 'black',
                        alignSelf: 'center',
                      }}>
                      Notifications
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{width: '20%'}}
                  onPress={() => this.props.navigation.navigate('Setting')}>
                  <View
                    style={{
                      justifyContent: 'space-between',
                      alignSelf: 'center',
                      height: 40,
                    }}>
                    <Icon
                      name={'account-outline'}
                      style={{alignSelf: 'center'}}
                      size={23}
                      color={'gray'}
                    />
                    <Text
                      style={{
                        fontSize: 10,
                        color: 'black',
                        alignSelf: 'center',
                      }}>
                      Profile
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate('Wallet')}
                  style={{width: '20%'}}>
                  <View
                    style={{
                      justifyContent: 'space-between',
                      alignSelf: 'center',
                      height: 40,
                    }}>
                    <Icon
                      name={'credit-card'}
                      style={{alignSelf: 'center'}}
                      size={20}
                      color={'gray'}
                    />
                    <Text
                      style={{
                        fontSize: 10,
                        color: 'black',
                        alignSelf: 'center',
                      }}>
                      Wallet
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>

              <View
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: '#efefef',
                  paddingBottom: 15,
                  marginTop: 10,
                }}>
                <Text style={{fontSize: 13, color: '#a7a7a7'}}>
                  Food Orders
                </Text>

                <ListItem
                  leftImage={true}
                  text="My Orders"
                  iconRightName="chevron-right"
                  onPressFunction={() => {
                    this.props.navigation.navigate('History');
                  }}>
                  <Image
                    source={require('../assets/paper.png')}
                    style={{
                      height: 12,
                      width: 12,
                      backgroundColor: '#efefef',
                      alignSelf: 'center',
                      resizeMode: 'contain',
                    }}
                  />
                </ListItem>

                <ListItem
                  leftImage={true}
                  text="Favorite Orders"
                  iconRightName="chevron-right"
                  onPressFunction={() => {
                    // this.props.navigation.navigate('Address', {
                    //   userObj: null,
                    //   fromLogin: 'no',
                    // });
                  }}>
                  <Image
                    source={require('../assets/wishlist.png')}
                    style={{
                      height: 12,
                      width: 12,
                      backgroundColor: '#efefef',
                      alignSelf: 'center',
                      resizeMode: 'contain',
                    }}
                  />
                </ListItem>

                <ListItem
                  leftImage={true}
                  text="Address Book"
                  iconRightName="chevron-right"
                  onPressFunction={() => {
                    this.props.navigation.navigate('Address', {
                      userObj: null,
                      fromLogin: 'no',
                    });
                  }}>
                  <Image
                    source={require('../assets/book.png')}
                    style={{
                      height: 12,
                      width: 12,
                      backgroundColor: '#efefef',
                      alignSelf: 'center',
                      resizeMode: 'contain',
                    }}
                  />
                </ListItem>

                <ListItem
                  leftImage={true}
                  text="Online Ordering Help"
                  iconRightName="chevron-right"
                  onPressFunction={() => {
                    this.props.navigation.navigate('Support');
                  }}>
                  <Image
                    source={require('../assets/comment.png')}
                    style={{
                      height: 12,
                      width: 12,
                      backgroundColor: '#efefef',
                      alignSelf: 'center',
                      resizeMode: 'contain',
                    }}
                  />
                </ListItem>
              </View>

              <View
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: '#efefef',
                  paddingBottom: 15,
                  marginTop: 10,
                }}>
                <Text style={{fontSize: 13, color: '#a7a7a7'}}>Support</Text>
                <ListItem
                  leftIcon={true}
                  leftIconName="account-group-outline"
                  text="Refer a friend"
                  iconRightName="chevron-right"
                  onPressFunction={() => {
                    this.props.navigation.navigate('Refer');
                  }}
                />

                <ListItem
                  leftIcon={true}
                  leftIconName="share-variant"
                  text="Share"
                  iconRightName="chevron-right"
                  onPressFunction={() => {
                    this.onShare(this.props.referalCode.code);
                  }}
                />

                <ListItem
                  leftIcon={true}
                  leftIconName="script-text-outline"
                  text="Terms & Conditions"
                  iconRightName="chevron-right"
                  onPressFunction={() => {
                    this.props.navigation.navigate('TermsAndCondition');
                    console.log('Terms & Conditions pressed');
                  }}
                />

                <ListItem
                  leftIcon={true}
                  leftIconName="package-variant-closed"
                  text="Privecy policy"
                  iconRightName="chevron-right"
                  onPressFunction={() => {
                    console.log('Privecy policy pressed');
                  }}
                />

                <ListItem
                  leftIcon={true}
                  leftIconName="backup-restore"
                  text="Return policy"
                  iconRightName="chevron-right"
                  onPressFunction={() => {
                    console.log('Return policy pressed');
                  }}
                />

                <ListItem
                  leftIcon={true}
                  leftIconName="comment-question-outline"
                  text="FAQs"
                  iconRightName="chevron-right"
                  onPressFunction={() => {
                    this.props.navigation.navigate('FAQs');
                  }}
                />
              </View>
              <View
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: '#fff',
                  paddingBottom: 15,
                  marginTop: 10,
                }}>
                <ListItem
                  leftIcon={true}
                  leftIconName="logout"
                  text="Log Out"
                  iconRightName="chevron-right"
                  onPressFunction={() => {
                    this.props.deleteAllItemsFromCart();
                    this.props.logOut();
                  }}
                />
              </View>
            </ScrollView>
          </View>
        )}
      </SafeAreaView>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Profile);
