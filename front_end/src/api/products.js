// ========== Products API ==========
// This file contains the API calls for the products

// === Imports ===

//import axios
import axios from "axios";

// === Constants ===
const baseUrl = `${process.env.REACT_APP_API_URL}/products`;

// === Functions ===
export const getAllProducts = async () => {
  const response = await axios.get(`${baseUrl}`);
  return response.data;
};

export const getProductById = async (id) => {
  const response = await axios.get(`${baseUrl}/${id}`);
  return response.data;
};

export const getProductsByCategory = async (id) => {
  const response = await axios.get(`${baseUrl}/category/${id}`);
  return response.data;
};

export const updateProduct = async (id, product, token) => {
  const response = await axios.put(`${baseUrl}/${id}`, product, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const deleteProduct = async (id, token) => {
  const response = await axios.delete(`${baseUrl}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
