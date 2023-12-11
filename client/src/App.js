import DataClass from "./components/DataClass.js";
import Page from "./components/Page.jsx";
import QuesOverview from "./components/QuesOverview.jsx";
import Header from "./components/Header.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Tags from "./components/Tags.jsx";
import "./stylesheets/index.css";
import { useContext, useEffect, useState } from "react";
import React from "react";
import Answer from "./components/Answer.jsx";
import NewQues from "./components/NewQues.jsx";
import NewAnswer from "./components/NewAnswer.jsx";
import axios from "axios";
import { AuthContext } from "./contexts/AuthContext.js";
import Signup from "./components/Signup.jsx";
import Login from "./components/Login.jsx";
import Profile from "./components/Profile.jsx";
import EditQuestion from "./components/EditQuestion.jsx";
import EditAnswer from "./components/EditAnswer.jsx";
import EditTag from "./components/EditTag.jsx";

export const DataContext = new React.createContext();

function App() {
  const [appData, setAppData] = useState(null);
  const [currPage, setCurrPage] = useState(null);
  const [question, setQuestion] = useState(null);
  const [searchValue, setSearchValue] = useState(null);
  const [editPage, setEditPage] = useState(null);
  const { user } = useContext(AuthContext);
  console.log(user);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/getAllData");
        const newDataInstance = new DataClass(response.data);

        setAppData(newDataInstance);
        setCurrPage("homePage");
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, []);

  const updatePage = async (page, editData, qId = null, searchvalue = null) => {
    const response = await axios.get("http://localhost:8000/api/getAllData");
    const newDataInstance = new DataClass(response.data);

    console.log(newDataInstance);
    setAppData(() => newDataInstance);

    setCurrPage(page);

    setEditPage(editData);
    
    if (qId !== null) {
      const questionToFind = newDataInstance.getQuestions().find((question) => question.qid === qId);
      setQuestion(questionToFind);
    }
    setSearchValue(searchvalue);
  }

  return (
    <div>
      <DataContext.Provider value={{appData}}>
        <Header updatePage={updatePage} />
        <div className="st-flex-row-container">
          <Sidebar updatePage={updatePage} />
          {
            currPage === "signup" && (
              <Page id="signup">
                <Signup updatePage={updatePage} />
              </Page>)
          }
          {
            currPage === "login" && (
              <Page id="login">
                <Login updatePage={updatePage} />
              </Page>)
          }
          {
            currPage === "homePage" && (
            <Page id="homePage">
              <QuesOverview searchValue={searchValue} updatePage={updatePage} />
            </Page>)
          }
          {
            currPage === "homePageFromSidebar" && (
            <Page id="homePage">
              <QuesOverview searchValue={searchValue} updatePage={updatePage} />
            </Page>)
          }
          {
            currPage === "newQuestionPage" && (
            <Page id="newQuestionPage">
              <NewQues updatePage={updatePage} />
            </Page>)
          }
          {
            currPage === "answerPage" && (
            <Page id="answerPage">
              <Answer updatePage={updatePage} question={question} />
            </Page>)
          }
          {
            currPage === "answerQuestion" && (
            <Page id="answerQuestion">
              <NewAnswer updatePage={updatePage} question={question} />
            </Page>)
          }
          {
            currPage === "tagsPage" && (
            <Page id="tagsPage">
              <Tags updatePage={updatePage} />
            </Page>)
          }
          {
            currPage === "profilePage" && (
            <Page id="profilePage">
              <Profile updatePage={updatePage} />
            </Page>)
          }
          {
            currPage === "editQuesPage" && (
            <Page id="editQuesPage">
              <EditQuestion updatePage={updatePage} question={editPage} />
            </Page>)
          }
          {
            currPage === "editAnsPage" && (
            <Page id="editAnsPage">
              <EditAnswer updatePage={updatePage} answer={editPage} />
            </Page>)
          }
          {
            currPage === "editTagPage" && (
            <Page id="editTagPage">
              <EditTag updatePage={updatePage} tag={editPage} />
            </Page>)
          }
        </div>
      </DataContext.Provider>
    </div>
  );
}

export default App;
