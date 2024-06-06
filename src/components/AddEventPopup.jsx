import React, { useState } from "react";
import { Modal, Form, DatePicker, Input, TimePicker, Checkbox, message } from "antd";
import { Button } from "@/components/Button";
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";
//import { getDatabase, ref, push, set } from "firebase/database";
import { database, getData, setData, pushData, login } from '../firebase'

const dateTimeFormat = "YYYY-MM-DD HH:mm";
const dateFormat = "YYYY-MM-DD";
const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const AddEventButtonPopup = ({
  open,
  setOpen,
  calendarRef,
  buttonType,
  clickedDateTime,
}) => {
  const [form] = Form.useForm();
  const [recur, setRecur] = useState(false);
  const [daysOfWeek, setDaysOfWeek] = useState([]);

  const showModal = () => {
    setOpen(true);
    setRecur(false);
  };

  const handleCancel = () => {
    onClose();
    setOpen(false);
  };

  const onClose = () => {
    form.resetFields();
  };

  const handleOk = (fieldsValue) => {
    let newId = uuidv4();
    let values = {};
    if (recur) {
      console.log(fieldsValue)
      let startrecur1 = new Date(fieldsValue["start-recurrence"].format("YYYY-MM-DD"));
      startrecur1.setDate(startrecur1.getDate() + 1)
      let startrecur1_string = startrecur1.toISOString().split("T")[0]
      let endrecur1 = new Date(fieldsValue["end-recurrence"].format("YYYY-MM-DD"));
      endrecur1.setDate(endrecur1.getDate() + 1)
      let endrecur1_string = endrecur1.toISOString().split("T")[0]
      values = {
        title: fieldsValue["title"],
        startTime: fieldsValue["start-recurrence"]
          .clone()
          .hour(fieldsValue["time-picker"][0].hour())
          .minute(fieldsValue["time-picker"][0].minute())
          .format("HH:mm"),
        endTime: fieldsValue["end-recurrence"]
          .clone()
          .hour(fieldsValue["time-picker"][1].hour())
          .minute(fieldsValue["time-picker"][1].minute())
          .format("HH:mm"),
        description: fieldsValue["description"]
          ? fieldsValue["description"]
          : "",
        startRecur: startrecur1_string,
        endRecur: endrecur1_string,
        daysOfWeek: daysOfWeek,
        id: newId,
        editable: false,
        groupId: newId,
        NWUClass: false,
        recurEvent: true,
      };
    } else {
      values = {
        title: fieldsValue["title"],
        start: fieldsValue["range-picker1"][0]
          // .clone()
          // .hour(fieldsValue["time-picker"][0].hour())
          // .minute(fieldsValue["time-picker"][0].minute())
          .format(dateTimeFormat),
        end: fieldsValue["range-picker1"][1]
          // .clone()
          // .hour(fieldsValue["time-picker"][1].hour())
          // .minute(fieldsValue["time-picker"][1].minute())
          .format(dateTimeFormat),
        description: fieldsValue["description"]
          ? fieldsValue["description"]
          : "",
        id: newId,
        groupId: "",
        NWUClass: false,
        recurEvent: false,
      };
    }
    console.log(values)
    setOpen(false);
    calendarRef.current.getApi().addEvent(values);
    message.success("Event added to calendar.");
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
        afterOpenChange={onClose}
        afterClose={onClose}
        destroyOnClose={true}
      >
        <Form
          id="CreateEventForm"
          form={form}
          name="time_related_controls"
          onFinish={handleOk}
          initialValues={{
            "range-picker1": clickedDateTime
              ? [dayjs(clickedDateTime), null]
              : [],
            startrecur: clickedDateTime ? dayjs(clickedDateTime) : null,
          }}
        >
          {/* EVENT TITLE */}
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

          {/* RECURRING BOOL */}
          <Form.Item label="isRecurring" name="isRecurring">
            <Checkbox
              checked={recur}
              onChange={(e) => {
                setRecur(e.target.checked);
              }}
            >
            </Checkbox>
          </Form.Item>

          {/* NONRECURRING DATE */}
          {!recur && (
            <Form.Item
              name="datenonrecur"
              label="Date"
              rules={[
                {
                  required: true,
                  message:
                    "Start date of the recurring event must not be empty!",
                },
              ]}
            >
              <DatePicker />
            </Form.Item>
          )}

          {/* NONRECURRING TIME */}
          {!recur && (
            <Form.Item
              name="range-picker1"
              label="Time"
              rules={[
                {
                  required: true,
                  message:
                    "Start date of the recurring event must not be empty!",
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

          {/* RECURRING START DATE */}
          {recur && (
            <Form.Item
              name="start-recurrence"
              label="Start-Date"
              rules={[
                {
                  required: true,
                  message:
                    "Start date of the recurring event must not be empty!",
                },
              ]}
            >
              <DatePicker />
            </Form.Item>
          )}

          {/* RECURRING END DATE */}
          {recur && (
            <Form.Item
              name="end-recurrence"
              label="End-Date"
              rules={[
                {
                  required: true,
                  message: "End date of the recurring event must not be empty!",
                },
              ]}
            >
              <DatePicker />
            </Form.Item>
          )}

          {/* RECURRING TIME */}
          {recur && (
            <Form.Item
              name="time-picker"
              label="Time"
              rules={[
                {
                  required: true,
                  message:
                    "Start time and end time of the recurring event must not be empty!",
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

          {/* RECURRING DAYS OF WEEK */}
          {recur && (
            <Form.Item label="On Days:" name="dow">
              <Checkbox.Group
                style={{ width: "100%" }}
                onChange={(checkedValues) => {
                  const dow = checkedValues.map((day) =>
                    weekdays.indexOf(day)
                  );
                  setDaysOfWeek(dow);
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

          {/* DESCRIPTION */}
          <Form.Item label="Description" name="description">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AddEventButtonPopup;
