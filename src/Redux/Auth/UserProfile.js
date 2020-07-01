import * as ActionTypes from './ActionTypes';

export const User = (
  state = {
    firstName: null,
    lastName: null,
    phoneNumber: null,
    email: null,
    description: null,
    isLoading: false,
    errMess: null,
  },
  action,
) => {
  switch (action.type) {
    // case ActionTypes.USERDATA_ERR:
    //   return {
    //     ...state,
    //     firstName: null,
    //     lastName: null,
    //     phoneNumber: null,
    //     email: null,
    //     description: null,
    //     isLoading: false,
    //     errMess: action.payload,
    //   };

    case ActionTypes.USERDATA_SUCCESS:
      return {
        ...state,
        firstName: action.payload.firstName,
        lastName: action.payload.lastName,
        phoneNumber: action.payload.phoneNo,
        email: action.payload.emailId,
        description: null,
        isLoading: false,
        errMess: null,
      };

    case ActionTypes.LOG_OUT:
      return {
        ...state,
        firstName: null,
        lastName: null,
        phoneNumber: null,
        email: null,
        description: null,
        isLoading: false,
        errMess: null,
      };

    default:
      return state;
  }
};
