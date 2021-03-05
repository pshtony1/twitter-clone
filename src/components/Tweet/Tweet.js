import { dbService, storageService } from "firebaseConfig";
import React, { useEffect, useRef, useState } from "react";
import { HiPencilAlt, HiOutlineHeart, HiHeart } from "react-icons/hi";
import { FaTrash } from "react-icons/fa";
import { TweetSkeleton } from "utils/Skeleton";
import { Link } from "react-router-dom";

const Tweet = ({ tweetObj, isOwner, userObj }) => {
  const [editing, setEditing] = useState(false);
  const [newTweet, setNewTweet] = useState(tweetObj.text);
  const [seeingMore, setSeeingMore] = useState(false);
  const [liked, setLiked] = useState(tweetObj.likes.includes(userObj.uid));
  const [likes, setLikes] = useState(tweetObj.likes);
  const [loadCount, setLoadCount] = useState(0);
  const [userImg, setUserImg] = useState(null);
  const [tweetImg, setTweetImg] = useState(null);
  const thisRef = useRef();

  const maxLoadCount = tweetObj.attachmentURL ? 2 : 1;

  useEffect(() => {
    if (loadCount === 0) {
      const preUserImg = new Image();
      preUserImg.onload = function () {
        setUserImg(preUserImg);
        setLoadCount((prev) => prev + 1);
      };

      preUserImg.src = tweetObj.user.photoURL
        ? tweetObj.user.photoURL
        : "https://www.flaticon.com/svg/static/icons/svg/3064/3064559.svg";

      if (tweetObj.attachmentURL) {
        const preTweetImg = new Image();
        preTweetImg.onload = function () {
          setTweetImg(preTweetImg);
          setLoadCount((prev) => prev + 1);
        };

        preTweetImg.src = tweetObj.attachmentURL;
      }
    } else {
      if (loadCount >= maxLoadCount) {
        const userImgElement = thisRef.current.querySelector(
          ".tweet__user-img"
        );
        userImgElement.src = userImg.src;

        if (tweetObj.attachmentURL) {
          const tweetImgElement = thisRef.current.querySelector(".tweet__img");
          tweetImgElement.src = tweetImg.src;
        }
      }
    }
  }, [loadCount]);

  const onDeleteClick = async () => {
    const ok = window.confirm("Are you sure you want to delete this tweet?");

    if (ok) {
      await dbService.doc(`tweets/${tweetObj.id}`).delete();

      if (tweetObj.attachmentURL !== "") {
        await storageService.refFromURL(tweetObj.attachmentURL).delete();
      }
    }
  };

  const toggleEditing = () => {
    setNewTweet(tweetObj.text);
    setEditing((prev) => !prev);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    await dbService.doc(`tweets/${tweetObj.id}`).update({
      text: newTweet,
      updatedAt: Date.now(),
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

  const convertTime2String = (updatedAt, createdAt) => {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const now = new Date();
    const date = new Date(createdAt);
    const passedTime = Math.floor((now - date) / 1000);
    let result;

    if (passedTime < 60) result = "Just Now";
    else if (passedTime < 120) result = `1 minute ago`;
    else if (passedTime < 3600)
      result = `${Math.floor(passedTime / 60)} minutes ago`;
    else if (passedTime < 7200) result = `1 hour ago`;
    else if (passedTime < 86400)
      result = `${Math.floor(passedTime / 3600)} hours ago`;
    else if (passedTime < 172800) result = `1 day ago`;
    else if (passedTime < 604800)
      result = `${Math.floor(passedTime / 86400)} days ago`;
    else if (now.getFullYear() === date.getFullYear()) {
      result = `${monthNames[date.getMonth()]} ${date.getDate()}`;
    } else {
      result = `${
        monthNames[date.getMonth()]
      } ${date.getDate()} ${date.getFullYear()}`;
    }

    if (updatedAt !== createdAt) {
      result += "(modified)";
    }

    return result;
  };

  const onLikeClick = async () => {
    let newLikes;

    if (!liked) {
      newLikes = [...likes, userObj.uid];
    } else {
      newLikes = likes.filter((id) => id !== userObj.uid);
    }

    await dbService.doc(`tweets/${tweetObj.id}`).update({
      likes: newLikes,
    });

    setLikes(newLikes);
    setLiked((prev) => !prev);
  };

  return (
    <div className="tweet-container" ref={thisRef}>
      {loadCount < maxLoadCount ? (
        <TweetSkeleton
          attachmentURL={tweetObj.attachmentURL}
          attachmentHeight={tweetObj.attachmentHeight}
        />
      ) : (
        <>
          <div className="tweet__header">
            <div className="user-container">
              <Link
                to={`/profile/${tweetObj.user.uid}`}
                className="tweet__user-link"
              >
                <img alt="" className="tweet__user-img" />
              </Link>
              <div className="tweet-info">
                <Link
                  to={`/profile/${tweetObj.user.uid}`}
                  className="info__display-name-link"
                >
                  <span className="info__display-name">
                    {tweetObj.user.displayName}
                  </span>
                </Link>
                <span className="info__time">
                  {convertTime2String(tweetObj.updatedAt, tweetObj.createdAt)}
                </span>
              </div>
            </div>
            {isOwner && (
              <div className="tweet-modify">
                <button
                  onClick={toggleEditing}
                  title="Edit"
                  {...(editing && { style: { color: "white" } })}
                >
                  <HiPencilAlt />
                </button>
                <button onClick={onDeleteClick} title="Delete">
                  <FaTrash />
                </button>
              </div>
            )}
          </div>
          {editing ? (
            <>
              {isOwner && (
                <>
                  <form onSubmit={onSubmit} className="tweet-edit-container">
                    <textarea
                      type="text"
                      placeholder="Edit your tweet"
                      value={newTweet}
                      required
                      onChange={onChange}
                      spellCheck={false}
                      maxLength={1000}
                    />
                    <div className="tweet-edit__button-container">
                      <button onClick={toggleEditing}>Cancel</button>
                      <input type="submit" value="Update Tweet" />
                    </div>
                  </form>
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
                  <img
                    className="tweet__img"
                    alt=""
                    {...(tweetImg && { src: tweetImg.src })}
                  />
                </div>
              )}
              <div className="tweet__like-container">
                <div className="like-inner-container" onClick={onLikeClick}>
                  {liked ? <HiHeart className="liked" /> : <HiOutlineHeart />}
                  <span className={liked ? "like-count active" : "like-count"}>
                    {likes.length}
                  </span>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Tweet;
