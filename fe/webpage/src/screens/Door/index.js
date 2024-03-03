import './door.css';
import logoDoor from '../../assets/images/doorIcon.jpg';
import React, { useState, useEffect, useRef } from 'react';
import { Button, Flex, Col, Row, Table, Switch, Spin, Modal } from 'antd';
import axios from 'axios';
import moment from 'moment';
import AddModal from '../../components/AddModal';
import EditModal from '../../components/EditModal';
import URL from '../../components/GlobalConst/globalconst';
import globalSignal from '../../components/GlobalConst/GlobalSignal';

const Door = ({ textDoor, setMessage, sendData }) => {
  const [doorData, setDoorData] = useState([]);
  const [activeStatus, setActiveStatus] = useState([]);
  const [buttonText, setButtonText] = useState(textDoor);
  const [espMessage, setEspMessage] = useState();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const ws = useRef(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [historyModalVisible, setHistoryModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const columns = [
    {
      dataIndex: 'title',
      render: (text, record) => (
        <a href="/#" onClick={() => showEditModal(record)}>
          {record.title}
        </a>
      ),
    },
    {
      dataIndex: 'time',
      render: (text) => moment(text).format('HH:mm DD/MM/YYYY'),
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
        console.log(text),
        <p>{text === 'OFF' ? "Close" : "Open"}</p>
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
    console.log(record);

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
      // Lặp qua mỗi giá trị thời gian trong mảng values.time
      for (const timeValue of values.time) {
        const timeISO = new Date(timeValue).toISOString();
        newArray.push({
          ...values,
          deviceCode: 'door',
          deviceName: 'Cửa',
          actionStatus: 1,
          actionLog: values.actionLog,
          time: timeISO,
        });
      }
      console.log(22, newArray);
      // Chuyển đổi thời gian sang định dạng ISO 8601

      // Gửi yêu cầu POST để thêm dữ liệu mới
      await axios.post(
        'http://localhost:8388/log-act/create-multiple',
        newArray
      );

      // console.log("Request sent for time:", );

      // Sau khi thêm thành công, tải lại dữ liệu
      fetchData();
      setIsModalVisible(false);
    } catch (error) {
      console.error('Error adding door:', error);
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
      await axios.patch(
        'http://localhost:8388/log-act/delete-multiple',
        selectedIDs
      );

      // Nếu thành công, làm mới dữ liệu để cập nhật giao diện
      fetchData();
      // Xóa các mục đã chọn khỏi selectedRowKeys
      setSelectedRowKeys([]);
    } catch (error) {
      console.error('Error deleting items:', error);
    }
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
      console.error('Error updating door:', error);
    }
  };


  useEffect(() => {
    setButtonText(textDoor);
  }, [textDoor]);

  // useEffect(() => {
  //   // Connect to WebSocket server on ESP8266
  //   ws.current = new WebSocket(URL);

  //   // Set up WebSocket event listeners
  //   ws.current.onopen = () => {
  //     ws.current.send('Connected to WebSocket');
  //     console.log('Connected to WebSocket');
  //   };

  //   ws.current.onmessage = (event) => {
  //     // Nhận thông điệp từ server và chuyển đổi nó thành trạng thái buttonText
  //     const message = event.data;
  //     if (message === "DOORStatus_ON" || message === "DOORStatus_OFF") {
  //       setButtonText(message === "DOORStatus_ON" ? "ON" : "OFF");
  //     }
  //   };

  //   // Cleanup function
  //   return () => {
  //     ws.current.close(); // Đóng kết nối WebSocket khi component bị unmount
  //   };
  // }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        // "http://localhost:8388/log-act/?deviceCode=oclock"
        'http://localhost:8388/log-act/?deviceCode=door'
      );
      setDoorData(response.data.content.items);
      sendData(response.data.content.items);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const changeSwitch = async (record, checked) => {
    if (!record.id) return;
    // setActiveStatus(checked);
    // console.log(activeStatus);
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
    // Gửi thông điệp đến WebSocket server dựa trên trạng thái hiện tại của buttonText
    const message = `DOOR_${buttonText === "ON" ? "OFF" : "ON"}`;
    globalSignal.messageSignal.dispatch(message);
    // setMessage(message)
    // ws.current.send(message);
  };

  return (
    <div className="boxdoor">
      <Flex>
        <div style={{ width: '50%', height: '150px' }}>
          <img
            alt="logoDoor"
            style={{ width: '60%', margin: '10px' }}
            src={logoDoor}
          />
        </div>
        <Row
          className="doorBtn"
          gutter={[10, 0]}
          justify="space-around"
          align="middle"
          style={{ width: '50%', height: '150px' }}
        >
          <Col>
            <Button type="primary" size="large" disabled={!buttonText} onClick={changeStateClick}>
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
            title="door History"
            open={historyModalVisible}
            onCancel={handleHistoryModalCancel}
            width={1000}
            footer={null}
          >
            <Table
              columns={historyColumns}
              dataSource={doorData}
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
            dataIndex: 'active',
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
        dataSource={doorData
          .filter((item) => item.actionStatus !== 0)
          .map((item) => ({
            ...item,
            key: item.id,
          }))}
        rowSelection={{
          type: 'checkbox',
          onChange: handleRowSelectionChange,
        }}
        pagination={{
          position: ['none'],
        }}
        scroll={{ y: 280 }}
      />
    </div>
  );
};

export default Door;
