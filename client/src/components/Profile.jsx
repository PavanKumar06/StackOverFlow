import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { DataContext } from "../App";
import PropTypes from "prop-types";

const Profile = ({ updatePage }) => {
  const { appData } = useContext(DataContext);
  const { user } = useContext(AuthContext);
  const [membershipDays, setMembershipDays] = useState(0);
  const [display, setDisplay] = useState("Questions");

  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 5;

  const [currentPageQuestions, setCurrentPageQuestions] = useState(1);
  const PAGE_SIZE_QUESTIONS = 5;

  useEffect(() => {
    const registrationDate = new Date(user.registrationDate);
    const timeDifference = new Date() - registrationDate;
    const days = Math.round(timeDifference / (1000 * 60 * 60 * 24));
    setMembershipDays(days);
  }, []);

  const userQuestions = appData.questions.filter(
    (question) => question.askedBy === user.username
  );

  const totalQuestionPages = Math.ceil(userQuestions.length / PAGE_SIZE_QUESTIONS);
  const startQuestionIndex = (currentPageQuestions - 1) * PAGE_SIZE_QUESTIONS;
  const endQuestionIndex = startQuestionIndex + PAGE_SIZE_QUESTIONS;
  const questionsToShow = userQuestions.slice(startQuestionIndex, endQuestionIndex);

  const paginateQuestions = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalQuestionPages) {
      setCurrentPageQuestions(1);
    } else {
      setCurrentPageQuestions(pageNumber);
    }
  };

  const userAnswers = appData.answers.filter(
    (answer) => answer.ansBy === user.username
  );

  const totalAnswerPages = Math.ceil(userAnswers.length / PAGE_SIZE);
  const startAnswerIndex = (currentPage - 1) * PAGE_SIZE;
  const endAnswerIndex = startAnswerIndex + PAGE_SIZE;
  const answersToShow = userAnswers.slice(startAnswerIndex, endAnswerIndex);

  const paginateAnswers = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalAnswerPages) {
      setCurrentPage(1);
    } else {
      setCurrentPage(pageNumber);
    }
  };

  const userTags = appData.tags.filter(
    (tag) => tag.tagBy === user.username
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span>Number of days since being a member - {membershipDays}</span>
        <br />
        <span>Reputation - {user.reputation}</span>
        <br />
        <span onClick={() => setDisplay("Questions")}>Questions</span>
        <br />
        <span onClick={() => setDisplay("Answers")}>Answers</span>
        <br />
        <span onClick={() => setDisplay("Tags")}>Tags</span>
        <br /> 
        {display === "Questions" && (
        <div>
          {questionsToShow.map((question) => (
            <div key={question.qid} onClick={() => updatePage("editQuesPage", question)}>
              <p>
                <strong style={{ fontWeight: 'bold' }}>Title -</strong> {question.title}
              </p>
              <p>
                <strong style={{ fontWeight: 'bold' }}>Text -</strong> {question.text}
              </p>
              <br />
            </div>
          ))}
          {totalQuestionPages >= 1 && (
            <div>
              <button onClick={() => paginateQuestions(currentPageQuestions - 1)} disabled={currentPageQuestions === 1}>
                Previous
              </button>
              <span> Page {currentPageQuestions} of {totalQuestionPages} </span>
              <button onClick={() => paginateQuestions(currentPageQuestions + 1)}>
                Next
              </button>
            </div>
          )}
        </div>
      )}
        {display === "Answers" && (
          <div>
            {answersToShow.map((answer) => (
              <div key={answer.aid} onClick={() => updatePage("editAnsPage", answer)}>
                <p>
                  <strong style={{ fontWeight: 'bold' }}>Text -</strong> {answer.text}
                </p>
                <br />
              </div>
            ))}
            {totalAnswerPages >= 1 && (
              <div>
                <button onClick={() => paginateAnswers(currentPage - 1)} disabled={currentPage === 1}>
                  Previous
                </button>
                <span> Page {currentPage} of {totalAnswerPages} </span>
                <button onClick={() => paginateAnswers(currentPage + 1)}>
                  Next
                </button>
              </div>
            )}
          </div>
        )}
        {display === "Tags" && (
            <div>
            {userTags.map((tag) => (
                <div key={tag.tid} onClick={() => updatePage("editTagPage", tag)}>
                <p>
                    <strong style={{ fontWeight: 'bold' }}>Tag -</strong> {tag.name}
                </p>
                <br />
                </div>
            ))}
            </div>
        )}
    </div>
  );
};

Profile.propTypes = {
  updatePage: PropTypes.func.isRequired,
};

export default Profile;
