import { useContext, useRef, useState } from "react";
import AuthContext from "../../store/auth-context";
import { api } from "../Auth/AuthForm";
import classes from "./ProfileForm.module.css";

const ProfileForm = () => {
  const passwordField = useRef();
  const authCtx = useContext(AuthContext);
  const [errorMessage, setErrorMessage] = useState('');
  const [succeedMessage, setSucceedMessage] = useState('');

  const handleChangePassword = async (event) => {
    event.preventDefault();

    try {
      setErrorMessage('');
      setSucceedMessage('');
      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${api}`,
        {
          method: "POST",
          body: JSON.stringify({
            idToken: authCtx.token,
            password: passwordField.current.value,
            returnSecureToken: true,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
       const data = await response.json();
       setErrorMessage(data.error.message);
       return;
      }

      setSucceedMessage('Password succeed changed');

    } catch (error) {
      setErrorMessage('Error');
    }
  };

  return (
    <form className={classes.form} onSubmit={handleChangePassword}>
      <div className={classes.control}>
        <label htmlFor="new-password">New Password</label>
        <input type="password" id="new-password" ref={passwordField} />
      </div>
      {errorMessage && <span className={classes.errorRedMessage}>{errorMessage}</span>}
      {succeedMessage && <span className={classes.succeedMessage}>{succeedMessage}</span>}
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
};

export default ProfileForm;
