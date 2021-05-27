import React, { useState, useEffect } from "react";

import Login from "./components/Login/Login";
import Home from "./components/Home/Home";
import MainHeader from "./components/MainHeader/MainHeader";
import AuthContext from "./store/auth-context";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // *** DANGER ***
  // this way of checking if the user already logged in will cause infinite loop
  // because the `setIsLoggedIn` call is going to re-render the App() component
  // to prevent it, use `useEffect` hook instead
  // const storedUserLoggedInInformation = localStorage.getItem('isLoggedIn')

  // if(storedUserLoggedInInformation === '1') {
  //   setIsLoggedIn(true)
  // }

  // *** IMPORTANT ***
  // the `useEffect` runs:
  // 1. when there is NO dependencies, then the `useEffect` runs AFTER the component mounts and every re-rendering
  // 2. when there is dependencies, then the code in the `useEffect` will run ONLY when the depencies changed
  useEffect(() => {
    const storedUserLoggedInInformation = localStorage.getItem("isLoggedIn");

    if (storedUserLoggedInInformation === "1") {
      setIsLoggedIn(true);
    }
    // note that, there is no dependencies here, so the code will only be ran once
    // no matter how many time the component is re-rendered
  }, []);

  const loginHandler = (email, password) => {
    // We should of course check email and password
    // But it's just a dummy/ demo anyways
    localStorage.setItem("isLoggedIn", "1");
    setIsLoggedIn(true);
  };

  const logoutHandler = () => {
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
  };

  return (
    // again, the AuthContext itself is not component
    // but the .Provider is an component
    // we wrap all components inside the context
    // so, all of those components have access to the data in the context
    // *** IMPORTANT ***
    // here, we need to set the default value to the whatever the value in the currect state
    // as soon as the `isLoggedIn` state changes, the context will receive the new value
    // and then all components that listen on the context will also get updated value

    // here, we do not need to pass down `isAuthenticated={isLoggedIn}` anymore,
    // since the `isLoggedIn` is available in the context
    // the components that listen to the context will have access to it directly
    <AuthContext.Provider
      value={{ isLoggedIn: isLoggedIn, onLogout: logoutHandler }}
    >
      {/* <MainHeader isAuthenticated={isLoggedIn} onLogout={logoutHandler} /> */}
      <MainHeader />
      <main>
        {!isLoggedIn && <Login onLogin={loginHandler} />}
        {isLoggedIn && <Home onLogout={logoutHandler} />}
      </main>
    </AuthContext.Provider>
  );
}

export default App;
