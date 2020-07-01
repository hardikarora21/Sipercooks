import React from 'react';
import Axios from 'axios';
import {
  View,
  Alert,
  StyleSheet,
  Text,
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  TouchableWithoutFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import HTML from 'react-native-render-html';
import {termsAndConditionsUrl} from '../../Config/Constants';

import {connect} from 'react-redux';

const mapStateToProps = state => {
  return {
    referalCode: state.referalCode,
    login: state.login,
  };
};

const SCREEN_WIDTH = Dimensions.get('window').width;

class TermsAndCondition extends React.Component {
  constructor(props) {
    super(props);
    // console.log('props at load', props);
    this.state = {
      count: 1,
      isLoading: true,
      termsOfService: undefined,
    };
  }
  componentDidMount() {
    this.getTermsAndCondition();
  }
  getTermsAndCondition() {
    var url = termsAndConditionsUrl();
    this.setState({isLoading: true});

    Axios.get(url, {
      headers: {
        Authorization: 'Bearer ' + this.props.login.accessToken,
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        console.log('Response in ?type=termsOfService', response);
        if (response.data.object[0].termsOfService) {
          this.setState({
            isLoading: false,
            termsOfService: response.data.object[0].termsOfService,
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
      <SafeAreaView>
        <View style={{backgroundColor: '#F0F0F0'}}>
          <View
            style={{
              paddingTop: 5,
              minWidth: SCREEN_WIDTH,
              backgroundColor: '#fff',
              height: 70,
            }}>
            <View
              style={{
                height: '10%',
                flexDirection: 'row',
                paddingHorizontal: 10,
                backgroundColor: 'white',
                paddingVertical: 30,
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
                TERMS AND CONDITIONS
              </Text>
            </View>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* <View style={{justifyContent: 'space-between', marginVertical: 16}}>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => this.props.navigation.goBack()}>
                <Icon
                  name={'close'}
                  size={25}
                  color="#ea0016"
                  style={{
                    alignSelf: 'center',
                    paddingHorizontal: 15,
                    paddingVertical: 15,
                  }}
                />
              </TouchableOpacity>
            </View> */}
            {this.state.isLoading ? (
              <View
                style={{
                  alignSelf: 'center',
                  marginTop: 300,
                }}>
                <ActivityIndicator size={30} color="#ea0016" />
              </View>
            ) : null}
            {!this.state.isLoading && this.state.termsOfService == undefined ? (
              <Text>Not Available</Text>
            ) : (
              <HTML
                baseFontStyle={{fontSize: 8}}
                containerStyle={{paddingHorizontal: 15}}
                html={this.state.termsOfService}
                imagesMaxWidth={Dimensions.get('window').width}
              />
            )}
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
}

export default connect(mapStateToProps)(TermsAndCondition);

const styles = StyleSheet.create({
  TextInputStyle: {
    width: '80%',
    height: 40,
    marginBottom: 0,
    borderBottomWidth: 1,
  },
  inputFieldWrapper: {
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: -4,
  },
});
