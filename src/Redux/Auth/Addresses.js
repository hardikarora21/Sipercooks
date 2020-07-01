import * as ActionTypes from './ActionTypes';

export const Addresses = (
  state = {
    addressesLoading: false,
    userAddresses: [],
    errMess: null,
    selectedAddress: null,
  },
  action,
) => {
  switch (action.type) {
    case ActionTypes.GET_USER_ADDRESSES:
      console.log(
        'Addresses from address reducer =========================',
        action.payload.addresses,
      );
      console.log(
        'currently selected address from address reducer =========================',
        action.payload.currentSelectedAddress,
      );
      return {
        ...state,
        userAddresses: action.payload.addresses,
        addressesLoading: false,
        errMess: null,
        selectedAddress: action.payload.currentSelectedAddress,
      };

    case ActionTypes.USER_ADDRESSES_LOADING:
      return {
        ...state,
        addressesLoading: true,
        userAddresses: [],
        errMess: null,
        selectedAddress: null,
      };

    case ActionTypes.USER_ADDRESSES_FAILED:
      return {
        ...state,
        addressesLoading: false,
        userAddresses: [],
        errMess: action.payload,
        selectedAddress: null,
      };

    case ActionTypes.ADD_SELECTED_ADDRESS:
      return {
        ...state,
        addressesLoading: state.addressesLoading,
        userAddresses: state.userAddresses,
        errMess: state.errMess,
        selectedAddress: action.payload,
      };

    case ActionTypes.LOG_OUT:
      return {
        ...state,
        addressesLoading: false,
        userAddresses: [],
        errMess: null,
        selectedAddress: null,
      };
    default:
      return state;
  }
};
