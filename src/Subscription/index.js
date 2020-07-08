import React from 'react';

import {
  View,
  Dimensions,
  StyleSheet,
  TextInput,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import {Badge, Button} from 'react-native-elements';
import {Header, Left, Right, Tab, Tabs, ScrollableTab} from 'native-base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Spacing from '../styles/spacing';
import Typography from '../styles/typography';
import Layout from '../styles/layout';
import ElevatedView from 'react-native-elevated-view';
import Theme from '../styles/theme';
import Axios from 'axios';
export default class Subscription extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      searchTerm: '',
      Category: [],
      Products: [],
      Featured: [],
      MergedData: [],
      toggle: false,
      data2: [],
      selectedId: 0,
    };
    this.toggleColor = this.toggleColor.bind(this);
  }
  toggleColor() {
    const newState = !this.state.toggle;
    this.setState({
      toggle: newState,
    });
  }

  async componentDidMount() {
    var id = await this.props.route.params.ca_id;

    if (id) {
      const St = this.props.route.params.ca_id;
      this.getDataFromServer(id);
    } else {
    }
  }
  getDataFromServer(id) {
    Axios.get(
      'http://ec2-3-7-159-160.ap-south-1.compute.amazonaws.com/api/v3/stores/subscription/package/supplier/' +
        id,
    )
      .then(response => {
        console.log('CategoryCategory', response);
        this.setState({data: response.data.object});
        this.getProductByCategoryIdFromServer(
          response.data.object[0].subscrpitonCategory.id,
        );

        // return response;
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  async mergeCategoryData() {
    var catData = [];
    var newData = [];

    catData = this.state.Category;
    for (var i = 0; i < catData.length; i++) {
      var catID;
      catID = catData[i].categoryId;
      console.log('categoryID', catID);
      var pro = await this.getProductsAcToCategory(catID);

      data = {categoryData: catData[i], productsData: this.state.Products};
      newData.push(data);
    }
    console.log('Merged Data is finnaly', newData);
    this.setState({MergedData: newData});
    console.log('Merged Data is finnaly', this.state.MergedData);
  }

  getProductByCategoryIdFromServer(Id) {
    var url;
    var currentPage = 0;
    var requestedBy;
    var previouslyRequestedId = 0;
    var params;

    var url =
      'http://ec2-3-7-159-160.ap-south-1.compute.amazonaws.com/api/v3/stores/subscription/package/category/' +
      Id;
    var self = this;
    Axios.get(url, {
      headers: {
        Authorization: 'bearer ' + '',
        'Content-type': 'application/json',
      },
    })
      .then(response => {
        self.setState({data2: response.data.object});
        console.log(
          'tyu777---u--------------------------------------->' +
            JSON.stringify(self.state.data2),
        );
      })
      .catch(function(error) {
        console.log('Error', error);
      });
  }

  // _renderCategoryTabs(data) {
  //   console.log('_renderCategoryTabs', data);
  //   const tabs = data.map(items => (
  //     <Tab
  //       tabStyle={{backgroundColor: Theme.colors.surface}}
  //       textStyle={{color: Theme.colors.text}}
  //       activeTabStyle={{backgroundColor: Theme.colors.surface}}
  //       activeTextStyle={{color: Theme.colors.text, fontWeight: 'bold'}}
  //       onPress={() =>
  //         this.getProductByCategoryIdFromServer(items.subscrpitonCategory.id)
  //       }
  //       heading={items.subscrpitonCategory.name}>
  //       <View style={styles.flatListWrapper}></View>
  //     </Tab>
  //   ));

  //   return tabs;
  // }
  renderit = ({item, index}) => {
    return (
      <TouchableOpacity
        style={{borderBottomWidth: this.state.selectedId == index ? 3 : 0}}
        onPress={() => {
          this.setState({selectedId: index}),
            this.getProductByCategoryIdFromServer(item.subscrpitonCategory.id);
        }}>
        <View
          style={{
            height: 50,
            justifyContent: 'center',
            width: Dimensions.get('window').width / 2,
          }}>
          <Text style={{fontSize: 15, color: 'black', alignSelf: 'center'}}>
            {item.subscrpitonCategory.name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  render() {
    const {toggle} = this.state;
    const colorCode = toggle ? '#4CAF50' : '#f0f0f0';
    const textColor = toggle ? 'white' : 'black';
    const deviceWidth = Dimensions.get('window').width;
    return (
      <View style={Layout.safeArea}>
        <View style={[Layout.safeArea]}>
          <Header
            style={{backgroundColor: Theme.colors.surface}}
            androidStatusBarColor={'#00000030'}>
            <Left>
              <View style={[Layout.row, {width: 440}]}>
                <TouchableWithoutFeedback
                  style={{
                    marginLeft: -13.5,
                    marginTop: 2,
                    height: 42,
                    width: 42,
                    borderRadius: 360,
                    backgroundColor: 'white',
                    justifyContent: 'center',
                    alignSelf: 'center',
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
                        justifyContent: 'center',
                        borderRadius: 360,
                        backgroundColor: 'white',
                        elevation: 2,
                      }}
                    />
                  </View>
                </TouchableWithoutFeedback>
                <Text
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingLeft: 10,
                    fontSize: 20,
                    color: 'black',
                  }}>
                  {'  '}
                  {this.props.route.params.cat_name}
                </Text>
              </View>
            </Left>
            <Right />
          </Header>

          <ScrollView showsVerticalScrollIndicator={false}>
            <FlatList
              extraData={this.state.selectedId}
              style={{borderBottomColor: '#efefef', borderBottomWidth: 1}}
              data={this.state.data}
              keyExtractor={(item, index) => index.toString()}
              renderItem={this.renderit}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
            {/* <View style={styles.flatListWrapper}>
              <FlatList
                horizontal={false}
                showsVerticalScrollIndicator={false}
                renderItem={({item, index}) => (
                  <ElevatedView elevation={0} style={[styles.listWrapper]}>
                    <TouchableOpacity
                      activeOpacity={1}
                      onPress={() =>this.props.navigation.navigate('SubscriptionDetailPage')}>
                      <TouchableOpacity
                        activeOpacity={1}
                        onPress={() =>
                         this.props.navigation.navigate('SubscriptionDetailPage')
                        }
                        style={[Layout.contentCenter, styles.imageWrapper]}>
                      
                      </TouchableOpacity>
                      <View style={styles.imageWrapper}>
                        <View style={[Layout.row, {}]}>
                       
                          <Text
                            style={[
                              Typography.subheading,
                              {fontWeight: 'bold'},
                            ]}>
                            Must-try North Indian Veg Mini Meal Plan
                          </Text>
                        </View>
                        <Text
                          style={[
                            Typography.body,
                            {color: Theme.colors.placeholder, marginTop: 4},
                          ]}>
                          Veg curry, 4 whole wheat rotis & raita served with
                          salad and pickle.
                        </Text>
                        <View style={styles.line} />
                        <View
                          style={[
                            Layout.row,
                            Layout.contentCenter,
                            {marginBottom: Spacing.y3},
                          ]}>
                          <View
                            style={[
                              Layout.column,
                              Layout.selfCenter,
                              styles.columnWrapper,
                            ]}>
                            <Text
                              style={[
                                Typography.body2,
                                {color: Theme.colors.placeholder},
                              ]}>
                              1 Days
                            </Text>
                            <View style={[Layout.row, {marginTop: -4}]}>
                              <Text
                                style={[
                                  Typography.subheading,
                                  styles.textStyle,
                                ]}>
                                ₹ 79
                              </Text>
                              <Text
                                style={[
                                  Typography.caption,
                                  styles.textStyleLine,
                                ]}
                              />
                            </View>
                            <Text
                              style={[
                                Typography.caption,
                                styles.captionTextStyle,
                              ]}>
                              per meal
                            </Text>
                          </View>
                          <View
                            style={[
                              Layout.column,
                              Layout.selfCenter,
                              styles.columnWrapper,
                            ]}>
                            <Text
                              style={[
                                Typography.body2,
                                {color: Theme.colors.placeholder},
                              ]}>
                              3 Days
                            </Text>
                            <View style={[Layout.row, {marginTop: -4}]}>
                              <Text
                                style={[
                                  Typography.subheading,
                                  styles.textStyle,
                                ]}>
                                ₹ 75
                              </Text>
                              <Text
                                style={[
                                  Typography.caption,
                                  styles.textStyleLine,
                                ]}>
                                {' '}
                                79
                              </Text>
                            </View>
                            <Text
                              style={[
                                Typography.caption,
                                styles.captionTextStyle,
                              ]}>
                              per meal
                            </Text>
                          </View>
                          <View
                            style={[
                              Layout.column,
                              Layout.selfCenter,
                              {marginLeft: 18},
                            ]}>
                            <Text
                              style={[
                                Typography.body2,
                                {color: Theme.colors.placeholder},
                              ]}>
                              7 Days
                            </Text>
                            <View style={[Layout.row, {marginTop: -4}]}>
                              <Text
                                style={[
                                  Typography.subheading,
                                  styles.textStyle,
                                ]}>
                                ₹ 73
                              </Text>
                              <Text
                                style={[
                                  Typography.caption,
                                  styles.textStyleLine,
                                ]}>
                                {' '}
                                79
                              </Text>
                            </View>
                            <Text
                              style={[
                                Typography.caption,
                                styles.captionTextStyle,
                              ]}>
                              per meal
                            </Text>
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </ElevatedView>
                )}
                data={this.state.data}
                keyExtractor={(item, index) => item + index}
              />
            </View> */}
            <FlatList
              horizontal={false}
              showsVerticalScrollIndicator={false}
              renderItem={({item, index}) => (
                <TouchableWithoutFeedback
                  onPress={() =>
                    this.props.navigation.navigate('SubscriptionDetail', {
                      title: item.name,
                      Des: item.description,
                      img: '',
                      sid: item.supplierId,
                      CID: item.subscrpitonCategory.id,
                    })
                  }>
                  <View
                    style={{
                      height: 330,
                      backgroundColor: 'white',
                      elevation: 2,
                      marginBottom: 10,
                      justifyContent: 'space-between',
                      paddingVertical: 5,
                    }}>
                    <Image
                      source={
                        item && item.media && item.media.mediaUrl
                          ? {uri: item.media.mediaUrl}
                          : require('../assets/foodbg.png')
                      }
                      style={{
                        height: 150,
                        width: '90%',
                        alignSelf: 'center',
                        resizeMode: 'cover',
                        marginTop: 10,
                        borderRadius: 5,
                      }}
                    />
                    <View
                      style={{
                        height: 70,
                        width: '90%',
                        alignSelf: 'center',
                        marginTop: 10,
                      }}>
                      <Text
                        numberOfLines={1}
                        style={{
                          fontSize: 20,
                          paddingTLeft: 10,
                          fontWeight: 'bold',
                        }}>
                        {item.name}
                      </Text>
                      <Text
                        numberOfLines={2}
                        style={{
                          fontSize: 15,
                          color: '#a7a7a7',
                          paddingBottom: 10,
                          borderBottomWidth: 1,
                          borderBottomColor: '#efefef',
                          minHeight: 35,
                        }}>
                        {item.description}
                      </Text>
                    </View>
                    <View
                      style={{
                        height: 60,
                        width: '90%',
                        alignSelf: 'center',
                        marginTop: 10,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <View
                        style={{
                          width: '28%',
                          marginLeft: 10,
                        }}>
                        <Text
                          numberOfLines={2}
                          style={{
                            fontSize: 14,
                            color: '#a7a7a7',
                            fontWeight: '900',
                          }}>
                          3 Days
                        </Text>
                        <View style={{flexDirection: 'row'}}>
                          <Text
                            numberOfLines={1}
                            style={{
                              fontSize: 14,
                              fontWeight: 'bold',
                            }}>
                            Rs. {item.threedayPlanSellingPrice}
                          </Text>
                          <Text
                            style={{
                              fontSize: 10,
                              textDecorationLine: 'line-through',
                              color: '#a7a7a7',
                              alignSelf: 'center',
                              paddingLeft: 5,
                            }}>
                            Rs. {item.thredayPlanMrp}
                          </Text>
                        </View>
                        <Text
                          numberOfLines={1}
                          style={{
                            fontSize: 14,
                          }}>
                          Per Meal
                        </Text>
                      </View>
                      <View
                        style={{
                          alignSelf: 'center',
                          height: '90%',
                          width: 1,
                          backgroundColor: '#efefef',
                        }}></View>
                      <View
                        style={{
                          width: '28%',
                          marginLeft: 10,
                        }}>
                        <Text
                          numberOfLines={2}
                          style={{
                            fontSize: 14,
                            color: '#a7a7a7',
                            fontWeight: '900',
                          }}>
                          7 Days
                        </Text>
                        <View style={{flexDirection: 'row'}}>
                          <Text
                            numberOfLines={1}
                            style={{
                              fontSize: 14,
                              fontWeight: 'bold',
                            }}>
                            Rs. {item.sevendayPlanSellingPrice}
                          </Text>
                          <Text
                            style={{
                              fontSize: 10,
                              textDecorationLine: 'line-through',
                              color: '#a7a7a7',
                              alignSelf: 'center',
                              paddingLeft: 5,
                            }}>
                            Rs. {item.sevendayPlanMrp}
                          </Text>
                        </View>
                        <Text
                          numberOfLines={1}
                          style={{
                            fontSize: 14,
                          }}>
                          Per Meal
                        </Text>
                      </View>
                      <View
                        style={{
                          alignSelf: 'center',
                          height: '90%',
                          width: 1,
                          backgroundColor: '#efefef',
                        }}></View>
                      <View
                        style={{
                          width: '28%',
                          marginLeft: 10,
                        }}>
                        <Text
                          numberOfLines={2}
                          style={{
                            fontSize: 14,
                            color: '#a7a7a7',
                            fontWeight: '900',
                          }}>
                          13 Days
                        </Text>
                        <View style={{flexDirection: 'row'}}>
                          <Text
                            numberOfLines={1}
                            style={{
                              fontSize: 14,
                              fontWeight: 'bold',
                            }}>
                            Rs {item.thirteendayPlanSellingPrice}
                          </Text>
                          <Text
                            style={{
                              fontSize: 10,
                              textDecorationLine: 'line-through',
                              color: '#a7a7a7',
                              alignSelf: 'center',
                              paddingLeft: 5,
                            }}>
                            Rs. {item.thirteendayPlanMrp}
                          </Text>
                        </View>
                        <Text
                          numberOfLines={1}
                          style={{
                            fontSize: 14,
                          }}>
                          Per Meal
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              )}
              data={this.state.data2}
              keyExtractor={(item, index) => item + index}
            />
          </ScrollView>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  logoImage: {
    height: 35,
    width: 35,
    marginLeft: 4,
  },
  logoTextImage: {
    height: 26,
    width: 120,
  },
  RightComponentStyle: {
    height: 28,
    borderRadius: 20,
    backgroundColor: '#f0f0f098',
  },
  filteImage: {
    height: 26,
    width: 26,
    marginRight: 4,
  },
  line: {
    height: 1,
    width: '100%',
    backgroundColor: '#f0f0f0',
    marginVertical: 6,
  },
  flatListWrapper: {
    marginBottom: 8,
    backgroundColor: '#f0f0f0',
  },
  imageWrapper: {
    paddingHorizontal: 12,
    marginTop: 20,
  },
  ImageBackgroundStyle: {
    height: 160,
    width: '100%',
    overflow: 'visible',
    borderRadius: 5,
  },
  columnWrapper: {
    borderRightWidth: 1,
    borderRightColor: '#f0f0f0',
    marginLeft: 18,
  },
  textStyle: {
    fontWeight: 'bold',
    marginRight: 4,
    marginBottom: 2,
  },
  captionTextStyle: {
    fontSize: 10,
    color: Theme.colors.text,
    marginTop: -4,
  },
  listWrapper: {
    // height:352,
    width: '100%',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    marginBottom: 16,
  },
  textStyleLine: {
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
  },
});
