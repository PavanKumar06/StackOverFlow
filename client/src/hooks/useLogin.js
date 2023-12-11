import { useContext, useState } from "react"
import { AuthContext } from "../contexts/AuthContext";

export const useLogin = () => {
    const [error, setError] = useState()
    const [isLoading, setIsLoading] = useState(null)
    const { dispatch } = useContext(AuthContext);

    const login = async (username, password) => {
        setIsLoading(true)
        setError(null)

        const response = await fetch('http://localhost:8000/api/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username, password})
        })

        const json = await response.json()

        if (!response.ok) {
            setIsLoading(false)
            setError(json.error)
        }
        if (response.ok) {
            sessionStorage.setItem('user', JSON.stringify(json))
            dispatch({ type: 'LOGIN', payload: json })

            setIsLoading(false);
            return json;
        }
    }

    return { login, isLoading, error };
}