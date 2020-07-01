import * as ActionTypes from './ActionTypes';

export const Login = (
  state = {
    loginLoading: false,
    loginErr: null,
    loginSuccess: false,
    accessToken: null,
    refreshToken: null,
    userId: null,
    loginCount: null,
    userName: null,
    skippedLogin: false,
    hasSelectedAddress: false,
  },
  action,
) => {
  switch (action.type) {
    case ActionTypes.LOGIN_LOADING:
      return {
        ...state,
        loginLoading: true,
        loginErr: null,
        loginSuccess: false,
        accessToken: null,
        refreshToken: null,
        userId: null,
        loginCount: null,
        userName: null,
        skippedLogin: false,
        hasSelectedAddress: false,
      };

    case ActionTypes.LOG_OUT:
      return {
        ...state,
        loginLoading: false,
        loginErr: null,
        loginSuccess: false,
        accessToken: null,
        refreshToken: null,
        userId: null,
        loginCount: null,
        userName: null,
        skippedLogin: false,
        hasSelectedAddress: false,
      };

    case ActionTypes.LOGIN_ERR:
      return {
        ...state,
        loginLoading: false,
        loginErr: action.payload,
        loginSuccess: false,
        accessToken: null,
        refreshToken: null,
        userId: null,
        loginCount: null,
        userName: null,
        skippedLogin: false,
        hasSelectedAddress: false,
      };

    case ActionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        loginLoading: false,
        loginErr: null,
        loginSuccess: true,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        userId: action.payload.userId,
        loginCount: action.payload.loginCount,
        userName: action.payload.userName,
        skippedLogin: false,
        // hasSelectedAddress: action.payload.hasSelectedAddress,
      };

    case ActionTypes.SKIPPED_LOGIN:
      return {
        ...state,
        loginLoading: false,
        loginErr: null,
        loginSuccess: false,
        accessToken: null,
        refreshToken: null,
        userId: null,
        loginCount: null,
        userName: null,
        skippedLogin: true,
        hasSelectedAddress: false,
      };

    case ActionTypes.ADDRESS_SELECTED:
      return {
        ...state,
        loginLoading: false,
        loginErr: null,
        loginSuccess: true,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        userId: state.userId,
        loginCount: state.loginCount,
        userName: state.userName,
        skippedLogin: false,
        hasSelectedAddress: true,
      };

    default:
      return state;
  }
};
