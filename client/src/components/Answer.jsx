import React, { useState } from "react";
import { useContext, useEffect } from "react";
import { DataContext } from "../App";
import PropTypes from "prop-types";
import { AuthContext } from "../contexts/AuthContext.js";

const Answer = ({ question, updatePage }) => {
  const { appData } = useContext(DataContext);
  const PAGE_SIZE_COMMENTS = 3;
  const [currentPageComments, setCurrentPageComments] = useState(1);

  const [currentPageAnswers, setCurrentPageAnswers] = useState(1);
  const PAGE_SIZE_ANSWERS = 5;

  const answers = appData.getAnswers();
  let questionAnswers = [];
  const [finalAnswers, setFinalAnswers] = useState([]);

  const comments = appData.getComments();
  let questionComments = [];
  const [finalComments, setFinalComments] = useState([]);

  const { user } = useContext(AuthContext);

  const totalCommentPages = Math.ceil(finalComments.length / PAGE_SIZE_COMMENTS);
  const startCommentIndex = (currentPageComments - 1) * PAGE_SIZE_COMMENTS;
  const endCommentIndex = startCommentIndex + PAGE_SIZE_COMMENTS;
  const commentsToShow = finalComments.slice(startCommentIndex, endCommentIndex);

  const totalAnswerPages = Math.ceil(finalAnswers.length / PAGE_SIZE_ANSWERS);
  const startAnswerIndex = (currentPageAnswers - 1) * PAGE_SIZE_ANSWERS;
  const endAnswerIndex = startAnswerIndex + PAGE_SIZE_ANSWERS;
  const answersToShow = finalAnswers.slice(startAnswerIndex, endAnswerIndex);

  let username = null;
  if (user) {
    username = user.username;
  }

  const sortByDate = (a, b) => {
    const dateA = new Date(a.ansDate).getTime();
    const dateB = new Date(b.ansDate).getTime();
    return dateB - dateA;
  };

  const [newComment, setNewComment] = useState({
    name: "",
    comment_by: "",
    com_date_time: new Date(),
  });

  const [answerComments, setAnswerComments] = useState({});

  useEffect(() => {
    for (let i = 0; i < question.ansIds.length; ++i) {
      for (let j = 0; j < answers.length; ++j) {
        if (question.ansIds[i] === answers[j].aid) {
          questionAnswers.push(answers[j]);
        }
      }
    }
  
    // Sort by date
    const sortByDateAnswers = [...questionAnswers].sort(sortByDate);
  
    // Find the index of the pinned answer
    const pinnedAnswerIndex = sortByDateAnswers.findIndex(ans => ans.aid === question.pinnedAnswer);
  
    // If the pinned answer is found and question.pinnedAnswer is not null, move it to the beginning
    if (pinnedAnswerIndex !== -1 && question.pinnedAnswer) {
      const pinnedAnswer = sortByDateAnswers.splice(pinnedAnswerIndex, 1)[0];
      sortByDateAnswers.unshift(pinnedAnswer);
    }
  
    setFinalAnswers(sortByDateAnswers);
  }, [answers, question.pinnedAnswer]);
  

  useEffect(() => {
    for (let i = 0; i < question.comIds.length; ++i) {
      for (let j = 0; j < comments.length; ++j) {
        if (question.comIds[i] === comments[j].cid) {
          questionComments.push(comments[j]);
        }
      }
    }
    const sortByDateComments = [...questionComments].sort(sortByDate);
    setFinalComments(sortByDateComments);
  }, [comments]);

  const buttonStyle = {
    cursor: "pointer",
  };
  const width10 = {
    width: "10%",
  };
  const width70 = {
    width: "70%",
  };
  const width20 = {
    width: "20%",
  };
  const width100 = {
    width: "100%",
  };

  const formatDate = (date) => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const now = new Date();
    const timeDifference = now - date;
    const secondsPassed = Math.floor(timeDifference / 1000);
    const minutesPassed = Math.floor(secondsPassed / 60);
    const hoursPassed = Math.floor(minutesPassed / 60);

    if (secondsPassed < 60) {
      return "0 seconds ago";
    } else if (minutesPassed < 60) {
      return `${minutesPassed} ${minutesPassed === 1 ? "minute" : "minutes"} ago`;
    } else if (hoursPassed < 24) {
      return `${hoursPassed} ${hoursPassed === 1 ? "hour" : "hours"} ago`;
    }

    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();

    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedHours = hours < 10 ? `0${hours}` : hours;

    return `${month} ${formattedDay}, ${year} ${formattedHours}:${formattedMinutes}`;
  };

  const calculateTimePassed = (date) => {
    const timeDifference = new Date() - date;
    const secondsPassed = Math.floor(timeDifference / 1000);

    if (secondsPassed < 60) {
      return "0 seconds ago";
    }

    return formatDate(new Date(date));
  };

  const handleEnterKeyPress = async (e) => {
    if (e.key === "Enter") {
      const comment = await appData.createNewComment(newComment);
      const qId = question.qid;
      await appData.updateQuestionComment(qId, comment.cid);
      await appData.updateLastAskDate(qId);
      setNewComment({
        name: "",
        comment_by: "",
        com_date_time: new Date(),
      });
      updatePage("answerPage", appData, question.qid);
    }
  };

  const handleEnterKeyPressAns = async (e, aid) => {
    if (e.key === "Enter") {
      const comment = await appData.createNewComment(answerComments[aid]);
      await appData.updateAnswerComment(aid, comment.cid);
      setAnswerComments({
        ...answerComments,
        [aid]: {
          name: "",
          comment_by: "",
          com_date_time: new Date(),
        },
      });
      updatePage("answerPage", appData, question.qid);
    }
  };

  const listComments = commentsToShow.map((com) => (
    <div className="st-flex-row-container st-margin-5" key={com.cid}>
      <div className="st-answer-content st-width-80 answerText" dangerouslySetInnerHTML={{ __html: com.name }}></div>
      <div className="st-answer-property st-width-20 answerAuthor">
        <span className="st-text-green">{com.comBy}</span>
        <span className="st-text-grey">{calculateTimePassed(com.comDate)}</span>
      </div>
    </div>
  ));

  const initialAnswerCommentPages = answersToShow.reduce((acc, ans) => {
    acc[ans.aid] = 1;
    return acc;
  }, {});
  
  const [currentAnswerCommentPages, setCurrentAnswerCommentPages] = useState(initialAnswerCommentPages);
  

  // const [currentAnswerCommentPages, setCurrentAnswerCommentPages] = useState({});
  const PAGE_SIZE_ANSWER_COMMENTS = 3;  

  const paginateAnswerComments = (ans, pageNumber) => {
    const totalPages = Math.ceil(ans.comments.length / PAGE_SIZE_ANSWER_COMMENTS) || 1;
  
    if (pageNumber < 1 || pageNumber > totalPages) {
      setCurrentAnswerCommentPages((prevPages) => ({
        ...prevPages,
        [ans.aid]: 1,
      }));
    } else {
      setCurrentAnswerCommentPages((prevPages) => ({
        ...prevPages,
        [ans.aid]: pageNumber,
      }));
    }
  };  

  const paginationControlsAnswerComments = (ans) => {
    const totalPages = Math.ceil(ans.comments.length / PAGE_SIZE_ANSWER_COMMENTS) || 1;
    const currentPage = currentAnswerCommentPages[ans.aid] || 1;
  
    return (
      <div>
        <button onClick={() => paginateAnswerComments(ans, currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </button>
        <span> Page {currentPage} of {totalPages} </span>
        <button onClick={() => paginateAnswerComments(ans, currentPage + 1)}>
          Next
        </button>
      </div>
    );
  };  

  const paginateAnswers = (pageNumber) => {
    const totalPages = Math.ceil(finalAnswers.length / PAGE_SIZE_ANSWERS);

    if (pageNumber < 1 || pageNumber > totalPages) {
      setCurrentPageAnswers(1);
    } else {
      setCurrentPageAnswers(pageNumber);
    }
  };

  const paginationControlsAnswers = (
    <div>
      <button onClick={() => paginateAnswers(currentPageAnswers - 1)} disabled={currentPageAnswers === 1}>
        Previous
      </button>
      <span> Page {currentPageAnswers} of {totalAnswerPages} </span>
      <button onClick={() => {
        paginateAnswers(currentPageAnswers + 1);
      }}>
        Next
      </button>
    </div>
  );

  const paginateComments = (pageNumber) => {
    const totalPages = Math.ceil(finalComments.length / PAGE_SIZE_COMMENTS);

    if (pageNumber < 1 || pageNumber > totalPages) {
      setCurrentPageComments(1);
    } else {
      setCurrentPageComments(pageNumber);
    }
  };

  const paginationControlsComments = (
    <div>
      <button onClick={() => paginateComments(currentPageComments - 1)} disabled={currentPageComments === 1}>
        Previous
      </button>
      <span> Page {currentPageComments} of {totalCommentPages} </span>
      <button onClick={() => {
        paginateComments(currentPageComments + 1);
      }}>
        Next
      </button>
    </div>
  );

  const listAnswers = answersToShow.map((ans, index) => {
    let isUpvoted = false;
    let isDownvoted = false;
    if (username) {
      console.log(ans);
      isUpvoted = ans.upvoteBy.includes(username);
      isDownvoted = ans.downvoteBy.includes(username);
    }
    return (
      <div className="st-flex-row-container st-margin-5" key={ans.aid}>
        <div>
          <div className="st-answer-content st-width-80 answerText" dangerouslySetInnerHTML={{ __html: ans.text }}>
          </div>
          <br />
          <span style={{ textAlign: 'center', display: 'block' }}><strong>Comments</strong></span>
          {user && user.reputation >= 50 && (
            <div className="st-margintop-40px">
              <span className="st-fontsize-30px">Comment Text</span>
              <br />
              <input id={`commentAnsTextInput-${ans.aid}`} placeholder="Enter Comment" value={answerComments[ans.aid]?.name || ""}
                onChange={(e) => setAnswerComments({
                  ...answerComments,
                  [ans.aid]: {
                    ...answerComments[ans.aid],
                    name: e.target.value,
                    comment_by: user.username,
                  },
                })}
                onKeyDown={(e) => { handleEnterKeyPressAns(e, ans.aid) }}
              />
            </div>
          )}
          {ans.comments.map((cId, commentIndex) => {
            const comment = comments.find((comment) => comment.cid === cId);
            const startIndex = (currentAnswerCommentPages[ans.aid] - 1) * PAGE_SIZE_ANSWER_COMMENTS;
            const endIndex = startIndex + PAGE_SIZE_ANSWER_COMMENTS;
            if (commentIndex >= startIndex && commentIndex < endIndex) {
              return (
                <div key={cId} className="st-flex-row-container st-margin-5">
                  <div className="st-answer-content st-width-80 answerText" dangerouslySetInnerHTML={{ __html: comment.name }}></div>
                  <div className="st-answer-property st-width-20 answerAuthor">
                    <span className="st-text-green">{comment.comBy}</span>
                    <span className="st-text-grey">{calculateTimePassed(comment.comDate)}</span>
                  </div>
                </div>
              );
            }
            return null;
          })}
          {paginationControlsAnswerComments(ans)}
          {index !== answersToShow.length - 1 && (
            <div className="st-dashed-line" style={width100}></div>
          )}
        </div>
        <div className="st-answer-property st-width-20 answerAuthor">
          <span className="st-text-green">{ans.ansBy}</span>
          <span className="st-text-grey">{calculateTimePassed(ans.ansDate)}</span>
          <br />
          <span>{ans.votes}</span> votes
          <br />
          {user && user.reputation >= 50 && (
            <button
              onClick={async () => {
                await appData.voteAnswer(ans.aid, "upvote", username, user);
                updatePage("answerPage", appData);
              }}
              disabled={isUpvoted}
            >
              Upvote
            </button>
          )}
          {user && user.reputation >= 50 && (
            <button
              onClick={async () => {
                await appData.voteAnswer(ans.aid, "downvote", username, user);
                updatePage("answerPage", appData);
              }}
              disabled={isDownvoted}
            >
              Downvote
            </button>
          )}
          {username && username === question.askedBy && (<button onClick={async () => {
            await appData.pinnedAnswer(question.qid, ans.aid)
            updatePage("answerPage", appData, question.qid);
          }}>Pin</button>)}
          {question.pinnedAnswer === ans.aid && <div style={{ backgroundColor: 'green', borderRadius: '50%', aspectRatio: 1, width: '15px', height: '15px' }}></div>}
        </div>
        <br />
      </div>
    )
  });
  return (
    <div className="st-answers">
      <div className="st-upper-div" id="answersHeader">
        <div id="numberofanswers">
          <b>
            <span id="numberoftags">{question.ansIds.length}</span> answers
          </b>
        </div>
        <div id="questionheading" >
          <b>{question.title}</b>
        </div>
        <div>
          {user && (
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
      <div className="st-upper-div" id="questionBody">
        <div className="st-margin-5" style={width10} id="numberofviews">
          <b>
            <span id="numberofviews">{question.views}</span> views<br />
          </b>
        </div>
        <div className="st-margin-5" style={width70} id="questioncontent" dangerouslySetInnerHTML={{ __html: question.text }}>
        </div>
        <div className="st-margin-5" style={width20}>
          <span className="st-text-crimson" id="questionby">
            {question.askedBy}
          </span>
          <br />
          <span className="st-text-grey" id="questionpostedby">
            asked {calculateTimePassed(question.askDate)}
          </span>
        </div>
      </div>
      <span style={{ textAlign: 'center', display: 'block' }}><strong>Comments</strong></span>
      {user && user.reputation >= 50 && (<div className="st-margintop-40px">
        <span className="st-fontsize-30px">Comment Text</span>
        <br />
        <input id="commentTextInput" placeholder="Enter Comment" value={newComment.name}
          onChange={(e) => setNewComment({ ...newComment, name: e.target.value, comment_by: user.username })}
          onKeyDown={handleEnterKeyPress}
        />
      </div>)}
      <div id="commentblock">
        {listComments}
        {paginationControlsComments}
      </div>
      <div className="st-dotted-line" style={width100}></div>
      <div id="answerblock">
        {listAnswers}
      </div>
      {paginationControlsAnswers}
      <div>
        {user && (
          <button
            className="st-background-deepskyblue st-text-white st-padding-15px st-margin-5"
            style={buttonStyle}
            id="answerquestion"
            type="submit"
            onClick={async () => {
              await updatePage("answerQuestion", appData, question.qid);
            }}
          >
            Answer Question
          </button>
        )}
      </div>
    </div>
  );
};

Answer.propTypes = {
  question: PropTypes.func.isRequired,
  updatePage: PropTypes.func.isRequired
};

export default Answer;
