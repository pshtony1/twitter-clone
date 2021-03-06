import React from "react";
// import ReactDOM from "react-dom";
import { FcGoogle } from "react-icons/fc";
import { IoLogoGithub } from "react-icons/io";
import { authService, firebaseInstance } from "firebaseConfig";

const SocialAuth = () => {
  const onSocialClick = async (e) => {
    const name = e.currentTarget.name;

    let provider;
    if (name === "google") {
      provider = new firebaseInstance.auth.GoogleAuthProvider();
    } else if (name === "github") {
      provider = new firebaseInstance.auth.GithubAuthProvider();
    }

    await authService.signInWithPopup(provider);
  };

  return (
    <div className="auth__social-container">
      <button
        className="social-button google"
        name="google"
        onClick={onSocialClick}
      >
        <FcGoogle />
      </button>
      <button
        className="social-button github"
        name="github"
        onClick={onSocialClick}
      >
        <IoLogoGithub />
      </button>
    </div>
  );
};

export default SocialAuth;
