import { getDatabase, ref, update, remove } from "@firebase/database";

import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Divider,
  DatePicker,
  Input,
  Popconfirm,
  Form,
  Checkbox,
  TimePicker,
  message,
} from "antd";
import dayjs from "dayjs";
import { v4 as uuidv4 } from "uuid";

const { RangePicker } = DatePicker;
const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const rangeConfig = {
  rules: [
    {
      type: "array",
      required: true,
      message: "Please enter a time!",
    },
  ],
};

const dateTimeFormat = "YYYY-MM-DD HH:mm";
const dateFormat = "YYYY-MM-DD";

const ClickEventPopup = ({ open, setOpen, currEvent, calendarRef }) => {
  const [form] = Form.useForm();
  const [clickedEdit, setClickedEdit] = useState(false);
  const [activeEvent, setActiveEvent] = useState(null);
  const [finishDisabled, setFinishDisabled] = useState(true);

  useEffect(() => {
    if (calendarRef != null && calendarRef.current != null) {
      setActiveEvent(calendarRef.current.getApi().getEventById(currEvent.id));
      console.log('here', activeEvent)
    }
    form.resetFields();
    if (clickedEdit) {
      setFormInitialValue();
    }
  }, [open]);

  const handleOk = () => {
    setOpen(false);
  };

  const handleEditOk = (fieldsValue) => {
    let event1 = calendarRef.current.getApi().getEventById(activeEvent.id);
    const newId = uuidv4();

    if (currEvent.extendedProps.recurEvent) {
      let {
        title,
        description,
        startRecurrence,
        endRecurrence,
        timePicker,
        daysOfWeek,
      } = fieldsValue;

      let startrecur = new Date(startRecurrence.format(dateFormat));
      startrecur.setDate(startrecur.getDate() + 1);
      let startrecur_string = startrecur.toISOString().split("T")[0];

      let endrecur = new Date(endRecurrence.format(dateFormat));
      endrecur.setDate(endrecur.getDate() + 1);
      let endrecur_string = endrecur.toISOString().split("T")[0];

      let values = {
        title: title,
        startTime: startRecurrence
          .hour(timePicker[0].hour())
          .minute(timePicker[0].minute())
          .format("HH:mm"),
        endTime: endRecurrence
          .hour(timePicker[1].hour())
          .minute(timePicker[1].minute())
          .format("HH:mm"),
        description: description ? description : "",
        startRecur: startrecur_string,
        endRecur: endrecur_string,
        daysOfWeek: daysOfWeek.map((day) => weekdays.indexOf(day)),
        editable: true,
        id: newId,
        groupId: title,
        NWUClass: false,
        recurEvent: true,
        firebaseId: event1.extendedProps.firebaseId,
      };

      const db = getDatabase();
      const eventRef = ref(db, `events/${values.firebaseId}`);

      update(eventRef, values)
        .then(() => {
          message.success("Class updated in calendar.");
        })
        .catch((error) => {
          message.error(`Failed to update class: ${error.message}`);
        });

      let event2 = calendarRef.current.getApi().getEventById(values.id);
      setActiveEvent(event2);
      handleOk();
    } else {
      let { title, rangePicker, description } = fieldsValue;
      let values = {
        title: title,
        description: description ? description : "",
        start: rangePicker[0].format(dateTimeFormat),
        end: rangePicker[1].format(dateTimeFormat),
        editable: true,
        id: newId,
        groupId: title,
        NWUClass: false,
        recurEvent: false,
        firebaseId: event1.extendedProps.firebaseId,
      };

      const db = getDatabase();
      const eventRef = ref(db, `events/${values.firebaseId}`);

      update(eventRef, values)
        .then(() => {
          message.success("Class updated in calendar.");
        })
        .catch((error) => {
          message.error(`Failed to update class: ${error.message}`);
        });
      let event2 = calendarRef.current.getApi().getEventById(values.id);
      setActiveEvent(event2);
      handleOk();
    }
    setClickedEdit(false);
  };

  const handleCancel = () => {
    setOpen(false);
    setClickedEdit(false);
  };

  const onModalOpenChange = () => {
    if (calendarRef != null && calendarRef.current != null) {
      setActiveEvent(calendarRef.current.getApi().getEventById(currEvent.id));
    }
    form.resetFields();
    console.log(activeEvent)
  };

  const onClickDelete = () => {
    if (calendarRef != null && calendarRef.current != null) {
      let event1 = calendarRef.current.getApi().getEventById(currEvent.id);
      const removalId = event1.extendedProps.firebaseId;
      const db = getDatabase();
      const eventRef = ref(db, `events/${removalId}`);
      remove(eventRef);
      event1.remove();
      setOpen(false);
      message.success("Event deleted successfully.");
    }
  };

  const onClosingCompletely = () => {
    setOpen(false);
    setClickedEdit(false);
    form.resetFields();
  };

  const setFormInitialValue = () => {
    if (activeEvent) {
      if (!activeEvent.extendedProps.recurEvent) {
        form.setFieldsValue({
          title: activeEvent.title,
        });
        form.setFieldsValue({
          rangePicker: [dayjs(activeEvent.start), dayjs(activeEvent.end)],
        });
        form.setFieldsValue({
          description: activeEvent.extendedProps.description,
        });
      } else {
        form.setFieldsValue({
          title: activeEvent.title,
        });
        form.setFieldsValue({
          startRecurrence: dayjs(
            activeEvent._def.recurringDef.typeData.startRecur
          ),
        });
        form.setFieldsValue({
          endRecurrence: dayjs(activeEvent._def.recurringDef.typeData.endRecur),
        });
        form.setFieldsValue({
          timePicker: [
            dayjs(activeEvent._def.recurringDef.typeData.startTime, "HH:mm:ss"),
            dayjs(activeEvent._def.recurringDef.typeData.endTime, "HH:mm:ss"),
          ],
        });
        form.setFieldsValue({
          daysOfWeek: activeEvent._def.recurringDef.typeData.daysOfWeek.map(
            (day) => weekdays[day]
          ),
        });
        form.setFieldsValue({
          description: activeEvent.extendedProps.description,
        });
      }
    }
  };

  const onClickEditButton = () => {
    if (calendarRef != null && calendarRef.current != null) {
      setClickedEdit(true);
      setFinishDisabled(true);
    }
    console.log(currEvent)
    form.resetFields();
    setFormInitialValue();
  };

  const onClickFinishButton = () => {
    form.validateFields().then(form.submit);
  };

  const onClickCancelEditButton = () => {
    setClickedEdit(false);
    form.resetFields();
  };

  function convertTo12Hr(date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;

    const strTime = hours + ":" + minutes + " " + ampm;
    return strTime;
  }


  const onFormValueChange = () => {
    setFinishDisabled(false);
  };

  return (
    <Modal
      title={activeEvent != null ? activeEvent.title : ""}
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      afterOpenChange={onModalOpenChange}
      afterClose={onClosingCompletely}
      footer={
        clickedEdit
          ? () => (
              <>
                <Button
                  onClick={onClickFinishButton}
                  disabled={finishDisabled}
                  type="primary"
                >
                  Finish
                </Button>
                <Button onClick={onClickCancelEditButton} danger>
                  Cancel Edit
                </Button>
              </>
            )
          : (_, { OkBtn, CancelBtn }) => (
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
                  disabled={currEvent.extendedProps.recurEvent}
                >
                  Edit
                </Button>
                <CancelBtn />
                <OkBtn />
              </>
            )
      }
    >
      {clickedEdit ? (
        <>
          {activeEvent != null ? (
            <Form
              id="EditEventForm"
              form={form}
              name="time_related_controls"
              onFinish={handleEditOk}
              onValuesChange={onFormValueChange}
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

              {!currEvent.extendedProps.recurEvent && (
                <Form.Item
                  name="rangePicker"
                  label="Start and End"
                  rules={[
                    {
                      required: true,
                      message:
                        "Start time and end time of the recurring event must not be empty!",
                    },
                  ]}
                >
                  <RangePicker
                    {...rangeConfig}
                    showTime
                    format="YYYY-MM-DD HH:mm"
                  />
                </Form.Item>
              )}

              {currEvent.extendedProps.recurEvent && (
                <Form.Item
                  name="startRecurrence"
                  label="Start Date"
                  rules={[
                    {
                      required: true,
                      message:
                        "Start time and end time of the recurring event must not be empty!",
                    },
                  ]}
                >
                  <DatePicker />
                </Form.Item>
              )}

              {currEvent.extendedProps.recurEvent && (
                <Form.Item
                  name="endRecurrence"
                  label="End Date"
                  rules={[
                    {
                      required: true,
                      message:
                        "Start time and end time of the recurring event must not be empty!",
                    },
                  ]}
                >
                  <DatePicker />
                </Form.Item>
              )}

              {currEvent.extendedProps.recurEvent && (
                <Form.Item
                  name="timePicker"
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

              {currEvent.extendedProps.recurEvent && (
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
          ) : (
            <></>
          )}
        </>
      ) : activeEvent ? (
        <>
          {activeEvent.extendedProps.recurEvent ? (
            <>
              <div>
                {/* Start: {convertTo12Hr(activeEvent.startTime)}
                <Divider type="vertical" />
                End: {convertTo12Hr(activeEvent.endTime)} */}
              </div>
            </>
          ) : (
            <div>
              {/* Start: {convertTo12Hr(getMostRecentRange()[0])} */}
              Start: {convertTo12Hr(activeEvent.start)}
              <Divider type="vertical" />
              End: {convertTo12Hr(activeEvent.end)}
            </div>
          )}

          {activeEvent.extendedProps.description.length > 0 ? (
            <div>Description: {activeEvent.extendedProps.description}</div>
          ) : (
            <></>
          )}
        </>
      ) : (
        <></>
      )}
    </Modal>
  );
};
export default ClickEventPopup;
