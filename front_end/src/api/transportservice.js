// ========== Transportservice  API ==========
// This file contains the API for the Transportservice

// ==== Imports ====

// import axios
import axios from "axios";

// ==== Constants ====
const baseUrl = `${process.env.REACT_APP_API_URL}/transport`;

// ==== Functions ====
export const getAllActiveTransport = async (token) => {
  const response = await axios.get(`${baseUrl}/active`);
  return response.data;
};
