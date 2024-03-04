import { Modal, Form, Input, Space, DatePicker, Checkbox, Radio } from "antd";
import dayjs, { Dayjs } from "dayjs";
import axios from "axios";
import { useEffect, useState } from "react";
const CheckboxGroup = Checkbox.Group;
const plainOptions = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
const defaultCheckedList = [];
const { RangePicker } = DatePicker;

const disabledDate = (current) => {
  // Can not select days before today and today
  return current && current < dayjs().endOf("day");
};

const AddModal = ({ visible, onCreate, onCancel }) => {
  const [changeTime, setChangeTime] = useState();
  const [form] = Form.useForm();
  const [checkedList, setCheckedList] = useState(defaultCheckedList);
  const checkAll = plainOptions.length === checkedList.length;
  const indeterminate =
    checkedList.length > 0 && checkedList.length < plainOptions.length;
  const [actionLog, setActionLog] = useState();

  useEffect(() => {
    if (visible) {
      form.setFieldsValue();
    }
  }, [visible]);

  const onChange = (list) => {
    setCheckedList(list);
    console.log(555, checkedList);
  };
  const onCheckAllChange = (e) => {
    setCheckedList(e.target.checked ? plainOptions : []);
  };
  const onChangeTime = (time: Dayjs) => {
    setChangeTime(time);
  };
  const showtime = () => {};
  const getDaysInWeekWithinRange = (DayOfWeek, startTime, endTime) => {
    const daysInWeek = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
    const daysInRange = [];

    const startDate = new Date(startTime);
    const endDate = new Date(endTime);

    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dayOfWeek = daysInWeek[currentDate.getDay()];
      if (DayOfWeek.includes(dayOfWeek)) {
        daysInRange.push(new Date(currentDate));
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return daysInRange;
  };

  const renderDatePicker = () => {
    if (checkedList.length === 0) {
      return (
        <DatePicker
          showTime={{ format: "HH:mm:ss" }}
          format="YYYY-MM-DD HH:mm:ss"
          style={{ width: "100%" }}
        />
      );
    } else {
      return (
        <Space direction="vertical" size={12}>
          <RangePicker
            disabledDate={disabledDate}
            format="YYYY-MM-DD HH:mm:ss"
            onChange={onChangeTime}
            showTime={showtime}
          />
        </Space>
      );
    }
  };

  const handleCreate = async (values) => {
    let results = [];
    if (checkedList.length === 0) {
      // If alarm not repeated, add the selected time
      if (values.time) {
        results.push(values.time.format("YYYY-MM-DD HH:mm:ss"));
      }
    } else {
      // If alarm repeated, add the selected time for each selected day
      console.log(666, values, changeTime);
      results = getDaysInWeekWithinRange(
        checkedList,
        changeTime[0],
        changeTime[1]
      );
      // console.log(777, { ...values, time: results});
    }
    // Call onCreate
    onCreate({ ...values, time: results, actionLog: actionLog });
    // console.log(555, { ...values, time: results });
  };

  const handleChoose = (checked) => {
    console.log(98479, checked.target.value);
    setActionLog(checked.target.value);
    // console.log(111, actionLog);
  };

  return (
    <Modal
      open={visible}
      title="Add Device"
      okText="Add"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields();
            handleCreate(values);
          })
          .catch((err) => console.error(err));
      }}
    >
      <Form form={form} layout="vertical" name="form_in_modal">
        <Form.Item name="title" label="Title" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item>
          <Checkbox
            indeterminate={indeterminate}
            onChange={onCheckAllChange}
            checked={checkAll}
          >
            Hằng Ngày
          </Checkbox>
          <br />
          <CheckboxGroup
            options={plainOptions}
            value={checkedList}
            onChange={onChange}
          />
        </Form.Item>
        <Form.Item
          name="time"
          label="Time"
          rules={[
            {
              required: checkedList.length === 0,
              message: "Please select time",
            },
          ]}
        >
          {renderDatePicker()}
        </Form.Item>
        <Form.Item>
          <Radio.Group
            onChange={handleChoose}
            defaultValue={1}
            // disabled={deviceCode === "oclock"}
          >
            <Radio value={"ON"} defaultChecked>
              Thiết bị Mở
            </Radio>
            <Radio value={"OFF"}>Thiết bị Đóng</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddModal;
