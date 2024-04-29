// FullCalendar Imports
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import rrulePlugin from "@fullcalendar/rrule";
import InteractionPlugin from "@fullcalendar/interaction";
// Other Imports
import React, { useState, useEffect, useRef } from "react";
import ClickEventPopup from "../components/ClickEventPopup";
import { database } from "../firebase";
import { getDatabase, ref, update, push, remove, onValue } from "@firebase/database";
import Sidebar from "../components/Sidebar";
import { cs_classes_list } from "@/lib/courseData";
import AddEventButtonPopup from "../components/AddEventPopup";
import dayjs from 'dayjs';

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


// Calendar Page
const CalendarPage = () => {

  // References
  const calendarRef = useRef(null);
  const db = getDatabase();

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
      const handleResize = () => {setWidth(window.innerWidth);}
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Update calendar events on change
  const updateEvents = () => {
    const eventsRef = ref(db, "events");
    onValue(eventsRef, (snapshot) => {
      const data = snapshot.val();
      const temp_list = [];
      for (let id in data) {
        temp_list.push(data[id]);
      }
      setCalendarEvents(temp_list);
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

  // Ret
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
              timeZone="UTC"
              events={calendarEvents}
              eventClick={onEventClick}
              // eventChange={onEventChange}
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

// Export
export default CalendarPage;