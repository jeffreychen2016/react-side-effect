import React, { useState, useEffect, useReducer } from "react";

import Card from "../UI/Card/Card";
import classes from "./Login.module.css";
import Button from "../UI/Button/Button";
import Input from "../UI/Input/Input";

// note that here, the reducer function is created outside of component
// because all data this function requires will be passed into this function as parameters
// it does NOT depend on the variables in the component
const emailReducer = (state, action) => {
  if (action.type === "USER_INPUT") {
    // return new state
    return { value: action.val, isValid: action.val.includes("@") };
  }
  if (action.type === "INPUT_BLUR") {
    // if the input field lost focus, we wanna return last snapshot of the state
    return { value: state.value, isValid: state.value.includes("@") };
  }
  // return default state
  return { value: "", isValid: false };
};

const passwordReducer = (state, action) => {
  if (action.type === "USER_INPUT") {
    // return new state
    return { value: action.val, isValid: action.val.trim().length > 6 };
  }
  if (action.type === "INPUT_BLUR") {
    // if the input field lost focus, we wanna return last snapshot of the state
    return { value: state.value, isValid: state.value.trim().length > 6 };
  }
  // return default state
  return { value: "", isValid: false };
};

const Login = (props) => {
  // ---------------------------
  // use `useReducer` hook
  // ---------------------------
  // const [state, dispatchFn] = useReducer(reducerFn, initialState, initFn)
  // reducerFn: the first parameter `state` will be the PREVIOUS state.
  // this function will be called very time we invoke the dispatchFn
  // dispatchFn: we can pass in `action` to it and use it to do extra logics
  const [emailState, dispatchEmail] = useReducer(emailReducer, {
    // this is the default state for `emailState`
    value: "",
    isValid: false,
  });

  const [passwordState, dispatchPassword] = useReducer(passwordReducer, {
    value: "",
    isValid: false,
  });

  const [formIsValid, setFormIsValid] = useState(false);

  const { isValid: emailIsValid } = emailState;
  const { isValid: passwordIsValid } = passwordState;

  useEffect(() => {
    const identifer = setTimeout(() => {
      console.log("checking inputs...");
      // even though here, the form state is still depending on other 2 states
      // (again, if other 2 states did not get updated on time by React, the form state might be wrong)
      // however, this fine appraoch right now
      // since, we are watching for `emailState` and `passwordState`
      // every time those 2 states changed, we reset the state for the form
      setFormIsValid(emailIsValid && passwordIsValid);
    }, 500);
    return () => {
      console.log("cleaning up");
      clearTimeout(identifer);
    };
    // note here, the depencies here are just `isValid` key from the state
    // not the entire state, since we only care about the `isValid` key here
  }, [emailIsValid, passwordIsValid]);

  const emailChangeHandler = (event) => {
    dispatchEmail({ type: "USER_INPUT", val: event.target.value });
  };

  const validateEmailHandler = () => {
    dispatchEmail({ type: "INPUT_BLUR" });
  };

  const passwordChangeHandler = (event) => {
    dispatchPassword({ type: "USER_INPUT", val: event.target.value });
  };

  const validatePasswordHandler = () => {
    dispatchPassword({ type: "INPUT_BLUR" });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    props.onLogin(emailState.value, passwordState.val);
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <Input
          id="email"
          label="E-Mail"
          type="email"
          isValid={emailIsValid}
          value={emailState.value}
          onChange={emailChangeHandler}
          onBlur={validateEmailHandler}
        />
        <Input
          id="password"
          label="Password"
          type="password"
          isValid={passwordIsValid}
          value={passwordState.value}
          onChange={passwordChangeHandler}
          onBlur={validatePasswordHandler}
        />
        {/* <div
          className={`${classes.control} ${
            emailState.isValid === false ? classes.invalid : ""
          }`}
        >
          <label htmlFor="email">E-Mail</label>
          <input
            type="email"
            id="email"
            value={emailState.value}
            onChange={emailChangeHandler}
            onBlur={validateEmailHandler}
          />
        </div>
        <div
          className={`${classes.control} ${
            passwordState.isValid === false ? classes.invalid : ""
          }`}
        >
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={passwordState.value}
            onChange={passwordChangeHandler}
            onBlur={validatePasswordHandler}
          />
        </div> */}
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn} disabled={!formIsValid}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );

  // ---------------------------
  // use `useState` hook
  // ---------------------------
  // const [enteredEmail, setEnteredEmail] = useState("");
  // const [emailIsValid, setEmailIsValid] = useState();
  // const [enteredPassword, setEnteredPassword] = useState("");
  // const [passwordIsValid, setPasswordIsValid] = useState();
  // const [formIsValid, setFormIsValid] = useState(false);
  // useEffect(() => {
  //   // *** IMPORTANT ***
  //   // this is called `debouncing`
  //   // note that, here we are always going to have mroe than 1 timers
  //   // that means, it is not going to do much expect for delaying the validation code
  //   // we need to use `return` part to make it work
  //   const identifer = setTimeout(() => {
  //     console.log("checking inputs...");
  //     setFormIsValid(
  //       enteredEmail.includes("@") && enteredPassword.trim().length > 6
  //     );
  //   }, 500);
  //   // this is called `cleaning up` function
  //   // note that, here we are going to clear the timer that is set previously starting from second time re-rendering this component
  //   // as long as the user keeps typing, the evaluation code is not going to run
  //   // it technique will be really useful if we were sending requests to database for validation or something.
  //   // this will reduce the requests to the backend servers.
  //   // this cleanup function will run:
  //   // 1. BEFORE the `useEffect` executes the above code expect for the first time
  //   // 2. when the component is unmounted
  //   // expect for the first time
  //   return () => {
  //     console.log("cleaning up");
  //     // clear previous timers
  //     clearTimeout(identifer);
  //   };
  //   // *** IMPORTANT ***
  //   // note here, every time when the email or password changes
  //   // the component will get re-rendered,
  //   // then, this `setFormIsValid` function will be called
  //   // this means, every key stroke in the input field will trigger the re-evaluation here which is exactly what we need here
  // }, [enteredEmail, enteredPassword]);
  // const emailChangeHandler = (event) => {
  //   setEnteredEmail(event.target.value);
  //   // we can put the common code into the useEffect
  //   // setFormIsValid(
  //   //   event.target.value.includes("@") && enteredPassword.trim().length > 6
  //   // );
  // };
  // const passwordChangeHandler = (event) => {
  //   setEnteredPassword(event.target.value);
  //   // setFormIsValid(
  //   //   event.target.value.trim().length > 6 && enteredEmail.includes("@")
  //   // );
  // };
  // const validateEmailHandler = () => {
  //   setEmailIsValid(enteredEmail.includes("@"));
  // };
  // const validatePasswordHandler = () => {
  //   setPasswordIsValid(enteredPassword.trim().length > 6);
  // };
  // const submitHandler = (event) => {
  //   event.preventDefault();
  //   props.onLogin(enteredEmail, enteredPassword);
  // };
  // return (
  //   <Card className={classes.login}>
  //     <form onSubmit={submitHandler}>
  //       <div
  //         className={`${classes.control} ${
  //           emailIsValid === false ? classes.invalid : ""
  //         }`}
  //       >
  //         <label htmlFor="email">E-Mail</label>
  //         <input
  //           type="email"
  //           id="email"
  //           value={enteredEmail}
  //           onChange={emailChangeHandler}
  //           onBlur={validateEmailHandler}
  //         />
  //       </div>
  //       <div
  //         className={`${classes.control} ${
  //           passwordIsValid === false ? classes.invalid : ""
  //         }`}
  //       >
  //         <label htmlFor="password">Password</label>
  //         <input
  //           type="password"
  //           id="password"
  //           value={enteredPassword}
  //           onChange={passwordChangeHandler}
  //           onBlur={validatePasswordHandler}
  //         />
  //       </div>
  //       <div className={classes.actions}>
  //         <Button type="submit" className={classes.btn} disabled={!formIsValid}>
  //           Login
  //         </Button>
  //       </div>
  //     </form>
  //   </Card>
  // );
};

export default Login;
