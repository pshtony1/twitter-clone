import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { dbService, storageService } from "firebaseConfig";
import { BiImageAdd } from "react-icons/bi";
import { RiDeleteBin2Fill } from "react-icons/ri";

const UploadTweet = ({ userObj, toggleAddTweet }) => {
  const [tweet, setTweet] = useState("");
  const [attachment, setAttachment] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();

    if (tweet.length < 1) return;

    let attachmentURL = "";

    if (attachment !== "") {
      const attachmentRef = storageService
        .ref()
        .child(`${userObj.uid}/${uuidv4()}`);
      const response = await attachmentRef.putString(attachment, "data_url");
      attachmentURL = await response.ref.getDownloadURL();
    }

    const tweetObj = {
      text: tweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      attachmentURL,
      user: {
        displayName: userObj.displayName,
        uid: userObj.uid,
        photoURL: userObj.photoURL,
      },
    };

    await dbService.collection("tweets").add(tweetObj);

    setTweet("");
    setAttachment("");
    toggleAddTweet();
  };

  const onChange = (e) => {
    const {
      target: { value },
    } = e;

    const textarea = document.querySelector(".add-tweet__submit");

    if (value.length > 0) {
      textarea.classList.add("active");
    } else {
      textarea.classList.remove("active");
    }

    setTweet(value);
  };

  const onFileChange = (e) => {
    const {
      target: { files },
    } = e;

    const file = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;

      setAttachment(result);
    };

    reader.readAsDataURL(file);
  };

  const onClearAttachment = () => {
    document.querySelector(".file-upload").value = "";
    setAttachment("");
  };

  return (
    <form className="add-tweet-form" action="" onSubmit={onSubmit}>
      <input
        className="file-upload"
        type="file"
        accept="image/*"
        onChange={onFileChange}
        id="file-upload"
      />
      <label htmlFor="file-upload">
        <BiImageAdd />
        Add a photo...
      </label>
      {attachment && (
        <div className="file-preview">
          <img src={attachment} alt="preview" />
          <button onClick={onClearAttachment}>
            <RiDeleteBin2Fill />
          </button>
        </div>
      )}
      <textarea
        className="add-tweet__input"
        value={tweet}
        onChange={onChange}
        placeholder="What's on your mind?"
        maxLength={1000}
        spellCheck="false"
      />
      <input className="add-tweet__submit" type="submit" value="Tweet" />
    </form>
  );
};

export default UploadTweet;
