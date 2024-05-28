// Imports
import React, { useState } from "react";
import {
  Button,
  Modal,
  Divider,
  DatePicker,
  Row,
  Input,
  Popconfirm,
  Form,
  TimePicker,
  Checkbox,
  message,
} from "antd";
import dayjs from "dayjs";
import {
  ref,
} from "@firebase/database";
import { database, getData, setData, pushData, removeData } from '../firebase'

// Date to String helper
const convertDateToStr = (aDate) => {
  let str1 = aDate.toISOString();
  let tmp_list = str1.split(".")[0].split("T");
  let str2 = tmp_list[0] + " " + tmp_list[1];
  return str1.length > 0 ? str2 : "";
};

const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// Declare date-time format
const dateTimeFormat = "YYYY-MM-DD HH:mm";

// Click Event Popup
const ClickEventPopup = ({ open, setOpen, currEvent, calendarRef }) => {
  // State variables
  const [rangePickerBuffer, setRangePickerBuffer] = useState([]);
  const [rangePickerStatus, setRangePickerStatus] = useState("");
  const [inputBoxModDescBuffer, setInputBoxModDescBuffer] = useState("");
  const [inputBoxModDescStatus, setInputBoxModDescStatus] = useState("");
  const [clickedEdit, setClickedEdit] = useState(false);
  const [form] = Form.useForm();
  const recur = true;

  // Handle modal close
  const handleOk = () => {
    setOpen(false);
  };

  // Handle modal cancel
  const handleCancel = () => {
    setOpen(false);
    setClickedEdit(false);
  };

  // Handle date change
  const onModalOpenChange = () => {
    if (open && calendarRef != null && calendarRef.current != null) {
      setRangePickerBuffer([
        dayjs(currEvent.start, dateTimeFormat),
        dayjs(currEvent.end, dateTimeFormat),
      ]);
    }
  };

  // Handle delete event
  const onClickDelete = () => {
    if (calendarRef != null && calendarRef.current != null) {
      let event1 = calendarRef.current.getApi().getEventById(currEvent.id);
      const removalId = event1.extendedProps.firebaseId;
      console.log("event1", event1);
      console.log("removal id", removalId);
      //const db = getDatabase();
      //const eventRef = ref(db, `events/${removalId}`);
      removeData(`events/${removalId}`);
      setOpen(false);
    }
  };

  // Handle whatever the fuck
  const onClosingCompletely = () => {
    setOpen(false);
    setClickedEdit(false);
    setRangePickerStatus("");
  };

  // Handle Edit
  const onClickEditButton = () => {
    if (calendarRef != null && calendarRef.current != null) {
      let event1 = calendarRef.current.getApi().getEventById(currEvent.id);
      setClickedEdit(true);
    }
  };

  // Handle Finish
  const onClickFinishButton = () => {
    if (calendarRef != null && calendarRef.current != null) {
      let event1 = calendarRef.current.getApi().getEventById(currEvent.id);
      if (rangePickerBuffer != null && rangePickerBuffer.length === 2) {
        setClickedEdit(false);
        setRangePickerStatus("");
        event1.setStart(rangePickerBuffer[0].format("YYYY-MM-DDTHH:mm:ss"));
        event1.setEnd(rangePickerBuffer[1].format("YYYY-MM-DDTHH:mm:ss"));
      } else {
        setRangePickerStatus("error");
      }
      event1.setExtendedProp("description", inputBoxModDescBuffer);
    }
  };

  // Handle cancel edit
  const onClickCancelEditButton = () => {
    setClickedEdit(false);
    setRangePickerStatus("");
  };

  // Ret
  return (
    <Modal
      title={currEvent.groupId}
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      afterOpenChange={onModalOpenChange}
      afterClose={onClosingCompletely}
      footer={
        clickedEdit ? (
          <>
            <Button onClick={onClickFinishButton} type="primary">
              Finish
            </Button>
            <Button onClick={onClickCancelEditButton} danger>
              Cancel Edit
            </Button>
          </>
        ) : (
          (_, { OkBtn, CancelBtn }) => (
            <>
              <Popconfirm
                title="Delete the event"
                description="Are you sure to delete this event?"
                onConfirm={onClickDelete}
                okText="Yes"
                cancelText="No"
              >
                <Button>Delete</Button>
              </Popconfirm>
              <Button
                onClick={onClickEditButton}
                disabled={currEvent.extendedProps.editable}
              >
                Edit
              </Button>
              <CancelBtn />
              <OkBtn />
            </>
          )
        )
      }
    >
      {clickedEdit ? (
        <>
          <Divider />
          <Form
            id="EditEventForm"
            form={form}
            name="time_related_controls"
            onFinish={handleOk}
            initialValues={{
              title: currEvent.groupId,
              // datenonrecur: dayjs(currEvent.start, dateTimeFormat),
              // timePicker: [
              //   dayjs(currEvent.start, dateTimeFormat),
              //   dayjs(currEvent.end, dateTimeFormat),
              // ],
              startrecur: currEvent.startRecur,
              endrecur: currEvent.endRecur,
              timePickerRec: [
                dayjs(currEvent.start, dateTimeFormat),
                dayjs(currEvent.end, dateTimeFormat),
              ],
              description: currEvent.extendedProps.description,
            }}
          >
            {/* EVENT TITLE */}
            <Form.Item
              label="Edit title"
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
                label="Starts on"
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
                label="Ends on"
                rules={[
                  {
                    required: true,
                    message:
                      "End date of the recurring event must not be empty!",
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
            <Form.Item label="Edit description" name="description">
              <Input />
            </Form.Item>
          </Form>
        </>
      ) : (
        <div>Description: {currEvent.extendedProps.description}</div>
      )}
    </Modal>
  );
};

// Export
export default ClickEventPopup;
