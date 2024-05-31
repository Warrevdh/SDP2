// ========== Notifications API ==========
// This file contains the API calls for the notifications

// === Imports ===

//import axios
import axios from "axios";

// === Constants ===
const baseUrl = `${process.env.REACT_APP_API_URL}/notifications`;

// === Functions ===
export const getNotificationsFromCompany = async (companyId, token) => {
  const response = await axios.get(`${baseUrl}/company/${companyId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const updateNotification = async (id, notification, token) => {
  const response = await axios.put(`${baseUrl}/${id}`, notification, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const deleteNotification = async (id, token) => {
  const response = await axios.delete(`${baseUrl}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
