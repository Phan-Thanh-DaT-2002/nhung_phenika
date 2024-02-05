// App.js
import React from "react";
import RTClock from "./RTClock";
import { Flex } from "antd";

const RTC = () => {
  return (
    <Flex justify="center" align="center">
      <RTClock />
    </Flex>
  );
};

export default RTC;
