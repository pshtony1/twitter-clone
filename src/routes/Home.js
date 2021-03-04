import React, { useEffect, useState } from "react";
import { dbService } from "firebaseConfig";
import Tweet from "components/Tweet/Tweet";
import UploadTweet from "components/Tweet/UploadTweet";

const Home = ({ userObj }) => {
  const [tweets, setTweets] = useState([]);

  useEffect(() => {
    dbService
      .collection("tweets")
      .orderBy("createdAt", "desc")
      .onSnapshot((snapshot) => {
        const tweetArray = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setTweets(tweetArray);
      });
  }, []);

  return (
    <div>
      <UploadTweet userObj={userObj} />
      <div>
        {tweets.map((tweet) => (
          <Tweet
            key={tweet.id}
            tweetObj={tweet}
            isOwner={tweet.creatorId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
