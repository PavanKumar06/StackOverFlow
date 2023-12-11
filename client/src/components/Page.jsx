import React from "react";
import PropTypes from "prop-types";

const Page = ({ id, children }) => {
  return (
    <div id={id} className="st-flex-col-container">
      {children}
    </div>
  );
};

Page.propTypes = {
  id: PropTypes.func.isRequired,
  children: PropTypes.func.isRequired
};

export default Page;
