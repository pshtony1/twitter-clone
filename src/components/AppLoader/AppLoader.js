import React from "react";
import { IoLogoTwitter } from "react-icons/io";

const AppLoader = () => {
  return (
    <div className="app-init-loader">
      <IoLogoTwitter className="loading-logo" />
      <footer>&copy; 2021 Twitter Clone</footer>
    </div>
  );
};

export default AppLoader;
