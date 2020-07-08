import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Image,
} from 'react-native';

class Brands extends React.Component {
  componentDidMount(){
    this.getCategory()

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
  getCategory=()=>{
    await Axios.get(
      'http://ec2-3-7-159-160.ap-south-1.compute.amazonaws.com/api/v3/account/banner/supplier/1',
      {
        headers: {
          Authorization: 'bearer ' + '',
          'Content-type': 'application/json',
        },
      },
    ).then(res=>{})
  }
  getBrands = async () => {
    this.setState({isBrandsLoading: true});
    console.log('inside get brands');

    var url = fetchCategoriesUrl();

    await Axios.get(url, {
      headers: {
        Authorization: 'bearer ' + '',
        'Content-type': 'application/json',
      },
      //   timeout: 15000,
    })
      .then(response => {
        console.log('Brands data->', response.data);
        this.setState({
          brandsData: response.data,
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
          height: 80,
          width: Dimensions.get('window').width / 6,
          justifyContent: 'center',
          paddingVertical: 2.5,
          borderColor: '#efefef',
          borderTopWidth: 1,
          marginTop: 15,
        }}>
        <View
          style={{
            flexDirection: 'row',
            height: 80,
            width: Dimensions.get('window').width / 6,
            justifyContent: 'space-between',
            alignSelf: 'center',
          }}>
          <View
            style={{
              justifyContent: 'space-evenly',
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
              }}>
              <Image
                style={{
                  height: '100%',
                  width: '100%',
                  resizeMode: 'contain',
                  alignSelf: 'center',
                }}
                source={item.image}
              />
            </View>
            <Text
              style={{
                textAlign: 'center',
                fontWeight: 'bold',
                marginTop: 10,
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
        horizontal
        style={{marginTop: -4}}
        contentContainerStyle={{
          justifyContent: 'space-evenly',
          alignSelf: 'center',
          width: Dimensions.get('window').width,
        }}
        showsHorizontalScrollIndicator={false}
        data={this.state.data}
        keyExtractor={(item, index) => index.toString()}
      />
    );
  }
}

export default Brands;
