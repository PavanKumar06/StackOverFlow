import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export const useLogout = () => {
    const { dispatch } = useContext(AuthContext);

    const logout = () => {
        sessionStorage.removeItem('user');
        dispatch({ type: 'LOGOUT' })
    }

    return {logout}
}