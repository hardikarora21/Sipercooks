import React from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {createStringWithFirstLetterCapital, getDate} from '../Shared/functions';

const SCREEN_WIDTH = Dimensions.get('screen').width;

class Transactions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {transactions} = this.props.route.params;

    return (
      <SafeAreaView>
        <ScrollView
          style={{backgroundColor: 'white'}}
          stickyHeaderIndices={[0]}
          showsVerticalScrollIndicator={false}>
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
                My Transactions
              </Text>
            </View>
          </View>

          <View style={{paddingHorizontal: 10}}>
            {transactions
              .slice(0)
              .reverse()
              .map((item, index) => {
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
                        {item.accountingEntryType === 'CREDIT' ? '+ ' : '- '}
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
              })}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

export default Transactions;
