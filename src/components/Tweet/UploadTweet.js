import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { BiImageAdd } from "react-icons/bi";
import { RiDeleteBin2Fill } from "react-icons/ri";
import Loader from "react-loader-spinner";
import { dbService } from "firebaseConfig";
import { readFile, uploadFileToStorage } from "utils/ManageData";

const UploadTweet = ({ userObj, toggleAddTweet }) => {
  const [tweet, setTweet] = useState("");
  const [attachmentHeight, setAttachmentHeight] = useState(null);
  const [attachment, setAttachment] = useState("");
  const [uploading, setUploading] = useState(false);
  const history = useHistory();

  const onSubmit = async (e) => {
    e.preventDefault();
    if (tweet.length < 1) return;

    setUploading(true);
    const attachmentURL = await uploadFileToStorage(userObj.uid, attachment);

    const createdAt = Date.now();
    const tweetObj = {
      text: tweet,
      createdAt,
      updatedAt: createdAt,
      creatorId: userObj.uid,
      attachmentURL,
      attachmentHeight: attachmentHeight || 0,
      user: {
        displayName: userObj.displayName,
        uid: userObj.uid,
        photoURL: userObj.photoURL,
      },
      likes: [],
    };

    await dbService.collection("tweets").add(tweetObj);

    setTweet("");
    setAttachment("");
    toggleAddTweet();
    setUploading(false);
    history.push("/");
  };

  const onChange = (e) => {
    const {
      target: { value },
    } = e;

    const submit = document.querySelector(".add-tweet__submit");

    if (value.length > 0) {
      submit.classList.add("active");
    } else {
      submit.classList.remove("active");
    }

    setTweet(value);
  };

  const onFileChange = (e) => {
    const submit = document.querySelector(".add-tweet__submit");
    submit.classList.remove("active");

    const onFileLoad = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;

      let image = new Image();
      image.onload = () => {
        const rect = document.getElementById("root").getBoundingClientRect();
        const maxWidth = rect.width - 30;
        const sizeRate = maxWidth / image.width;

        if (sizeRate * image.height >= 600) {
          setAttachmentHeight(600);
        } else {
          setAttachmentHeight(Math.floor(sizeRate * image.height));
        }

        if (document.querySelector(".add-tweet__input").value.length > 0) {
          submit.classList.add("active");
        }
      };
      image.src = result;

      setAttachment(result);
    };

    readFile(e, onFileLoad);
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
      {uploading ? (
        <Loader
          className="auth-submit__loader"
          type="Oval"
          color="#00BFFF"
          height={25}
          width={25}
        />
      ) : (
        <input className="add-tweet__submit" type="submit" value="Tweet" />
      )}
    </form>
  );
};

export default UploadTweet;
