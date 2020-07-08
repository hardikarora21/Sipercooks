import React from 'react';
import {
  StyleSheet,
  ScrollView,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Dimensions,
  TouchableWithoutFeedback,
  StatusBar,
  SafeAreaView,
  FlatList,
  Alert,
} from 'react-native';
import Axios from 'axios';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {getDay, getMonth} from '../Shared/functions';
const dw = Dimensions.get('window').width;
const dh = Dimensions.get('window').height;
export default class Subscriptiondetails extends React.Component {
  state = {
    Days: [],
    allSubCategoryProducts: [],
    scrollto: undefined,
    data2: [],
  };
  async componentDidMount() {
    if (await this.props.route.params.sid) {
      var id = await this.props.route.params.sid;
      var Id1 = await this.props.route.params.CID;
      this.sevendays();

      await Axios.get(
        'http://ec2-3-7-159-160.ap-south-1.compute.amazonaws.com/api/v3/stores/products/supplier/' +
          id,
        {
          headers: {
            Authorization: 'bearer ' + ' ',
            'Content-type': 'application/json',
          },
        },
      )
        .then(response => {
          console.log(
            ' SubSubCategory products from server on prodictlisting',
            response.data.object,
          );
          this.setState({
            allSubCategoryProductsLoading: false,
            isPaginating: false,
            allSubCategoryProducts: [
              ...this.state.allSubCategoryProducts,
              ...response.data.object,
            ],
            // productsList: response.data.object,
          });
          while (this.state.allSubCategoryProducts.length < 7) {
            this.setState({
              allSubCategoryProducts: [
                ...this.state.allSubCategoryProducts,
                ...response.data.object,
              ],
            });
          }
          this.props.createDefaultVariants(response.data.object);
        })
        .catch(err => {
          this.setState({allSubCategoryProductsLoading: false});
          console.log(err);
        });

      var url =
        'http://ec2-3-7-159-160.ap-south-1.compute.amazonaws.com/api/v3/stores/subscription/package/' +
        Id1;
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
            'tyu777------------------------------------------>' +
              JSON.stringify(response.data),
          );
        })
        .catch(function(error) {
          console.log('Error', error);
        });
    }
    console.log(
      'Data for flatlist-->' +
        JSON.stringify(this.state.allSubCategoryProducts[0]),
    );
  }

  sevendays = () => {
    var y = 0;
    var date = new Date();
    var currentdate = date.getDate();
    var currentday = date.getDay();
    if (currentday && currentdate)
      for (let index = 0; index < 7; index++) {
        let d = currentdate + index;
        let dy = currentday + index;
        if (dy > 6) {
          dy = 0 + y;
          y = y + 1;
        }
        this.state.Days.push({date: d, day: getDay(dy)});
      }
    console.log('state------> ' + JSON.stringify(this.state.Days));
  };
  renderData = (item, index) => {
    var d = new Date();

    return (
      <TouchableOpacity
        onPress={() => {
          this.setState({scrollto: item.index}),
            this.flatlistref1.scrollToIndex({
              animated: true,
              index: item.index,
            });
        }}>
        <View
          style={{
            height: 350,
            backgroundColor: 'white',
            width: dw / 1.2,
            borderRadius: 10,
            marginRight: 10,
            overflow: 'hidden',
            marginBottom: 10,
          }}>
          <Image
            style={{height: '80%', width: '100%', resizeMode: 'cover'}}
            source={
              item.item &&
              item.item.productListings &&
              item.item.productListings[0].medias[0]
                ? {
                    uri: item.item.productListings[0].medias[0].mediaUrl,
                  }
                : require('../assets/foodbg.png')
            }
          />

          <View
            style={{
              height: '20%',
              width: '100%',
              justifyContent: 'center',
            }}>
            <Text
              numberOfLines={2}
              style={{
                fontSize: 15,
                paddingLeft: 10,
                color: '#a7a7a7',
              }}>
              {this.state.Days[item.index].day}{' '}
              {this.state.Days[item.index].date} {getMonth(d.getMonth())}
            </Text>
            <Text
              numberOfLines={2}
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                paddingLeft: 10,
              }}>
              {item.item.name}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  renderdays = (item, index) => {
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          this.setState({scrollto: item.index}),
            this.flatlistref.scrollToIndex({animated: true, index: item.index});
        }}>
        <View
          style={{
            height: 70,
            width: dw / 6,
            backgroundColor:
              this.state.scrollto == item.index ? '#ea0016' : 'white',
            borderRadius: 10,
            marginRight: 10,
            justifyContent: 'center',
            elevation: 2,
            marginBottom: 10,
          }}>
          <Text
            numberOfLines={2}
            style={{
              fontSize: 15,
              fontWeight: 'bold',
              textAlign: 'center',
              color: this.state.scrollto == item.index ? 'white' : 'black',
            }}>
            {item.item.day}
          </Text>
          <Text
            numberOfLines={2}
            style={{
              fontSize: 15,
              fontWeight: 'bold',
              textAlign: 'center',
              color: this.state.scrollto == item.index ? 'white' : 'black',
            }}>
            {item.item.date}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    );
  };
  PlaceOrder = (days, amt, mrpamt) => {
    if (this.state.scrollto == undefined) {
      Alert.alert(
        'Start Date ',
        'Please select a start date for buying the subscription',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: 'Ok',
            onPress: () => {
              // this.props.navigation.navigate('Login');
            },
          },
        ],
        {cancelable: false},
      );
    } else {
      this.props.navigation.navigate('BuySubscription', {
        day: this.state.scrollto,
        Amount: amt,
        PlanDays: days,
        startDate: this.state.Days[this.state.scrollto].date,
        startDay: this.state.Days[this.state.scrollto].day,
        mrp: mrpamt,
      });
    }
  };
  render() {
    return (
      <View
        style={{
          width: dw,
          height: dh,
          backgroundColor: '#efefef',
          flex: 1,
        }}>
        <View
          style={{
            height: 60,
            justifyContent: 'space-between',
            backgroundColor: 'white',
            elevation: 2,
          }}>
          <View
            style={{
              height: 50,
              flexDirection: 'row',
              paddingLeft: 10,
              marginTop: 10,
              justifyContent: 'space-between',
              paddingRight: 10,
            }}>
            <View
              style={{
                flexDirection: 'row',
                height: 50,
              }}>
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
            </View>
            <Text
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                paddingLeft: 10,
                fontSize: 20,
                alignSelf: 'center',
              }}>
              {'   '}
              {this.props.route.params.title}
            </Text>
          </View>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{height: 390, width: dw}}>
            <Image
              style={{height: 280, width: dw, resizeMode: 'cover', zIndex: 1}}
              source={
                this.props.route.params.img
                  ? {uri: this.props.route.params.img}
                  : require('../assets/foodbg.png')
              }
            />
            <View
              style={{
                height: 110,
                width: '80%',
                backgroundColor: 'white',
                alignSelf: 'center',
                marginTop: -55,
                zIndex: 10,
                borderRadius: 5,
                elevation: 3,
                justifyContent: 'space-between',
                paddingVertical: 10,
                paddingHorizontal: 10,
              }}>
              <Text
                numberOfLines={1}
                style={{
                  fontSize: 20,
                  paddingTLeft: 10,
                  fontWeight: 'bold',
                }}>
                {this.props.route.params.title}
              </Text>
              <Text
                numberOfLines={2}
                style={{
                  fontSize: 15,
                  color: '#a7a7a7',
                  width: '96%',
                }}>
                {this.props.route.params.Des}
              </Text>
            </View>
          </View>
          <Text
            numberOfLines={2}
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              paddingLeft: 10,
            }}>
            A sneek-peek into the plan
          </Text>
          <FlatList
            ref={ref => {
              this.flatlistref1 = ref;
            }}
            initialScrollIndex={this.state.scrollto}
            style={{marginTop: 20, paddingLeft: 10, marginRight: 10}}
            extraData={this.state.scrollto}
            data={this.state.Days}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => item + index}
            renderItem={this.renderdays}
          />
          {this.state.allSubCategoryProducts.length > 0 ? (
            <FlatList
              ref={ref => {
                this.flatlistref = ref;
              }}
              initialScrollIndex={this.state.scrollto}
              extraData={this.state.Days}
              style={{marginTop: 10, paddingLeft: 10}}
              data={this.state.allSubCategoryProducts.slice(0, 7)}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => item + index}
              renderItem={this.renderData}
            />
          ) : null}
          <Text
            numberOfLines={2}
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              paddingLeft: 10,
              marginTop: 30,
            }}>
            Choose your plan
          </Text>
          <FlatList
            style={{marginTop: 40}}
            data={this.state.data2}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => (
              <View>
                <View
                  style={{
                    height: 68,
                    width: dw / 1.05,
                    alignSelf: 'center',
                    backgroundColor: 'white',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingHorizontal: 10,
                    borderRadius: 10,
                    elevation: 3,
                    marginBottom: 10,
                  }}>
                  <View
                    style={{
                      width: '30%',
                      alignSelf: 'center',
                      height: 40,
                      justifyContent: 'center',
                      marginTop: 14,
                    }}>
                    <Text
                      numberOfLines={2}
                      style={{
                        fontSize: 18,
                        color: '#a7a7a7',
                        fontWeight: '900',
                      }}>
                      3 Days
                    </Text>
                    <View style={{flexDirection: 'row'}}>
                      <Text
                        numberOfLines={1}
                        style={{
                          fontSize: 20,
                          fontWeight: 'bold',
                        }}>
                        Rs. {item.threedayPlanSellingPrice}
                      </Text>
                      <Text
                        style={{
                          fontSize: 15,
                          textDecorationLine: 'line-through',
                          color: '#a7a7a7',
                          alignSelf: 'center',
                          paddingLeft: 8,
                        }}>
                        Rs. {item.thredayPlanMrp}
                      </Text>
                    </View>
                    <Text
                      numberOfLines={1}
                      style={{
                        fontSize: 14,
                      }}></Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      this.PlaceOrder(
                        3,
                        item.threedayPlanSellingPrice,
                        item.thredayPlanMrp,
                      );
                    }}
                    style={{alignSelf: 'center'}}>
                    <View
                      style={{
                        height: 35,
                        backgroundColor: 'green',
                        justifyContent: 'center',
                        alignSelf: 'center',
                        borderRadius: 25,
                        width: 100,
                      }}>
                      <Text
                        numberOfLines={1}
                        style={{
                          fontSize: 15,
                          fontWeight: 'bold',
                          color: 'white',
                          textAlign: 'center',
                        }}>
                        CHOOSE
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    height: 68,
                    width: dw / 1.05,
                    alignSelf: 'center',
                    backgroundColor: 'white',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingHorizontal: 10,
                    borderRadius: 10,
                    elevation: 3,
                    marginBottom: 10,
                  }}>
                  <View
                    style={{
                      width: '30%',
                      alignSelf: 'center',
                      height: 40,
                      justifyContent: 'center',
                      marginTop: 14,
                    }}>
                    <Text
                      numberOfLines={2}
                      style={{
                        fontSize: 18,
                        color: '#a7a7a7',
                        fontWeight: '900',
                      }}>
                      7 Days
                    </Text>
                    <View style={{flexDirection: 'row'}}>
                      <Text
                        numberOfLines={1}
                        style={{
                          fontSize: 20,
                          fontWeight: 'bold',
                        }}>
                        Rs {item.sevendayPlanSellingPrice}
                      </Text>
                      <Text
                        style={{
                          fontSize: 15,
                          textDecorationLine: 'line-through',
                          color: '#a7a7a7',
                          alignSelf: 'center',
                          paddingLeft: 8,
                        }}>
                        Rs. {item.sevendayPlanMrp}
                      </Text>
                    </View>
                    <Text
                      numberOfLines={1}
                      style={{
                        fontSize: 14,
                      }}></Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      this.PlaceOrder(
                        7,
                        item.sevendayPlanSellingPrice,
                        item.sevendayPlanMrp,
                      );
                    }}
                    style={{alignSelf: 'center'}}>
                    <View
                      style={{
                        height: 35,
                        backgroundColor: 'green',
                        justifyContent: 'center',
                        alignSelf: 'center',
                        borderRadius: 25,
                        width: 100,
                      }}>
                      <Text
                        numberOfLines={1}
                        style={{
                          fontSize: 15,
                          fontWeight: 'bold',
                          color: 'white',
                          textAlign: 'center',
                        }}>
                        CHOOSE
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    height: 68,
                    width: dw / 1.05,
                    alignSelf: 'center',
                    backgroundColor: 'white',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingHorizontal: 10,
                    borderRadius: 10,
                    elevation: 3,
                    marginBottom: 10,
                  }}>
                  <View
                    style={{
                      width: '30%',
                      alignSelf: 'center',
                      height: 40,
                      justifyContent: 'center',
                      marginTop: 14,
                    }}>
                    <Text
                      numberOfLines={2}
                      style={{
                        fontSize: 18,
                        color: '#a7a7a7',
                        fontWeight: '900',
                      }}>
                      13 Days
                    </Text>
                    <View style={{flexDirection: 'row'}}>
                      <Text
                        numberOfLines={1}
                        style={{
                          fontSize: 20,
                          fontWeight: 'bold',
                        }}>
                        Rs {item.thirteendayPlanSellingPrice}
                      </Text>
                      <Text
                        style={{
                          fontSize: 15,
                          textDecorationLine: 'line-through',
                          color: '#a7a7a7',
                          alignSelf: 'center',
                          paddingLeft: 8,
                        }}>
                        Rs. {item.thirteendayPlanMrp}
                      </Text>
                    </View>
                    <Text
                      numberOfLines={1}
                      style={{
                        fontSize: 14,
                      }}></Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      this.PlaceOrder(
                        13,
                        item.thirteendayPlanSellingPrice,
                        item.thirteendayPlanMrp,
                      );
                    }}
                    style={{alignSelf: 'center'}}>
                    <View
                      style={{
                        height: 35,
                        backgroundColor: 'green',
                        justifyContent: 'center',
                        alignSelf: 'center',
                        borderRadius: 25,
                        width: 100,
                      }}>
                      <Text
                        numberOfLines={1}
                        style={{
                          fontSize: 15,
                          fontWeight: 'bold',
                          color: 'white',
                          textAlign: 'center',
                        }}>
                        CHOOSE
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </ScrollView>
      </View>
    );
  }
}
