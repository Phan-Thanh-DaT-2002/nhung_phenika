import React, { useEffect, useState } from "react";
import DoorComponent from "./screens/Door";
import Clock from "./screens/clock";
import Led from "./screens/Led";

const App = () => {
  const [time, setTime] = useState(new Date());
  const [latestDoorStatus, setLatestDoorStatus] = useState("LOCK");
  const [doorData, setDoorData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3001/data");
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
        deviceCode: "door",
        deviceName: "cửa",
        actionStatus: newLockStatus ? 0 : 1,
        actionLog: newLockStatus ? "LOCK" : "UNLOCK",
        time: currentTime,
      };

      // Send the new command to the server
      await fetch("http://localhost:3001/add-command", {
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
    <div style={{ width: "100wh", height: "98vh" }}>
      <Clock time={time} setTime={setTime} />
      <DoorComponent
        locked={isDoorLocked}
        doorData={doorData}
        onToggleLock={handleToggleLock}
      />
      <Led/>
    </div>
  );
};

export default App;
