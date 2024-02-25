// Led.jsx

import React, { useState, useEffect, useRef } from "react";
import { dataUrl, fetchData, sendData } from "../../AxiosUtility";

const Led = () => {
  const [lightStatus, setLightStatus] = useState();
  const [ledData, setLedData] = useState(false);

  const ws = useRef(null);

  useEffect(() => {
    const fetchDataFromServer = async () => {
      try {
        const responseData = await fetchData(dataUrl);
        console.log(222, responseData);
        const sortLedData = responseData.content.items.sort(
          (a, b) => new Date(b.time) - new Date(a.time)
        );
        var newData = [];
        sortLedData.forEach((device) => {
          if (device.deviceCode === "led1") {
            newData.push(device);
          }
        });
        setLedData(newData);
        // console.log(111, newData);
        // responseData.items.forEach((command) => {
        //   if (command.deviceCode === "led1") {
        //     setLightStatus(command.actionStatus === "ON");
        //   }
        // });
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchDataFromServer();
    // Connect to WebSocket server on ESP8266
    ws.current = new WebSocket("ws://192.168.1.178:81");

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
  }, [lightStatus]);
  const toggleLight = async () => {
    // Check if WebSocket connection is open before sending a message
    if (ws.current.readyState === WebSocket.OPEN) {
      // Send a "toggle" message to the WebSocket server
      // Update the logic based on your requirements
      ws.current.send("toggle");

      // const currentTime = new Date()("en-US", {
      //   timeZone: "Asia/Ho_Chi_Minh",
      // });
      const currentTime = new Date();

      // Lấy thông tin ngày và giờ từ đối tượng Date
      const year = currentTime.getFullYear();
      const month = String(currentTime.getMonth() + 1).padStart(2, "0"); // Thêm '0' phía trước nếu tháng < 10
      const day = String(currentTime.getDate()).padStart(2, "0"); // Thêm '0' phía trước nếu ngày < 10
      const hours = String(currentTime.getHours()).padStart(2, "0");
      const minutes = String(currentTime.getMinutes()).padStart(2, "0");
      const seconds = String(currentTime.getSeconds()).padStart(2, "0");

      // Tạo chuỗi theo định dạng mong muốn
      const formattedDateTime = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;

      console.log("formattedDateTime", formattedDateTime);

      const newCommandData = {
        deviceCode: "led1",
        deviceName: "đèn",
        actionStatus: 2,
        actionLog: lightStatus ? "ON" : "OFF",
        time: currentTime,
      };

      // Send the new command to the server
      await fetch("http://localhost:8388/log-act/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCommandData),
      });
    }
    setLightStatus(!lightStatus);
  };
  const formatDateTime = (isoDateString) => {
    const isoDate = new Date(isoDateString);

    // Lấy thông tin ngày và giờ từ đối tượng Date
    const day = isoDate.getDate();
    const month = isoDate.getMonth() + 1; // Thêm 1 vì tháng bắt đầu từ 0
    const year = isoDate.getFullYear();
    const hours = isoDate.getHours();
    const minutes = isoDate.getMinutes();
    const seconds = isoDate.getSeconds();

    // Tạo chuỗi theo định dạng mong muốn
    const formattedDateTime = `${
      (hours + 7) % 24
    }:${minutes}:${seconds} - ${day}/${month}/${year}`;

    return formattedDateTime;
  };

  return (
    <div>
      <h1>Light Control</h1>
      <p>Light is {lightStatus ? "off" : "on"}</p>
      <button onClick={toggleLight}>Toggle Light</button>
      <ul
        style={{
          overflowY: "auto",
        }}
      >
        {ledData ? (
          ledData.map((data, index) => (
            <li key={index}>{`${formatDateTime(data.time)} - ${
              data.actionLog
            }`}</li>
          ))
        ) : (
          <li>No data available</li>
        )}
      </ul>
    </div>
  );
};

export default Led;
