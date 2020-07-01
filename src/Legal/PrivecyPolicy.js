import React from 'react';
import Axios from 'axios';
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
import {connect} from 'react-redux';

const mapStateToProps = state => {
  return {
    login: state.login,
  };
};

class PrivacyPolicy extends React.Component {
  constructor(props) {
    super(props);
    // console.log('props at load', props);
    this.state = {
      count: 1,
      isLoading: true,
      privacyPolicy: undefined,
    };
  }
  componentDidMount() {
    this.getPrivacyPolicy();
  }
  getPrivacyPolicy() {
    const authToken = this.props.login.accessToken;
    let url =
      'http://ec2-13-234-237-49.ap-south-1.compute.amazonaws.com/api/v3/account/legal/supplier/' +
      '59' +
      '?type=privacyPolicy';
    Axios.get(url, {
      headers: {
        Authorization: 'Bearer ' + authToken,
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        console.log('Response in ?type=privacyPolicy', response);
        if (response.data.object[0].privacyPolicy) {
          this.setState({
            isLoading: false,
            privacyPolicy: response.data.object[0].privacyPolicy,
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
                  Privacy Policy
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
            {this.state.privacyPolicy == undefined ? (
              <Text>Not Available</Text>
            ) : (
              <HTML
                html={this.state.privacyPolicy}
                imagesMaxWidth={Dimensions.get('window').width}
              />
            )}
          </ScrollView>
        </View>
      </View>
    );
  }
}

export default connect(mapStateToProps)(PrivacyPolicy);

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
