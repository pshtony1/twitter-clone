import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { dbService } from "firebaseConfig";
import Tweet from "components/Tweet/Tweet";
import {
  readFile,
  removeFileFromStorage,
  updateTweetFromFirebase,
  uploadFileToStorage,
} from "utils/ManageData";

const Profile = ({ userObj, refreshUser }) => {
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const [userTweets, setUserTweets] = useState(null);
  const { id: findId } = useParams();
  const history = useHistory();

  const getUserTweets = async () => {
    const tweets = await dbService
      .collection("tweets")
      .where("creatorId", "==", findId)
      .orderBy("createdAt", "desc")
      .get();

    const allTweets = tweets.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setUserTweets(allTweets);
  };

  useEffect(() => {
    getUserTweets();
  });

  const onChange = (e) => {
    const {
      target: { value },
    } = e;

    setNewDisplayName(value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (userObj.displayName !== newDisplayName) {
      setUserTweets((prev) => {
        return prev.map((tweetObj) => {
          tweetObj.user.displayName = newDisplayName;

          return tweetObj;
        });
      });

      userTweets.forEach((tweetObj) => {
        updateTweetFromFirebase(tweetObj.id, {
          user: {
            ...tweetObj.user,
            displayName: newDisplayName,
          },
        });
      });

      await userObj.updateProfile({
        displayName: newDisplayName,
      });

      refreshUser();
    }
  };

  const onFileChange = (e) => {
    const onFileLoad = async (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;

      removeFileFromStorage(userObj.photoURL);
      const photoURL = uploadFileToStorage(userObj.uid, result);

      userTweets.forEach((tweetObj) => {
        updateTweetFromFirebase(tweetObj.id, {
          user: {
            ...tweetObj.user,
            photoURL,
          },
        });
      });

      await userObj.updateProfile({
        photoURL,
      });

      history.go(0);
    };

    readFile(e, onFileLoad);
  };

  const onRemoveClick = async () => {
    removeFileFromStorage(userObj.photoURL);

    userTweets.forEach(async (tweetObj) => {
      updateTweetFromFirebase(tweetObj.id, {
        user: {
          ...tweetObj.user,
          photoURL: "",
        },
      });
    });

    await userObj.updateProfile({
      photoURL: "",
    });

    history.go(0);
  };

  return (
    <div className="home">
      {userObj.uid === findId && (
        <>
          <h3>Edit Profile</h3>
          <form onSubmit={onSubmit} className="profile-edit-container">
            <span>Display name</span>
            <input
              onChange={onChange}
              type="text"
              placeholder="Display name"
              value={newDisplayName}
              className="profile-edit__name"
              spellCheck={false}
            />
            <span>Profile photo</span>

            <div className="profile-edit__photo">
              <img
                src={
                  userObj.photoURL
                    ? userObj.photoURL
                    : process.env.REACT_APP_DEFAULT_PROFILE
                }
                alt=""
              />
              <div className="edit-photo__button-container">
                <input
                  className="edit-photo__file-upload"
                  type="file"
                  accept="image/*"
                  onChange={onFileChange}
                  id="edit-photo__file-upload"
                />
                <label htmlFor="edit-photo__file-upload">Upload photo</label>
                <div
                  className="edit-photo__button-remove"
                  onClick={onRemoveClick}
                >
                  Remove photo
                </div>
              </div>
            </div>

            <input
              type="submit"
              value="Update Profile"
              className="profile-edit__submit"
            />
          </form>
        </>
      )}

      <h3>{userObj.uid === findId ? "Your" : "All"} Tweets</h3>
      <div className="tweets">
        {userTweets &&
          userTweets.map((tweetObj) => (
            <Tweet
              key={tweetObj.id}
              tweetObj={tweetObj}
              isOwner={userObj.uid === findId}
              userObj={userObj}
            />
          ))}
      </div>
    </div>
  );
};

export default Profile;
