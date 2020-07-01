import * as ActionTypes from './ActionTypes';

export const Cart = (
  state = {
    cart: [],
  },
  action,
) => {
  switch (action.type) {
    case ActionTypes.CLEAR_CART:
      return {
        ...state,
        cart: [],
      };

    case ActionTypes.ADD_ONE_PRODUCT:
      var newProduct = [action.payload];
      // var currentCart = state.cart;
      // currentCart.push(action.payload);
      return {
        ...state,
        cart: [...state.cart, ...newProduct],
      };

    case ActionTypes.DELETE_ONE_ITEM:
      var indexOfItemToBeDeleted = action.payload;
      var currentCartData = state.cart;
      currentCartData.splice(indexOfItemToBeDeleted, 1);
      return {
        ...state,
        cart: currentCartData,
      };

    case ActionTypes.INCREASE_PRODUCT_COUNT:
      var productId = action.payload.productId;
      var variantSelectedByCustomer = action.payload.variantSelectedByCustomer;
      var currentStateOfCart = state.cart;

      var index0fProductInCartWithSameIdAndSameVariant = state.cart.findIndex(
        x =>
          x.id === productId &&
          x.variantSelectedByCustome === variantSelectedByCustomer,
      );

      index0fProductInCartWithSameIdAndSameVariant === -1
        ? null
        : (currentStateOfCart[
            index0fProductInCartWithSameIdAndSameVariant
          ].productCountInCart =
            currentStateOfCart[index0fProductInCartWithSameIdAndSameVariant]
              .productCountInCart + 1);
      return {
        ...state,
        cart: currentStateOfCart,
      };

    case ActionTypes.DECREASE_PRODUCT_COUNT:
      var productId = action.payload.productId;
      var variantSelectedByCustomer = action.payload.variantSelectedByCustomer;
      var currentStateOfCart = state.cart;

      var index0fProductInCartWithSameIdAndSameVariant = state.cart.findIndex(
        x =>
          x.id === productId &&
          x.variantSelectedByCustome === variantSelectedByCustomer,
      );

      index0fProductInCartWithSameIdAndSameVariant === -1
        ? null
        : currentStateOfCart[index0fProductInCartWithSameIdAndSameVariant]
            .productCountInCart > 1
        ? (currentStateOfCart[
            index0fProductInCartWithSameIdAndSameVariant
          ].productCountInCart =
            currentStateOfCart[index0fProductInCartWithSameIdAndSameVariant]
              .productCountInCart - 1)
        : currentStateOfCart.splice(
            index0fProductInCartWithSameIdAndSameVariant,
            1,
          );
      return {
        ...state,
        cart: currentStateOfCart,
      };
    default:
      return state;
  }
};
