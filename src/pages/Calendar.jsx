import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import InteractionPlugin from '@fullcalendar/interaction';
import React, { useState, useEffect, useRef } from 'react';
import ClickEventPopup from '../components/ClickEventPopup';
import AddEventButtonPopup from '../components/AddEventPopup';

let clickedEvent = {
    id: "randomlyInitializedEvent",
    title: "Random Event",
    start: new Date('9999-03-28T11:00:00'),
    end: new Date('9999-03-28T12:20:00'),
    extendedProps: {
        description: ''
    }
};

const event_list = [
    {
        id: "event1",
        title: "CS449 Deep Learning",
        start: '2024-03-28T09:30:00',
        end: '2024-03-28T11:50:00',
        description: '',
    },
    {
        id: "event2",
        title: "CS449 Graduate Algorithm",
        start: '2024-03-28T11:00:00',
        end: '2024-03-28T12:20:00',
        description: 'Lecture',
    }
];

let calendarRefCopy = null;

const CalendarPage = () => {

    const calendarRef = React.useRef(null);

    const [eventsInCalendar, setEventsInCalendar] = useState(event_list);

    const [showClickEventPopup, setShowClickEventPopup] = useState(false);

    const [showAddEventButtonPopup, setShowAddEventButtonPopup] = useState(false);
    
    //const [showTodoPopup, setShowTodoPopup] = useState(false);

    const changeClickedEvent = (aEvent) => {
        clickedEvent = aEvent;
        return Promise.resolve();
    }

    const onEventClickCustom = (info) => {
        changeClickedEvent(info.event).then(
            () => {
                setShowClickEventPopup(true);
                //console.log(clickedEvent);
            }
        );
    };

    const onEventRemove = ({aEvent, revert}) => {

    };

    const fetchCalendarRef = () => {
        return calendarRef;
    }

    useEffect(
        () => {
            calendarRefCopy = fetchCalendarRef();
        }, []
    )

    const onEventAdd = (newEvent) => {
        console.log(calendarRef.current, newEvent);
        calendarRef.current.getApi().addEvent(newEvent);
    };

    const onEventChange = ({aEvent}) => {

    }

    return (
        <>
            <div>
                <AddEventButtonPopup 
                    open={showAddEventButtonPopup} 
                    setOpen={setShowAddEventButtonPopup} 
                    onEventAdd={onEventAdd}
                />
            </div>
            <div>
                <FullCalendar 
                    ref={calendarRef}
                    plugins={[dayGridPlugin, timeGridPlugin, InteractionPlugin]}
                    initialView="timeGridDay"
                    headerToolbar={{
                        center:"timeGridWeek,timeGridDay"
                    }}
                    editable
                    timeZone='UTC'
                    events = {eventsInCalendar}
                    eventClick={onEventClickCustom}
                    eventChange={onEventChange}
                    eventRemove={onEventRemove}
                    eventAdd={onEventAdd}
                />
                <ClickEventPopup 
                    open={showClickEventPopup}
                    setOpen={setShowClickEventPopup}
                    currEvent={clickedEvent}
                    calendarRef={calendarRefCopy}
                />
            </div>
        </>
    );
}

export default CalendarPage;