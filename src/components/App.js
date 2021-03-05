import React, { useEffect, useState } from "react";
import AppRouter from "components/Router";
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

  const refreshUser = (customUser = null) => {
    let user;

    if (customUser) {
      user = customUser;
    } else {
      user = authService.currentUser;
    }

    setUserObj({
      displayName: user.displayName,
      uid: user.uid,
      updateProfile: (args) => user.updateProfile(args),
      photoURL: user.photoURL,
    });
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
        "Initializing..."
      )}
      {/* <footer>&copy; {new Date().getFullYear()} Cwitter</footer> */}
    </>
  );
}

export default App;
