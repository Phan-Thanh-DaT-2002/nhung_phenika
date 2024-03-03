import React, { useState, useEffect } from "react";

function Led() {
  const [isConnected, setIsConnected] = useState(false);
  const [isButtonChecked, setIsButtonChecked] = useState(false);
  const [isLedChecked, setIsLedChecked] = useState(false);

  let ws;

  useEffect(() => {
    // Kết nối đến server WebSocket của ESP8266
    ws = new WebSocket("ws://192.168.170.115:8000/ws");

    ws.onopen = () => {
      console.log("Connected to ESP8266");
      setIsConnected(true);
    };

    ws.onmessage = (evt) => {
      const message = evt.data;
      console.log("Message from ESP8266:", message);
      if (message === "BTN_PRESSED") {
        setIsButtonChecked(true);
      } else if (message === "BTN_RELEASE") {
        setIsButtonChecked(false);
      }
    };

    ws.onclose = () => {
      console.log("Disconnected from ESP8266");
      setIsConnected(false);
    };

    return () => {
      // Cleanup function
      if (ws) {
        ws.close();
      }
    };
  }, []);

  const handleButtonClick = () => {
    if (ws.readyState === WebSocket.OPEN) {
      const newLedStatus = !isLedChecked;
      setIsLedChecked(newLedStatus);
      const status = newLedStatus ? "LED_ON" : "LED_OFF";
      ws.send(status);
    } else {
      console.error("WebSocket connection not open.");
    }
  };

  return (
    <div className="led">
      <h1>ESP8266 Control Panel</h1>
      <div>Status: {isConnected ? "Connected" : "Disconnected"}</div>
      <div>
        <label>
          ESP8266 Button Status:
          <input type="checkbox" checked={isButtonChecked} readOnly />
        </label>
      </div>
      <div>
        <label>
          Control LED:
          <input
            type="checkbox"
            checked={isLedChecked}
            onChange={handleButtonClick}
          />
        </label>
      </div>
    </div>
  );
}

export default Led;
