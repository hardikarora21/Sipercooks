import React from 'react';
import {
  View,
  Text,
  ImageBackground,
  SafeAreaView,
  Dimensions,
  Image,
  ActivityIndicator,
} from 'react-native';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Badge, withBadge} from 'react-native-elements';

import AnimatedCart from '../Cart/AnimatedCart';
import Cart from '../Cart/index';
import Success from '../Success/index';
import Refer from '../Refer/index';
import Address from '../Address/index';
import AddAddress from '../AddAddress';
import Profile from '../Profile/index';
import History from '../History/index';
import Home from '../Home/Home';
import OrderSummery from '../OrderSummery/index';
import Productdetails from '../Productdetails';
import Productlisting from '../ProductListing/index';
import Wallet from '../Wallet';
import Setting from '../Settings';
import Login from '../pages/Account/Login/index';
import Support from '../Support/index';
import Chat from '../Chat/index';
import Search from '../Search/index';
import Categories from '../Category/index';
import Transactions from '../Wallet/transactions';
import FAQs from '../FAQs';
import TermsAndCondition from '../Legal/TermsAndConditions';

import {connect} from 'react-redux';
import {loginSuccess, logOut} from '../Redux/Auth/ActionCreatore';

import Axios from 'axios';
var Querystringified = require('querystringify');
import {otpVerificationUrl} from '../../Config/Constants';
import Checkout from '../Checkout';

const Stack = createStackNavigator();

const Tab = createMaterialBottomTabNavigator();

const stacknavigatorOptions = {headerShown: false};

function ProfileStack() {
  return (
    <Stack.Navigator initialRouteName="Profile">
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={stacknavigatorOptions}
      />
      <Stack.Screen
        name="Address"
        component={Address}
        options={stacknavigatorOptions}
      />
      <Stack.Screen
        name="Setting"
        component={Setting}
        options={stacknavigatorOptions}
      />
      <Stack.Screen
        name="History"
        component={History}
        options={stacknavigatorOptions}
      />
      <Stack.Screen
        name="Chat"
        component={Chat}
        options={stacknavigatorOptions}
      />
      <Stack.Screen
        name="Support"
        component={Support}
        options={stacknavigatorOptions}
      />
      <Stack.Screen
        name="OrderSummery"
        component={OrderSummery}
        options={stacknavigatorOptions}
      />
      <Stack.Screen
        name="Refer"
        component={Refer}
        options={stacknavigatorOptions}
      />
      <Stack.Screen
        name="FAQs"
        component={FAQs}
        options={stacknavigatorOptions}
      />
      <Stack.Screen
        name="TermsAndCondition"
        component={TermsAndCondition}
        options={stacknavigatorOptions}
      />
    </Stack.Navigator>
  );
}

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={Home}
        options={stacknavigatorOptions}
      />
      <Stack.Screen
        name="Productdetails"
        component={Productdetails}
        options={stacknavigatorOptions}
      />
      <Stack.Screen
        name="AddAddress"
        component={AddAddress}
        options={stacknavigatorOptions}
      />
      {/* <Stack.Screen
        name="Success"
        component={Success}
        options={stacknavigatorOptions}
      /> */}
      {/* <Stack.Screen
        name="Checkout"
        component={Checkout}
        options={stacknavigatorOptions}
      /> */}
      <Stack.Screen
        name="Refer"
        component={Refer}
        options={stacknavigatorOptions}
      />
      <Stack.Screen
        name="Productlist"
        component={Productlisting}
        options={stacknavigatorOptions}
      />
      <Stack.Screen
        name="Search"
        component={Search}
        options={stacknavigatorOptions}
      />
      <Stack.Screen
        name="Address"
        component={Address}
        options={stacknavigatorOptions}
      />
      <Stack.Screen
        name="Setting"
        component={Setting}
        options={stacknavigatorOptions}
      />
    </Stack.Navigator>
  );
}

function WalletStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="WalletPage"
        component={Wallet}
        options={stacknavigatorOptions}
      />
      <Stack.Screen
        name="Transactions"
        component={Transactions}
        options={stacknavigatorOptions}
      />
    </Stack.Navigator>
  );
}

function CategoriesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Categories"
        component={Categories}
        options={stacknavigatorOptions}
      />
      <Stack.Screen
        name="Search"
        component={Search}
        options={stacknavigatorOptions}
      />
      {/* <Stack.Screen
        name="Productlist"
        component={Productlisting}
        options={stacknavigatorOptions}
      /> */}
    </Stack.Navigator>
  );
}

function CartStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="CartPage"
        component={Cart}
        options={stacknavigatorOptions}
      />
      <Stack.Screen
        name="Checkout"
        component={Checkout}
        options={stacknavigatorOptions}
      />
      <Stack.Screen
        name="Refer"
        component={Refer}
        options={stacknavigatorOptions}
      />
      <Stack.Screen
        name="Success"
        component={Success}
        options={stacknavigatorOptions}
      />
      <Stack.Screen
        name="Address"
        component={Address}
        options={stacknavigatorOptions}
      />
      <Stack.Screen
        name="AddAddress"
        component={AddAddress}
        options={stacknavigatorOptions}
      />
    </Stack.Navigator>
  );
}

const mapStateToProps = state => {
  return {
    cart: state.cart,
    defaultVariants: state.defaultVariants,
    login: state.login,
    addresses: state.addresses,
  };
};

const mapDispatchToProps = dispatch => ({
  logOut: () => dispatch(logOut()),
  loginSuccess: userData => dispatch(loginSuccess(userData)),
});

class BottomTabNavigator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.login.accessToken !== null
      ? this.getNewAccessToken()
      : this.setState({isLoading: false});
  }

  getNewAccessToken = async () => {
    var body = {
      username: this.props.login.userName,
      // password: this.props.login.refreshToken,
      grant_type: 'refresh_token',
      refresh_token: this.props.login.refreshToken,
    };

    let data_res = Querystringified.stringify(body);
    var url = otpVerificationUrl();
    await Axios.post(url, data_res, {
      headers: {
        Authorization: 'Basic VVNFUl9DTElFTlRfQVBQOnBhc3N3b3Jk',
        'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
      withCredentials: true,
    })
      .then(resp => {
        // console.log('Access code verification', resp.data);
        if (resp.data.access_token && resp.data.refresh_token) {
          var userObject = {
            accessToken: resp.data.access_token,
            refreshToken: resp.data.refresh_token,
            userId: resp.data.userId.toString(),
            loginCount: resp.data.loginCount.toString(),
            userName: this.props.login.userName,
            hasSelectedAddress: this.props.login.hasSelectedAddress,
          };
          this.props.loginSuccess(userObject);
        } else this.props.logOut();
      })
      .catch(err => {
        // console.log(err.message);
      });
  };

  render() {
    return (
      <NavigationContainer>
        {(this.props.login.hasSelectedAddress ||
          this.props.login.skippedLogin) && (
          <Tab.Navigator
            barStyle={{backgroundColor: '#fff'}}
            activeColor="#327dfc"
            inactiveColor="#999"
            screenOptions={({route}) => ({
              tabBarIcon: ({focused, color, size}) => {
                if (route.name === 'Home') {
                  return (
                    <Icon
                      name={focused ? 'home' : 'home-outline'}
                      size={23}
                      color={color}
                    />
                  );
                } else if (route.name === 'Categories') {
                  return (
                    <Icon
                      name={focused ? 'cards' : 'cards-outline'}
                      size={23}
                      color={color}
                    />
                  );
                } else if (route.name === 'Cart') {
                  return (
                    <>
                      <Icon
                        name={focused ? 'cart' : 'cart-outline'}
                        size={23}
                        color={color}
                      />
                      {this.props.cart.cart.length > 0 ? (
                        <Badge
                          status="error"
                          containerStyle={{
                            position: 'absolute',
                            top: -7,
                            right: -7,
                          }}
                          value={this.props.cart.cart.length}
                        />
                      ) : null}
                    </>
                  );
                } else if (route.name === 'Wallet') {
                  return (
                    <Icon
                      name={focused ? 'wallet' : 'wallet-outline'}
                      size={23}
                      color={color}
                    />
                  );
                } else if (route.name === 'Account') {
                  return (
                    <Icon
                      name={focused ? 'account' : 'account-outline'}
                      size={23}
                      color={color}
                    />
                  );
                }
              },
            })}>
            <Tab.Screen name="Home" component={HomeStack} />
            <Tab.Screen name="Categories" component={CategoriesStack} />
            <Tab.Screen name="Cart" component={CartStack} />
            <Tab.Screen name="Wallet" component={WalletStack} />
            <Tab.Screen name="Account" component={ProfileStack} />
          </Tab.Navigator>
        )}
        {!this.props.login.hasSelectedAddress &&
          !this.props.login.skippedLogin && (
            <Stack.Navigator
              initialRouteName={
                this.props.login.loginSuccess ? 'Address' : 'Login'
              }>
              {this.props.login.loginSuccess ? null : (
                <Stack.Screen
                  name="Login"
                  component={Login}
                  options={stacknavigatorOptions}
                />
              )}
              <Stack.Screen
                name="Address"
                component={Address}
                options={stacknavigatorOptions}
              />
              <Stack.Screen
                name="AddAddress"
                component={AddAddress}
                options={stacknavigatorOptions}
              />
              <Stack.Screen
                name="Setting"
                component={Setting}
                options={stacknavigatorOptions}
              />
            </Stack.Navigator>
          )}
      </NavigationContainer>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BottomTabNavigator);
