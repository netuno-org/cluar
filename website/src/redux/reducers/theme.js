const getInitialTheme = () => {
    try {
        const saved = localStorage.getItem("theme");
        return saved === "dark" ? "dark" : "light";
    } catch (error) {
        return "light";
    }
};

const initialState = {
    mode: getInitialTheme(),
};

// Actions types
export const TOGGLE_THEME = "TOGGLE_THEME";
export const SET_THEME = "SETH_THEME";

// Reducer
export const themeReducer = (state = initialState, action) => {
    switch (action.type) {
        case TOGGLE_THEME:
            const newMode = state.mode === "light" ? "dark" : "light";
            localStorage.setItem("theme", newMode);
            return { ...state, mode: newMode };

        case SET_THEME:
            localStorage.setItem("theme", action.payload);
            return { ...state, mode: action.payload };

        default:
            return state;
    }
};