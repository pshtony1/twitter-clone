import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { IoLogoTwitter } from "react-icons/io";
import { FiPlus } from "react-icons/fi";
import { authService } from "firebaseConfig";
import UploadTweet from "components/Tweet/UploadTweet";
import { useClickOutSide } from "utils/ClickOutSide";

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
    const profile = document.querySelector(".nav-item.profile");

    profile.classList.toggle("active");
    setOpenProfile((prev) => !prev);
  };

  const toggleAddTweet = () => {
    const addTweet = document.querySelector(".add-tweet");

    addTweet.classList.toggle("active");
    setopenAddTweet((prev) => !prev);
  };

  const clickOutRef_Profile = useClickOutSide(
    ".nav-item.profile",
    toggleProfile
  );
  const clickOutRef_AddTweet = useClickOutSide(".add-tweet", toggleAddTweet);

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
        <div className="profile-menu" ref={clickOutRef_Profile}>
          <span className="profile-menu__name">
            Hello, <strong>{userObj.displayName}</strong>
          </span>
          <Link
            to={`/profile/${userObj.uid}`}
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
        <div className="add-tweet-container" ref={clickOutRef_AddTweet}>
          <UploadTweet userObj={userObj} toggleAddTweet={toggleAddTweet} />
        </div>
      )}
    </nav>
  );
};

export default Navigation;
