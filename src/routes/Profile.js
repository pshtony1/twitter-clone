import React, { useEffect, useState } from "react";
// import { dbService } from "firebaseConfig";

const Profile = ({ userObj, refreshUser }) => {
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);

  const getMyTweets = async () => {
    // const tweets = await dbService
    //   .collection("tweets")
    //   .where("creatorId", "==", userObj.uid)
    //   .orderBy("createdAt")
    //   .get();
    // const myTweets = tweets.docs.map((doc) => doc.data());
    // console.log(tweets.docs.map((doc) => doc.data()));
  };

  useEffect(() => {
    getMyTweets();
  }, []);

  const onChange = (e) => {
    const {
      target: { value },
    } = e;

    setNewDisplayName(value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (userObj.displayName !== newDisplayName) {
      await userObj.updateProfile({
        displayName: newDisplayName,
      });

      refreshUser();
    }
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          onChange={onChange}
          type="text"
          placeholder="Display name"
          value={newDisplayName}
        />
        <input type="submit" value="Update Profile" />
      </form>
    </>
  );
};

export default Profile;
