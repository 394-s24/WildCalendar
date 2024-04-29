import React, { useState, useEffect } from 'react';
import { Button, Modal, Divider, DatePicker, Row, Col, Input, Popconfirm, Form, Checkbox, TimePicker } from 'antd';
import dayjs from 'dayjs';
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
            type: 'array',
            required: true,
            message: 'Please enter a time!',
        },
    ],
}

const convertDateToStr = (aDate) => {
    let str1 = aDate.toISOString();
    let tmp_list = str1.split(".")[0].split("T")
    let str2 = tmp_list[0]+" "+tmp_list[1];
    return (str1.length > 0 ? str2 : "");
  }

const dateTimeFormat = "YYYY-MM-DD HH:mm";

//let mostRecentEvent = null;

const ClickEventPopup = ({open, setOpen, currEvent, calendarRef}) => {
    const [form] = Form.useForm();
    const [rangePickerBuffer, setRangePickerBuffer] = useState([]);
    const [rangePickerStatus, setRangePickerStatus] = useState("")
    const [inputBoxModDescBuffer, setInputBoxModDescBuffer] = useState("");
    const [inputBoxModDescStatus, setInputBoxModDescStatus] = useState("")
    const [clickedEdit, setClickedEdit] = useState(false);
    const [descCopy, setDescCopy] = useState(currEvent.extendedProps.description);
    const [daysOfWeek, setDaysOfWeek] = useState([]);
    const [mostRecentEvent, setMostRecentEvent] = useState(null);
    const [finishDisabled, setFinishDisabled] = useState(true);

    useEffect (
        () => {
            if (calendarRef != null && calendarRef.current != null) {
                setMostRecentEvent(calendarRef.current.getApi().getEventById(currEvent.id));
            }
            form.resetFields();
            //console.log("useEffect for reset form!")
        }, [open]
    )

    const handleOk = () => {
        setOpen(false);
    };


    const handleEditOk = (fieldsValue) => {
        let event1 = calendarRef.current.getApi().getEventById(mostRecentEvent.id);
        if (currEvent.extendedProps.recurEvent) {
            let newId = uuidv4();
            // event1.setProp("title", fieldsValue["title"])
            // event1.setExtendedProp("startTime", fieldsValue["start-recurrence"]
            //     .clone()
            //     .hour(fieldsValue["time-picker"][0].hour())
            //     .minute(fieldsValue["time-picker"][0].minute())
            //     .format("HH:mm"))
            // event1.setExtendedProp("endTime", fieldsValue["end-recurrence"]
            //     .clone()
            //     .hour(fieldsValue["time-picker"][1].hour())
            //     .minute(fieldsValue["time-picker"][1].minute())
            //     .format("HH:mm"))
            // event1.setExtendedProp("description", fieldsValue["description"]
            // ? fieldsValue["description"]
            // : "")
            // event1.setExtendedProp("startRecur", fieldsValue["start-recurrence"].format("YYYY-MM-DD"))
            // event1.setExtendedProp("endRecur", fieldsValue["end-recurrence"].format("YYYY-MM-DD"))
            // event1.setExtendedProp("daysOfWeek", daysOfWeek)
            event1.remove();
            let values = {
                title: fieldsValue["title"],
                startTime: fieldsValue["start-recurrence"]
                  //.clone()
                  .hour(fieldsValue["time-picker"][0].hour())
                  .minute(fieldsValue["time-picker"][0].minute())
                  .format("HH:mm"),
                endTime: fieldsValue["end-recurrence"]
                  //.clone()
                  .hour(fieldsValue["time-picker"][1].hour())
                  .minute(fieldsValue["time-picker"][1].minute())
                  .format("HH:mm"),
                description: fieldsValue["description"]
                  ? fieldsValue["description"]
                  : "",
                startRecur: fieldsValue["start-recurrence"].format("YYYY-MM-DD"),
                endRecur: fieldsValue["end-recurrence"].format("YYYY-MM-DD"),
                daysOfWeek: fieldsValue["daysOfWeek"].map(
                    (day) => weekdays.indexOf(day)
                ),
                //id: newId,
                editable: false,
                id: newId,
                groupId: newId,
                NWUClass: false,
                recurEvent: true,
            };
            //console.log(values)
            let event2 = calendarRef.current.getApi().addEvent(values);
            //console.log(event2)
            setMostRecentEvent(event2);
        } else {
            event1.setProp("title", fieldsValue["title"])
            event1.setStart(fieldsValue["range-picker1"][0]
                // .clone()
                // .hour(fieldsValue["time-picker"][0].hour())
                // .minute(fieldsValue["time-picker"][0].minute())
                .format(dateTimeFormat))
            event1.setEnd(fieldsValue["range-picker1"][1]
                // .clone()
                // .hour(fieldsValue["time-picker"][1].hour())
                // .minute(fieldsValue["time-picker"][1].minute())
                .format(dateTimeFormat))
            event1.setExtendedProp("description", fieldsValue["description"]
            ? fieldsValue["description"]
            : "")
            //console.log(fieldsValue["description"])
            setMostRecentEvent(calendarRef.current.getApi().getEventById(currEvent.id));
        }
        
        
        setClickedEdit(false);
        //console.log(values)
        //calendarRef.current.getApi().addEvent(values);
      };

    const handleCancel = () => {
        setOpen(false);
        setClickedEdit(false);
    };

    const onModalOpenChange = () => {
        if (calendarRef != null && calendarRef.current != null) {
            setMostRecentEvent(calendarRef.current.getApi().getEventById(currEvent.id));
        }
        form.resetFields();
        //console.log(mostRecentEvent)
    };

    const onClickDelete = () => {
        if (calendarRef != null && calendarRef.current != null) {
          let event1 = calendarRef.current.getApi().getEventById(currEvent.id);
          event1.remove();
          setOpen(false);
        }
    };

    const onClosingCompletely = () => {
        setOpen(false);
        setClickedEdit(false);
        form.resetFields();
        //setMostRecentEvent(null);;
    };

    const onClickEditButton = () => {
        console.log(mostRecentEvent)
        console.log(currEvent)
        if (calendarRef != null && calendarRef.current != null) {
            setClickedEdit(true);
            setFinishDisabled(true);
        }
        form.resetFields();
        if(!mostRecentEvent.extendedProps.recurEvent) {
            form.setFieldsValue({
                'title' : mostRecentEvent.title,
              });
            form.setFieldsValue({'range-picker1': [dayjs(getMostRecentRange()[0]), dayjs(getMostRecentRange()[1])], });
            form.setFieldsValue({'description': mostRecentEvent.extendedProps.description});
        } 
        else{
            form.setFieldsValue({
                'title' : mostRecentEvent.title,
              });
            form.setFieldsValue({'start-recurrence': dayjs(mostRecentEvent._def.recurringDef.typeData.startRecur)})
            form.setFieldsValue({'end-recurrence': dayjs(mostRecentEvent._def.recurringDef.typeData.endRecur),})
            form.setFieldsValue({'time-picker': [dayjs(millsecToTime(mostRecentEvent._def.recurringDef.typeData.startTime['milliseconds']), 'HH:mm:ss'), dayjs(millsecToTime(mostRecentEvent._def.recurringDef.typeData.endTime['milliseconds']), 'HH:mm:ss')], })
            form.setFieldsValue({'daysOfWeek': mostRecentEvent._def.recurringDef.typeData.daysOfWeek.map((day) =>
                    weekdays[day]
                ), })
            form.setFieldsValue({'description': mostRecentEvent.extendedProps.description})
        }
    };

    const onClickFinishButton = () => {
        form.validateFields().then(form.submit);
    };

    const onClickCancelEditButton = () => {
        setClickedEdit(false);
        setRangePickerStatus("");
        form.resetFields();
    };

    const formatTimeToAMPM = (dateString) => {
        const localDate = new Date(dateString);
        //console.log(localDate)
    
        let hours = localDate.getHours(); // get local hours
        const minutes = localDate.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        const minutesStr = minutes < 10 ? '0' + minutes : minutes;
    
        return `${hours}:${minutesStr} ${ampm}`;
    };  

    const millsecToTime = (ms) => {
        let h,m,s;
        h = Math.floor(ms/1000/60/60);
        m = Math.floor((ms/1000/60/60 - h)*60);
        s = Math.floor(((ms/1000/60/60 - h)*60 - m)*60);
        // to get time format 00:00:00
    
        s < 10 ? s = `0${s}`: s = `${s}`
        m < 10 ? m = `0${m}`: m = `${m}`
        h < 10 ? h = `0${h}`: h = `${h}`
        return h+":"+m+":"+s;
    }

    const getMostRecentRange = () => {
        if(calendarRef != null && calendarRef.current != null)
        {
            let event1 = calendarRef.current.getApi().getEventById(currEvent.id);
            if(event1 != null)
            {
                let startTime = null;
                let endTime = null;
                startTime = new Date(event1.start);
                endTime = new Date(event1.end);
                //console.log([startTime, endTime])
                return [startTime, endTime];
            }
        }
        return [];
    }

    const onFormValueChange = ({changedValue, currValue}) => {
        setFinishDisabled(false)
    }

    return (
        <Modal
            title={mostRecentEvent != null ? mostRecentEvent.title : ""}
            open={open}
            onOk={handleOk}
            //confirmLoading={confirmLoading}
            onCancel={handleCancel}
            afterOpenChange={onModalOpenChange}
            afterClose={onClosingCompletely}
            footer={clickedEdit ?
                (_, { OkBtn, CancelBtn }) => (
                    <>
                        <Button onClick={onClickFinishButton} disabled={finishDisabled} type="primary">Finish</Button>
                        <Button onClick={onClickCancelEditButton} danger>Cancel Edit</Button>
                    </>
                )
                :
                (_, { OkBtn, CancelBtn }) => (
                    <>
                        <Popconfirm
                            title="Delete the event"
                            description="Are you sure to delete this event?"
                            onConfirm={onClickDelete}
                            //onCancel={cancel}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button>Delete</Button>
                        </Popconfirm>
                        <Button onClick={onClickEditButton} disabled={currEvent.extendedProps.NWUClass}>Edit</Button>
                        <CancelBtn />
                        <OkBtn />
                    </>
                )}
        >
            {clickedEdit ? (
                <>
                    {/* <div>
                        Edit Start and End:
                    </div>
                    <Row>
                        <DatePicker onChange={(e) => {
                            setRangePickerBuffer(e)
                        }} />
                        <p>test</p>
                    </Row>
                    {
                        <>
                            <div>
                                Edit Event Description:
                            </div>
                            <Row>
                                <Input
                                    defaultValue={descCopy}
                                    onChange={(e) => {
                                        setInputBoxModDescBuffer(e.target.value);
                                    }}
                                    onPressEnter={onClickFinishButton}
                                    status={inputBoxModDescStatus}
                                />
                            </Row>
                        </>
                    } */}
                    {mostRecentEvent != null ? 
                        <Form
                            id="EditEventForm"
                            form={form}
                            name="time_related_controls"
                            onFinish={handleEditOk}
                            // initialValues={{
                            //   // 'date-picker': clickedDateTime ? clickedDateTime : undefined,
                            //   'date-picker': clickedDateTime ? clickedDateTime : undefined,
                            // }}
                            onValuesChange={onFormValueChange}
                            // initialValues={
                            //     !mostRecentEvent.extendedProps.recurEvent ? {
                            //         'title' : mostRecentEvent.title,
                            //         'range-picker1': [dayjs(getMostRecentRange()[0]), dayjs(getMostRecentRange()[1])],
                            //         'description': mostRecentEvent.extendedProps.description
                            //     } : {
                            //         'title' : mostRecentEvent.title,
                            //         'start-recurrence': dayjs(mostRecentEvent._def.recurringDef.typeData.startRecur),
                            //         'end-recurrence': dayjs(mostRecentEvent._def.recurringDef.typeData.endRecur),
                            //         'time-picker': [dayjs(millsecToTime(mostRecentEvent._def.recurringDef.typeData.startTime['milliseconds']), 'HH:mm:ss'), dayjs(millsecToTime(mostRecentEvent._def.recurringDef.typeData.endTime['milliseconds']), 'HH:mm:ss')],
                            //         'daysOfWeek': mostRecentEvent._def.recurringDef.typeData.daysOfWeek.map((day) =>
                            //                 weekdays[day]
                            //             ),
                            //         'description': mostRecentEvent.extendedProps.description
                            //     }
                            // }
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
                                <Form.Item name="range-picker1" label="Start and End" rules={[
                                    {
                                      required: true,
                                      message: "Start time and end time of the recurring event must not be empty!",
                                    },
                                  ]}>
                                    <RangePicker {...rangeConfig} showTime format="YYYY-MM-DD HH:mm"
                                        />
                                </Form.Item>
                            )}

                            {currEvent.extendedProps.recurEvent && (
                                <Form.Item name="start-recurrence" label="Start Date" rules={[
                                    {
                                      required: true,
                                      message: "Start time and end time of the recurring event must not be empty!",
                                    },
                                  ]}>
                                    <DatePicker />
                                </Form.Item>
                            )}

                            {currEvent.extendedProps.recurEvent && (
                                <Form.Item name="end-recurrence" label="End Date" rules={[
                                    {
                                      required: true,
                                      message: "Start time and end time of the recurring event must not be empty!",
                                    },
                                  ]}>
                                    <DatePicker />
                                </Form.Item>
                            )}

                            {currEvent.extendedProps.recurEvent && (
                                <Form.Item name="time-picker" label="Time" rules={[
                                    {
                                      required: true,
                                      message: "Start time and end time of the recurring event must not be empty!",
                                    },
                                  ]}>
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
                        </Form> : <></>}
                </>

            ) : (
                mostRecentEvent ? 
                    <>
                        {mostRecentEvent.extendedProps.recurEvent ? <>
                            <div>
                                Start: {formatTimeToAMPM('2001-03-25 '+millsecToTime(mostRecentEvent._def.recurringDef.typeData.startTime['milliseconds']))}
                                <Divider type="vertical" />
                                End: {formatTimeToAMPM('2001-03-25 '+millsecToTime(mostRecentEvent._def.recurringDef.typeData.endTime['milliseconds']))}
                            </div>
                        </> : (
                            <div>
                                Start: {formatTimeToAMPM(getMostRecentRange()[0])}
                                <Divider type="vertical" />
                                End: {formatTimeToAMPM(getMostRecentRange()[1])}
                            </div>
                        )}

                        {
                            (mostRecentEvent.extendedProps.description.length > 0) ?
                            (
                                <div>
                                    Description: {mostRecentEvent.extendedProps.description}
                                </div>
                            ) : (
                                <></>
                            )
                        }
                    </> 
                : <></>
            )}
        </Modal> 
    );
};
export default ClickEventPopup;
