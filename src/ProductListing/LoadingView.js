import React, {useState} from 'react';
import {View, Text, FlatList} from 'react-native';

export default function LoadingView({viewType}) {
  return (
    <FlatList
      style={{paddingTop: 10}}
      data={viewType === 'oneView' ? [1] : [1, 2, 3, 4, 5]}
      showsVerticalScrollIndicator={false}
      renderItem={({item}) => (
        <View
          style={{
            height: 130,
            backgroundColor: 'white',
            flexDirection: 'row',
            paddingVertical: 10,
            borderRadius: 5,
            marginBottom: 2,
            borderRadius: 5,
          }}>
          <View
            style={{
              backgroundColor: '#efefef',
              height: 85,
              width: 85,
              marginHorizontal: 10,
              marginVertical: 20,
            }}
          />

          <View style={{width: '75%', justifyContent: 'space-evenly'}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginLeft: -6,
                paddingRight: 10,
                marginTop: 15,
              }}>
              <View style={{marginLeft: 10, width: '69%'}}>
                <Text
                  style={{
                    fontSize: 8,
                    backgroundColor: '#efefef',
                    textAlign: 'center',
                    paddingHorizontal: 8,
                    paddingTop: 3.6,
                    paddingBottom: 3.6,
                    color: 'black',
                    lineHeight: 10,
                    flexWrap: 'wrap',
                  }}
                />
                <Text
                  style={{
                    fontSize: 14,
                    paddingTop: 5,
                    fontWeight: '600',
                    backgroundColor: '#efefef',
                  }}
                />
              </View>
              <View
                style={{
                  height: 30,
                  width: 60,
                  backgroundColor: '#efefef',
                }}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingLeft: 5,
              }}>
              <View
                style={{
                  height: 28,
                  borderColor: '#e1e1e1',
                  backgroundColor: '#efefef',
                  justifyContent: 'center',
                  width: 100,
                  borderRadius: 2,
                }}
              />
            </View>
          </View>
        </View>
      )}
      keyExtractor={(item, index) => index.toString()}
    />
  );
}
