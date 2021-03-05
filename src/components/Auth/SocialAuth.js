import { authService, firebaseInstance } from "firebaseConfig";
import React from "react";
import ReactDOM from "react-dom";
import { FcGoogle } from "react-icons/fc";
import { IoLogoGithub } from "react-icons/io";

const SocialAuth = () => {
  const onSocialClick = async (e) => {
    let name;

    for (let i = 0; i < e.nativeEvent.path.length; i++) {
      const element = ReactDOM.findDOMNode(e.nativeEvent.path[i]);

      if (element.matches("button")) {
        name = element.name;
        break;
      }
    }

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
