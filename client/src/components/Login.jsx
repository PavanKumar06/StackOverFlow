import React, { useContext, useState } from "react"
import { useLogin } from "../hooks/useLogin"
import { DataContext } from "../App";
import PropTypes from "prop-types";

const Login = ({updatePage}) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const { login, isLoading, error } = useLogin()
    const {appData} = useContext(DataContext)

    const handleSubmit = async (e) => {
        e.preventDefault()
        const res = await login(username, password)
        if (res) {
            updatePage("homePage", appData);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <h2>Login</h2>
            <label>Username:</label>
            <input type="text" onChange={(e) => setUsername(e.target.value)} value={username} />
            <label>Password:</label>
            <input type="password" onChange={(e) => setPassword(e.target.value)} value={password} />

            <button disabled={isLoading}>Login</button>
            { error && <div>{ error }</div> }
        </form>
    );
}

Login.propTypes = {
    updatePage: PropTypes.func.isRequired,
};

export default Login;