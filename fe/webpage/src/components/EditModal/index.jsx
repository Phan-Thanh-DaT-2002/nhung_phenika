import { Modal, Form, Input, Switch, DatePicker } from 'antd';
import { useState, useEffect } from 'react';
import moment from 'moment';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

const EditModal = ({ visible, initialValues, onUpdate, onCancel }) => {
  const [form] = Form.useForm();
  const [currentInitialValues, setCurrentInitialValues] =
    useState(initialValues);
  const [actionStatus, setActionStatus] = useState(initialValues.actionStatus);

  useEffect(() => {
    if (visible && initialValues) {
      initialValues.time = dayjs(initialValues.time);
      setCurrentInitialValues(initialValues);
      form.setFieldsValue(initialValues);
      setActionStatus(initialValues.actionStatus);
    }
  }, [visible, initialValues]);

  const handleUpdate = async (values) => {
    values.id = initialValues.id;
    values.time = values.time.format('YYYY-MM-DD HH:mm:ss');
    console.log(222, values);
    onUpdate(values);
  };

  const handleSwitchChange = (checked) => {
    // Set actionStatus value based on the checked state of the switch
    setActionStatus(checked ? 1 : 2);
  };

  return (
    <Modal
      visible={visible}
      title="Edit Alarm"
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
          rules={[{ required: true, message: 'Please select time' }]}
        >
          <DatePicker
            style={{ width: '100%' }}
            format="YYYY-MM-DD HH:mm:ss"
            showTime
          />
        </Form.Item>
        <Form.Item
          name="actionStatus"
          label="On/Off"
          initialValue={initialValues.actionStatus}
        >
          <Switch
            checkedChildren="ON"
            unCheckedChildren="OFF"
            onChange={handleSwitchChange}
            checked={actionStatus === 1}
          ></Switch>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditModal;
