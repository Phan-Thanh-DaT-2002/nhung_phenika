import "./alarm.css";
import logoAlarm from "../../assets/images/alarmIcon.png";
import React, { useState, useEffect, useRef } from "react";
import { Button, Flex, Col, Row, Table, Switch, Spin, Modal } from "antd";
import axios from "axios";
import moment from "moment";
import AddModal from "../../components/AddModal";

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
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const ws = useRef(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [historyModalVisible, setHistoryModalVisible] = useState(false);

  // Hàm hiển thị pop-up
  const showHistoryModal = () => {
    setHistoryModalVisible(true);
  };

  // Hàm đóng pop-up
  const handleHistoryModalCancel = () => {
    setHistoryModalVisible(false);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleCreate = async (values) => {
    try {
      // console.log(999, values);
  
      // Lặp qua mỗi giá trị thời gian trong mảng values.time
      for (const timeValue of values.time) {
        // Chuyển đổi thời gian sang định dạng ISO 8601
        const timeISO = new Date(timeValue).toISOString();
  
        // Gửi yêu cầu POST để thêm dữ liệu mới
        await axios.post("http://localhost:8388/log-act", {
          ...values,
          deviceCode: "oclock",
          deviceName: "Đồng hồ",
          actionStatus: 1,
          actionLog: "ON",
          time: timeISO,
          createdDate: moment().toISOString(),
          updatedDate: moment().toISOString(),
        });
  
        console.log("Request sent for time:", timeValue);
      }
  
      // Sau khi thêm thành công, tải lại dữ liệu
      fetchData();
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error adding alarm:", error);
    }
  };
  
  const handleRowSelectionChange = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys);
    console.log(555, selectedRowKeys);
  };

  const handleDelete = async () => {
    try {
      // Thu thập các ID của các mục đã chọn
      const selectedIDs = selectedRowKeys;
      console.log(666, selectedIDs);
  
      // Gọi API PATCH để sửa actionStatus của các ID đã chọn thành 2
      await axios.patch("http://localhost:8388/log-act", {
        ids: selectedIDs,
        actionStatus: 2
      });
  
      // Nếu thành công, làm mới dữ liệu để cập nhật giao diện
      fetchData();
      // Xóa các mục đã chọn khỏi selectedRowKeys
      setSelectedRowKeys([]);
    } catch (error) {
      console.error("Error deleting items:", error);
    }
  };

  useEffect(() => {
    // Connect to WebSocket server on ESP8266
    ws.current = new WebSocket("ws://192.168.1.178:81");

    // Set up WebSocket event listeners
    ws.current.onopen = () => {
      console.log("Connected to WebSocket");
    };

    ws.current.onmessage = (event) => {
      setEspMessage(event.data);
      console.log("Message from server:", event.data);
    };
  }, []);

  useEffect(() => {
    fetchData();
    // console.log(2222, alarmData);
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
    console.log(111, activeStatus);
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
              actionLog: "ON",
            };
          }
        });

        setAlarmData(updatedAlarmData);

        // Gọi API để tạo một lệnh mới trong dữ liệu lưu trữ với actionStatus là 2
        await axios.post("http://localhost:8388/log-act", {
          deviceCode: nearestCommand.deviceCode,
          deviceName: nearestCommand.deviceName,
          actionStatus: 2,
          actionLog: "ON",
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
      console.log(espMessage);

      // Kiểm tra xem espMessage đã được khởi tạo chưa
      const messages = espMessage.split("=");
      const device = messages[0];
      const status = messages[1];
      if (device === "oclock") {
        setButtonText(status === "ON" ? "ON" : "OFF");
        setLoading(false);
      }
      console.log(device);
      console.log(status);
    }
  }, [espMessage]);

  return (
    <div className="boxAlarm" style={{ backgroundColor: "#fff" }}>
      <Flex>
        <div style={{ width: "15vw", height: "15vh" }}>
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
            <Button type="primary" size="large" onClick={showHistoryModal}>
              History
            </Button>
          </Col>
          <Modal
            title="Alarm History"
            visible={historyModalVisible}
            onCancel={handleHistoryModalCancel}
            footer={null} // Không hiển thị footer
          >
            <Table
              columns={columns} // columns bạn đã định nghĩa trước đó
              dataSource={alarmData} // alarmData là dữ liệu bạn muốn hiển thị
              pagination={false} // Tắt phân trang
            />
          </Modal>
          <Col>
            <Button type="primary" size="large" onClick={showModal}>
              Add
            </Button>
          </Col>
          <AddModal
            visible={isModalVisible}
            onCreate={handleCreate}
            onCancel={handleCancel}
          />
          <Col>
            <Button type="primary" size="large" onClick={handleDelete}>
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
        dataSource={alarmData.filter(item => item.actionStatus === 1).map((item, index) => ({
          ...item,
          active: activeStatus[index],
          key: item.id, // Sử dụng một trường duy nhất trong dữ liệu làm key
        }))}  
        rowSelection={{
          type: "checkbox",
          onChange: handleRowSelectionChange,
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
