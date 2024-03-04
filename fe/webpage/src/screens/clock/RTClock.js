// RTClock.js
import React, { useState, useEffect } from 'react';
import { Flex, Typography } from 'antd';

const { Title } = Typography;

const RTClock = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Cleanup the interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <Flex justify="center" align="center" style={{
      width: '15%',
      border: '2px solid black'
    }}>
      <Title level={1}>{currentTime.toLocaleTimeString()}</Title>
    </Flex>
  );
};

export default RTClock;
