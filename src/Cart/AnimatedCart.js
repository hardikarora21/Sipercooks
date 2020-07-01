import React, {useState} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, {
  abs,
  add,
  call,
  clockRunning,
  cond,
  eq,
  not,
  set,
  useCode,
} from 'react-native-reanimated';
import {PanGestureHandler} from 'react-native-gesture-handler';
import {usePanGestureHandler} from 'react-native-redash';

const {width} = Dimensions.get('window');

// interface ItemProps {
//   item: ItemModel;
// }

export default function AnimatedCart() {
  const [cartData, setCartData] = React.useState([
    {
      brand: 'Myntra52',
      productName: 'Popular Moong Dal, 1 Kg Pouch',
      price: '165',
      mrp: '365',
      media: '',
    },
    // {
    //   brand: 'Aashirvad',
    //   productName: 'Popular Rajma Dal, 10 Kg Pouch',
    //   price: '125',
    //   mrp: '305',
    //   media: '',
    // },
  ]);

  const [cartCount, setCartCount] = React.useState(0);
  const {gestureHandler, translation, velocity, state} = usePanGestureHandler();
  const translateX = translation.x;

  function render_CartData(item) {
    return (
      <Animated.View>
        <View style={styles.background} />
        <PanGestureHandler {...gestureHandler}>
          <Animated.View style={{transform: [{translateX}]}}>
            <View
              style={{
                backgroundColor: 'white',
                height: 105,
                borderTopWidth: 1,
                borderTopColor: '#efefef',
                flexDirection: 'row',
              }}>
              <View
                style={{
                  width: '30%',
                  justifyContent: 'center',
                  height: '100%',
                }}>
                <Image
                  style={{
                    height: '80%',
                    width: '100%',
                    resizeMode: 'contain',
                  }}
                  source={require('../assets/pd1.jpg')}
                />
              </View>
              <View
                style={{
                  width: '70%',
                  height: '100%',
                  justifyContent: 'space-evenly',
                }}>
                <Text
                  style={{
                    color: 'white',

                    fontSize: 8,
                    backgroundColor: '#e0848e',
                    width: '23%',
                    textAlign: 'center',
                    borderRadius: 20,
                    paddingHorizontal: 8,
                    paddingTop: 3.6,
                    paddingBottom: 3.6,
                    lineHeight: 9,
                  }}>
                  {item.brand}
                </Text>
                <Text
                  style={{fontSize: 12, fontWeight: 'bold', marginTop: -10}}>
                  {item.productName}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    paddingRight: 23,
                    justifyContent: 'space-between',
                  }}>
                  <View style={{flexDirection: 'row'}}>
                    <Text
                      style={{
                        fontSize: 14,
                        color: '#EA0016',
                        fontWeight: 'bold',
                        alignSelf: 'center',
                      }}
                      numberOfLines={1}>
                      Rs.{item.price}
                      {'   '}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        color: '#EA0016',
                        fontFamily: 'sans-serif-thin',
                        alignSelf: 'center',
                      }}
                      numberOfLines={1}>
                      [
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        color: '#EA0016',
                        textDecorationLine: 'line-through',
                        fontFamily: 'sans-serif-thin',
                        alignSelf: 'center',
                      }}
                      numberOfLines={1}>
                      MRP. Rs.{item.mrp}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        color: '#EA0016',
                        fontFamily: 'sans-serif-thin',
                        alignSelf: 'center',
                      }}
                      numberOfLines={1}>
                      ]
                    </Text>
                  </View>
                  <View>
                    <View
                      style={{
                        width: 80,
                        height: 28,
                        overflow: 'hidden',
                        borderWidth: 1,
                        borderColor: '#e1e1e1',
                        flexDirection: 'row',
                      }}>
                      <Icon
                        name={'minus'}
                        style={{
                          alignSelf: 'center',
                          height: 28,
                          width: 20,
                          paddingVertical: 7,
                          paddingLeft: 3,
                        }}
                        color={'#EA0016'}
                        size={15}
                        onPress={() => setCartCount(cartCount - 1)}
                      />
                      <Text
                        style={{
                          textAlign: 'center',
                          width: 40,
                          alignSelf: 'center',
                          fontWeight: 'bold',
                        }}>
                        {cartCount}
                      </Text>
                      <Icon
                        onPress={() => setCartCount(cartCount + 1)}
                        name={'plus'}
                        style={{
                          alignSelf: 'center',
                          height: 28,
                          width: 20,
                          paddingLeft: 1.5,
                          paddingVertical: 7,
                        }}
                        color={'#EA0016'}
                        size={15}
                      />
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </Animated.View>
        </PanGestureHandler>
      </Animated.View>
    );
  }

  return (
    <FlatList
      style={{marginTop: 0}}
      data={cartData}
      renderItem={({item}) => render_CartData(item)}
      keyExtractor={(item, index) => index.toString()}
    />
  );
}

