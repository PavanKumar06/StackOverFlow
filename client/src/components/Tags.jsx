import React from "react";
import { DataContext } from "../App";
import { useContext } from "react";
import PropTypes from "prop-types";
import { AuthContext } from "../contexts/AuthContext.js";

const Tags = ({updatePage}) => {
  const { appData } = useContext(DataContext);
  const tags = appData.getTags();
  const questions = appData.getQuestions();
  const { user } = useContext(AuthContext);
  const buttonStyle = {
    cursor: "pointer",
  };
   const getCount = (tagId, questions) => {
    let count = 0;
    questions.forEach((question) => {
      if (question.tagIds.includes(tagId)) {
        count++;
      }
    });
    return count;
  };
  const tagsContainerStyle = {
    display: "flex",
    flexWrap: "wrap",
  };  
 
  const listTags = tags.map((tag) => (
    <div key={tag.tid} className="st-flex-row-container st-margin-5">
      <div className="st-tags-box tagNode" id={tag.tid}>
        <a onClick={() => {
          updatePage("homePage", appData, null, `[${tag.name}]`)
        }}>{tag.name}</a>
        <span> {getCount(tag.tid, questions)} questions</span>
      </div>
    </div>
  ));
 
  return (
    <div className="st-tags">
      <div className="st-upper-div">
        <div>
          <b>
            <span id="numberoftags">{tags.length}</span> Tags
          </b>
        </div>
        <div>
          <b>All Tags</b>
        </div>
        <div>
          { user && (
            <button
              className="st-background-deepskyblue st-text-white st-padding-15px"
              style={buttonStyle}
              id="formTitleInput"
              type="submit"
              onClick={() => updatePage("newQuestionPage", appData)}
            >
              Ask a Question
            </button>
          )}
        </div>
      </div>
      <div className="st-tags-content-div" id="tagscontentdiv" style={tagsContainerStyle}>
        {" "}
        {listTags}
      </div>
    </div>
  );
};

Tags.propTypes = {
  updatePage: PropTypes.func.isRequired
};


export default Tags;
