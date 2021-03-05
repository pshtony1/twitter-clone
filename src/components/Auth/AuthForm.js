import { authService } from "firebaseConfig";
import React, { useState } from "react";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import { FiArrowRight } from "react-icons/fi";
import SocialAuth from "./SocialAuth";
import Loader from "react-loader-spinner";

const AuthForm = ({ refreshUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [visiblePassword, setVisiblePassword] = useState(false);
  const [newAccount, setNewAccount] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    const {
      target: { name, value },
    } = e;

    if (value.length > 0) {
      e.target.classList.add("active");
    } else {
      e.target.classList.remove("active");
    }

    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);
    if (name === "displayName") setDisplayName(value);

    const emailInput = document.querySelector(".email-input");
    const pwInput = document.querySelector(".password-input");
    const dnInput = document.querySelector(".display-name-input");
    const submit = document.querySelector(".submit");

    if (newAccount) {
      if (
        emailInput.value.length > 0 &&
        pwInput.value.length > 0 &&
        dnInput.value.length > 0
      ) {
        submit.classList.add("active");
      } else {
        submit.classList.remove("active");
      }
    } else {
      if (emailInput.value.length > 0 && pwInput.value.length > 0) {
        submit.classList.add("active");
      } else {
        submit.classList.remove("active");
      }
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const submit = document.querySelector(".submit");

    if (
      email.length === 0 ||
      password.length === 0 ||
      submit.matches(".loading")
    ) {
      return;
    }

    submit.classList.add("loading");
    setLoading(true);
    setError("");

    try {
      if (newAccount) {
        await authService
          .createUserWithEmailAndPassword(email, password)
          .then(async ({ user }) => {
            await user.updateProfile({ displayName });
          })
          .then(() => refreshUser());
      } else {
        await authService.signInWithEmailAndPassword(email, password);
      }
    } catch (error) {
      setError("Please check your email or password.");
      console.error(error.message);
    } finally {
      submit.classList.remove("loading");
      setLoading(false);
    }
  };

  const toggleVisible = (e) => {
    const pwInput = document.querySelector(".password-input");

    if (visiblePassword) {
      pwInput.type = "password";
    } else {
      pwInput.type = "text";
    }

    setVisiblePassword((prev) => !prev);
  };

  const toggleAccount = () => {
    setNewAccount((prev) => !prev);

    const emailInput = document.querySelector(".email-input");
    emailInput.classList.remove("active");

    const pwInput = document.querySelector(".password-input");
    pwInput.classList.remove("active");

    const submit = document.querySelector(".submit");
    submit.classList.remove("active");

    setError("");
    setEmail("");
    setPassword("");
    setDisplayName("");
  };

  return (
    <>
      <span className="title">{newAccount ? "Create Account" : "Sign In"}</span>
      <span className="auth__error">{error}</span>
      <form className="auth__form" onSubmit={onSubmit}>
        <div className="email-container">
          <input
            className="email-input"
            name="email"
            type="text"
            placeholder="Email"
            value={email}
            onChange={onChange}
            autoFocus
          />
        </div>
        <div className="password-container">
          <input
            className="password-input"
            name="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={onChange}
          />
          {visiblePassword ? (
            <AiFillEye className="toggle-visible" onClick={toggleVisible} />
          ) : (
            <AiFillEyeInvisible
              className="toggle-visible"
              onClick={toggleVisible}
            />
          )}
        </div>
        {newAccount && (
          <div className="display-name-container">
            <input
              className="display-name-input"
              name="displayName"
              type="text"
              placeholder="Display Name"
              value={displayName}
              onChange={onChange}
              autoFocus
            />
          </div>
        )}
        <button className="submit" type="submit">
          {loading ? (
            <Loader
              className="auth-submit__loader"
              type="Oval"
              color="#00BFFF"
              height={25}
              width={25}
            />
          ) : (
            <FiArrowRight />
          )}
        </button>
      </form>

      <SocialAuth />

      <span className="auth__toggle-section" onClick={toggleAccount}>
        {newAccount ? "Sign In" : "Create Account"}
      </span>
    </>
  );
};

export default AuthForm;
