import { dbService, storageService } from "firebaseConfig";
import React, { useState } from "react";

const Tweet = ({ tweetObj, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newTweet, setNewTweet] = useState(tweetObj.text);
  const [seeingMore, setSeeingMore] = useState(false);

  const onDeleteClick = async () => {
    const ok = window.confirm("Are you sure you want to delete this tweet?");

    if (ok) {
      await dbService.doc(`tweets/${tweetObj.id}`).delete();

      if (tweetObj.attachmentURL !== "") {
        await storageService.refFromURL(tweetObj.attachmentURL).delete();
      }
    }
  };

  const toggleEditing = () => setEditing((prev) => !prev);

  const onSubmit = async (e) => {
    e.preventDefault();
    await dbService.doc(`tweets/${tweetObj.id}`).update({
      text: newTweet,
    });
    setEditing(false);
  };

  const onChange = (e) => {
    const {
      target: { value },
    } = e;

    setNewTweet(value);
  };

  const onSeeMoreClick = () => {
    setSeeingMore((prev) => !prev);
  };

  return (
    <div className="tweet-container">
      <div className="tweet__header">
        <img src={tweetObj.user.photoURL} alt="" />
        <span>{tweetObj.user.displayName}</span>
      </div>
      {editing ? (
        <>
          {isOwner && (
            <>
              <form onSubmit={onSubmit}>
                <input
                  type="text"
                  placeholder="Edit your tweet"
                  value={newTweet}
                  required
                  onChange={onChange}
                />
                <input type="submit" value="Update Tweet" />
              </form>
              <button onClick={toggleEditing}>Cancel</button>
            </>
          )}
        </>
      ) : (
        <>
          <span className="tweet__text">
            {!seeingMore ? (
              <>
                {tweetObj.text.slice(0, 100)}
                {tweetObj.text.length > 100 && (
                  <>
                    ...
                    <span className="see-more" onClick={onSeeMoreClick}>
                      See More
                    </span>
                  </>
                )}
              </>
            ) : (
              <>{tweetObj.text}</>
            )}
          </span>
          {tweetObj.attachmentURL && (
            <div className="tweet__img-container">
              <img className="tweet__img" src={tweetObj.attachmentURL} />
            </div>
          )}
          {isOwner && (
            <>
              <button onClick={onDeleteClick}>Delete Tweet</button>
              <button onClick={toggleEditing}>Edit Tweet</button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Tweet;
