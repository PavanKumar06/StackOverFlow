import React from "react";
import { useState, useEffect } from "react";
import Question from "./Question";
import { AuthContext } from "../contexts/AuthContext.js";

const Searching = ({ data, matchedQuestions }) => {
  const sortByDate = (a, b) => {
    const dateA = a.askDate;
    const dateB = b.askDate;
    return dateB - dateA;
  };

  const sortByActive = (answers) => (a, b) => {
    const ansDateA = getLastAnswerDate(a.ansIds, answers);
    const ansDateB = getLastAnswerDate(b.ansIds, answers);
    return ansDateB - ansDateA;
  };

  const getLastAnswerDate = (ansIds, answers) => {
    if (ansIds && ansIds.length > 0) {
      const lastAnswerId = ansIds[ansIds.length - 1];
      const answer = answers.find((ans) => ans.aid === lastAnswerId);
      if (answer) {
        return answer.ansDate;
      }
    }
    return new Date("1900-01-01");
  };

  const [originalList, setOriginalList] = useState(matchedQuestions);
  const [quesList, setQuesList] = useState(originalList);
  const { user } = useContext(AuthContext);

  function handleNewest() {
    const sortByDateQuestions = [...originalList].sort(sortByDate);
    setQuesList(sortByDateQuestions);
  }

  function handleActive() {
    const sortByActiveQuestions = [...originalList].sort(
      sortByActive(data.answers)
    );
    setQuesList(sortByActiveQuestions);
  }

  function handleUnanswered() {
    const getUnansweredQuestions = originalList.filter(
      (question) => question.ansIds.length === 0
    );
    setQuesList(getUnansweredQuestions);
  }

  const buttonStyle = {
    cursor: "pointer",
  };

  const searchStyle = {
    width: "100%",
  };

  useEffect(() => {
    setOriginalList(matchedQuestions);
    setQuesList(matchedQuestions);
  }, [matchedQuestions]);

  return (
    <div className="st-ques-searching" style={searchStyle}>
      <div className="st-upper-div">
        <div>
          <b>Search Results</b>
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
      <div className="st-upper-div">
        <div className="st-quesNum">
          <b>
            <span id="totalnumberofquestions">{matchedQuestions.length}</span>{" "}
            questions
          </b>
        </div>
        <div className="st-3buttons" id="newestactiveunanswered">
          <button className="st-sortbuttons" id="newest" onClick={handleNewest}>
            Newest
          </button>
          <button className="st-sortbuttons" id="active" onClick={handleActive}>
            Active
          </button>
          <button
            className="st-sortbuttons"
            id="unanswered"
            onClick={handleUnanswered}
          >
            Unanswered
          </button>
        </div>
      </div>
      <div className="st-dotted-line"></div>
      {matchedQuestions.length !== 0 ? (
        <Question questions={quesList} tags={data.tags} />
      ) : (
        <div className="st-margin-left-10p"><h1>No Questions Found</h1> </div>
      )}
    </div>
  );
};

export default Searching;
