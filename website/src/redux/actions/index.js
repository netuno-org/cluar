import {
    LOGGED_USER_INFO,
    LOGGED_USER_INFO_RELOAD
  } from './actionTypes';
  
  export const loggedUserInfoAction = (data) => ({
    type: LOGGED_USER_INFO,
    payload: { ...data }
  });
  
  export const loggedUserInfoReloadAction = () => ({
    type: LOGGED_USER_INFO_RELOAD,
    payload: { }
  });