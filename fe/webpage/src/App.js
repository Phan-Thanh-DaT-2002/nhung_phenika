import React, { useEffect, useState } from "react";
import DoorComponent from "./screens/Door";
import RTC from "./screens/clock/RTC";
import Led from "./screens/Led";
import Alarm from "./screens/alarm";
import { Grid, Radio,  Col, Row  } from "antd";
import BackGround from "./assets/images/background.png"

const App = () => {
  const [time, setTime] = useState(new Date());
  const [latestDoorStatus, setLatestDoorStatus] = useState("LOCK");
  const [doorData, setDoorData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8388/log-act/");
        const jsonData = await response.json();
        const doorData = jsonData.content.items.filter(
          (item) => item.deviceCode === "door"
        );

        // Sort the doorData based on time in descending order
        const sortedDoorData = doorData.sort(
          (a, b) => new Date(b.time) - new Date(a.time)
        );

        // Get the latest command for the door
        const latestCommand = sortedDoorData[0];

        // Update the latest door status if a new command has been received
        const latestCommandTime = new Date(latestCommand.time);
        if (latestCommandTime > time) {
          setLatestDoorStatus(latestCommand.actionLog);
        }

        setDoorData(sortedDoorData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [time]);

  const isDoorLocked = latestDoorStatus === "LOCK";

  const handleToggleLock = async (newLockStatus) => {
    try {
      const currentTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' });
      const newCommandData = {
        deviceCode: "led1",
        deviceName: "cửa",
        actionStatus: newLockStatus ? 0 : 1,
        actionLog: newLockStatus ? "LOCK" : "UNLOCK",
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

      // Update the state without making a new fetch
      setDoorData((prevDoorData) => [
        newCommandData,
        ...prevDoorData,
      ]);

      setLatestDoorStatus(newLockStatus ? "LOCK" : "UNLOCK");
      setTime(currentTime);
    } catch (error) {
      console.error("Error adding new command:", error);
    }
  };

  return (
    <div style={{ width: "100vw", height: "100vh", margin:"0", padding:"0",
    backgroundImage:`url(${BackGround})`, 
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
    backgroundSize: "cover", }}>

      <div style={{    
        margin:"0", padding:"20px 0",
        display: "inline-block",
        position: "relative",
        left: "50%",
        transform: "translateX(-50%)"}}>
        <h1>HỆ THỐNG ĐIỀU KHIỂN CÁC THIẾT BỊ TRONG NHÀ</h1>
      </div>
      <div><RTC/></div>
      <Row gutter={[24, 24]} style={{margin: "0 20px"}}>
      <Col span={8}><Led/></Col>
      <Col span={8}><Alarm/></Col>
      {/* <Col span={8}><Alarm/></Col> */}
    </Row>
    </div>
  );
};

export default App;
