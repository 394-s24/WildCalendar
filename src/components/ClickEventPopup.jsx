import React, { useState, useEffect } from 'react';
import { Button, Modal, Divider, DatePicker, Row, Input, Popconfirm } from 'antd';
import dayjs from 'dayjs';
import { getDatabase, ref, update, push, remove, onValue } from "@firebase/database";

const convertDateToStr = (aDate) => {
    let str1 = aDate.toISOString();
    let tmp_list = str1.split(".")[0].split("T")
    let str2 = tmp_list[0]+" "+tmp_list[1];
    return (str1.length > 0 ? str2 : "");
  }
const dateTimeFormat = "YYYY-MM-DD HH:mm";

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
        if(open && calendarRef != null && calendarRef.current != null)
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
        if (calendarRef != null && calendarRef.current != null) {
          let event1 = calendarRef.current.getApi().getEventById(currEvent.id);
          const removalId = event1.extendedProps.firebaseId;
          console.log('event1', event1)
          console.log('removal id', removalId)
          const db = getDatabase();
          const eventRef = ref(db, `events/${removalId}`)
          remove(eventRef);
          event1.remove();
          setOpen(false);
        }
    };

    const onClosingCompletely = () => {
        setOpen(false);
        setClickedEdit(false);
        setRangePickerStatus("");
        setDescCopy("")
    };

    const onClickEditButton = () => {
      if (calendarRef != null && calendarRef.current != null) {
        let event1 = calendarRef.current.getApi().getEventById(currEvent.id);
        setDescCopy(event1.extendedProps.description);
        setClickedEdit(true);
      }
    };

    const onClickFinishButton = () => {
        if (calendarRef != null && calendarRef.current != null) {
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
        }
    };

    const onClickCancelEditButton = () => {
        setClickedEdit(false);
        setRangePickerStatus("");
    };

    const getMostRecentRange = () => {
        console.log(currEvent)
        if(calendarRef != null && calendarRef.current != null)
        {
            let event1 = calendarRef.current.getApi().getEventById(currEvent.id);
            if(event1 != null)
            {
                // return [convertDateToStr(event1.start), convertDateToStr(event1.end)];
            }

        }
        return [];
    }

    return (
        <Modal
            title={currEvent.groupId}
            open={open}
            onOk={handleOk}
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
                        <DatePicker onChange={onChange} />
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


  // // Handle event delete
  // const onEventRemove = async (info) => {
  //   console.log("onRemove!");
  //   let newEvent = info.event.toPlainObject({
  //     collapseExtendedProps: true,
  //   });
  //   await remove(ref(database, `events/${newEvent.id}`)).catch((error) => {
  //     console.error("Error removing new item: ", error);
  //   });
  //   calendarEvents.map(async (item) => {
  //     if (
  //       newEvent.groupId !== "" &&
  //       item.groupId == newEvent.groupId &&
  //       item.id !== newEvent.id
  //     ) {
  //       let event1 = calendarRef.current.getApi().getEventById(item.id);
  //       if (event1) {
  //         event1.remove();
  //         await remove(ref(database, `events/${item.id}`)).catch((error) => {
  //           console.error("Error removing new item: ", error);
  //         });
  //       }
  //     }
  //   });
  // };

  // // Handle event change
  // const onEventChange = async (info) => {
  //   console.log("onChange!");
  //   let newEvent = info.event.toPlainObject({
  //     collapseExtendedProps: true,
  //   });
  //   const updates = {};
  //   updates[`/events/${newEvent.id}`] = newEvent;
  //   await update(ref(database), updates).catch((error) => {
  //     console.error("Error adding new item: ", error);
  //   });
  // };