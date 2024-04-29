import React, { useState } from "react";
import { Modal, Form, DatePicker, Input, TimePicker, Checkbox, message } from "antd";
import { Button } from "@/components/Button";
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";
import { getDatabase, ref, push, set } from "firebase/database";

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
    const db = getDatabase();
    const eventRef = ref(db, "events");
    console.log(daysOfWeek)

    if (recur) {
      const {
        title,
        description,
        startrecur,
        endrecur,
        timePickerRec,
      } = fieldsValue;
      let startRecStr = new Date(
        startrecur
          .format(dateFormat)
      )
      let endRecStr = new Date(
        endrecur
          .format(dateFormat)
      )
      values = {
        title: title,
        startTime: startrecur
          .clone()
          .hour(timePickerRec[0].hour())
          .minute(timePickerRec[0].minute())
          .format("HH:mm"),
        endTime: endrecur
          .clone()
          .hour(timePickerRec[1].hour())
          .minute(timePickerRec[1].minute())
          .format("HH:mm"),
        description: description
          ? description
          : "",
        start: startRecStr,
        end: endRecStr,
        daysOfWeek: daysOfWeek,
        id: newId,
        editable: false,
        groupId: title,
        NWUClass: false,
        recurEvent: true,
      };
    } 
    else {
      const {
        title,
        description,
        datenonrecur,
        timePicker,
      } = fieldsValue;
      values = {
        title: title,
        start: datenonrecur
          .hour(timePicker[0].hour())
          .minute(timePicker[0].minute())
          .format(dateTimeFormat),
        end: datenonrecur
          .hour(timePicker[1].hour())
          .minute(timePicker[1].minute())
          .format(dateTimeFormat),
        description: description
          ? description
          : "",
        id: newId,
        groupId: title,
        NWUClass: false,
        recurEvent: false,
        editable: true,
      };
    }

    console.log(values);
    setOpen(false);
    calendarRef.current.getApi().addEvent(values);

    const newEventRef = push(eventRef);
    const newAutoId = newEventRef.key;
    values.firebaseId = newAutoId;
    set(newEventRef, values);
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
              name="timePicker"
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
              name="startrecur"
              label="Start Date"
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
              name="endrecur"
              label="End Date"
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
              name="timePickerRec"
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
