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
import dayjs from 'dayjs';
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";

let clickedEvent = {
  id: "randomlyInitializedEvent",
  title: "Random Event",
  start: new Date("9999-03-28T11:00:00"),
  end: new Date("9999-03-28T12:20:00"),
  extendedProps: {
    description: "",
  },
};

//let clickedCell = null;

const CalendarPage = () => {
  const calendarRef = React.useRef(null);
  const [eventsInCalendar, setEventsInCalendar] = useState([]); //cs_classes_list.slice(1,4)
  const [classList, setClassList] = useState([]);
  const [showClickEventPopup, setShowClickEventPopup] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [clickedCell, setClickedCell] = useState(null);
  const [showAddEventButtonPopup, setShowAddEventButtonPopup] = useState(false);

  const navigate = useNavigate();
  const auth = getAuth();

  // Authentication check and redirection
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (!user) {
        // User is not signed in; redirect them to the login page
        navigate("/login");
      }
    });

    return () => unsubscribe(); // Clean up the subscription
  }, [navigate]);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetEventsFromDB();
    fetClassesFromDB();
    console.log("useEffect called!");
  }, []);

  const fetEventsFromDB = () => {
    const eventsRef = ref(database, "events");
    const eventListener = onValue(eventsRef, (snapshot) => {
      const eventData = snapshot.val();
      let tmp_list = []; //events_list[]
      if (eventData) {
        Object.entries(eventData).forEach(([_, item]) => {
          let item_copy = item;
          if(item.recurEvent)
          {
            console.log(item.startRecur)
            let startrecur1 = new Date(item.startRecur);
            startrecur1.setDate(startrecur1.getDate() + 1)
            let startrecur1_string = startrecur1.toISOString().split("T")[0]
            let endrecur1 = new Date(item.endRecur);
            endrecur1.setDate(endrecur1.getDate() + 1)
            let endrecur1_string = endrecur1.toISOString().split("T")[0]
            item_copy = {
              ...item,
              startRecur: startrecur1_string,
              endRecur: endrecur1_string
            }
          }
          tmp_list = [...tmp_list, item];
        });
        setEventsInCalendar(tmp_list);
      }
    });

    return () => {
      eventListener();
    };
  };

  const fetClassesFromDB = () => {
    const classesRef = ref(database, "NWUClass");
    const classListener = onValue(classesRef, (snapshot) => {
      const classData = snapshot.val();
      if (classData) {
        setClassList(classData);
      }
    });
    return () => {
      classListener();
    };
  };

  const fetchCalendarRef = () => {
    return calendarRef;
  };

  const changeClickedEvent = (aEvent) => {
    clickedEvent = aEvent;
    return Promise.resolve();
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

  const onEventClickCustom = (info) => {
    console.log("onClick!");

    changeClickedEvent(info.event).then(() => {
      console.log(clickedEvent)
      setShowClickEventPopup(true);
    });
  };

  // const changeClickedCell = (aCell) => {
  //   clickedCell = aCell;
  //   return Promise.resolve();
  // };

  const dateClick = (info) => {
    console.log("Date clicked: ", info.dateStr);
    setClickedCell(info.dateStr);
    // changeClickedCell(info.dateStr).then(() => {

    setShowAddEventButtonPopup(true);
    //   console.log("State should now contain the clicked date:", clickedCell);
    // });

  }

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
    console.log(addInfo.event);
    let newEvent = addInfo.event.toPlainObject({ collapseExtendedProps: true });
    if(addInfo.event.extendedProps.recurEvent)
    {
      newEvent = {
        ...newEvent,
        startTime: millsecToTime(addInfo.event._def.recurringDef.typeData.startTime['milliseconds']),
        endTime: millsecToTime(addInfo.event._def.recurringDef.typeData.endTime['milliseconds']),
        startRecur: addInfo.event._def.recurringDef.typeData.startRecur.toISOString().split('T')[0],
        endRecur: addInfo.event._def.recurringDef.typeData.endRecur.toISOString().split('T')[0],
        daysOfWeek: addInfo.event._def.recurringDef.typeData.daysOfWeek,
      }
    }
    const updates = {};
    updates[`/events/${newEvent.id}`] = newEvent;
    await update(ref(database), updates).catch((error) => {
      console.error("Error adding new item: ", error);
    });
  };

  const onEventChange = async (changedInfo) => {
    console.log("onChange!");
    console.log(changedInfo.event);
    let newEvent = changedInfo.event.toPlainObject({
      collapseExtendedProps: true,
    });
    if(changedInfo.event.extendedProps.recurEvent)
    {
      newEvent = {
        ...newEvent,
        startTime: millsecToTime(changedInfo.event._def.recurringDef.typeData.startTime['milliseconds']),
        endTime: millsecToTime(changedInfo.event._def.recurringDef.typeData.endTime['milliseconds']),
        startRecur: changedInfo.event._def.recurringDef.typeData.startRecur,
        endRecur: changedInfo.event._def.recurringDef.typeData.endRecur,
        daysOfWeek: changedInfo.event._def.recurringDef.typeData.daysOfWeek,
      }
    }
    console.log("new Event: ", newEvent);
    const updates = {};
    updates[`/events/${newEvent.id}`] = newEvent;
    await update(ref(database), updates).catch((error) => {
      console.error("Error adding new item: ", error);
    });
  };

  const setClickedCellfunc = (e) => {
    setClickedCell(e);
  }

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
              timeZone="local"
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
              setClickedDateTime={setClickedCellfunc}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
