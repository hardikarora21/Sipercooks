import React from 'react';
import axios from 'axios';
import AuthSingleton from '../../utils/auth-singleton';
import {
  View,
  Alert,
  StyleSheet,
  Text,
  ScrollView,
  Image,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Router from '../../RootNavigator/Router';
import Assets from '../../assets';
import Layout from '../../styles/layout';
import Theme from '../../styles/theme';
import Spacing from '../../styles/spacing';
import Typography from '../../styles/typography';
import PageLoader from '../../common/components/PageLoader';
import theme from '../../styles/theme';
import {NavigationEvents} from 'react-navigation';
import Config from 'react-native-config';
import HTML from 'react-native-render-html';

export default class ReturnPolicy extends React.Component {
  constructor(props) {
    super(props);
    // console.log('props at load', props);
    this.state = {
      count: 1,
      isLoading: true,
      refundPolicy: undefined,
    };
  }
  componentDidMount() {
    this.getReturnPolicy();
  }
  getReturnPolicy() {
    const authSingleton = new AuthSingleton();
    authSingleton.loadAuthToken();
    const authToken = authSingleton.getAuthToken();
    const userId = authSingleton.getUserId();
    let url =
      Config.API_LOGIN +
      '/api/v3/account/legal/supplier/' +
      Config.SUPPLIER_ID +
      '?type=refundPolicy';
    axios
      .get(url, {
        headers: {
          Authorization: 'Bearer ' + authToken,
          'Content-Type': 'application/json',
        },
      })
      .then(response => {
        console.log('Response in ?type=refundPolicy', response);
        if (response.data.object[0].refundPolicy) {
          this.setState({
            isLoading: false,
            refundPolicy: response.data.object[0].refundPolicy,
          });
        } else {
          this.setState({isLoading: false});
        }
      })
      .catch(function(error) {
        // handle error
        this.setState({isLoading: false});
        // console.log(error);
      });
  }

  render() {
    return (
      <View style={[Layout.safeArea]}>
        <View style={[Layout.safeArea, {backgroundColor: '#F0F0F0'}]}>
          <ScrollView
            style={[{marginTop: 22, marginHorizontal: 4}]}
            showsVerticalScrollIndicator={false}>
            <View
              style={[
                Layout.row,
                {justifyContent: 'space-between', marginVertical: 16},
              ]}>
              <View style={[{marginLeft: 12}]}>
                <Text style={[Typography.headline, {fontWeight: 'bold'}]}>
                  Refund Policy
                </Text>
              </View>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => Router.navigate('Dashboard')}>
                <Image
                  source={Assets.close}
                  style={{
                    height: 38,
                    width: 38,
                    marginRight: 12,
                    marginBottom: 8,
                  }}
                />
              </TouchableOpacity>
            </View>
            {this.state.refundPolicy == undefined ? (
              <Text>Not Available</Text>
            ) : (
              <HTML
                html={this.state.refundPolicy}
                imagesMaxWidth={Dimensions.get('window').width}
              />
            )}
          </ScrollView>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  TextInputStyle: {
    width: '80%',
    height: 40,
    marginBottom: 0,
    borderBottomColor: Theme.colors.disabled,
    borderBottomWidth: 1,
  },
  inputFieldWrapper: {
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: -4,
  },
});
