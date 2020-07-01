import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
  TextInput,
  Image,
  Dimensions,
} from 'react-native';
import {List, Checkbox} from 'react-native-paper';
import Ico from 'react-native-vector-icons/MaterialIcons';
import {
  generalQueries,
  paymentRefundQuries,
  cancellationAndReturn,
  placeingOrder,
  deliveryRelatedQuries,
} from './FAQData';

const SCREEN_WIDTH = Dimensions.get('window').width;

class FAQs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    // console.log(JSON.stringify(this.state));
    return (
      <View style={styles.container}>
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
              FAQs
            </Text>
          </View>
        </View>

        <ScrollView stickyHeaderIndices={[0, 2, 4, 6, 8]}>
          <View
            style={{
              backgroundColor: '#fff',
              paddingHorizontal: 15,
              paddingVertical: 15,
            }}>
            <Text style={{fontSize: 15, fontWeight: '700'}}>
              General Queries
            </Text>
          </View>
          <View>
            {generalQueries.map((item, index) => {
              return (
                <List.Accordion
                  style={{backgroundColor: '#fff', marginBottom: 1}}
                  title={item.title}
                  titleStyle={{
                    fontSize: 14,
                    color: '#333',
                  }}>
                  <List.Item
                    left={() => {
                      <View style={{maxWidth: 0}} />;
                    }}
                    style={{backgroundColor: '#fff'}}
                    description={item.content}
                    descriptionStyle={{fontSize: 12}}
                    descriptionNumberOfLines={20}
                  />
                </List.Accordion>
              );
            })}
          </View>
          <View
            style={{
              backgroundColor: '#fff',
              paddingHorizontal: 15,
              paddingVertical: 15,
            }}>
            <Text style={{fontSize: 15, fontWeight: '700'}}>
              Payment Refund Queries
            </Text>
          </View>
          <View>
            {paymentRefundQuries.map((item, index) => {
              return (
                <List.Accordion
                  style={{backgroundColor: '#fff', marginBottom: 1}}
                  title={item.title}
                  titleStyle={{
                    fontSize: 14,
                    color: '#333',
                  }}>
                  <List.Item
                    left={() => {
                      <View style={{maxWidth: 0}} />;
                    }}
                    style={{backgroundColor: '#fff'}}
                    description={item.content}
                    descriptionStyle={{fontSize: 12}}
                    descriptionNumberOfLines={20}
                  />
                </List.Accordion>
              );
            })}
          </View>
          <View
            style={{
              backgroundColor: '#fff',
              paddingHorizontal: 15,
              paddingVertical: 15,
            }}>
            <Text style={{fontSize: 15, fontWeight: '700'}}>
              Cancellation And Return
            </Text>
          </View>
          <View>
            {cancellationAndReturn.map((item, index) => {
              return (
                <List.Accordion
                  style={{backgroundColor: '#fff', marginBottom: 1}}
                  title={item.title}
                  titleStyle={{
                    fontSize: 14,
                    color: '#333',
                  }}>
                  <List.Item
                    left={() => {
                      <View style={{maxWidth: 0}} />;
                    }}
                    style={{backgroundColor: '#fff'}}
                    description={item.content}
                    descriptionStyle={{fontSize: 12}}
                    descriptionNumberOfLines={20}
                  />
                </List.Accordion>
              );
            })}
          </View>
          <View
            style={{
              backgroundColor: '#fff',
              paddingHorizontal: 15,
              paddingVertical: 15,
            }}>
            <Text style={{fontSize: 15, fontWeight: '700'}}>
              Placeing Order
            </Text>
          </View>
          <View>
            {placeingOrder.map((item, index) => {
              return (
                <List.Accordion
                  style={{backgroundColor: '#fff', marginBottom: 1}}
                  title={item.title}
                  titleStyle={{
                    fontSize: 14,
                    color: '#333',
                  }}>
                  <List.Item
                    left={() => {
                      <View style={{maxWidth: 0}} />;
                    }}
                    style={{backgroundColor: '#fff'}}
                    description={item.content}
                    descriptionStyle={{fontSize: 12}}
                    descriptionNumberOfLines={20}
                  />
                </List.Accordion>
              );
            })}
          </View>
          <View
            style={{
              backgroundColor: '#fff',
              paddingHorizontal: 15,
              paddingVertical: 15,
            }}>
            <Text style={{fontSize: 15, fontWeight: '700'}}>
              Delivery Related Quries
            </Text>
          </View>
          <View>
            {deliveryRelatedQuries.map((item, index) => {
              return (
                <List.Accordion
                  style={{backgroundColor: '#fff', marginBottom: 1}}
                  title={item.title}
                  titleNumberOfLines={2}
                  titleStyle={{
                    fontSize: 14,
                    color: '#333',
                  }}>
                  <List.Item
                    left={() => {
                      <View style={{maxWidth: 0}} />;
                    }}
                    style={{backgroundColor: '#fff'}}
                    description={item.content}
                    descriptionStyle={{fontSize: 12}}
                    descriptionNumberOfLines={20}
                  />
                </List.Accordion>
              );
            })}
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default FAQs;

const styles = StyleSheet.create({
  container: {flex: 1},
});
