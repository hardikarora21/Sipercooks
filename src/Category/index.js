import * as React from 'react';
import {
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Dimensions,
  TouchableWithoutFeedback,
  Image,
  TextInput,
  RefreshControl,
} from 'react-native';
import {List, Checkbox} from 'react-native-paper';
import Axios from 'axios';
import {
  fetchCategoriesUrl,
  fetchSubCategoriesUrl,
} from '../../Config/Constants';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ico from 'react-native-vector-icons/MaterialIcons';
import {createStringWithFirstLetterCapital, getDate} from '../Shared/functions';

const SCREEN_WIDTH = Dimensions.get('window').width;

class Categories extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
      isCategoryDataLoading: false,
      categoryData: [],
      networkError: false,
      subCategoryDataLoading: true,
      subCategoryData: [],
      categoriesSelect: [],
    };
  }

  componentDidMount() {
    this.getCategoryDataFromServer();
  }

  getCategoryDataFromServer = async () => {
    this.setState({isCategoryDataLoading: true});
    console.log('inside getCategoryDataFromServer');

    var url = fetchCategoriesUrl();
    await Axios.get(url, {
      headers: {
        Authorization: 'bearer ' + '',
        'Content-type': 'application/json',
      },
      timeout: 15000,
    })
      .then(response => {
        console.log('Category data->', response.data.object);
        this.setState({
          categoryData: response.data.object,
          isCategoryDataLoading: false,
        });
        var categoriesSelect = [];
        response.data.object.map((item, index) => {
          categoriesSelect.push({isAccordianOpen: false});
        });
        this.setState({categoriesSelect: categoriesSelect});
      })
      .catch(error => {
        if (!error.status) {
          this.setState({networkError: true, isCategoryDataLoading: false});
        }
        console.log('Error', error);
      });

    console.log('select data-> ', this.state.categoriesSelect);
  };

  getSubCategoriesByCategoryIdFromServer = async categoryId => {
    this.setState({subCategoryDataLoading: true});
    console.log('Start Getting sub category from server');

    var url = fetchSubCategoriesUrl(categoryId);

    await Axios.get(url, {
      headers: {
        Authorization: 'bearer ' + ' ',
        'Content-type': 'application/json',
      },
    })
      .then(response => {
        console.log('getSubCategoriesByCategoryIdFromServer', response.data);
        this.setState({
          subCategoryData: response.data.object,
          subCategoryDataLoading: false,
          // show_DropdownElements: true,
        });

        // self.setState({couponData: response.data.object});
      })
      .catch(function(err) {
        this.setState({
          subCategoryDataLoading: false,
        });
        console.log('Error', err.message);
      });
  };

  _handlePress = (indexOfCategory, categoryId) => {
    if (this.state.categoriesSelect.length > 0) {
      var currentExpandState = this.state.categoriesSelect;
      !currentExpandState[indexOfCategory].isAccordianOpen
        ? this.getSubCategoriesByCategoryIdFromServer(categoryId)
        : null;
      var categoriesSelect = [];
      currentExpandState.map((item, index) => {
        if (indexOfCategory === index)
          categoriesSelect.push({
            isAccordianOpen: !currentExpandState[indexOfCategory]
              .isAccordianOpen,
          });
        else {
          categoriesSelect.push({isAccordianOpen: false});
        }
      });
      this.setState({categoriesSelect: categoriesSelect});
    } else {
      return;
    }
  };

  render() {
    const {categoriesSelect} = this.state;
    return (
      <SafeAreaView>
        <ScrollView
          showsVerticalScrollIndicator={false}
          stickyHeaderIndices={[0]}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isCategoryDataLoading}
              onRefresh={this.getCategoryDataFromServer}
              progressViewOffset={80}
              progressBackgroundColor="#EA0016"
              colors={['#fff']}
            />
          }>
          <View
            style={{
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
                Categories
              </Text>
            </View>
          </View>
          <View style={{backgroundColor: '#fff', padding: 10}}>
            <TouchableWithoutFeedback
              onPress={() => {
                this.props.navigation.navigate('Search');
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  marginHorizontal: 10,
                  paddingHorizontal: 10,
                  // elevation: 2,
                  backgroundColor: 'white',
                  borderColor: '#efefef',
                  borderWidth: 1,
                  height: 42,
                  borderRadius: 5,
                }}>
                <Ico
                  name={'search'}
                  style={{alignSelf: 'center', color: 'gray'}}
                  size={18}
                />
                <TextInput
                  editable={false}
                  style={{
                    paddingLeft: 5,
                    marginLeft: 5,
                    alignSelf: 'center',
                    height: 40,
                  }}
                  placeholder={'Search'}
                  placeholderTextColor="gray"
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
          {/* <List.Section> */}
          {/* {this.state.categoryData.length > 0 &&
          !this.state.isCategoryDataLoading
            ? this.state.categoryData.map((item, index) => {
                return (
                  <List.Accordion
                    style={{backgroundColor: '#fff', marginBottom: 1}}
                    key={index}
                    title={item.firstName}
                    titleStyle={{
                      fontWeight: '600',
                      // color:
                      //   this.state.categoriesSelect.length > 0
                      //     ? !categoriesSelect[index].isAccordianOpen
                      //       ? '#333'
                      //       : '#EA0016'
                      //     : '#333',
                      color: '#333',
                    }}
                    left={
                      // props => <List.Icon {...props} icon="folder" />
                      props => (
                        <Image
                          style={{
                            height: 50,
                            width: 50,
                            // resizeMode: 'contain',
                          }}
                          source={
                            item.media && item.media.mediaUrl
                              ? {uri: item.media.mediaUrl}
                              : require('../assets/foodbg.png')
                          }
                        />
                      )
                    }
                    expanded={
                      this.state.categoriesSelect.length > 0
                        ? this.state.categoriesSelect[index].isAccordianOpen
                        : true
                    }
                    onPress={() => this._handlePress(index, item.id)}>
                    {this.state.subCategoryData.length > 0 &&
                    !this.state.subCategoryDataLoading
                      ? this.state.subCategoryData.map((x, y) => {
                          return (
                            // <TouchableOpacity
                            //   style={{
                            //     backgroundColor: '#fff',
                            //     marginBottom:
                            //       y === this.state.subCategoryData.length - 1
                            //         ? 8
                            //         : 1,
                            //   }}
                            //   >
                            <List.Item
                              key={y}
                              onPress={() =>
                                this.props.navigation.navigate('Productlist', {
                                  subcatid: x.id,
                                  subCatname: x.name,
                                })
                              }
                              left={() => {
                                <View style={{maxWidth: 0}} />;
                              }}
                              style={{
                                minWidth: SCREEN_WIDTH,
                                backgroundColor: '#fff',
                                marginBottom:
                                  y === this.state.subCategoryData.length - 1
                                    ? 8
                                    : 1,
                                // backgroundColor: '#f00',
                              }}
                              title={x.name}
                              titleStyle={{marginLeft: 0}}
                            />
                            // </TouchableOpacity>
                          );
                        })
                      : [1, 2, 3, 4, 5, 6, 7].map((item, index) => {
                          return (
                            <List.Item
                              left={() => {
                                <View style={{maxWidth: 0}} />;
                              }}
                              style={{
                                minWidth: SCREEN_WIDTH,
                                backgroundColor: '#fff',
                                marginBottom:
                                  index ===
                                  this.state.subCategoryData.length - 1
                                    ? 8
                                    : 1,
                              }}
                              titleStyle={{
                                backgroundColor: '#efefef',
                                height: 20,
                              }}
                            />
                          );
                        })}
                  </List.Accordion>
                );
              })
            : this.state.isCategoryDataLoading
            ? [1, 2, 3, 4, 5, 6, 7, 8].map((item, index) => {
                return (
                  <View key={index}>
                    <View
                      style={{
                        backgroundColor: '#fff',
                        flex: 1,
                        flexDirection: 'row',
                        marginBottom: 1,
                      }}>
                      <View
                        style={{
                          flex: 2,
                          height: 55,
                          width: 55,
                          backgroundColor: '#efefef',
                          margin: 10,
                        }}
                      />
                      <View
                        style={{
                          flex: 10,
                          height: 30,
                          width: 30,
                          backgroundColor: '#efefef',
                          margin: 10,
                          marginTop: 22,
                        }}
                      />
                    </View>
                  </View>
                );
              })
            : null} */}
          {/* </List.Section> */}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

export default Categories;
