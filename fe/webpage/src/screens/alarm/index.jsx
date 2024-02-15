import "./alarm.css";
import logoAlarm from "../../assets/images/alarmIcon.png";
import React, { useState, useEffect, useRef } from "react";
import { Button, Flex, Col, Row, Table, Switch, Spin } from "antd";
import axios from "axios";
import moment from "moment";

const columns = [
  {
    // title: "Name",
    dataIndex: "name",
    render: (text, record) => <a href="/#">{record.title}</a>,
  },
  {
    // title: "Time",
    dataIndex: "time",
    render: (text) => moment(text).format("HH:mm DD/MM/YYYY"),
  },
  {
    // title: "Options",
    dataIndex: "options",
  },
];

const Alarm = () => {
  const [alarmData, setAlarmData] = useState([]);
  const [activeStatus, setActiveStatus] = useState([]);
  const [buttonText, setButtonText] = useState();
  const [espMessage, setEspMessage] = useState();
  const [loading, setLoading] = useState(true);
  const ws = useRef(null);

  useEffect(() => {
    // Connect to WebSocket server on ESP8266
    ws.current = new WebSocket("ws://172.20.10.13:81");

    // Set up WebSocket event listeners
    ws.current.onopen = () => {
      console.log("Connected to WebSocket");
    };

    ws.current.onmessage = (event) => {
      setEspMessage(event.dataF);
      console.log("Message from server:", event.data);
    };
  }, [espMessage]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8388/log-act?deviceCode=oclock"
      );
      setAlarmData(response.data);
      setActiveStatus(response.data.map(() => true));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleToggleActive = (checked, index) => {
    setActiveStatus((prevStatus) => {
      const newStatus = [...prevStatus];
      newStatus[index] = checked;
      return newStatus;
    });
  };

  const handleToggleONOFF = async () => {
    try {
      // Lọc những lệnh trong alarmData có actionStatus là 1 và time > current time
      const filteredCommands = alarmData.filter(
        (command) =>
          command.actionStatus === 1 && moment(command.time).isAfter(moment())
      );

      if (filteredCommands.length > 0) {
        // Track thời gian của lệnh gần nhất
        const nearestCommand = filteredCommands.sort((a, b) =>
          moment(a.time).diff(moment(b.time))
        )[0];

        // Thay trạng thái actionLog của tất cả các lệnh thành ON và thay đổi actionStatus của lệnh đó thành 2
        const updatedAlarmData = alarmData.map((command) => {
          if (command.id === nearestCommand.id) {
            return {
              ...command,
              actionStatus: 2,
              actionLog: buttonText === "ON" ? "OFF" : "ON",
            };
          } else {
            return {
              ...command,
              actionLog: buttonText === "ON" ? "OFF" : "ON",
            };
          }
        });

        setAlarmData(updatedAlarmData);

        // Gọi API để tạo một lệnh mới trong dữ liệu lưu trữ với actionStatus là 2
        await axios.post("http://localhost:8388/log-act", {
          deviceCode: nearestCommand.deviceCode,
          deviceName: nearestCommand.deviceName,
          actionStatus: 2,
          actionLog: buttonText === "ON" ? "OFF" : "ON",
          time: moment().toISOString(),
          createdDate: moment().toISOString(),
          updatedDate: moment().toISOString(),
          title: "Ấn nút trên web",
        });

        // Sau khi gửi yêu cầu thành công, cập nhật lại dữ liệu bằng cách gọi fetchData
        fetchData();
      }
    } catch (error) {
      console.error("Error toggling ON/OFF:", error);
    }
  };

  useEffect(() => {
    if (espMessage) {
      // Kiểm tra xem espMessage đã được khởi tạo chưa
      const messages = espMessage.split("=");
      const device = messages[0];
      const status = messages[1];
      if (device === "oclock") {
        setButtonText(status === "ON" ? "ON" : "OFF");
      }
    }
  }, [espMessage]);

  return (
    <div className="boxAlarm">
      <Flex>
        <div style={{ width: "50%", height: "150px" }}>
          <img
            alt="logoAlarm"
            style={{ width: "60%", margin: "10px" }}
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
            {loading ? ( // Kiểm tra trạng thái loading trước khi hiển thị nút
              <Spin />
            ) : (
              <Button type="primary" size="large" onClick={handleToggleONOFF}>
                {buttonText}
              </Button>
            )}
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
                key={record.key} // Thêm key ở đây
                checked={activeStatus[index]}
                onChange={(checked) => handleToggleActive(checked, index)}
              />
            ),
          },
        ]}
        dataSource={alarmData.map((item, index) => ({
          ...item,
          active: activeStatus[index],
          key: item.id, // Sử dụng một trường duy nhất trong dữ liệu làm key
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
