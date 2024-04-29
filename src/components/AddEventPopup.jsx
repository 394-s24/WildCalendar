import React, { useEffect, useState } from "react";
import { Modal, Form, DatePicker, Input, TimePicker, Checkbox } from "antd";
import { Button } from "@/components/Button";
import { PlusOutlined } from "@ant-design/icons";
import { v4 as uuidv4 } from "uuid";
import moment from 'moment'
import dayjs from 'dayjs';

const dateTimeFormat = "YYYY-MM-DD HH:mm";

const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const { RangePicker } = DatePicker;

const rangeConfig = {
    rules: [
        {
            type: 'array',
            required: true,
            message: 'Please enter a time!',
        },
    ],
}

const AddEventButtonPopup = ({ open, setOpen, calendarRef, buttonType, clickedDateTime }) => {
  const [form] = Form.useForm();
  const [recur, setRecur] = useState(false);
  const [daysOfWeek, setDaysOfWeek] = useState([]);
  

  const showModal = () => {
    setOpen(true);
    setRecur(false);
    
  };

  const handleCancel = () => {
    form.resetFields();
    setOpen(false);
  };

  const onClosingCompletely = () => {
    form.resetFields();
  };

  const onModalOpenChange = () => {
    form.resetFields();
    //console.log(clickedDateTime, open);
  }

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
    calendarRef.current.getApi().addEvent(values);
    
  };

  return (
    <>
      {buttonType === "scr_small" ? (
        <Button variant="outline" size="sm" onClick={showModal}>
          Add Event
        </Button>
      ) : buttonType === "" ? null : (
        <Button variant="outline" onClick={showModal}>
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
        afterOpenChange={onModalOpenChange}
        afterClose={onClosingCompletely}
      >
        <Form
          id="CreateEventForm"
          form={form}
          name="time_related_controls"
          onFinish={handleOk}
          // initialValues={{
          //   // 'date-picker': clickedDateTime ? clickedDateTime : undefined,
          //   'date-picker': clickedDateTime ? clickedDateTime : undefined,
          // }}
          initialValues={{
            'range-picker1': clickedDateTime ? [dayjs(clickedDateTime), null] : [],
            'start-recurrence' : clickedDateTime ? dayjs(clickedDateTime) : null,
          }}
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

          <Form.Item name="isRecurring">
            <Checkbox
              checked={recur}
              onChange={(e) => {
                setRecur(e.target.checked);
              }}
              className=""
            >
              Recurring?
            </Checkbox>
          </Form.Item>

          {!recur && (
            <Form.Item name="range-picker1" label="Start and End" rules={[
              {
                required: true,
                message: "Start time and end time of the event must not be empty!",
              },
            ]}>
                <RangePicker {...rangeConfig} showTime format="YYYY-MM-DD HH:mm"
                    />
            </Form.Item>
          )}

          {/* {!recur && (
            <Form.Item name="time-picker" label="Time">
              <TimePicker.RangePicker
                format="HH:mm A"
                minuteStep={5}
                hourStep={1}
                hideDisabledOptions
              />
            </Form.Item>
          )} */}

          {recur && (
            <Form.Item name="start-recurrence" label="Start Date" rules={[
              {
                required: true,
                message: "Start date of the recurring event must not be empty!",
              },
            ]}>
              <DatePicker />
            </Form.Item>
          )}

          {recur && (
            <Form.Item name="end-recurrence" label="End Date" rules={[
              {
                required: true,
                message: "End date of the recurring event must not be empty!",
              },
            ]}>
              <DatePicker />
            </Form.Item>
          )}

          {recur && (
            <Form.Item 
              name="time-picker" 
              label="Time"
              rules={[
                {
                  required: true,
                  message: "Start time and end time of the recurring event must not be empty!",
                },
              ]}
            >
              <TimePicker.RangePicker
                format="HH:mm A"
                minuteStep={5}
                hourStep={1}
                hideDisabledOptions
              />
            </Form.Item>
          )}

          {recur && (
            <Form.Item label="On Days:" name="daysOfWeek">
              <Checkbox.Group
                style={{ width: "100%" }}
                onChange={(checkedValues) => {
                  const daysOfWeek = checkedValues.map((day) =>
                    weekdays.indexOf(day)
                  );
                  setDaysOfWeek(daysOfWeek);
                }}
              >
                {weekdays.map((weekday) => (
                  <Checkbox value={weekday} className="w-full">
                    {weekday}
                  </Checkbox>
                ))}
              </Checkbox.Group>
            </Form.Item>
          )}

          <Form.Item label="Description" name="description">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AddEventButtonPopup;
