import React from "react";
import { useContext } from "react";
import TagsButton from "./TagsButton";
import { DataContext } from "../App";
import PropTypes from "prop-types";
import { AuthContext } from "../contexts/AuthContext";


const Question = ({ questions , updatePage }) => {
  const { appData } = useContext(DataContext);
  const tags = appData.getTags();
  const { user } = useContext(AuthContext)
  let username = null;
  if (user) {
    username = user.username;
  }

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

  const listQues = questions.map((question) => {
    let isUpvoted = false;
    let isDownvoted = false;
    if (username) {
      isUpvoted = question.upvoteBy.includes(username);
      isDownvoted = question.downvoteBy.includes(username);
    }

    return (
      <div key={question.qid} className="st-flex-row-container st-margin-5">
        <div className="postStats">
          <span>
            <b>{question.views}</b>
          </span>
          <span>
            <b> views</b>
          </span>
          <br />
          <span>
            <b>{question.ansIds.length}</b>
          </span>
          <span>
            <b> answers</b>
          </span>
          <br />
          <span>
            <b>{question.votes}</b>
          </span>
          <span>
            <b> votes</b>
          </span>
        </div>
        <div className="postTitle">
          {user && user.reputation >= 50 && (
            <button
              onClick={async () => {
                await appData.voteQuestion(question.qid, "upvote", username, user);
                updatePage("homePage", appData);
              }}
              disabled={isUpvoted}
            >
              Upvote
            </button>
          )}
          {user && user.reputation >= 50 && (
            <button
              onClick={async () => {
                await appData.voteQuestion(question.qid, "downvote", username, user);
                updatePage("homePage", appData);
              }}
              disabled={isDownvoted}
            >
              Downvote
            </button>
          )}
          <b onClick={async () => {
            await appData.updateViews(question.qid);
            updatePage("answerPage", appData, question.qid)
          }}
          >{question.title}</b>
          <TagsButton tags={tags} tagIds={question.tagIds}/>
        </div>
        <div className="lastActivity">
          <span style={{ color: "red" }}> {question.askedBy}</span>
          <span> asked {calculateTimePassed(question.askDate)}</span>
        </div>
      </div>
    );
  });

  return (
    <div>
      {" "}
      {listQues}
      
    </div>
  );
};

Question.propTypes = {
  questions: PropTypes.func.isRequired,
  updatePage: PropTypes.func.isRequired
};

export default Question;
