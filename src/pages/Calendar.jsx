import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import rrulePlugin from "@fullcalendar/rrule";
import InteractionPlugin from "@fullcalendar/interaction";
import React, { useState, useEffect, useRef } from "react";
import ClickEventPopup from "../components/ClickEventPopup";
import { database } from "../firebase";
import { ref, update, push, remove, onValue } from "@firebase/database";
import { message } from "antd";
import Sidebar from "../components/Sidebar";
import { cs_classes_list } from "@/lib/courseData";
import AddEventButtonPopup from "../components/AddEventPopup";


let clickedEvent = {
  id: "randomlyInitializedEvent",
  title: "Random Event",
  start: new Date("9999-03-28T11:00:00"),
  end: new Date("9999-03-28T12:20:00"),
  extendedProps: {
    description: "",
  },
};

const CalendarPage = () => {
  const calendarRef = React.useRef(null);
  const [eventsInCalendar, setEventsInCalendar] = useState(cs_classes_list.slice(1,4));
  const [showClickEventPopup, setShowClickEventPopup] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [clickedCell, setClickedCell] = useState(null);
  const [showAddEventButtonPopup, setShowAddEventButtonPopup] = useState(false);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // fetEventsFromDB();
    // fetClassesFromDB();
    console.log("useEffect called!");
  }, []);

  // const fetEventsFromDB = () => {
  //   const eventsRef = ref(database, "events");
  //   const eventListener = onValue(eventsRef, (snapshot) => {
  //     const eventData = snapshot.val();
  //     let tmp_list = []; //events_list[]
  //     if (eventData) {
  //       Object.entries(eventData).forEach(([_, item]) => {
  //         tmp_list = [...tmp_list, item];
  //       });
  //       setEventsInCalendar(tmp_list);
  //     }
  //   });

  //   return () => {
  //     eventListener();
  //   };
  // };

  // const fetClassesFromDB = () => {
  //   const classesRef = ref(database, "NWUClass");
  //   const classListener = onValue(classesRef, (snapshot) => {
  //     const classData = snapshot.val();
  //     if (classData) {
  //       setClassList(classData);
  //     }
  //   });
  //   return () => {
  //     classListener();
  //   };
  // };

  // const fetchCalendarRef = () => {
  //   return calendarRef;
  // };

  const onEventClickCustom = (info) => {
    console.log("onClick!");

    changeClickedEvent(info.event).then(() => {
      setShowClickEventPopup(true);
      console.log(clickedEvent);
    });
  };

  const dateClick = (info) => {
    console.log("Date clicked: ", info.dateStr);
    setClickedCell(info.dateStr);
    console.log(info);
    console.log("State should now contain the clicked date:", clickedCell);
    setShowAddEventButtonPopup(true);
  }

  const changeClickedEvent = (aEvent) => {
    clickedEvent = aEvent;
    return Promise.resolve();
  };

  const onEventRemove = async (changedInfo) => {
    console.log("onRemove!");
    let newEvent = changedInfo.event.toPlainObject({
      collapseExtendedProps: true,
    });
    await remove(ref(database, `events/${newEvent.id}`)).catch((error) => {
      console.error("Error removing new item: ", error);
    });
    eventsInCalendar.map(async (item) => {
      if (
        newEvent.groupId !== "" &&
        item.groupId == newEvent.groupId &&
        item.id !== newEvent.id
      ) {
        let event1 = calendarRef.current.getApi().getEventById(item.id);
        if (event1) {
          event1.remove();
          await remove(ref(database, `events/${item.id}`)).catch((error) => {
            console.error("Error removing new item: ", error);
          });
        }
      }
    });
  };

  const onEventAdd = async (addInfo) => {
    console.log("onAdd!");
    console.log(addInfo);
    let newEvent = addInfo.event.toPlainObject({ collapseExtendedProps: true });
    // if (
    //   recurringEvent.id === newEvent.id &&
    //   recurringEvent.groupId === newEvent.groupId
    // ) {
    //   newEvent = recurringEvent;
    // }
    const updates = {};
    updates[`/events/${newEvent.id}`] = newEvent;
    await update(ref(database), updates).catch((error) => {
      console.error("Error adding new item: ", error);
    });
  };

  const onEventChange = async (changedInfo) => {
    console.log("onChange!");
    let newEvent = changedInfo.event.toPlainObject({
      collapseExtendedProps: true,
    });
    const updates = {};
    updates[`/events/${newEvent.id}`] = newEvent;
    await update(ref(database), updates).catch((error) => {
      console.error("Error adding new item: ", error);
    });
  };

  return (
    <div className="mx-auto flex">
      <div className="fixed h-screen">
        <Sidebar calendarRef={calendarRef} />
      </div>
      <div className="pt-24 px-2 sm:px-4 sm:ps-20 lg:ps-64 flex-grow w-screen mx-auto">
        {contextHolder}
        <div className="flex flex-col gap-4">
          <div>
            <FullCalendar
              ref={calendarRef}
              plugins={[
                dayGridPlugin,
                timeGridPlugin,
                InteractionPlugin,
                rrulePlugin,
              ]}
              initialView="timeGridWeek"
              titleFormat={{
                year: "numeric",
                month: "long",
                day: "numeric",
              }}
              headerToolbar={
                windowWidth > 700
                  ? {
                      start: "prev,next today",
                      center: "title",
                      end: "timeGridWeek,timeGridDay,dayGridMonth",
                    }
                  : {
                      start: "",
                      center: "title",
                      end: "today timeGridWeek,timeGridDay,dayGridMonth",
                    }
              }
              buttonText={{
                today: "Today",
                month: "Month",
                week: "Week",
                day: "Day",
                list: "List",
              }}
              editable
              expandRows
              aspectRatio={0.8}
              timeZone="CST"
              events={eventsInCalendar}
              eventClick={onEventClickCustom}
              eventChange={onEventChange}
              eventRemove={onEventRemove}
              eventAdd={onEventAdd}
              eventColor="#20025a"
              dateClick={dateClick}
              
            />
            <ClickEventPopup
              open={showClickEventPopup}
              setOpen={setShowClickEventPopup}
              currEvent={clickedEvent}
              calendarRef={calendarRef}
            />
            <AddEventButtonPopup
              open={showAddEventButtonPopup}
              setOpen={setShowAddEventButtonPopup}
              calendarRef={calendarRef}
              buttonType="scr_small"
              clickedDateTime={clickedCell}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
