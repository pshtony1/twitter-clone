import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { BiImageAdd } from "react-icons/bi";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { v4 as uuidv4 } from "uuid";
import { dbService, storageService } from "firebaseConfig";
import { readFile } from "utils/ManageData";

const UploadTweet = ({ userObj, toggleAddTweet }) => {
  const [tweet, setTweet] = useState("");
  const [attachmentHeight, setAttachmentHeight] = useState(null);
  const [attachment, setAttachment] = useState("");
  const history = useHistory();

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
        const sizeRate = maxWidth / this.width;

        if (sizeRate * this.height >= 600) {
          setAttachmentHeight(600);
        } else {
          setAttachmentHeight(Math.floor(sizeRate * this.height));
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
      <input className="add-tweet__submit" type="submit" value="Tweet" />
    </form>
  );
};

export default UploadTweet;
