import React from "react";
import PropTypes from "prop-types";

const TagsButton = ({ tags, tagIds }) => {
  const listTags = tagIds.map((tagId) => {
    const matchedTag = tags.find((tag) => tag.tid === tagId);
    if (matchedTag) {
      return (
        <button key={tagId} className="st-tag-button">
          {matchedTag.name}
        </button>
      );
    } else return null;
  });
  return <div className="tagsContainer st-margintop-5px">{listTags}</div>;
};

TagsButton.propTypes = {
  tags: PropTypes.func.isRequired,
  tagIds: PropTypes.func.isRequired
};

export default TagsButton;
