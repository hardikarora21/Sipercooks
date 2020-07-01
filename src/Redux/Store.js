import {createStore, combineReducers, applyMiddleware} from 'redux';
import {DefaultVariants} from './Cart/DefaultVariants';
import {Cart} from './Cart/CartReducer';
import {Login} from './Auth/Login';
import {User} from './Auth/UserProfile';
import {Addresses} from './Auth/Addresses';
import {NearestSupplier} from './Auth/NearestSupplier';
import {VisitedProfileOnes} from './Auth/HasVisitedProfile';
import {ReferalCode} from './Auth/RefferalCode';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import {persistStore, persistCombineReducers} from 'redux-persist';
// import storage from 'redux-persist/lib/storage';
import {AsyncStorage} from 'react-native';

export const ConfigureStore = () => {
  const config = {
    key: 'root',
    storage: AsyncStorage,
    debug: true,
  };
  const store = createStore(
    persistCombineReducers(config, {
      defaultVariants: DefaultVariants,
      cart: Cart,
      login: Login,
      addresses: Addresses,
      user: User,
      nearestSupplier: NearestSupplier,
      visitedProfileOnes: VisitedProfileOnes,
      referalCode: ReferalCode,
    }),
    applyMiddleware(thunk, logger),
  );

  const persistor = persistStore(store);

  return {persistor, store};
};
