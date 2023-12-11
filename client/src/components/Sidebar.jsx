import React from "react";
import { DataContext } from "../App";
import { useContext } from "react";
import PropTypes from "prop-types";
import { AuthContext } from "../contexts/AuthContext";

const Sidebar = ({updatePage}) => {
  const {appData} = useContext(DataContext);
  const {user} = useContext(AuthContext);
  
  return (
    <div className="container-fluid st-width-175px st-align-center">
      <div className="st-flex-col-container st-left" id="sideBarNav">
        <div className="st-margintop-40px" id="questionsnavdiv">
          <span id="questionsnav" onClick={() => updatePage("homePageFromSidebar", appData)}>
            Questions
          </span>
        </div>
        <div className="st-margintop-40px" id="tagsnavdiv">
          <span id="tagsnav"  onClick={() => updatePage("tagsPage", appData)}>
            Tags
          </span>
        </div>
        { user && (
          <div className="st-margintop-40px" id="profilenavdiv">
            <span id="profilenav"  onClick={() => updatePage("profilePage", appData)}>
              Profile
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

Sidebar.propTypes = {
  updatePage: PropTypes.func.isRequired
};

export default Sidebar;
