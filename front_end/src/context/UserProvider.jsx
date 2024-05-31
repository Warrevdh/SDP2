import { getUserWithToken, loginUser } from "../api/users";

import React, { createContext, useEffect, useState } from "react";
import Cookies from "js-cookie";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = Cookies.get("userToken");

    if (token) {
      setUserToken(token);
      setUser(fetchUser(token));
    }
  }, []);

  const fetchUser = async (token) => {
    try {
      const response = await getUserWithToken(token);
      setUser(response);
    } catch (error) {
      console.log(error);
    }
  };

  const login = async (data) => {
    try {
      const response = await loginUser(data);
      setUserToken(response.token);
      setUser(response);
      Cookies.set("userToken", response.token, { expires: 0.25 }); // expires in 6 hours
      return response;
    } catch (error) {
      return error;
    }
  };

  const logout = () => {
    setUserToken(null);
    setUser(null);
    Cookies.remove("userToken");
  };

  return (
    <UserContext.Provider value={{ userToken, login, logout, user }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
