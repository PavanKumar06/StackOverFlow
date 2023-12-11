import React from "react";
import { useContext, useEffect, useState } from "react";
import Question from "./Question.jsx";
import { DataContext } from "../App";
import PropTypes from "prop-types";
import { AuthContext } from "../contexts/AuthContext.js";

const QuesOverview = ({ searchValue, updatePage }) => {
  const { appData } = useContext(DataContext);
  const { user } = useContext(AuthContext);

  const [quesList, setQuesList] = useState(appData.getQuestions());
  const originalList = appData.getQuestions();

  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 5;

  useEffect(() => {
    setQuesList(appData.getQuestions());
  }, [appData]);

  const sortByDate = (a, b) => {
    const dateA = new Date(a.askDate).getTime();
    const dateB = new Date(b.askDate).getTime();
    return dateB - dateA;
  };

  const sortByActive = (a, b) => {
    const dateA = new Date(a.lastAskDate).getTime();
    const dateB = new Date(b.lastAskDate).getTime();
    return dateB - dateA;
  };

  // const getLastAnswerDate = (ansIds, answers) => {
  //   if (ansIds && ansIds.length > 0) {
  //     let latestAnswer = null;

  //     ansIds.forEach((ansId) => {
  //       const answer = answers.find((ans) => ans.aid === ansId);
  //       if (answer) {
  //         if (!latestAnswer || answer.ansDate > latestAnswer.ansDate) {
  //           latestAnswer = answer;
  //         }
  //       }
  //     });

  //     return new Date(latestAnswer.ansDate).getTime();
  //   }
  //   return new Date("1900-01-01").getTime();
  // };
  
  useEffect(() => {
    handleNewest();
  }, []);

  function handleNewest() {
    const sortByDateQuestions = [...originalList].sort(sortByDate);
    setQuesList(sortByDateQuestions);
  }

  function handleActive() {
    const sortByActiveQuestions = [...originalList].sort(sortByActive);
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

  useEffect(() => {
    if (searchValue) {
      const matchingQuestions = searchQuestions(searchValue, originalList, appData.getTags());
      setQuesList(matchingQuestions);
    } else {
      handleNewest();
    }
  }, [searchValue]);

  function searchQuestions(searchTerm, questions, tags) {
    if (searchTerm.trim() === "") {
      return [];
    }
    const keywords = searchTerm.split(" ");
 
    const tagKeywords = keywords
      .filter((keyword) => /^\[\w+(-\w+)*\]$/.test(keyword))
      .map((tag) => tag.slice(1, -1));
 
    const mainKeywords = keywords.filter((keyword) => !tagKeywords.includes(keyword));
    const matchingQuestions = questions.filter((question) => {
      const { title, text, tagIds } = question;
      const titleAndTextMatch = mainKeywords.some(
        (keyword) => title.toLowerCase().includes(keyword) || text.toLowerCase().includes(keyword)
      );
      const tagMatch = tagIds.some((tagId) =>
        tagKeywords.includes(tags.find((tag) => tag.tid === tagId).name)
      );
      return titleAndTextMatch || tagMatch;
    });
 
    return matchingQuestions;
  }  

  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = quesList.slice(
    indexOfFirstQuestion,
    indexOfLastQuestion
  );
  const totalPages = Math.ceil(quesList.length / questionsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) {
      setCurrentPage(1);
    } else {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="st-ques-overview ">
      <div className="st-upper-div">
        <div>
          <b>All Questions</b>
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
            <span id="totalnumberofquestions">{ quesList.length }</span> questions
          </b>
        </div>
        <div className="st-3buttons" id="newestactiveunanswered">
          <button className="st-sortbuttons" id="newest" onClick={handleNewest}>
            Newest
          </button>
          <button className="st-sortbuttons" id="active" onClick={handleActive}>
            Active
          </button>
          <button className="st-sortbuttons" id="unanswered" onClick={handleUnanswered}>
            Unanswered
          </button>
        </div>
      </div>
      <div className="st-dotted-line"></div>
      <Question questions={currentQuestions} updatePage={updatePage} />
      <div className="pagination">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span> Page {currentPage} of {totalPages} </span>
        <button onClick={() => paginate(currentPage + 1)}>
          Next
        </button>
      </div>
    </div>
  );
};

QuesOverview.propTypes = {
  updatePage: PropTypes.func.isRequired,
  searchValue: PropTypes.func.isRequired
};

export default QuesOverview;
