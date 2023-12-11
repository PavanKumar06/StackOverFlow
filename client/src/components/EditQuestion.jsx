import React,{ useContext, useState } from "react"
import { DataContext } from "../App"
import PropTypes from "prop-types";

const EditQuestion = ({updatePage, question}) => {
    const {appData} = useContext(DataContext)
    const [title, setTitle] = useState(question.title);
    const [text, setText] = useState(question.text);

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <label>
                <strong>Title:</strong>
                <br />
                <textarea
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                rows={3}
                cols={50}
                style={{ marginBottom: '10px', resize: 'none' }}
                />
            </label>

            <label>
                <strong>Text:</strong>
                <br />
                <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={5}
                cols={50}
                style={{ marginBottom: '20px', resize: 'none' }}
                />
            </label>

            <button
                onClick={async () => {
                await appData.updateQuestionTitleText(question.qid, title, text);
                updatePage("profilePage", appData);
                }}
                style={{ padding: '10px', fontSize: '16px', cursor: 'pointer' }}
            >
                Submit
            </button>
            <button
                onClick={async () => {
                    await appData.deleteQuestionText(question.qid);
                    updatePage("profilePage", appData);
                }}
                style={{ marginLeft: '10px', padding: '10px', fontSize: '16px', cursor: 'pointer' }}
            >
                Delete
            </button>
        </div>

    )
}

EditQuestion.propTypes = {
    updatePage: PropTypes.func.isRequired,
    question: PropTypes.object.isRequired
};
  
export default EditQuestion;