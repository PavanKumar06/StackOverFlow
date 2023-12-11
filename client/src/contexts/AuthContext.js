import React, { createContext, useEffect, useReducer } from 'react';
import PropTypes from "prop-types";

export const AuthContext = createContext();

export const authReducer = (state, action) => {
    switch(action.type) {
        case "LOGIN":
            return { user: action.payload };
        case "LOGOUT":
            return { user: null };
        default:
            return state;
    }
}

const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, {
        user: null
    });

    useEffect(() => {
        const user = JSON.parse(sessionStorage.getItem('user'));

        if (user) {
            dispatch({type: 'LOGIN', payload: user});
        }
    }, []);

    return (
        <AuthContext.Provider value={{...state, dispatch}}>
            { children }
        </AuthContext.Provider>
    )
}

AuthContextProvider.propTypes = {
    children: PropTypes.node.isRequired
};

export default AuthContextProvider;