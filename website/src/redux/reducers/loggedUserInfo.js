import { LOGGED_USER_INFO, LOGGED_USER_INFO_RELOAD } from '../actions/actionTypes';

const initialState = {
  loggedUserInfo: null,
  loggedUserInfoReload: null
};

export const loggedUserInfoReducer = (state = initialState, action) => {
  switch (action.type) {
  case LOGGED_USER_INFO:
    return {
      ...state,
      loggedUserInfo: action.payload
    };
  case LOGGED_USER_INFO_RELOAD:
    return {
      ...state,
      loggedUserInfoReload: action.payload
    };
  default:
    return state;
  }
};