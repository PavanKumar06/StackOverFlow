import React, { useState } from "react";
import { useContext } from "react";
import { DataContext } from "../App";
import PropTypes from "prop-types";
import { useLogout } from '../hooks/useLogout'
import { AuthContext } from "../contexts/AuthContext";
 
const Header = ({updatePage}) => {
  const { appData } = useContext(DataContext);
  const [searchValue, setSearchValue] = useState("");
  const {logout} = useLogout();
  const { user } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    updatePage("homePage", appData);
  }
 
  const handleKeyPress = (event) => {
    if (event.keyCode === 13) {
      updatePage("homePage", appData, null, searchValue);
    }
  };
 
  return (
    <div className="st-header">
      <h1 className="st-header-title">Fake Stack Overflow</h1>
      <div className="st-searchbar">
        <input
          type="text"
          id="searchBar"
          placeholder="Search..."
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        {user ? (
          <button onClick={handleLogout}>Logout</button>
          ) : (
          <>
            <button onClick={() => updatePage("signup", appData)}>Register</button>
            <button onClick={() => updatePage("login", appData)}>Login</button>
          </>
        )}
      </div>
    </div>
  );
};
 
Header.propTypes = {
  updatePage: PropTypes.func.isRequired,
};

export default Header;