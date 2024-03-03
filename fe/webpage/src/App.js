import React, { useEffect, useState } from "react";
import RTC from "./screens/clock/RTC";
import Led from "./screens/Led";
import Alarm from "./screens/alarm";
import { Grid, Radio,  Col, Row  } from "antd";
import Door from "./screens/Door";

const App = () => {

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <div style={{    
        display: "inline-block",
        position: "relative",
        left: "50%",
        transform: "translateX(-50%)"}}>
        <h1>HỆ THỐNG ĐIỀU KHIỂN CÁC THIẾT BỊ TRONG NHÀ</h1>
      </div>
      <div><RTC/></div>
      <Row gutter={[24, 24]} style={{margin: "0 20px"}}>
      <Col span={8}><Alarm/></Col>
      <Col span={8}><Door/></Col>
      <Col span={8}><Led/></Col>
    </Row>
    </div>
  );
};

export default App;
