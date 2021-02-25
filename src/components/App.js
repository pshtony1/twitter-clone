import React, { useEffect, useState } from "react";
import AppRouter from "components/Router";
import { authService } from "firebaseConfig";

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggednIn] = useState(false);

  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggednIn(true);
      } else {
        setIsLoggednIn(false);
      }
      setInit(true);
    });
  }, []);

  return (
    <>
      {init ? <AppRouter isLoggedIn={isLoggedIn} /> : "Initializing..."}
      <footer>&copy; {new Date().getFullYear()} Cwitter</footer>
    </>
  );
}

export default App;
