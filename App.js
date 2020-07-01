import React from 'react';

import {Provider} from 'react-redux';
import {ConfigureStore} from './src/Redux/Store';
import {PersistGate} from 'redux-persist/integration/react';
import BottomTabNavigator from './src/RootNavigator/root';

const {persistor, store} = ConfigureStore();

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <BottomTabNavigator />
        </PersistGate>
      </Provider>
    );
  }
}

export default App;
