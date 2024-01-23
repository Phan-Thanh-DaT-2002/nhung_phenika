// Led.jsx

import React, { useState, useEffect } from "react";
import { dataUrl, fetchData, sendData } from "../../AxiosUtility";


const Led = () => {
  const [lightStatus, setLightStatus] = useState(false);

  useEffect(() => {
    const fetchDataFromServer = async () => {
      try {
        const responseData = await fetchData(dataUrl);
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
  }, []);

  const toggleLight = async () => {
    try {
      if (lightStatus) {
        await sendData("http://192.168.1.17/LED=ON", "post", null);
      } else {
        await sendData("http://192.168.1.17/LED=OFF", "post", null);
      }

      setLightStatus(!lightStatus);
    } catch (error) {
      console.error(error.message);
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
