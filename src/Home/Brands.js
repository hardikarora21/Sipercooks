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
  constructor(props) {
    super(props);
    this.state = {
      data: [
        {name: 'Britania', image: require('../assets/i1.jpg')},
        {name: 'Amul', image: require('../assets/i2.jpg')},
        {name: 'Nestle', image: require('../assets/i3.png')},
        // {name: 'Pepsi', image: require('../assets/i4.png')},
        // {name: 'ITC', image: require('../assets/i5.jpeg')},
      ],
      brandsData: [],
    };
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
          backgroundColor: 'white',
          height: 100,
          width: Dimensions.get('window').width / 3.05,
          justifyContent: 'center',
          paddingVertical: 2.5,
          borderColor: '#efefef',
          borderTopWidth: 1,
          marginTop: 15,
        }}>
        <View
          style={{
            flexDirection: 'row',
            height: 95,
            width: Dimensions.get('window').width / 3.05,
            justifyContent: 'space-between',
            alignSelf: 'center',
          }}>
          <View
            style={{
              justifyContent: 'space-evenly',
              height: 95,
              width: '100%',
            }}>
            <View
              style={{
                height: '80%',
                width: '100%',
                backgroundColor: 'white',
                borderRadius: 3,
              }}>
              <Image
                style={{height: '100%', width: '100%', resizeMode: 'contain'}}
                source={item.image}
              />
            </View>
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
