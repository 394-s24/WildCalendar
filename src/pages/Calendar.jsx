// FullCalendar Imports
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import rrulePlugin from "@fullcalendar/rrule";
import InteractionPlugin from "@fullcalendar/interaction";
// Other Imports
import React, { useState, useEffect, useRef } from "react";
import ClickEventPopup from "../components/ClickEventPopup";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import { observeAuthState, getData, updateData, removeData,setData } from '../firebase';

const CalendarPage = () => {

  // References
  const calendarRef = useRef(null);

  const navigate = useNavigate();

  // Authentication check and redirection
  useEffect(() => {
    const unsubscribe = observeAuthState(user => {
      if (!user) {
        navigate("/login");
      }
    });
    return () => unsubscribe && unsubscribe(); // Clean up the subscription
  }, [navigate]);

  // Events, Event popup boolean, Window sizing, Recently clicked event
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [showClickEventPopup, setShowClickEventPopup] = useState(false);
  const [width, setWidth] = useState(window.innerWidth);
  const [clickedEvent, setClickedEvent] = useState({
    id: "0",
    title: "Title",
    start: new Date("9999-03-28T11:00:00"),
    end: new Date("9999-03-28T12:20:00"),
    extendedProps: {
      description: ""
    }
  });

  // Width detection for toolbar responsiveness
  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Update calendar events on change
  const updateEvents = async () => {
    try {
      const snapshot = await getData("events");
      const data = snapshot.val();
      console.log(data)
      const temp_list = [];
      for (let id in data) {
        temp_list.push(data[id]);
      }
      setCalendarEvents(temp_list);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
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

  const onEventRemove = async (changedInfo) => {
    console.log("onRemove!");
    let newEvent = changedInfo.event.toPlainObject({
      collapseExtendedProps: true,
    });
    await removeData(`events/${newEvent.id}`).catch((error) => {
      console.error("Error removing new item: ", error);
    });
    calendarEvents.map(async (item) => {
      if (
        newEvent.groupId !== "" &&
        item.groupId == newEvent.groupId &&
        item.id !== newEvent.id
      ) {
        let event1 = calendarRef.current.getApi().getEventById(item.id);
        if (event1) {
          event1.remove();
          // await remove(ref(database, `events/${item.id}`)).catch((error) => {
          //   console.error("Error removing new item: ", error);
          // });
          await removeData(`events/${item.id}`).catch((error) => {
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
    console.log(`/events/${newEvent.id}`)
    const updates = {};
    updates[`/events/${newEvent.id}`] = newEvent;
    // await update(ref(database), updates).catch((error) => {
    //   console.error("Error adding new item: ", error);
    // });
    await setData(`/events/${newEvent.id}`, newEvent).catch((error) => {
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
    //console.log("new Event: ", newEvent);
    const updates = {};
    updates[`/events/${newEvent.id}`] = newEvent;
    await updateData(``, updates).catch((error) => {
      console.error("Error adding new item: ", error);
    });
  };

  // On-Mount event initialization
  useEffect(() => {
    updateEvents();
    console.log("Events initialized.");
  }, []);

  // Handle event click
  const onEventClick = (info) => {
    setClickedEvent(info.event);
    setShowClickEventPopup(true);
  };

  return (
    <div className="mx-auto flex">
      <div className="fixed h-screen">
        <Sidebar calendarRef={calendarRef} />
      </div>
      <div className="pt-24 px-2 sm:px-4 sm:ps-20 lg:ps-64 flex-grow w-screen mx-auto">
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
                width > 700
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
              events={calendarEvents}
              eventClick={onEventClick}

              eventChange={onEventChange}
              eventRemove={onEventRemove}
              eventAdd={onEventAdd}


              eventColor="#20025a"
            />
            <ClickEventPopup
              open={showClickEventPopup}
              setOpen={setShowClickEventPopup}
              currEvent={clickedEvent}
              calendarRef={calendarRef}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Export
export default CalendarPage;
