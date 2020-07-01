import React from 'react';
import {TouchableOpacity, View, Text} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function ListItem(props) {
  return (
    <TouchableOpacity onPress={() => props.onPressFunction()}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 15,
          marginBottom: 5,
        }}>
        <View style={{flexDirection: 'row'}}>
          <View
            style={{
              backgroundColor: '#efefef',
              justifyContent: 'center',
              alignSelf: 'center',
              height: 25,
              width: 25,
              borderRadius: 360,
            }}>
            {props.leftIcon && (
              <Icon
                name={props.leftIconName}
                style={{alignSelf: 'center'}}
                size={13}
                color={'gray'}
              />
            )}
            {props.leftImage && props.children}
          </View>
          <Text
            style={{
              fontSize: 13,
              color: 'black',
              alignSelf: 'center',
              paddingLeft: 10,
            }}>
            {props.text}
          </Text>
        </View>

        <Icon
          name={props.iconRightName}
          size={20}
          style={{alignSelf: 'flex-end'}}
          color={'gray'}
        />
      </View>
    </TouchableOpacity>
  );
}
