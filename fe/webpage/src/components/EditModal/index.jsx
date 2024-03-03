import { Modal, Form, Input, Switch, DatePicker, Radio } from "antd";
import { useState, useEffect } from "react";
import dayjs from "dayjs";

const EditModal = ({ visible, initialValues, onUpdate, onCancel }) => {
  const [form] = Form.useForm();
  const [currentInitialValues, setCurrentInitialValues] =
    useState(initialValues);
  const [actionStatus, setActionStatus] = useState(initialValues.actionStatus);
  const [actionLog, setActionLog] = useState(initialValues.actionLog);

  useEffect(() => {
    if (visible && initialValues) {
      initialValues.time = dayjs(initialValues.time);
      setCurrentInitialValues(initialValues);
      form.setFieldsValue(initialValues);
      setActionStatus(initialValues.actionStatus);
    }
  }, [visible, initialValues]);

  const handleUpdate = async (values) => {
    values.actionLog = actionLog;
    values.id = initialValues.id;
    values.deviceName = initialValues.deviceName;
    values.deviceCode = initialValues.deviceCode;
    values.time = values.time.format("YYYY-MM-DDTHH:mm:ss");
    console.log(222, values);
    onUpdate(values);
  };

  const handleSwitchChange = (checked) => {
    // Set actionStatus value based on the checked state of the switch
    setActionStatus(checked ? 1 : 2);
  };
  const handleChoose = (checked) => {
    console.log(checked.target.value);
    setActionLog(checked.target.value);
    // console.log(111, actionLog);
  };

  return (
    <Modal
      open={visible}
      title="Edit Device"
      okText="Save"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={() => {
        form.validateFields().then((values) => {
          // Add actionStatus value to the values object before updating
          values.actionStatus = actionStatus;
          form.resetFields();
          handleUpdate(values);
        });
      }}
    >
      <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
        initialValues={currentInitialValues}
      >
        <Form.Item name="title" label="Title" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item
          name="time"
          label="Time"
          rules={[{ required: true, message: "Please select time" }]}
        >
          <DatePicker
            style={{ width: "100%" }}
            format="YYYY-MM-DD HH:mm:ss"
            showTime
          />
        </Form.Item>
        <Form.Item
          name="actionStatus"
          label="Status"
          initialValue={initialValues.actionStatus}
        >
          <Switch
            checkedChildren="ON"
            unCheckedChildren="OFF"
            onChange={handleSwitchChange}
            checked={actionStatus === 1}
          ></Switch>
        </Form.Item>
        <Form.Item>
          <Radio.Group
            onChange={handleChoose}
            defaultValue={initialValues.actionLog}
            disabled={initialValues.deviceCode === "oclock"}
          >
            <Radio value={"ON"}>Thiết bị Mở</Radio>
            <Radio value={"OFF"}>Thiết bị Đóng</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditModal;
