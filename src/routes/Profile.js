import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import Loader from "react-loader-spinner";
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
  const [uploading, setUploading] = useState(false);
  const [updatingName, setUpdatingName] = useState(false);
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

    const submit = document.querySelector(".profile-edit__submit");

    if (userObj.displayName === value) {
      submit.classList.add("un-active");
    } else {
      submit.classList.remove("un-active");
    }

    setNewDisplayName(value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (userObj.displayName !== newDisplayName) {
      setUpdatingName(true);
      setUserTweets((prev) => {
        return prev.map((tweetObj) => {
          tweetObj.user.displayName = newDisplayName;

          return tweetObj;
        });
      });

      userTweets.forEach(async (tweetObj) => {
        await updateTweetFromFirebase(tweetObj.id, {
          user: {
            ...tweetObj.user,
            displayName: newDisplayName,
          },
        });
      });

      await userObj.updateProfile({
        displayName: newDisplayName,
      });

      setUpdatingName(false);
      refreshUser();
    }
  };

  const onFileChange = (e) => {
    const onFileLoad = async (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;

      await removeFileFromStorage(userObj.photoURL);
      const photoURL = await uploadFileToStorage(userObj.uid, result);

      userTweets.forEach(async (tweetObj) => {
        await updateTweetFromFirebase(tweetObj.id, {
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
      setUploading(false);
    };

    setUploading(true);
    readFile(e, onFileLoad);
  };

  const onRemoveClick = async () => {
    setUploading(true);

    await removeFileFromStorage(userObj.photoURL);

    userTweets.forEach(async (tweetObj) => {
      await updateTweetFromFirebase(tweetObj.id, {
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
    setUploading(false);
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
              {uploading ? (
                <Loader
                  className="profile-edit-photo__loader"
                  type="Oval"
                  color="#00BFFF"
                  height={25}
                  width={25}
                />
              ) : (
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
              )}
            </div>
            {updatingName ? (
              <div className="profile-edit__submit updating">
                <Loader
                  className="profile-edit-photo__loader"
                  type="Oval"
                  color="#00BFFF"
                  height={20}
                  width={20}
                />
              </div>
            ) : (
              <input
                type="submit"
                value="Update Profile"
                className="profile-edit__submit un-active"
              />
            )}
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
