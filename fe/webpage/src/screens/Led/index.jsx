// Led.jsx

import React, { useState, useEffect, useRef } from "react";
import { dataUrl, fetchData, sendData } from "../../AxiosUtility";

const Led = () => {
  const [lightStatus, setLightStatus] = useState(false);

  const ws = useRef(null);

  useEffect(() => {
    const fetchDataFromServer = async () => {
      try {
        const responseData = await fetchData(dataUrl);
        //some logic here
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchDataFromServer();
    // Connect to WebSocket server on ESP8266
    ws.current = new WebSocket("ws://192.168.1.17:81");

    // Set up WebSocket event listeners
    ws.current.onopen = () => {
      console.log("Connected to WebSocket");
    };

    ws.current.onmessage = (event) => {
      console.log("Message from server:", event.data);
    };

    ws.current.onclose = () => {
      console.log("Disconnected from WebSocket");
    };

    // Clean up WebSocket connection on component unmount
    return () => {
      ws.current.close();
    };
  }, []);

  const toggleLight = () => {
    // Check if WebSocket connection is open before sending a message
    if (ws.current.readyState === WebSocket.OPEN) {
      // Send a "toggle" message to the WebSocket server
      // Update the logic based on your requirements
      ws.current.send("toggle");
      setLightStatus(!lightStatus);
    }
  };

  return (
    <div>
      <h1>Light Control</h1>
      <p>Light is {lightStatus ? "off" : "on"}</p>
      <button onClick={toggleLight}>Toggle Light</button>
    </div>
  );
};

export default Led;
