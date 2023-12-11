import React, { useRef } from "react";
import { useContext, useState } from "react";
import { DataContext } from "../App";
import PropTypes from "prop-types";
import { AuthContext } from "../contexts/AuthContext";

const NewAnswer = ({ question, updatePage }) => {
  const { appData } = useContext(DataContext);
  const answerError = useRef(null);
  const { user } = useContext(AuthContext)

  const [newAnswer, setNewAnswer] = useState({
    text: "",
    ansBy: "",
    ansDate: null,
  });

  const handleTextChange = (e) => {
    setNewAnswer(prevState => ({ ...prevState, text: e.target.value }));
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

  const addAnswer = async () => {
    const { text } = { ...newAnswer };
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
    const updatedAnswer = {
      ans_by: user.username,
      text: result,
      ans_date_time: new Date(),
    };
    setNewAnswer({
      ...newAnswer,
      text: result,
      ansDate: new Date(),
    });
    const answer = await appData.createNewAnswer(updatedAnswer);
    const qId = question.qid;
    await appData.updateQuestion(qId, answer.aid);
    await appData.updateLastAskDate(qId);
  };

  const checkValidations = async (button) => {
    if (checkHtml(newAnswer.text)) {
      answerError.current.textContent = "Invalid hyperlink constraints";
      return;
    }
    if (newAnswer.text === "") {
      answerError.current.textContent = "Answer text cannot be empty";
      return;
    }
    answerError.current.textContent = "";
    if (button) {
      await addAnswer();
      updatePage("answerPage", appData, question.qid);
    }
  };

  const buttonStyle = {
    cursor: "pointer",
  };

  return (
    <div className="st-margin-left-10p">
      <div className="st-margintop-40px">
        <span className="st-fontsize-30px">Answer Text*</span>
        <br />
        <textarea
          rows="5"
          cols="39"
          id="answerTextInput"
          placeholder="Enter Answer"
          onChange={async (e) => {
            handleTextChange(e);
            await checkValidations(false, false, e.target.value === "");
          }}
        ></textarea>
        <span
          id="enteranswererror"
          className="st-text-crimson"
          ref={answerError}
        ></span>
      </div>
      <div className="st-margintop-40px">
        <button
          className="st-background-deepskyblue st-text-white st-padding-15px"
          style={buttonStyle}
          id="postanswer"
          type="submit"
          onClick={async () => {
            await checkValidations(true, false, false);
          }}
        >
          Post Answer
        </button>
        <p className="st-display-inline st-margin-left-5p st-text-crimson">
          * indicates mandatory fields
        </p>
      </div>
    </div>
  );
};

NewAnswer.propTypes = {
  question: PropTypes.func.isRequired,
  updatePage: PropTypes.func.isRequired
};

export default NewAnswer;
