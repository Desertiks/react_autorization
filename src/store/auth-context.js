import { createContext, useEffect, useState } from "react";

let logOutTimer;

const calculateDate = (expirationTime) => {
  const currentDate = new Date().getTime();
  const adjExpirationTime = new Date(expirationTime).getTime();

  return currentDate - adjExpirationTime;
};

const getStoredToken = () => {
  const storedToken = localStorage.getItem('token');
  const storedExpirationTime = localStorage.getItem('expirationTime');

  const remainingTime = Math.abs(calculateDate(storedExpirationTime));

  console.log(remainingTime);

  if (remainingTime <= 60000) {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationTime');
    return null;
  }

  return {
    token: storedToken,
    duration: remainingTime,
  }
};

const AuthContext = createContext({
  token: "",
  isLoggedIn: false,
  login: (token, expirationTime) => {},
  logout: () => {},
});

export const AuthContextProvider = (props) => {
  const tokenData = getStoredToken();
  let initialToken;

  if (tokenData) {
    initialToken = tokenData.token;
  }
  const [token, setToken] = useState(initialToken);

  const userIsLoggedIn = !!token;

  const handleLogin = (token, expirationTime) => {
    setToken(token);
    localStorage.setItem("token", token);
    localStorage.setItem("expirationTime", expirationTime);

    const remainingTime = Math.abs(calculateDate(expirationTime));

    console.log(remainingTime);

    logOutTimer = setTimeout(handleLogout, remainingTime);
  };

  const handleLogout = () => {
    setToken("");
    localStorage.removeItem('token');
    localStorage.removeItem('expirationTime');

    if (logOutTimer) {
      clearTimeout(logOutTimer);
    }
  };

  const contextValue = {
    token,
    userIsLoggedIn,
    login: handleLogin,
    logout: handleLogout,
  };

  useEffect(() => {
    if (tokenData) {
        logOutTimer = setTimeout(handleLogout, tokenData.duration);
    }
  }, [tokenData])

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
