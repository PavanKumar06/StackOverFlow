import React, { useContext, useRef, useState } from "react";
import { DataContext } from "../App";
import PropTypes from "prop-types";
import { AuthContext } from "../contexts/AuthContext";

const NewQues = ({ updatePage }) => {
  const { appData } = useContext(DataContext);
  const { user } = useContext(AuthContext)

  const tagsRef = useRef(null);
  const [errorMessages, setErrorMessages] = useState({
    title: "",
    text: "",
    tags: "",
    username: "",
  });

  const [newQuestion, setNewQuestion] = useState({
    title: "",
    text: "",
    tagIds: [],
    askedBy: "",
    askDate: null,
    ansIds: [],
    views: 0,
  });

  const handleTitleChange = (e) => {
    setNewQuestion({ ...newQuestion, title: e.target.value });
  };

  const handleTextChange = (e) => {
    setNewQuestion({ ...newQuestion, text: e.target.value });
  };

  const checkHtml = (answertext) => {
    const htmlPattern = /\[([^\]]*)]\((\S*)\)/;
    const matches = answertext.match(htmlPattern);

    if (matches) {
      const [, linkText, url] = matches;

      if (
        !linkText.trim() ||
        !url.trim() ||
        !url.includes("https://") ||
        linkText === "[]" ||
        url === "https://"
      ) {
        return true;
      }
    }

    return false;
  };

  const handleTagsChange = async () => {
    const existingTags = appData.getTags();
    const questionTags = tagsRef.current.value
      .split(/\s+/)
      .filter((tag) => tag.length > 0);

    if (questionTags.length > 5) {
      setErrorMessages({
        ...errorMessages,
        tags: "Cannot have more than 5 tags",
      });
      return;
    }

    let tagIds = [];

    for (let i = 0; i < questionTags.length; ++i) {
      const text = questionTags[i];
      if (text.length > 20) {
        setErrorMessages({
          ...errorMessages,
          tags: "New tag length cannot be more than 20",
        });
        return;
      }
      for (let j = 0; j < existingTags.length; ++j) {
        if (text === existingTags[j].name) {
          tagIds.push(existingTags[j].tid);
          break;
        }
      }
      if (tagIds.length !== i + 1) {
        const newTag = {
          name: text,
          tag_by: user.username
        };
        let upTag = await appData.createNewTag(newTag);
        existingTags.push(upTag);
        tagIds.push(upTag.tid);
      }
    }

    setErrorMessages({ ...errorMessages, tags: "" });
    return tagIds;
  };

  const addQuestion = async () => {
    const updatedTags = await handleTagsChange();
    if (updatedTags === undefined) {
      return;
    }

    if (!newQuestion.title) {
      setErrorMessages({ ...errorMessages, title: "Title cannot be empty" });
      return;
    } else if (newQuestion.title.length > 100) {
      setErrorMessages({
        ...errorMessages,
        title: "Title cannot be more than 100 characters",
      });
      return;
    }

    if (!newQuestion.text) {
      setErrorMessages({
        ...errorMessages,
        text: "Question text cannot be empty",
      });
      return;
    } else {
      if (checkHtml(newQuestion.text)) {
        setErrorMessages({
          ...errorMessages,
          text: "Invalid hyperlink constraints",
        });
        return;
      }
    }

    const { text } = { ...newQuestion };
    const htmlPattern = /\[([^\]]+)]\((\S+)\)/;
    const matches = text.match(htmlPattern);
    let result = text;
    if (matches) {
      const originalString = text;
      const match = /\[(.*?)\]\((.*?)\)/;
      result = originalString.replace(
        match,
        '<a href="$2" target="_blank">$1</a>'
      );
    }

    const updatedQuestion = {
      title: newQuestion.title,
      text: result,
      tags: updatedTags,
      asked_by: user.username,
      ask_date_time: new Date(),
      answers: newQuestion.ansIds,
      views: 0,
    };

    await appData.createNewQuestion(updatedQuestion);
    updatePage("homePage", appData);
  };

  const buttonStyle = {
    cursor: "pointer",
  };

  return (
    <div className="st-margin-left-10p">
      <div className="st-margintop-40px">
        <span className="st-fontsize-30px">Question Title*</span>
        <br />
        <span>Limit title to 100 characters or less</span>
        <br />
        <input
          className="st-user-width-height"
          type="text"
          id="formTitleInput"
          placeholder="Question Title"
          value={newQuestion.title}
          onChange={handleTitleChange}
        />
        <span id="questiontitleerror" className="st-text-crimson">
          {errorMessages.title}
        </span>
      </div>
      <div className="st-margintop-40px">
        <span className="st-fontsize-30px">Question Text*</span>
        <br />
        <span>Add details</span>
        <br />
        <textarea
          rows="5"
          cols="39"
          id="formTextInput"
          placeholder="Question Text"
          value={newQuestion.text}
          onChange={handleTextChange}
        ></textarea>
        <span id="questiontexterror" className="st-text-crimson">
          {errorMessages.text}
        </span>
      </div>
      <div className="st-margintop-40px">
        <span className="st-fontsize-30px">Tags*</span>
        <br />
        <span>Add keywords separated by whitespace</span>
        <br />
        <input
          ref={tagsRef}
          className="st-user-width-height"
          type="text"
          id="formTagInput"
          placeholder="Tags"
        />
        <span id="entertagserror" className="st-text-crimson">
          {errorMessages.tags}
        </span>
      </div>

      <div className="st-margintop-40px">
        <button
          className="st-background-deepskyblue st-text-white st-padding-15px"
          style={buttonStyle}
          id="postquestion"
          type="submit"
          onClick={async () => {
            await addQuestion();
          }}
        >
          Post Question
        </button>
        <p className="st-display-inline st-margin-left-10p st-text-crimson">
          * indicates mandatory fields
        </p>
      </div>
    </div>
  );
};

NewQues.propTypes = {
  updatePage: PropTypes.func.isRequired,
};

export default NewQues;
