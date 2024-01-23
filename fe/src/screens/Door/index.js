import React, { useState } from "react";
import { LockOutlined, UnlockOutlined } from "@ant-design/icons";

const DoorComponent = ({ locked, doorData, onToggleLock }) => {

  const handleToggleLock = () => {
    // Toggle lock status
    onToggleLock(!locked);

    // Add new command to server
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",

        width: "400px",
        height: "500px",
        marginTop: "100px",

        background: "#0D2282",
        color: "#FFFFFF",

        border: "1px solid black",
        borderRadius: "10px",
      }}
    >
      <h1>Trạng thái cửa</h1>
      <div onClick={handleToggleLock}>
        {locked ? (
          <LockOutlined style={{ fontSize: "60px", color: "red" }} />
        ) : (
          <UnlockOutlined style={{ fontSize: "60px", color: "#00FF1A" }} />
        )}
      </div>
      <h2>Lịch sử ra lệnh</h2>
      <ul
        style={{
          overflowY: "auto",
        }}
      >
        {doorData ? (
          doorData.map((data, index) => (
            <li key={index}>{`${data.time} - ${data.actionLog}`}</li>
          ))
        ) : (
          <li>No data available</li>
        )}
      </ul>
    </div>
  );
};

export default DoorComponent;
