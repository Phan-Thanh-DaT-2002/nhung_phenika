// Led.jsx

import "./led.css";
import logoLed from "../../assets/images/ledIcon.png";
import React, { useState, useEffect, useRef } from "react";
import { Button, Flex, Col, Row, Table, Switch, Spin, Modal } from "antd";
import axios from "axios";
import moment from "moment";
import AddModal from "../../components/AddModal";
import EditModal from "../../components/EditModal";
import dayjs from "dayjs";
import globalSignal from "../../components/GlobalConst/GlobalSignal";

const Led = ({ textLed, sendData }) => {
  const [ledData, setLedData] = useState([]);
  const [ledDataHistory, setLedDataHistory] = useState([]);
  const [buttonText, setButtonText] = useState(textLed);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [historyModalVisible, setHistoryModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const isMounted = useRef(false);

  const columns = [
    {
      dataIndex: "title",
      render: (text, record) => (
        <a href="/#" onClick={() => showEditModal(record)}>
          {record.title}
        </a>
      ),
    },
    {
      dataIndex: "time",
      render: (text) => moment(text).format("HH:mm DD/MM/YYYY"),
    },
  ];
  const historyColumns = [
    {
      dataIndex: "deviceCode",
      title: "deviceCode",
      render: (text, record) => <p>{text}</p>,
    },
    {
      dataIndex: "deviceName",
      title: "deviceName",
      render: (text) => <p>{text}</p>,
    },
    {
      dataIndex: "actionStatus",
      title: "actionStatus",
      render: (text) => (
        <p>{text === 2 ? "UnActive" : text === 1 ? "Active" : "Deleted"}</p>
      ),
    },
    {
      dataIndex: "actionLog",
      title: "actionLog",
      render: (text) => (
        console.log(text), (<p>{text === "OFF" ? "Light OFF" : "Light ON"}</p>)
      ),
    },
    {
      dataIndex: "title",
      title: "title",
      render: (text, record) => <a href="/#">{record.title}</a>,
    },
    {
      dataIndex: "time",
      title: "time",
      render: (text) => moment(text).format("HH:mm DD/MM/YYYY"),
    },
    {
      dataIndex: "createdDate",
      title: "createdDate",
      render: (text) => moment(text).format("HH:mm DD/MM/YYYY"),
    },
    {
      dataIndex: "updatedDate",
      title: "updatedDate",
      render: (text) => moment(text).format("HH:mm DD/MM/YYYY"),
    },
  ];
  const showHistoryModal = () => {
    searchAll();
    setHistoryModalVisible(true);
  };

  const handleHistoryModalCancel = () => {
    setHistoryModalVisible(false);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const showEditModal = (record) => {
    setSelectedRecord(record);
    // console.log(record);

    setEditModalVisible(true);
  };

  const handleEditModalCancel = () => {
    setEditModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleCreate = async (values) => {
    try {
      console.log(999, values);
      var newArray = [];
      // Loop through each time value in the values.time array
      for (const timeValue of values.time) {
        const date = new Date(timeValue);

        // Adjust the time to the UTC+7 timezone
        const adjustedTime = new Date(
          date.getTime() + date.getTimezoneOffset() * 60000 + 7 * 60 * 60 * 1000
        );

        // Manually build the formatted time string
        const year = adjustedTime.getFullYear();
        const month = String(adjustedTime.getMonth() + 1).padStart(2, "0");
        const day = String(adjustedTime.getDate()).padStart(2, "0");
        const hours = String(adjustedTime.getHours()).padStart(2, "0");
        const minutes = String(adjustedTime.getMinutes()).padStart(2, "0");
        const seconds = String(adjustedTime.getSeconds()).padStart(2, "0");

        const timeFormatted = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;

        newArray.push({
          ...values,
          deviceCode: "led1",
          actionStatus: 1,
          actionLog: values.actionLog,
          time: timeFormatted,
        });
      }
      console.log(22, newArray);
      // Chuyển đổi thời gian sang định dạng ISO 8601

      // Gửi yêu cầu POST để thêm dữ liệu mới
      await axios.post(
        "http://localhost:8388/log-act/create-multiple",
        newArray
      );
      // Sau khi thêm thành công, tải lại dữ liệu
      fetchData();
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error adding led:", error);
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
      // console.log(666, selectedIDs);
      // Gọi API PATCH để sửa actionStatus của các ID đã chọn thành 2
      await axios.patch(
        "http://localhost:8388/log-act/delete-multiple",
        selectedIDs
      );

      // Nếu thành công, làm mới dữ liệu để cập nhật giao diện
      fetchData();
      // Xóa các mục đã chọn khỏi selectedRowKeys
      setSelectedRowKeys([]);
    } catch (error) {
      console.error("Error deleting items:", error);
    }
    // fetchData();
  };
  const handleUpdate = async (values) => {
    setEditModalVisible(false);
    try {
      console.log(999, values);
      await axios.put(`http://localhost:8388/log-act/edit`, {
        id: values.id,
        deviceCode: values.deviceCode,
        deviceName: values.deviceName,
        actionStatus: values.actionStatus,
        actionLog: values.actionLog,
        time: values.time,
        title: values.title,
      });
      fetchData();
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error updating led:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatTime = (date) => {
    // Adjust the time to the UTC+7 timezone
    const adjustedTime = new Date(
      date.getTime() + date.getTimezoneOffset() * 60000 + 7 * 60 * 60 * 1000
    );

    // Manually build the formatted time string
    const year = adjustedTime.getFullYear();
    const month = String(adjustedTime.getMonth() + 1).padStart(2, "0");
    const day = String(adjustedTime.getDate()).padStart(2, "0");
    const hours = String(adjustedTime.getHours()).padStart(2, "0");
    const minutes = String(adjustedTime.getMinutes()).padStart(2, "0");
    const seconds = String(adjustedTime.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  };

  useEffect(() => {
    try {
      const day = new Date().getTime();

      // Manually format the time to the desired string
      const formattedTime = formatTime(new Date(day));

      const newCommand = async () => {
        const res = await axios.post("http://localhost:8388/log-act/", {
          deviceCode: "led1",
          deviceName: "đèn",
          actionStatus: 0,
          actionLog: textLed,
          time: formattedTime,
          title: "Now",
        });
        // console.log(res);
        if (res.data.code === "3") {
          await axios.patch(`http://localhost:8388/log-act/delete-multiple`, [
            ledData[0].id,
          ]);
          // console.log(ledData[0]);
          fetchData();
        }
      };

      // Chỉ gọi newCommand khi textLed thay đổi
      if (isMounted.current && textLed !== buttonText) {
        newCommand();
        setButtonText(textLed);
      } else {
        isMounted.current = true;
      }
    } catch (error) {
      console.log(error);
    }
  }, [textLed, buttonText]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        // "http://localhost:8388/log-act/?deviceCode=led"
        "http://localhost:8388/log-act/?deviceCode=led1"
      );
      // console.log(response);
      if (response.data.code === "0") {
        setLedData(response.data.content.items);
        sendData(response.data.content.items);
      } else if (response.data.code === "2") setLedData([]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const changeSwitch = async (record, checked) => {
    console.log(555, record);
    if (!record.id) return;
    try {
      // Gửi PATCH request để cập nhật actionStatus ngược lại hệ thống
      await axios.put(`http://localhost:8388/log-act/edit`, {
        id: record.id,
        deviceCode: record.deviceCode,
        deviceName: record.deviceName,
        actionStatus: checked ? 1 : 2,
        actionLog: record.actionLog,
        time: record.time,
        title: record.title,
      });
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };
  const changeStateClick = () => {
    const message = `LED_${buttonText === "ON" ? "OFF" : "ON"}`;
    globalSignal.messageSignal.dispatch(message);
  };
  const searchAll = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8388/log-act/searchAll/?deviceCode=led1"
      );
      setLedDataHistory(response.data.content.items);
    } catch (e) {}
  };

  const handleDeleteById = async (id) => {
    try {
      // Gọi API PATCH để sửa actionStatus của ID thành 2
      await axios.patch(`http://localhost:8388/log-act/delete-multiple`, [id]);

      // Nếu thành công, làm mới dữ liệu để cập nhật giao diện
      console.log(id);

      fetchData();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleDeviceSignal = ({ id, type }) => {
    console.log(id, type);
    if (type === "LED") {
      handleDeleteById(id);
    }
  };

  useEffect(() => {
    const deviceSignalListener = ({ id, type }) => {
      handleDeviceSignal({ id, type });
    };

    globalSignal.deviceSignal.add(deviceSignalListener);

    // Cleanup function
    return () => {
      globalSignal.deviceSignal.remove(deviceSignalListener);
    };
  }, [fetchData]);

  return (
    <div className="boxLed">
      <Flex>
        <div style={{ width: "50%", height: "150px" }}>
          <img
            alt="logoLed"
            style={{
              width: "60%",
              margin: "10px",
              filter: buttonText === "OFF" ? "grayscale(100%)" : "none",
            }}
            src={logoLed}
          />
        </div>
        <Row
          className="ledBtn"
          gutter={[10, 0]}
          justify="space-around"
          align="middle"
          style={{ width: "50%", height: "150px" }}
        >
          <Col>
            <Button
              type="primary"
              size="large"
              disabled={!buttonText}
              onClick={changeStateClick}
              style={{
                backgroundColor: buttonText === "ON" ? "#73d13d" : "#f5222d",
              }}
            >
              {buttonText}
            </Button>
          </Col>
          <EditModal
            visible={editModalVisible}
            initialValues={selectedRecord || {}}
            onUpdate={handleUpdate}
            onCancel={handleEditModalCancel}
          />
          <Col>
            <Button type="primary" size="large" onClick={showHistoryModal}>
              History
            </Button>
          </Col>
          <Modal
            title="led History"
            open={historyModalVisible}
            onCancel={handleHistoryModalCancel}
            width={1000}
            footer={null}
          >
            <Table
              columns={historyColumns}
              dataSource={ledDataHistory}
              pagination={{ pageSize: 5 }}
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
                checkedChildren="ON"
                unCheckedChildren="OFF"
                checked={record.actionStatus === 1}
                onChange={(checked) => changeSwitch(record, checked)}
              />
            ),
          },
        ]}
        dataSource={ledData
          .filter((item) => item.actionStatus !== 0)
          .map((item) => ({
            ...item,
            key: item.id,
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

export default Led;
