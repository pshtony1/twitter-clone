import { dbService, storageService } from "firebaseConfig";
import React, { useState } from "react";

const Tweet = ({ tweetObj, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newTweet, setNewTweet] = useState(tweetObj.text);

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

  return (
    <div>
      <div>
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
            <h4>{tweetObj.text}</h4>
            {tweetObj.attachmentURL && (
              <img src={tweetObj.attachmentURL} width="100px" height="100px" />
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
    </div>
  );
};

export default Tweet;
