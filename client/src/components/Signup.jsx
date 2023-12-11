import React, { useContext, useState } from "react";
import { useSignup } from "../hooks/useSignup";
import { DataContext } from "../App";
import PropTypes from "prop-types";

const Signup = ({updatePage}) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [reEnterPassword, setReEnterPassword] = useState('');
    const [passwordMatch, setPasswordMatch] = useState(null);
    const { signup, isLoading, error } = useSignup();
    const { appData } = useContext(DataContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password === reEnterPassword) {
            setPasswordMatch(null); 
            const res = await signup(username, password, email);
            if (res) {
                updatePage("homePage", appData);
            }
        }
        else {
            setPasswordMatch("Passwords do not match")
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <h2>Signup</h2>
            <label>Username:</label>
            <input type="text" onChange={(e) => setUsername(e.target.value)} value={username} />
            <label>Password:</label>
            <input type="password" onChange={(e) => setPassword(e.target.value)} value={password} />
            <label>Retype Password:</label>
            <input type="password" onChange={(e) => setReEnterPassword(e.target.value)} value={reEnterPassword} />
            <label>Email:</label>
            <input type="email" onChange={(e) => setEmail(e.target.value)} value={email} />

            <button disabled={isLoading}>Signup</button>
            { error && <div>{ error }</div> }
            { passwordMatch && <div>{ passwordMatch }</div> }
        </form>
    );
}

Signup.propTypes = {
    updatePage: PropTypes.func.isRequired,
};

export default Signup;