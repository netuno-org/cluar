import { combineReducers } from 'redux';

import { loggedUserInfoReducer } from './loggedUserInfo';

export const Reducers = combineReducers({
  loggedUserInfoState: loggedUserInfoReducer,
});