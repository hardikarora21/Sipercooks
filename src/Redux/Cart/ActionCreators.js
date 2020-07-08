import * as ActionTypes from './ActionTypes';
import {Alert} from 'react-native';

// default variants
export const createDefaultVariants = objectOfProducts => dispatch => {
  dispatch(creatingDefaultVariants(objectOfProducts));
};

export const creatingDefaultVariants = objectOfProducts => ({
  type: ActionTypes.ADD_DEFAULT_VARIANTS,
  payload: objectOfProducts,
});

export const deleteAllDefaultVarinats = () => dispatch => {
  dispatch(deleteAllVariants());
};

export const deleteAllVariants = () => ({
  type: ActionTypes.DELETE_DEFAULT_VARIANTS,
});

export const editDefaultVariant = (
  newVariantInfo,
  indexOfProduct,
) => dispatch => {
  dispatch(editVariant(newVariantInfo, indexOfProduct));
};

export const editVariant = (newVariantInfo, indexOfProduct) => ({
  type: ActionTypes.EDIT_DEFAULT_VARIANTS,
  payload: {newVariantInfo: newVariantInfo, indexOfProduct: indexOfProduct},
});

export const addOneItemToCart = (object, first) => dispatch => {
  console.log(
    'cart in ftttttttt-------------------------------------------------------------------------------> ' +
      first,
  );
  if (first == 'Empty' || first == undefined) {
    dispatch(addItemToCart(object));
  } else {
    if (object.supplierId == first.supplierId) {
      dispatch(addItemToCart(object));
    } else {
      Alert.alert(
        'Please Clear the Cart!',
        'You need to clear the cart to add this Product.',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: 'Clear Cart',
            onPress: () => {
              dispatch(clearCart());
            },
          },
        ],
        {cancelable: false},
      );
    }
  }
};

export const addItemToCart = product => ({
  type: ActionTypes.ADD_ONE_PRODUCT,
  payload: product,
});

export const deleteOneItemFromCart = index => dispatch => {
  dispatch(deleteItem(index));
};

export const deleteItem = index => ({
  type: ActionTypes.DELETE_ONE_ITEM,
  payload: index,
});

export const deleteAllItemsFromCart = () => dispatch => {
  dispatch(clearCart());
};

export const clearCart = () => ({
  type: ActionTypes.CLEAR_CART,
});

export const increaseProductCount = (
  productId,
  variantSelectedByCustomer,
) => dispatch => {
  dispatch(increaseCount(productId, variantSelectedByCustomer));
};

export const increaseCount = (productId, variantSelectedByCustomer) => ({
  type: ActionTypes.INCREASE_PRODUCT_COUNT,
  payload: {
    productId: productId,
    variantSelectedByCustomer: variantSelectedByCustomer,
  },
});

export const decreaseProductCount = (
  productId,
  variantSelectedByCustomer,
) => dispatch => {
  dispatch(decreaseCount(productId, variantSelectedByCustomer));
};

export const decreaseCount = (productId, variantSelectedByCustomer) => ({
  type: ActionTypes.DECREASE_PRODUCT_COUNT,
  payload: {
    productId: productId,
    variantSelectedByCustomer: variantSelectedByCustomer,
  },
});
