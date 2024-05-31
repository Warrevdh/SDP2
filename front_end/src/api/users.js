// ========== Users API ==========
// This file contains the API calls for the users

// === Imports ===

//import axios
import axios from "axios";

// === Constants ===
const baseUrl = `${process.env.REACT_APP_API_URL}/users`;

// === Functions ===

// get user with token
export const getUserWithToken = async (token) => {
  const response = await axios.get(`${baseUrl}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// register user
export const registerUser = async (user) => {
  const response = await axios.post(`${baseUrl}/register`, user);
  return response.data;
};

// login user
export const loginUser = async (user) => {
  const response = await axios.post(`${baseUrl}/login`, user);
  return response.data;
};

// update user
export const updateUser = async (user, token) => {
  const response = await axios.put(
    `${baseUrl}/update`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    user
  );
  return response.data;
};

// delete user
export const deleteUser = async (id, token) => {
  const response = await axios.delete(`${baseUrl}/delete/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
