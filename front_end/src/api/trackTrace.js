// ========== Track&Trace API ==========
// This file contains the API calls for the tracking of an order

// === Imports ===

//import axios
import axios from "axios";

// - import react
import { useCallback } from "react";

// === Constants ===
const baseUrl = `${process.env.REACT_APP_API_URL}/track&traces`;

// === Functions ===
const useTrackTrace = () => {
  // get location of a order
  const trackOrder = useCallback(async (traceData) => {
    const response = await axios.get(
      `${baseUrl}/traceer/${traceData.code}/${traceData.verification}`
    );
    return response.data;
  }, []);

  return {
    trackOrder,
  };
};

export default useTrackTrace;