const styles = StyleSheet.create({
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#E1E2E3',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    overflow: 'hidden',
  },
});

// const {gestureHandler, translation, velocity, state} = usePanGestureHandler();
// const translateX = useValue(0);
// const offsetX = useValue(0);
// useCode(
//   () => [
//     cond(
//       eq(state, state.ACTIVE),
//       set(translateX, add(offsetX, translation.x)),
//     ),
//     cond(eq(state, state.END), set(offsetX, translateX)),
//   ],
//   [],
// );

// function render_CartData(item) {
//   return (
//     <Animated.View>
//       <View style={styles.background} />
//       <PanGestureHandler {...gestureHandler}>
//         <Animated.View style={{transform: [{translateX}]}}>
//           <View
//             style={{
//               backgroundColor: 'white',
//               height: 105,
//               borderTopWidth: 1,
//               borderTopColor: '#efefef',
//               flexDirection: 'row',
//             }}>
//             <View
//               style={{
//                 width: '30%',
//                 justifyContent: 'center',
//                 height: '100%',
//               }}>
//               <Image
//                 style={{
//                   height: '80%',
//                   width: '100%',
//                   resizeMode: 'contain',
//                 }}
//                 source={require('../assets/pd1.jpg')}
//               />
//             </View>
//             <View
//               style={{
//                 width: '70%',
//                 height: '100%',
//                 justifyContent: 'space-evenly',
//               }}>
//               <Text
//                 style={{
//                   color: 'white',

//                   fontSize: 8,
//                   backgroundColor: '#e0848e',
//                   width: '23%',
//                   textAlign: 'center',
//                   borderRadius: 20,
//                   paddingHorizontal: 8,
//                   paddingTop: 3.6,
//                   paddingBottom: 3.6,
//                   lineHeight: 9,
//                 }}>
//                 {item.brand}
//               </Text>
//               <Text
//                 style={{fontSize: 12, fontWeight: 'bold', marginTop: -10}}>
//                 {item.productName}
//               </Text>
//               <View
//                 style={{
//                   flexDirection: 'row',
//                   paddingRight: 23,
//                   justifyContent: 'space-between',
//                 }}>
//                 <View style={{flexDirection: 'row'}}>
//                   <Text
//                     style={{
//                       fontSize: 14,
//                       color: '#EA0016',
//                       fontWeight: 'bold',
//                       alignSelf: 'center',
//                     }}
//                     numberOfLines={1}>
//                     Rs.{item.price}
//                     {'   '}
//                   </Text>
//                   <Text
//                     style={{
//                       fontSize: 12,
//                       color: '#EA0016',
//                       fontFamily: 'sans-serif-thin',
//                       alignSelf: 'center',
//                     }}
//                     numberOfLines={1}>
//                     [
//                   </Text>
//                   <Text
//                     style={{
//                       fontSize: 12,
//                       color: '#EA0016',
//                       textDecorationLine: 'line-through',
//                       fontFamily: 'sans-serif-thin',
//                       alignSelf: 'center',
//                     }}
//                     numberOfLines={1}>
//                     MRP. Rs.{item.mrp}
//                   </Text>
//                   <Text
//                     style={{
//                       fontSize: 12,
//                       color: '#EA0016',
//                       fontFamily: 'sans-serif-thin',
//                       alignSelf: 'center',
//                     }}
//                     numberOfLines={1}>
//                     ]
//                   </Text>
//                 </View>
//                 <View>
//                   <View
//                     style={{
//                       width: 80,
//                       height: 28,
//                       overflow: 'hidden',
//                       borderWidth: 1,
//                       borderColor: '#e1e1e1',
//                       flexDirection: 'row',
//                     }}>
//                     <Icon
//                       name={'minus'}
//                       style={{
//                         alignSelf: 'center',
//                         height: 28,
//                         width: 20,
//                         paddingVertical: 7,
//                         paddingLeft: 3,
//                       }}
//                       color={'#EA0016'}
//                       size={15}
//                       onPress={() => setCartCount(cartCount - 1)}
//                     />
//                     <Text
//                       style={{
//                         textAlign: 'center',
//                         width: 40,
//                         alignSelf: 'center',
//                         fontWeight: 'bold',
//                       }}>
//                       {cartCount}
//                     </Text>
//                     <Icon
//                       onPress={() => setCartCount(cartCount + 1)}
//                       name={'plus'}
//                       style={{
//                         alignSelf: 'center',
//                         height: 28,
//                         width: 20,
//                         paddingLeft: 1.5,
//                         paddingVertical: 7,
//                       }}
//                       color={'#EA0016'}
//                       size={15}
//                     />
//                   </View>
//                 </View>
//               </View>
//             </View>
//           </View>
//         </Animated.View>
//       </PanGestureHandler>
//     </Animated.View>
//   );
// }
