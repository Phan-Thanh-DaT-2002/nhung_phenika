// AxiosUtility.js

import axios from "axios";

const dataUrl = "http://localhost:8388/log-act/";

const fetchData = async () => {
  try {
    const response = await axios.get(dataUrl);
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching data: ${error.message}`);
  }
};

const sendData = async (url, method, data) => {
  try {
    const response = await axios({ method, url, data });
    return response.data;
  } catch (error) {
    throw new Error(`Error sending data: ${error.message}`);
  }
};

export { fetchData, sendData, dataUrl };
