import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Image,
} from 'react-native';
import Axios from 'axios';
class Brands extends React.Component {
  componentDidMount() {
    this.getBrands();
  }
  constructor(props) {
    super(props);
    this.state = {
      data: [
        {name: 'Pizza', image: require('../assets/cat-1.png')},
        {name: 'Noodles', image: require('../assets/cat-2.png')},
        {name: 'Pasta', image: require('../assets/cat-3.png')},
        {name: 'Pasta', image: require('../assets/cat-4.png')},
        {name: 'Pizza', image: require('../assets/cat-1.png')},
      ],
      brandsData: [],
    };
  }
  getCategory = async () => {
    await Axios.get(
      'http://ec2-3-7-159-160.ap-south-1.compute.amazonaws.com/api/v3/account/banner/supplier/1',
      {
        headers: {
          Authorization: 'bearer ' + '',
          'Content-type': 'application/json',
        },
      },
    ).then(res => {});
  };
  getBrands = async () => {
    this.setState({isBrandsLoading: true});
    console.log('inside get brands');

    await Axios.get(
      'http://ec2-3-7-159-160.ap-south-1.compute.amazonaws.com/api/v3/stores/categories/',
      {
        headers: {
          Authorization: 'bearer ' + '',
          'Content-type': 'application/json',
        },
        //   timeout: 15000,
      },
    )
      .then(response => {
        console.log('Brands data->', response.data);
        this.setState({
          brandsData: response.data.object,
          isBrandsLoading: false,
        });
      })
      .catch(error => {
        if (!error.status) {
          this.setState({isBrandsLoading: false});
        }
        console.log('Error', error);
      });
  };

  render_brands = ({item}) => {
    return (
      <TouchableOpacity
        style={{
          height: 90,
          width: Dimensions.get('window').width / 4.5,
          justifyContent: 'center',
          paddingVertical: 2.5,
          borderColor: '#efefef',
          borderTopWidth: 1,
          marginTop: 15,
          marginLeft: '2.2%',
        }}>
        <View
          style={{
            flexDirection: 'row',
            height: 90,
            width: Dimensions.get('window').width / 6,
            alignSelf: 'center',
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              height: 65,
              width: '100%',
            }}>
            <View
              style={{
                height: '90%',
                width: '100%',
                backgroundColor: 'white',
                borderRadius: 5,
                justifyContent: 'center',
                overflow: 'hidden',
                overflow: 'hidden',
                borderRadius: 5,
              }}>
              <Image
                style={{
                  height: '100%',
                  width: '100%',
                  resizeMode: 'contain',
                  alignSelf: 'center',
                }}
                source={
                  item && item.iconMedia && item.iconMedia.mediaUrl
                    ? {uri: item.iconMedia.mediaUrl}
                    : require('../assets/foodbg.png')
                }
              />
            </View>
            <View style={{width: 1, height: 4}}></View>
            <Text
              style={{
                textAlign: 'center',
                fontWeight: 'bold',
                fontSize: 10,
              }}>
              {item.name}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <FlatList
        renderItem={this.render_brands}
        numColumns={4}
        style={{marginTop: -4}}
        contentContainerStyle={{
          justifyContent: 'space-evenly',
          alignSelf: 'center',
          width: Dimensions.get('window').width,
        }}
        showsHorizontalScrollIndicator={false}
        data={this.state.brandsData}
        keyExtractor={(item, index) => index.toString()}
      />
    );
  }
}

export default Brands;
