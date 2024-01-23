import React, { useState, useEffect } from "react";
import "./Clock.css"; // Import your CSS file for styling
import { SwapOutlined } from "@ant-design/icons";

const Clock = ({ time, setTime }) => {
  const [is24HourFormat, setIs24HourFormat] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, [setTime]);

  // Ensure time is a valid Date object before extracting digits
  if (!(time instanceof Date)) {
    return (
      <div className="clock-container">
        <div className="digit-container">
          <div className="digit">-</div>
          <div className="digit">-</div>
        </div>
        <div className="colon">:</div>
        <div className="digit-container">
          <div className="digit">-</div>
          <div className="digit">-</div>
        </div>
        <div className="colon">:</div>
        <div className="digit-container">
          <div className="digit">-</div>
          <div className="digit">-</div>
        </div>
        <div className="ampm">--</div>
        <button
          className="switch-button"
          onClick={() => setIs24HourFormat(!is24HourFormat)}
        >
          <SwapOutlined />
        </button>
      </div>
    );
  }

  // Extract individual digits of the time
  let hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  if (!is24HourFormat) {
    // Convert to AM/PM format
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;

    // Display the AM/PM indicator
    return (
      <div className="clock-container">
        <div className="digit-container">
          <div className="digit">{Math.floor(hours / 10)}</div>
          <div className="digit">{hours % 10}</div>
        </div>
        <div className="colon">:</div>
        <div className="digit-container">
          <div className="digit">{Math.floor(minutes / 10)}</div>
          <div className="digit">{minutes % 10}</div>
        </div>
        <div className="colon">:</div>
        <div className="digit-container">
          <div className="digit">{Math.floor(seconds / 10)}</div>
          <div className="digit">{seconds % 10}</div>
        </div>
        <div className="ampm">{ampm}</div>
        <button
          className="switch-button"
          onClick={() => setIs24HourFormat(!is24HourFormat)}
        >
          <SwapOutlined />
        </button>
      </div>
    );
  }

  // Display the 24-hour format
  return (
    <div className="clock-container">
      <div className="digit-container">
        <div className="digit">{Math.floor(hours / 10)}</div>
        <div className="digit">{hours % 10}</div>
      </div>
      <div className="colon">:</div>
      <div className="digit-container">
        <div className="digit">{Math.floor(minutes / 10)}</div>
        <div className="digit">{minutes % 10}</div>
      </div>
      <div className="colon">:</div>
      <div className="digit-container">
        <div className="digit">{Math.floor(seconds / 10)}</div>
        <div className="digit">{seconds % 10}</div>
      </div>
      <button
        className="switch-button"
        onClick={() => setIs24HourFormat(!is24HourFormat)}
      >
        <SwapOutlined />
      </button>
    </div>
  );
};

export default Clock;
