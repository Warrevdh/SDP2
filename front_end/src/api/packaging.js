// ============ Packagings API ============
// This file contains the API calls for the packagings

// === Imports ===

//import axios
import axios from "axios";

// === Constants ===
const baseUrl = `${process.env.REACT_APP_API_URL}/packages`;

// === Functions ===
// get all packagings
export const getAllpackages = async () => {
  const response = await axios.get(`${baseUrl}/all`);
  return response.data;
};

// get order by id
export const getPackagingById = async (id) => {
  const response = await axios.get(`${baseUrl}/${id}`);
  return response.data;
};
