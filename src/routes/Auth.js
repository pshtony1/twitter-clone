import React from "react";
import AuthForm from "components/Auth/AuthForm";
import { IoLogoTwitter } from "react-icons/io";

const Auth = ({ refreshUser }) => {
  return (
    <div className="auth-container">
      <IoLogoTwitter className="auth__logo" />
      <AuthForm refreshUser={refreshUser} />
    </div>
  );
};

export default Auth;
