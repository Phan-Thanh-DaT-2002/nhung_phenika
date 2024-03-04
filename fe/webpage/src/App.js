import React, { useEffect, useRef, useState } from "react";
import RTC from "./screens/clock/RTC";
import Led from "./screens/Led";
import Alarm from "./screens/alarm";
import { Grid, Radio, Col, Row } from "antd";
import Door from "./screens/Door";
import URL from "./components/GlobalConst/globalconst";
import globalSignal from "./components/GlobalConst/GlobalSignal";


const App = () => {
  const [textAlarm, setTextAlarm] = useState();
  const [alarmData, setAlarmData] = useState();
  const [textLed, setTextLed] = useState();
  const [ledData, setLedData] = useState();
  const [textDoor, setTextDoor] = useState();
  const [doorData, setDoorData] = useState();
  const ws = useRef(null);
  const [message, setMessage] = useState("")

  useEffect(() => {
    const messageSignalListener = (message) => {
      // Xử lý message ở đây
      console.log("Received message in App:", message);
      if (message.length > 0) {
        if (ws.current.readyState === WebSocket.OPEN) ws.current.send(message);
      }
    };

    globalSignal.messageSignal.add(messageSignalListener);

    // Cleanup function
    return () => {
      globalSignal.messageSignal.remove(messageSignalListener);
    };
  }, []);

  const connectWebSocket = async () => {
    return new Promise((resolve, reject) => {
      ws.current = new WebSocket(URL);

      ws.current.onopen = () => {
        ws.current.send("Connected to WebSocket");
        console.log("Connected to WebSocket");
        resolve();
      };

      ws.current.onerror = (error) => {
        reject(error);
      };

      ws.current.onmessage = (event) => {
        const mes = event.data;

        if (mes === "ALARMStatus_ON") {
          if (textAlarm !== "ON") {
            setTextAlarm("ON");
          }
        } else if (mes === "ALARMStatus_OFF") {
          if (textAlarm !== "OFF") {
            setTextAlarm("OFF");
          }
        }
        if (mes === "LEDStatus_ON" || mes === "LEDStatus_OFF") {
          setTextLed(mes === "LEDStatus_ON" ? "ON" : "OFF");
        }
        if (mes === "DOORStatus_ON" || mes === "DOORStatus_OFF") {
          setTextDoor(mes === "DOORStatus_ON" ? "ON" : "OFF");
        }
        // globalSignal.deviceSignal
        // Gửi lại thông điệp tương ứng khi nhận được DONE
        switch (mes) {
          case "LED_DONE":
            globalSignal.deviceSignal.dispatch({ id: ledData[0].id, type: "LED" });
            const messageLed = 'LEDAlarm_TIME:' + convertStringDate(ledData);
            if (ws.current.readyState === WebSocket.OPEN) ws.current.send(messageLed);
            break;
          case "ALARM_DONE":
            globalSignal.deviceSignal.dispatch({ id: alarmData[0].id, type: "ALARM" });
            const messageAlarm = 'ALARM_TIME:' + convertStringDate(alarmData);
            if (ws.current.readyState === WebSocket.OPEN) ws.current.send(messageAlarm);
            break;
          case "DOOR_DONE":
            globalSignal.deviceSignal.dispatch({ id: doorData[0].id, type: "DOOR" });
            const messageDoor = 'DOORAlarm_TIME:' + convertStringDate(doorData);
            if (ws.current.readyState === WebSocket.OPEN) ws.current.send(messageDoor);
            break;
          default:
            break;
        }
      };

      ws.current.onclose = () => {
        console.log("WebSocket closed");
      };

      // Cleanup function
      return () => {
        if (ws.current.readyState === WebSocket.OPEN) {
          ws.current.close();
        }
      };
    });
  };

  useEffect(() => {
    const initializeWebSocket = async () => {
      try {
        await connectWebSocket();
        // Continue with any other initialization after WebSocket connection
      } catch (error) {
        console.error("WebSocket connection error:", error);
      }
    };

    initializeWebSocket();

    // Cleanup function
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  const convertStringDate = (data) => {
    const dateObject = new Date(data[0].time);

    const year = dateObject.getUTCFullYear();
    const month = (dateObject.getUTCMonth() + 1).toString().padStart(2, "0"); // Thêm 1 vì tháng bắt đầu từ 0
    const day = (dateObject.getUTCDate() + 1).toString().padStart(2, "0");
    const hours = ((dateObject.getUTCHours() + 7) % 24).toString().padStart(2, "0");
    const minutes = dateObject.getUTCMinutes().toString().padStart(2, "0");
    const seconds = dateObject.getUTCSeconds().toString().padStart(2, "0");
    return `${year}${month}${day}${hours}${minutes}${seconds}`;
  }

  useEffect(() => {
    if (alarmData && ledData && doorData) {
      const date = [];
      date.push(new Date());
      const messageDate = 'DATETIME:' + convertStringDate(date);
      if (ws.current.readyState === WebSocket.OPEN) ws.current.send(messageDate);
      const messageAlarm = 'ALARM_TIME:' + convertStringDate(alarmData);
      if (ws.current.readyState === WebSocket.OPEN) ws.current.send(messageAlarm);
      const messageLed = 'LEDAlarm_TIME:' + convertStringDate(ledData);
      if (ws.current.readyState === WebSocket.OPEN) ws.current.send(messageLed);
      const messageDoor = 'DOORAlarm_TIME:' + convertStringDate(doorData);
      if (ws.current.readyState === WebSocket.OPEN) ws.current.send(messageDoor);
      console.log(messageAlarm, messageLed, messageDoor);
    }

  }, alarmData, doorData, ledData)

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <div style={{
        display: "inline-block",
        position: "relative",
        left: "50%",
        transform: "translateX(-50%)"
      }}>
        <h1>HỆ THỐNG ĐIỀU KHIỂN</h1>
      </div>
      <div><RTC /></div>
      <Row gutter={[24, 24]} style={{ margin: "0 20px" }}>
        {textAlarm && (
          <Col span={8}><Alarm textAlarm={textAlarm} sendData={setAlarmData} /></Col>
        )}
        {textDoor && (
          <Col span={8}><Door textDoor={textDoor} sendData={setDoorData} /></Col>
        )}
        {textLed && (
          <Col span={8}><Led textLed={textLed} sendData={setLedData} /></Col>
        )}
      </Row>
    </div>
  );
};

export default App;
