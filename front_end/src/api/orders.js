// ============ Orders API ============
// This file contains the API calls for the orders

// === Imports ===

//import axios
import axios from "axios";

// === Constants ===
const baseUrl = `${process.env.REACT_APP_API_URL}/orders`;

// === Functions ===
// get all orders
export const getAllOrders = async (id, token) => {
  const response = await axios.get(`${baseUrl}/company/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// get order by id
export const getOrderById = async (id) => {
  const response = await axios.get(`${baseUrl}/${id}`);
  return response.data;
};

// create order
export const createOrder = async (order, token) => {
  const response = await axios.post(`${baseUrl}`, order, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
