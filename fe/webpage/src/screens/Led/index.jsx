// Led.jsx

import './led.css';
import logoLed from '../../assets/images/ledIcon.png';
import React, { useState, useEffect, useRef } from 'react';
import { Button, Flex, Col, Row, Table, Switch, Spin, Modal } from 'antd';
import axios from 'axios';
import moment from 'moment';
import AddModal from '../../components/AddModal';
import EditModal from '../../components/EditModal';

const Led = () => {
  const [ledData, setLedData] = useState([]);
  const [activeStatus, setActiveStatus] = useState([]);
  const [buttonText, setButtonText] = useState("");
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
      dataIndex: 'deviceCode',
      title: 'deviceCode',
      render: (text, record) => <p>{text}</p>,
    },
    {
      dataIndex: 'deviceName',
      title: 'deviceName',
      render: (text) => <p>{text}</p>,
    },
    {
      dataIndex: 'actionStatus',
      title: 'actionStatus',
      render: (text) => (
        <p>{text == 2 ? 'Done' : text == 1 ? 'Active' : 'UnActive'}</p>
      ),
    },
    {
      dataIndex: 'title',
      title: 'title',
      render: (text, record) => <a href="/#">{record.title}</a>,
    },
    {
      dataIndex: 'time',
      title: 'time',
      render: (text) => moment(text).format('HH:mm DD/MM/YYYY'),
    },
    {
      dataIndex: 'createdDate',
      title: 'createdDate',
      render: (text) => moment(text).format('HH:mm DD/MM/YYYY'),
    },
    {
      dataIndex: 'updatedDate',
      title: 'updatedDate',
      render: (text) => moment(text).format('HH:mm DD/MM/YYYY'),
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
          deviceCode: 'led1',
          deviceName: 'đèn',
          actionStatus: 1,
          actionLog: 'ON',
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
      console.error('Error adding led:', error);
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
      await axios.patch(`http://localhost:8388/log-act/update/${values.id}`, {
        actionStatus: values.actionStatus,
        actionLog: 'ON',
        time: values.time,
        title: values.title,
      });
      fetchData();
      setIsModalVisible(false);
    } catch (error) {
      console.error('Error updating led:', error);
    }
  };

  useEffect(() => {
    // Connect to WebSocket server on ESP8266
    ws.current = new WebSocket('ws://192.168.146.115:8000/ws');

    // Set up WebSocket event listeners
    ws.current.onopen = () => {
      ws.current.send('Connected to WebSocket');
      console.log('Connected to WebSocket');
    };

    ws.current.onmessage = (event) => {
      // Nhận thông điệp từ server và chuyển đổi nó thành trạng thái buttonText
      const message = event.data;
      if (message === "ledStatus=ON" || message === "ledStatus=OFF") {
        setButtonText(message === "ledStatus=ON" ? "ON" : "OFF");
      }
    };

    // Cleanup function
    return () => {
      ws.current.close(); // Đóng kết nối WebSocket khi component bị unmount
    };
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        // "http://localhost:8388/log-act/?deviceCode=led"
        'http://localhost:8388/log-act/?deviceCode=led1'
      );
      // setLedData(response.data.content.items);
      setLedData(response.data);
      console.log(999, ledData);
      // console.log("",response.data.content.items);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const changeSwitch = async (id, checked) => {
    if (!id) return;
    // setActiveStatus(checked);
    console.log(activeStatus);
    try {
      // Gửi PATCH request để cập nhật actionStatus ngược lại hệ thống
      await axios.patch(`http://localhost:8388/log-act/update/${id}`, {
        actionStatus: checked ? 1 : 2, // Nếu checked là true thì actionStatus là 1, ngược lại là 2
      });
    } catch (error) {
      console.error(error);
    }
  };
  const changeStateClick = () => {
    // Gửi thông điệp đến WebSocket server dựa trên trạng thái hiện tại của buttonText
    const message = `led=${buttonText === "ON" ? "OFF" : "ON"}`;
    ws.current.send(message); // Gửi thông điệp tới WebSocket server
    setButtonText((prev) => prev === "ON" ? "OFF" : "ON"); // Cập nhật trạng thái của nút
  };

  return (
    <div className="boxled">
      <Flex>
        <div style={{ width: '50%', height: '150px' }}>
          <img
            alt="logoLed"
            style={{ width: '60%', margin: '10px' }}
            src={logoLed}
          />
        </div>
        <Row
          className="ledBtn"
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
            title="led History"
            open={historyModalVisible}
            onCancel={handleHistoryModalCancel}
            width={800}
            footer={null}
          >
            <Table
              columns={historyColumns}
              dataSource={ledData}
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
                onChange={(checked) => changeSwitch(record.id, checked)}
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

export default Led;



// import React, { useState, useEffect, useRef } from "react";
// import { dataUrl, fetchData, sendData } from "../../AxiosUtility";

// const Led = () => {
//   const [lightStatus, setLightStatus] = useState();
//   const [ledData, setLedData] = useState(false);

//   const ws = useRef(null);

//   useEffect(() => {
//     const fetchDataFromServer = async () => {
//       try {
//         const responseData = await fetchData(dataUrl);
//         console.log(222, responseData);
//         const sortLedData = responseData.content.items.sort(
//           (a, b) => new Date(b.time) - new Date(a.time)
//         );
//         var newData = [];
//         sortLedData.forEach((device) => {
//           if (device.deviceCode === "led1") {
//             newData.push(device);
//           }
//         });
//         setLedData(newData);
//         // console.log(111, newData);
//         // responseData.items.forEach((command) => {
//         //   if (command.deviceCode === "led1") {
//         //     setLightStatus(command.actionStatus === "ON");
//         //   }
//         // });
//       } catch (error) {
//         console.error(error.message);
//       }
//     };

//     fetchDataFromServer();
//     // Connect to WebSocket server on ESP8266
//     ws.current = new WebSocket("ws://192.168.146.115:8000/ws");

//     // Set up WebSocket event listeners
//     ws.current.onopen = () => {
//       console.log("Connected to WebSocket");
//     };

//     ws.current.onmessage = (event) => {
//       console.log("Message from server:", event.data);
//     };

//     ws.current.onclose = () => {
//       console.log("Disconnected from WebSocket");
//     };

//     // Clean up WebSocket connection on component unmount
//     return () => {
//       ws.current.close();
//     };
//   }, [lightStatus]);
//   const toggleLight = async () => {
//     // Check if WebSocket connection is open before sending a message
//     if (ws.current.readyState === WebSocket.OPEN) {
//       // Send a "toggle" message to the WebSocket server
//       // Update the logic based on your requirements
//       ws.current.send("toggle");

//       // const currentTime = new Date()("en-US", {
//       //   timeZone: "Asia/Ho_Chi_Minh",
//       // });
//       const currentTime = new Date();

//       // Lấy thông tin ngày và giờ từ đối tượng Date
//       const year = currentTime.getFullYear();
//       const month = String(currentTime.getMonth() + 1).padStart(2, "0"); // Thêm '0' phía trước nếu tháng < 10
//       const day = String(currentTime.getDate()).padStart(2, "0"); // Thêm '0' phía trước nếu ngày < 10
//       const hours = String(currentTime.getHours()).padStart(2, "0");
//       const minutes = String(currentTime.getMinutes()).padStart(2, "0");
//       const seconds = String(currentTime.getSeconds()).padStart(2, "0");

//       // Tạo chuỗi theo định dạng mong muốn
//       const formattedDateTime = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;

//       console.log("formattedDateTime", formattedDateTime);

//       const newCommandData = {
//         deviceCode: "led1",
//         deviceName: "đèn",
//         actionStatus: 2,
//         actionLog: lightStatus ? "ON" : "OFF",
//         time: currentTime,
//       };

//       // Send the new command to the server
//       await fetch("http://localhost:8388/log-act/", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(newCommandData),
//       });
//     }
//     setLightStatus(!lightStatus);
//   };
//   const formatDateTime = (isoDateString) => {
//     const isoDate = new Date(isoDateString);

//     // Lấy thông tin ngày và giờ từ đối tượng Date
//     const day = isoDate.getDate();
//     const month = isoDate.getMonth() + 1; // Thêm 1 vì tháng bắt đầu từ 0
//     const year = isoDate.getFullYear();
//     const hours = isoDate.getHours();
//     const minutes = isoDate.getMinutes();
//     const seconds = isoDate.getSeconds();

//     // Tạo chuỗi theo định dạng mong muốn
//     const formattedDateTime = `${
//       (hours + 7) % 24
//     }:${minutes}:${seconds} - ${day}/${month}/${year}`;

//     return formattedDateTime;
//   };

//   return (
//     <div>
//       <h1>Light Control</h1>
//       <p>Light is {lightStatus ? "off" : "on"}</p>
//       <button onClick={toggleLight}>Toggle Light</button>
//       <ul
//         style={{
//           overflowY: "auto",
//         }}
//       >
//         {ledData ? (
//           ledData.map((data, index) => (
//             <li key={index}>{`${formatDateTime(data.time)} - ${
//               data.actionLog
//             }`}</li>
//           ))
//         ) : (
//           <li>No data available</li>
//         )}
//       </ul>
//     </div>
//   );
// };

// export default Led;
