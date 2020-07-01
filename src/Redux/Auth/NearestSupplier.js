import * as ActionTypes from './ActionTypes';

export const NearestSupplier = (
  state = {
    supplierIdWithMinDist: null,
  },
  action,
) => {
  switch (action.type) {
    case ActionTypes.ADD_NEAREST_SUPPLIER:
      return {
        ...state,
        supplierIdWithMinDist: action.payload,
      };

    case ActionTypes.DELETE_NEAREST_SUPPLIER:
      return {
        ...state,
        supplierIdWithMinDist: null,
      };

    case ActionTypes.LOG_OUT:
      return {
        ...state,
        supplierIdWithMinDist: null,
      };
    default:
      return state;
  }
};
