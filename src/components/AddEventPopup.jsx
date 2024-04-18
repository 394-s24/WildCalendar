import React, { useState } from "react";
import { Modal, Form, DatePicker, Input, TimePicker, Checkbox } from "antd";
import { Button } from "@/components/Button";
import { PlusOutlined } from "@ant-design/icons";

const dateTimeFormat = "YYYY-MM-DD HH:mm";

const uuid = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

const AddEventButtonPopup = ({ open, setOpen, calendarRef, buttonType }) => {
  const [form] = Form.useForm();
  const [recur, setRecur] = useState(false)

  const showModal = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    form.resetFields();
    setOpen(false);
  };

  const onClosingCompletely = () => {
    form.resetFields();
  };

  const handleOk = (fieldsValue) => {
    let newId = uuid();
    let values = {
      title: fieldsValue["title"],
      start: fieldsValue["date-picker"]
        .clone()
        .hour(fieldsValue["time-picker"][0].hour())
        .minute(fieldsValue["time-picker"][0].minute())
        .format(dateTimeFormat),
      end: fieldsValue["date-picker"]
        .clone()
        .hour(fieldsValue["time-picker"][1].hour())
        .minute(fieldsValue["time-picker"][1].minute())
        .format(dateTimeFormat),
      description: fieldsValue["description"] ? fieldsValue["description"] : "",
      id: newId,
      groupId: "",
      NWUClass: false,
    };
    setOpen(false);
    console.log(calendarRef);
    console.log("Vals obj here");
    console.log(values);
    calendarRef.current.getApi().addEvent(values);
  };

  


  return (
    <>
      {buttonType === "scr_small" ? (
        <Button variant="outline" size="sm" onClick={showModal}>
          <PlusOutlined />
        </Button>
      ) : (
        <Button type="primary" onClick={showModal}>
          Add Event
        </Button>
      )}
      <Modal
        title="Create an Event"
        open={open}
        onOk={() => {
          form.validateFields().then(form.submit);
        }}
        onCancel={handleCancel}
        //afterOpenChange={onModalOpenChange}
        afterClose={onClosingCompletely}
      >
        <Form
          id="CreateEventForm"
          form={form}
          name="time_related_controls"
          onFinish={handleOk}
        >
          <Form.Item
            label="Title"
            name="title"
            rules={[
              {
                required: true,
                message: "Title of the event cannot be empty!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Recur?" name="disabled" valuePropName="checked">
            <Checkbox 
              checked={recur}
              onChange={(e) => {setRecur(e.target.checked); console.log(recur)}}
              className='w-full'></Checkbox>
          </Form.Item>

          {!recur && (<Form.Item name="date-picker" label="Date">
            <DatePicker />
          </Form.Item>)}

          {!recur && (
          <Form.Item name="time-picker" label="Time">
            <TimePicker.RangePicker
              format="HH:mm A"
              minuteStep={5}
              hourStep={1}
              hideDisabledOptions
            />
          </Form.Item>)}


          {recur && 

          (<Form.Item name="date-picker" label="Start Date">
            <DatePicker />
          </Form.Item>)
  
          }

          {recur && 
              (<Form.Item name="date-picker" label="End Date">
               <DatePicker />
              </Form.Item>)}

          {recur && (
          <Form.Item name="time-picker" label="Time">
            <TimePicker.RangePicker
              format="HH:mm A"
              minuteStep={5}
              hourStep={1}
              hideDisabledOptions
            />
          </Form.Item>)}


          
          {recur && (<Form.Item label="Recurring" name="disabled" valuePropName="checked">
            <Checkbox className='w-full'>Sunday</Checkbox>
            <Checkbox className='w-full'>Monday</Checkbox>
            <Checkbox className='w-full'>Tuesday</Checkbox>
            <Checkbox className='w-full'>Wednesday</Checkbox>
            <Checkbox className='w-full'>Thursday</Checkbox>
            <Checkbox className='w-full'>Friday</Checkbox>
            <Checkbox className='w-full'>Saturday</Checkbox>
          </Form.Item>) }

          <Form.Item label="Description" name="description">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AddEventButtonPopup;
