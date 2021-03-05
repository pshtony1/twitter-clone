import React, { useEffect, useState } from "react";
import AppRouter from "components/Router";
import { IoLogoTwitter } from "react-icons/io";
import { authService } from "firebaseConfig";

function App() {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);

  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        setUserObj({
          displayName: user.displayName,
          uid: user.uid,
          updateProfile: (args) => user.updateProfile(args),
          photoURL: user.photoURL,
        });
      } else {
        setUserObj(null);
      }

      setInit(true);
    });
  }, []);

  const refreshUser = (customUser = null, obj) => {
    let user;

    if (customUser) {
      user = customUser;
    } else {
      user = authService.currentUser;
    }

    if (obj) {
      setUserObj((prev) => {
        return {
          ...prev,
          ...obj,
        };
      });
    } else {
      setUserObj({
        displayName: user.displayName,
        uid: user.uid,
        updateProfile: (args) => user.updateProfile(args),
        photoURL: user.photoURL,
      });
    }
  };

  return (
    <>
      {init ? (
        <AppRouter
          isLoggedIn={Boolean(userObj)}
          userObj={userObj}
          refreshUser={refreshUser}
        />
      ) : (
        <div className="app-init-loader">
          <IoLogoTwitter className="loading-logo" />
          <footer>&copy; 2021 Twitter Clone</footer>
        </div>
      )}
    </>
  );
}

export default App;
