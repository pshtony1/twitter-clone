import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { dbService, storageService } from "firebaseConfig";

const UploadTweet = ({ userObj }) => {
  const [tweet, setTweet] = useState("");
  const [attachment, setAttachment] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();

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
    };

    await dbService.collection("tweets").add(tweetObj);

    setTweet("");
    setAttachment("");
  };

  const onChange = (e) => {
    const {
      target: { value },
    } = e;

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

    console.log(file);

    reader.readAsDataURL(file);
  };

  const onClearAttachment = () => {
    document.querySelector(".file-upload").value = "";
    setAttachment("");
  };

  return (
    <form action="" onSubmit={onSubmit}>
      <input
        type="text"
        value={tweet}
        onChange={onChange}
        placeholder="What's on your mind?"
        maxLength={120}
      />
      <input
        className="file-upload"
        type="file"
        accept="image/*"
        onChange={onFileChange}
      />
      <input type="submit" value="Tweet" />
      {attachment && (
        <div>
          <img src={attachment} width="50px" height="50px" alt="preview" />
          <button onClick={onClearAttachment}>Clear</button>
        </div>
      )}
    </form>
  );
};

export default UploadTweet;
