import React from "react";
import AuthForm from "components/Auth/AuthForm";
import SocialAuth from "components/Auth/SocialAuth";

const Auth = () => {
  return (
    <div>
      <AuthForm />
      <SocialAuth />
    </div>
  );
};

export default Auth;
