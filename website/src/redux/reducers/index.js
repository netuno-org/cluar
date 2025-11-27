import { combineReducers } from 'redux';

import { loggedUserInfoReducer } from './loggedUserInfo';
import { themeReducer } from './theme';

export const Reducers = combineReducers({
  loggedUserInfoState: loggedUserInfoReducer,
  theme: themeReducer,
});