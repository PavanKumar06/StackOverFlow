import React, { useContext, useState } from "react";
import { DataContext } from "../App";
import PropTypes from "prop-types";

const EditAnswer = ({ updatePage, answer }) => {
  const { appData } = useContext(DataContext);
  const [text, setText] = useState(answer.text);

  return (
    <div>
      <label>
        <strong>Text:</strong>
        <br />
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          cols={50}
          style={{ marginBottom: '10px', resize: 'none' }}
        />
      </label>
      <button
        onClick={async () => {
          await appData.updateAnswerText(answer.aid, text);
          updatePage("profilePage", appData);
        }}
        style={{ padding: '10px', fontSize: '16px', cursor: 'pointer' }}
      >
        Submit
      </button>
      <button
        onClick={async () => {
            await appData.deleteAnswerText(answer.aid);
            updatePage("profilePage", appData);
        }}
        style={{ marginLeft: '10px', padding: '10px', fontSize: '16px', cursor: 'pointer' }}
      >
        Delete
      </button>
    </div>
  );
};

EditAnswer.propTypes = {
  updatePage: PropTypes.func.isRequired,
  answer: PropTypes.object.isRequired,
};

export default EditAnswer;
