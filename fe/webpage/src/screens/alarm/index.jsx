import "./alarm.css";
import logoAlarm from "../../access/images/alarmIcon.png";
import React, { useState } from "react";
import { Button, Flex, Col, Row, Table, Switch } from "antd";

const columns = [
  {
    // title: "Name",
    dataIndex: "name",
    render: (text) => <a href="/#">{text}</a>,
  },
  {
    // title: "Time",
    dataIndex: "time",
  },
  {
    // title: "Options",
    dataIndex: "options",
  },
];
const data = [
  {
    key: "1",
    name: "Go to school",
    time: "06:30",
    options: "Mỗi ngày",
  },
  {
    key: "2",
    name: "Go home",
    time: "12:30",
    options: "Mỗi ngày",
  },
  {
    key: "3",
    name: "Play Football",
    time: "15:30",
    options: "Mỗi T5",
  },
  {
    key: "4",
    name: "Sleep",
    time: "22:30",
    options: "Mỗi ngày",
  },
  {
    key: "5",
    name: "Shopping",
    time: "06:30",
    options: "T2, T5",
  },
  {
    key: "6",
    name: "Do something",
    time: "16:30",
    options: "Mỗi ngày",
  },
];

const Alarm = () => {
  const [activeStatus, setActiveStatus] = useState(data.map(() => true));
  const handleToggleActive = (checked, index) => {
    setActiveStatus((prevStatus) => {
      const newStatus = [...prevStatus];
      newStatus[index] = checked;
      return newStatus;
    });
  };

  return (
    <div className="boxAlarm">
      <Flex>
        <div style={{ width: "50%", height: "150px" }}>
          <img
            alt="logoAlarm"
            style={{ width: "65%", height: "70%", margin: "10px" }}
            src={logoAlarm}
          />
        </div>
        <Row
          className="alarmBtn"
          gutter={[10, 0]}
          justify="space-around"
          align="middle"
          style={{ width: "50%", height: "150px" }}
        >
          <Col>
            <Button type="primary" size="large">
              ON/OFF
            </Button>
          </Col>
          <Col>
            <Button type="primary" size="large">
              History
            </Button>
          </Col>
          <Col>
            <Button type="primary" size="large">
              Add
            </Button>
          </Col>
          <Col>
            <Button type="primary" size="large">
              Delete
            </Button>
          </Col>
        </Row>
      </Flex>
      <Table
        columns={[
          ...columns,
          {
            dataIndex: "active",
            render: (text, record, index) => (
              <Switch
                checked={activeStatus[index]}
                onChange={(checked) => handleToggleActive(checked, index)}
              />
            ),
          },
        ]}
        dataSource={data.map((item, index) => ({
          ...item,
          active: activeStatus[index],
        }))}
        rowSelection={{
          type: "checkbox",
        }}
        pagination={{
          position: ["none"],
        }}
        scroll={{ y: 280 }}
      />
    </div>
  );
};
export default Alarm;
