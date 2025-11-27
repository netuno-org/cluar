import { TOGGLE_THEME, SET_THEME } from '../reducers/theme';

export const toggleTheme = () => ({
    type: TOGGLE_THEME,
});

export const setTheme = (mode) => ({
    type: SET_THEME,
    payload: mode,
});