import React, { useContext, useState } from "react";
import { DataContext } from "../App";
import PropTypes from "prop-types";

const EditTag = ({ updatePage, tag }) => {
  const { appData } = useContext(DataContext);
  const [name, setName] = useState(tag.name);
  const [errorMessage, setErrorMessage] = useState(null);

  return (
    <div>
      <label>
        <strong>Name:</strong>
        <br />
        <textarea
          value={name}
          onChange={(e) => setName(e.target.value)}
          rows={3}
          cols={50}
          style={{ marginBottom: '10px', resize: 'none' }}
        />
      </label>
      <button
        onClick={async () => {
          await appData.updateTagName(tag.tid, name);
          updatePage("profilePage", appData);
        }}
        style={{ padding: '10px', fontSize: '16px', cursor: 'pointer' }}
      >
        Submit
      </button>
      <button
        onClick={async () => {
          try {
            await appData.deleteTagText(tag.tid);
            updatePage("profilePage", appData);
          } catch (error) {
            setErrorMessage(error.message);
          }
        }}
        style={{ marginLeft: '10px', padding: '10px', fontSize: '16px', cursor: 'pointer' }}
      >
        Delete
      </button>
      {errorMessage && (
        <div style={{ color: 'red', marginTop: '10px' }}>
          {errorMessage}
        </div>
      )}
    </div>
  );
};

EditTag.propTypes = {
  updatePage: PropTypes.func.isRequired,
  tag: PropTypes.object.isRequired,
};

export default EditTag;
