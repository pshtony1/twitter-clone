import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { IoLogoTwitter } from "react-icons/io";
import { authService } from "firebaseConfig";
import { FiPlus } from "react-icons/fi";
import UploadTweet from "components/Tweet/UploadTweet";

const Navigation = ({ userObj }) => {
  const [openProfile, setOpenProfile] = useState(false);
  const [openAddTweet, setopenAddTweet] = useState(false);
  const history = useHistory();

  const onLogOutClick = () => {
    authService.signOut();
    history.push("/");
  };

  const onLinkClick = () => {
    setOpenProfile(false);
  };

  const toggleProfile = () => {
    setOpenProfile((prev) => !prev);
  };

  const toggleAddTweet = () => {
    document.querySelector(".add-tweet").classList.toggle("active");
    setopenAddTweet((prev) => !prev);
  };

  return (
    <nav className="navigation">
      <Link to="/" className="nav-item home" onClick={onLinkClick}>
        <IoLogoTwitter />
      </Link>
      <div className="add-tweet" onClick={toggleAddTweet}>
        <FiPlus />
      </div>
      <div className="nav-item profile" onClick={toggleProfile}>
        <img
          src={
            userObj.photoURL
              ? userObj.photoURL
              : "https://www.flaticon.com/svg/static/icons/svg/3064/3064559.svg"
          }
          alt=""
        />
      </div>
      {openProfile && (
        <div className="profile-menu">
          <span className="profile-menu__name">
            Hello, <strong>{userObj.displayName}</strong>
          </span>
          <Link
            to="/profile"
            className="menu-item profile"
            onClick={onLinkClick}
          >
            Your Profile
          </Link>
          <div className="menu-item logout" onClick={onLogOutClick}>
            Sign out
          </div>
        </div>
      )}
      {openAddTweet && (
        <div className="add-tweet-container">
          <UploadTweet userObj={userObj} toggleAddTweet={toggleAddTweet} />
        </div>
      )}
    </nav>
  );
};

export default Navigation;
