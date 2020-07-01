import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  ScrollView,
  SafeAreaView,
  Dimensions,
  TouchableWithoutFeedback,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ToastAndroid,
} from 'react-native';
import Ico from 'react-native-vector-icons/MaterialIcons';
import {searchUrl} from '../../Config/Constants';
import Axios from 'axios';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('screen').height;

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      searchKey: '',
      isSearching: false,
      errInSearch: false,
      errMessage: '',
    };
  }

  search = async searchKey => {
    if (searchKey.length < 4) {
      this.setState({
        searchKey: searchKey,
      });

      searchKey.length == 2
        ? ToastAndroid.showWithGravity(
            'Enter atleast four characters.',
            ToastAndroid.SHORT,
            ToastAndroid.CENTER,
          )
        : null;

      console.log('length less then 4');

      return;
    } else {
      console.log('Inside Search\nSearch key ->', searchKey);
      this.setState({
        isSearching: true,
        searchKey: searchKey,
        errInSearch: false,
        errMessage: '',
      });

      var url = searchUrl + searchKey;

      await Axios.get(url, {
        headers: {
          Authorization: 'bearer ' + '',
          'Content-type': 'application/json',
        },
      })
        .then(response => {
          console.log('Search data->', response.data);
          this.setState({
            searchResults: response.data,
            isSearching: false,
          });
        })
        .catch(error => {
          this.setState({
            isSearching: false,
            errInSearch: true,
            errMessage: error.message,
          });
          console.log('Error in searching', error);
        });
    }
  };

  render() {
    return (
      <SafeAreaView>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          stickyHeaderIndices={[0]}>
          <View style={{backgroundColor: '#fff'}}>
            <View style={styles.container}>
              <View style={{felx: 3}}>
                <TouchableWithoutFeedback
                  style={styles.backButton}
                  onPress={() => this.props.navigation.goBack()}>
                  <View style={styles.backButtonView}>
                    <Image
                      source={require('../assets/a1.png')}
                      style={styles.backButton}
                    />
                  </View>
                </TouchableWithoutFeedback>
              </View>
              <View style={styles.textInputView}>
                <Ico
                  name={'search'}
                  style={{alignSelf: 'center', color: 'gray'}}
                  size={18}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder={'Search'}
                  placeholderTextColor="gray"
                  autoFocus={true}
                  blurOnSubmit={true}
                  clearButtonMode="while-editing"
                  onChangeText={text => this.search(text)}
                  value={this.state.searchKey}
                />
              </View>
              {/* <View style={{flex: 2}}>
              <TouchableOpacity
                style={{marginVertical: 18}}
                onPress={() => this.props.navigation.navigate('Cart')}>
                <Image
                  style={{
                    height: 25,
                    width: 25,
                    marginLeft: 9,
                    // alignSelf: 'center',
                    resizeMode: 'contain',
                  }}
                  source={require('../assets/p1.png')}
                />
              </TouchableOpacity>
            </View> */}
            </View>
          </View>
          <View>
            {this.state.isSearching
              ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 4, 5, 6, 7].map(
                  (item, index) => {
                    return (
                      <View key={index} style={styles.loadingSearchResultStyle}>
                        <View style={{flex: 1}} />
                        <View style={{flex: 10}} />
                        <View style={{flex: 1}} />
                      </View>
                    );
                  },
                )
              : //   <ActivityIndicator
              //     size={35}
              //     color="#f00"
              //     animating={this.state.isSearching}
              //     style={styles.activityIndicator}
              //   />
              this.state.searchResults.length > 0
              ? this.state.searchResults.map((item, index) => {
                  return (
                    <View key={index} style={styles.searchResultStyle}>
                      <View style={{flex: 1}}>
                        <Ico
                          name={'search'}
                          // style={{alignSelf: 'center', color: 'gray'}}
                          size={18}
                        />
                      </View>
                      <View style={{flex: 10}}>
                        <TouchableOpacity
                          onPress={() => {
                            this.props.navigation.navigate('Productdetails', {
                              fromWhere: 'Search',
                              product: {
                                id: item.productId,
                                name: item.productName,
                              },
                            });
                          }}>
                          <Text>{item.productName}</Text>
                        </TouchableOpacity>
                      </View>
                      <View style={{flex: 1}}>
                        <TouchableOpacity
                          onPress={() => {
                            this.setState({searchKey: item.productName});
                            this.search(item.productName);
                          }}>
                          <Text style={{fontSize: 20}}>↖</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })
              : null}
          </View>
          <View>
            {this.state.errInSearch ? (
              <View>
                <Text>Errr in search</Text>
                <Text>{this.state.errMessage}</Text>
              </View>
            ) : null}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

export default Search;

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#fff',
    minHeight: SCREEN_HEIGHT,
  },
  container: {
    // flex: 1,
    flexDirection: 'row',
  },
  backButton: {
    marginLeft: -13.5,
    marginTop: 2,
    height: 42,
    width: 42,
    borderRadius: 360,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  backButton: {
    width: 18,
    height: 18,
    padding: 5,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 360,
    backgroundColor: 'white',
    // elevation: 2,
  },
  backButtonView: {
    height: 35,
    width: 35,
    borderRadius: 360,
    borderWidth: 1,
    borderColor: '#ededed',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignSelf: 'center',
    marginVertical: 18,
    marginHorizontal: 5,
    marginLeft: 10,
  },
  textInput: {
    width: (SCREEN_WIDTH / 10) * 5.7,
    // backgroundColor: '#efefef',
  },
  textInputView: {
    flex: 10,
    flexDirection: 'row',
    marginHorizontal: 10,
    paddingHorizontal: 10,
    elevation: 2,
    backgroundColor: 'white',
    height: 42,
    borderRadius: 5,
    marginVertical: 15,
  },
  activityIndicator: {
    alignSelf: 'center',
  },
  searchResultStyle: {
    flex: 1,
    flexDirection: 'row',
    height: 50,
    marginHorizontal: 20,
    borderBottomColor: '#efefef',
    borderBottomWidth: 1,
    paddingVertical: 15,
  },
  loadingSearchResultStyle: {
    flex: 1,
    flexDirection: 'row',
    height: 20,
    marginVertical: 7,
    marginHorizontal: 20,
    borderBottomColor: '#efefef',
    borderBottomWidth: 1,
    paddingVertical: 15,
    backgroundColor: '#efefef',
  },
});

{
  /* <ActivityIndicator
                size={35}
                color="#f00"
                animating={this.state.isSearching}
                style={styles.activityIndicator}
              /> */
}
//   [1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 4, 5, 6, 7].map(
//       (item, index) => {
//         return (
//           <View key={index} style={styles.loadingSearchResultStyle}>
//             <View style={{flex: 1}} />
//             <View style={{flex: 10}} />
//             <View style={{flex: 1}} />
//           </View>
//         );
//       },
//     )
