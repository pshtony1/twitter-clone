import React from "react";
import { IoLogoTwitter } from "react-icons/io";
import AuthForm from "components/Auth/AuthForm";

const Auth = ({ refreshUser }) => {
  return (
    <div className="auth-container">
      <IoLogoTwitter className="auth__logo" />
      <AuthForm refreshUser={refreshUser} />
    </div>
  );
};

export default Auth;
