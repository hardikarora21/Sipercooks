import React from 'react';
import {View, Image, StatusBar} from 'react-native';
import {Provider} from 'react-redux';
import {ConfigureStore} from './src/Redux/Store';
import {PersistGate} from 'redux-persist/integration/react';
import BottomTabNavigator from './src/RootNavigator/root';

const {persistor, store} = ConfigureStore();

class App extends React.Component {
  state = {
    Fs: false,
  };
  componentDidMount() {
    setTimeout(() => {
      this.setState({Fs: true});
    }, 1500);
  }
  render() {
    if (this.state.Fs == true)
      return (
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <BottomTabNavigator />
          </PersistGate>
        </Provider>
      );
    else return <Splash />;
  }
}
class Splash extends React.Component {
  render() {
    return (
      <View
        style={{flex: 1, justifyContent: 'center', backgroundColor: 'white'}}>
        <StatusBar backgroundColor="white" barStyle={'light-content'} />
        <Image
          style={{
            height: 150,
            width: 250,
            resizeMode: 'contain',
            alignSelf: 'center',
          }}
          source={require('./src/assets/ic_launcher.png')}
        />
      </View>
    );
  }
}
export default App;
