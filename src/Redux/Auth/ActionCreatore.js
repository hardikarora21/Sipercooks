import * as ActionTypes from './ActionTypes';
import {
  customerAddressesUrl,
  getUserProfile,
  getReferalCodeUrl,
  createReferalCodeUrl,
  supplierId,
} from '../../../Config/Constants';
import Axios from 'axios';

export const loginSuccess = obj => dispatch => dispatch(addUser(obj));

export const addUser = userData => ({
  type: ActionTypes.LOGIN_SUCCESS,
  payload: userData,
});

export const loginFail = errMessage => dispatch => {
  dispatch(errInLogin(errMessage));
};

export const errInLogin = errMessage => ({
  type: ActionTypes.LOGIN_ERR,
  payload: errMessage,
});

export const logOut = () => dispatch => dispatch(logOutuser());

logOutuser = () => ({
  type: ActionTypes.LOG_OUT,
});

export const skipLogin = () => dispatch => {
  dispatch(loginSkipped());
};

export const loginSkipped = () => ({
  type: ActionTypes.SKIPPED_LOGIN,
});

//the below action sets a value hasSelectedAddress In login reducer to true which means that user has selected ana ddress
export const addressSelected = () => dispatch => {
  dispatch(userSelectedDeliveryAddress());
};

export const userSelectedDeliveryAddress = () => ({
  type: ActionTypes.ADDRESS_SELECTED,
});

export const getuserAddresses = data => dispatch => {
  var userId = data.userId;
  var currentSelectedAddress = data.currentSelectedAddress;
  console.log(
    'Current selected address of user on action creator screen==============',
    currentSelectedAddress,
  );
  var url = customerAddressesUrl(userId);

  Axios.get(url, {
    headers: {
      Authorization: 'bearer ' + '',
      'Content-type': 'application/json',
    },
    timeout: 15000,
  })
    .then(response => {
      console.log(
        'Addresses data->',
        response.data.object,
        'currentSelectedAddress===========================================',
        currentSelectedAddress,
      );
      dispatch(addAddresses(response.data.object, currentSelectedAddress));
    })
    .catch(error => {
      dispatch(addressesFailed(error.message));
      console.log('Error', error.message);
    });
};

export const addAddresses = (addresses, currentSelectedAddress) => ({
  type: ActionTypes.GET_USER_ADDRESSES,
  payload: {
    addresses: addresses,
    currentSelectedAddress: currentSelectedAddress,
  },
});

export const addressesLoading = () => ({
  type: ActionTypes.USER_ADDRESSES_LOADING,
});

export const addressesFailed = error => ({
  type: ActionTypes.USER_ADDRESSES_FAILED,
  payload: error,
});

//the below reducre is used to set a address selected by the user as the address selected by the user for delivery in addresses reducer
export const addSelectedAddress = address => dispatch => {
  dispatch(selectedAddress(address));
};

export const selectedAddress = address => ({
  type: ActionTypes.ADD_SELECTED_ADDRESS,
  payload: address,
});

export const getUserData = customerId => dispatch => {
  // dispatch(userDataLoading());

  const url = getUserProfile(customerId);

  Axios.get(url, {
    headers: {
      Authorization: 'bearer ' + '',
      'Content-type': 'application/json',
    },
    timeout: 15000,
  })
    .then(response => {
      console.log('User data from action creatore screen', response.data);
      dispatch(addUserData(response.data.object[0]));
    })
    .catch(err => {
      dispatch(userDataErr(err.message));
    });
};

export const userDataLoading = () => ({
  type: ActionTypes.USERDATA_LOADING,
});

export const addUserData = data => ({
  type: ActionTypes.USERDATA_SUCCESS,
  payload: data,
});

export const userDataErr = err => ({
  type: ActionTypes.USERDATA_ERR,
  payload: err,
});

export const addNearestSupplier = nreaestSupplierData => dispatch => {
  dispatch(addSupplire(nreaestSupplierData));
};

export const addSupplire = nreaestSupplierData => ({
  type: ActionTypes.ADD_NEAREST_SUPPLIER,
  payload: nreaestSupplierData,
});

export const deleteNearestSupplier = () => dispatch => {
  dispatch(deleteSupplier());
};

export const deleteSupplier = () => ({
  type: ActionTypes.DELETE_NEAREST_SUPPLIER,
});

export const profileVisitedOnes = () => dispatch => {
  dispatch(hasVisitedProfile());
};

export const hasVisitedProfile = () => ({
  type: ActionTypes.VISITED_PROFILE_ONES,
});

export const getReferalCode = customerId => dispatch => {
  // getReferalCodeUrl, createReferalCodeUrl
  var getReffralCodeUrl = getReferalCodeUrl(customerId);
  var postRefferalCodeUrl = createReferalCodeUrl();

  var bodyForReferalCodeGeneration = {
    count: 0,
    createdBy: {
      description: 'string',
      id: 0,
    },
    createdDate: '2020-06-30T07:34:33.114Z',
    customer: customerId,
    id: 0,
    isFlag: 0,
    referralCode: 'string',
    state: {
      description: 'string',
      id: 0,
    },
    supplier: 59,
    updatedBy: {
      description: 'string',
      id: 0,
    },
    updatedDate: '2020-06-30T07:34:33.114Z',
  };

  Axios.post(postRefferalCodeUrl, bodyForReferalCodeGeneration, {
    headers: {
      Authorization: 'Bearer ' + '',
      'Content-Type': 'application/json',
    },
  })
    .then(resp => {
      console.log(
        'Here is response from posting a referal code =================================================================================================================================',
        resp.data.object[0].referralCode,
      );
      dispatch(addReferalToLocal(resp.data.object[0].referralCode));
    })
    .catch(err => {
      console.log(err.message);
    });
};

export const addReferalToLocal = code => ({
  type: ActionTypes.GET_REFFERAL_CODE,
  payload: code,
});
