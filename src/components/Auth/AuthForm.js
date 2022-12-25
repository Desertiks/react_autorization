import { useContext, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import AuthContext from "../../store/auth-context";

import classes from "./AuthForm.module.css";

export const api = 'AIzaSyAqHorveith3bVkSdDvkmNBz3XxYwZs98A';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [errorText, setErrorText] = useState("");
  const [succeedMessage, setSucceedMessage] = useState("");

  const emailField = useRef();
  const passwordField = useRef();
  const history = useHistory();


 const authCtx = useContext(AuthContext);

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const handleSumbitButton = async (event) => {
    event.preventDefault();

    const emailValue = emailField.current.value;
    const passwordValue = passwordField.current.value;


    if (!isLogin) {
      try {
        setErrorText('');
        setSucceedMessage('');
        const response = await fetch(
          `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${api}`,
          {
            method: "POST",
            body: JSON.stringify({
              email: emailValue,
              password: passwordValue,
              returnSecureToken: true,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          const errorMessage = await response.json();
          setErrorText(errorMessage.error.message);
          return;
        }

        setSucceedMessage('User created successfully');
      } catch (error) {
        setErrorText('Authorization error');
      }
    } else {
      authCtx.logout();
      try {
        setErrorText('');
        setSucceedMessage('');
        const response = await fetch(
          `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${api}`,
          {
            method: "POST",
            body: JSON.stringify({
              email: emailValue,
              password: passwordValue,
              returnSecureToken: true,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          const errorMessage = await response.json();
          setErrorText(errorMessage.error.message);
          return;
        }
        const data = await response.json();

        setSucceedMessage('Sign in successfully');
        const expirationTime = new Date((new Date().getTime() + (+data.expiresIn * 1000)));
        authCtx.login(data.idToken, expirationTime.toISOString());
        history.replace('/');

      } catch (error) {
        setErrorText('Authorization login error');
      }
    }
  };

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form onSubmit={handleSumbitButton}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input type="email" id="email" required ref={emailField} />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input type="password" id="password" required ref={passwordField} />
        </div>
        <div className={classes.actions}>
          {errorText && (
            <span className={classes.errorRedMessage}>{errorText}</span>
          )}
          {succeedMessage && (
            <span className={classes.succeedMessage}>{succeedMessage}</span>
          )}
          <button>{isLogin ? "Login" : "Create Account"}</button>
          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? "Create new account" : "Login with existing account"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
