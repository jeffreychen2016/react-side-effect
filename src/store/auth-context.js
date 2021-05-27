// *** IMPORTANT ***
// we are using the React Context to manage the state behind the scence
// so that we do not have to pass states through components
// while some of the components do not need them and just simply forward them to next component

import React from "react";

// AuthContext itself is not a component
// it is an object that contains component
// set the context default to `{ isLoggedIn: false }`
const AuthContext = React.createContext({
  isLoggedIn: false,
  onLogout: () => {},
});

export default AuthContext;

// steps to use the context
// 1. provide the context to the components (wrap the compoents that need access to context), like
// {
/* <AuthContext.Provider value={{ isLoggedIn: isLoggedIn }}>
  <MainHeader isAuthenticated={isLoggedIn} onLogout={logoutHandler} />
  <main>
    {!isLoggedIn && <Login onLogin={loginHandler} />}
    {isLoggedIn && <Home onLogout={logoutHandler} />}
  </main>
</AuthContext.Provider>; */
// }

// 2. change the consuming component to listen to the context using `useContext` hook:
// import AuthContext from "../../store/auth-context";
// const ctx = useContext(AuthContext);
// then use it like `ctx.isLoggedIn` instead of `props.isLoggedIn`
