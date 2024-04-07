import React, { useState, useEffect } from 'react';
import { Button, Modal, Divider, DatePicker, Row, Col, Input, Popconfirm } from 'antd';
import dayjs from 'dayjs';

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

const convertDateToStr = (aDate) => {
    let str1 = aDate.toISOString();
    let tmp_list = str1.split(".")[0].split("T")
    let str2 = tmp_list[0]+" "+tmp_list[1];
    return (str1.length > 0 ? str2 : "");
  }

const dateTimeFormat = "YYYY-MM-DD HH:mm:ss";

const ClickEventPopup = ({open, setOpen, currEvent, calendarRef}) => {
    
    const [rangePickerBuffer, setRangePickerBuffer] = useState([]);
    const [rangePickerStatus, setRangePickerStatus] = useState("")
    const [inputBoxModDescBuffer, setInputBoxModDescBuffer] = useState("");
    const [inputBoxModDescStatus, setInputBoxModDescStatus] = useState("")
    const [clickedEdit, setClickedEdit] = useState(false);
    const [descCopy, setDescCopy] = useState(currEvent.extendedProps.description);

    const handleOk = () => {
        setOpen(false);
    };

    const handleCancel = () => {
        setOpen(false);
        setClickedEdit(false);
    };

    const onModalOpenChange = () => {
        if(open)
        {
            let event1 = calendarRef.current.getApi().getEventById(currEvent.id);
            setDescCopy(event1.extendedProps.description);
            setRangePickerBuffer(
                [dayjs(currEvent.start, dateTimeFormat), 
                    dayjs(currEvent.end, dateTimeFormat)
                ]);
        }
    };

    const onClickDelete = () => {
        let event1 = calendarRef.current.getApi().getEventById(currEvent.id);
        event1.remove();
        setOpen(false);
    };

    const onClosingCompletely = () => {
        setOpen(false);
        setClickedEdit(false);
        setRangePickerStatus("");
        setDescCopy("")
    };

    const onClickEditButton = () => {
        let event1 = calendarRef.current.getApi().getEventById(currEvent.id);
        setDescCopy(event1.extendedProps.description);
        setClickedEdit(true);
    };

    const onClickFinishButton = () => {
        let event1 = calendarRef.current.getApi().getEventById(currEvent.id);
        if(rangePickerBuffer != null && rangePickerBuffer.length === 2)
        {
            setClickedEdit(false);
            setRangePickerStatus("");
            event1.setStart(rangePickerBuffer[0].format("YYYY-MM-DDTHH:mm:ss"));
            event1.setEnd(rangePickerBuffer[1].format("YYYY-MM-DDTHH:mm:ss"));
        }
        else
        {
            setRangePickerStatus("error");
        }
        event1.setExtendedProp("description", inputBoxModDescBuffer);
        setDescCopy(event1.extendedProps.description);
    };

    const onClickCancelEditButton = () => {
        setClickedEdit(false);
        setRangePickerStatus("");
    };

    const getMostRecentRange = () => {
        //console.log(currEvent.extendedProps)
        if(calendarRef != null)
        {
            let event1 = calendarRef.current.getApi().getEventById(currEvent.id);
            if(event1 != null)
            {
                return [convertDateToStr(event1.start), convertDateToStr(event1.end)];
            }
                
        }
        return [];
    }

    return (
        <Modal
            title={currEvent.title}
            open={open}
            onOk={handleOk}
            //confirmLoading={confirmLoading}
            onCancel={handleCancel}
            afterOpenChange={onModalOpenChange}
            afterClose={onClosingCompletely}
            footer={clickedEdit ? 
                (_, { OkBtn, CancelBtn }) => (
                    <>
                        <Button onClick={onClickFinishButton} type="primary">Finish</Button>
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
            {false ? (
                    <Divider>
                        {/*Please don't delete this divider!*/}
                        {clickedEdit}
                    </Divider>
                ) : (
                    <></>
            )}
            
            {clickedEdit ? (
                <>
                    <div>
                        Edit Start and End: 
                    </div>
                    <Row>
                        <RangePicker 
                            {...rangeConfig} 
                            showTime 
                            format={dateTimeFormat}
                            defaultValue={clickedEdit ? [
                                dayjs(getMostRecentRange()[0], dateTimeFormat), 
                                dayjs(getMostRecentRange()[1], dateTimeFormat)
                            ] : []}
                            onChange={(e) => {
                                if(e != null)
                                {
                                    setRangePickerBuffer(e);
                                }
                            }}
                            status={rangePickerStatus}
                        />
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
                    }
                </>
                
            ) : (
                <>
                    {currEvent.groupId !== '' ? <></> : (
                        <div>
                            Start: {getMostRecentRange()[0]}
                            <Divider type="vertical" />
                            End: {getMostRecentRange()[1]}
                        </div>
                    )}
                    
                    {
                        (descCopy.length > 0) ?
                        (
                            <div>
                                Description: {descCopy}
                            </div>
                        ) : (
                            <></>
                        )
                    }
                </>
            )}
            
        </Modal>
    );
};
export default ClickEventPopup;