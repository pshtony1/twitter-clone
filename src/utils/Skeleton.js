import React from "react";

const TweetSkeleton = ({ attachmentURL, attachmentHeight }) => {
  return (
    <div className="skeleton__tweet-container">
      <div className="skeleton__tweet-header">
        <div className="skeleton__user-img"></div>
        <div className="skeleton__tweet-info">
          <div className="skeleton__info-display-name"></div>
          <div className="skeleton__info-time"></div>
        </div>
      </div>
      <div className="skeleton__tweet-text"></div>
      {attachmentURL && (
        <div
          className="skeleton__tweet-img"
          style={{ height: attachmentHeight }}
        ></div>
      )}
      <div className="skeleton__tweet-like-container">
        <div className="skeleton__tweet-like"></div>
      </div>
    </div>
  );
};

export { TweetSkeleton };
