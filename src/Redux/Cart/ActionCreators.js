import * as ActionTypes from './ActionTypes';

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

// cart
export const addOneItemToCart = object => dispatch => {
  dispatch(addItemToCart(object));
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
