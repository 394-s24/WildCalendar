import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import InteractionPlugin from '@fullcalendar/interaction';
import React, { useState, useEffect, useRef } from 'react';
import ClickEventPopup from '../components/ClickEventPopup';
import AddEventButtonPopup from '../components/AddEventPopup';
import { database } from '../firebase';
import {ref, onValue, push} from '@firebase/database';


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



const addExampleCareerItems = (eventNames) => {

        
    eventNames.forEach(eventName => {
        const CareerRef = ref(database, 'career');
        
        const exampleCareerItems = [
            {
                eventName: eventName,
                description: 'career day event. Attending: Microsoft',
                start: '2024-04-4T11:00:00',
                end: '2024-04-4T14:20:00',
                location: 'Ford'
            }
        ];
    
        exampleCareerItems.forEach((career) => {
            push(ref(database, `career/${eventName}`), career);
        });
    });
};

    // const addExampleClassItems = (eventNames) => {
       
    //     eventNames.forEach(eventName => {
    //         const ClassRef = ref(database, 'className');
    //         const exampleClassItems = [
    //             {
    //                 eventName: eventName,
    //                 description: 'Deep Learning taught by Professor Bryan Pardo', 
    //                 start: '2024-03-4T11:00:00',
    //                 end: '2024-04-3T12:20:00',
    //                 location: 'Tech LR5'
    //             },

    //             {
    //                 eventName: eventName,
    //                 description: 'Agile Software Development taught by Professor Chris Riesbeck', 
    //                 start: '2024-03-4T9:30:00',
    //                 end: '2024-04-3T10:50:00',
    //                 location: 'Tech LR5'
    //             },

    //             {
    //                 eventName: eventName,
    //                 description: 'Human Computer Interaction taught by Professor Victoria Chavez', 
    //                 start: '2024-03-4T14:30:00',
    //                 end: '2024-04-3T16:00:00',
    //                 location: 'Tech LR3'
    //             },
    //         ];

    //         exampleClassItems.forEach((className) => {
    //             push(ref(database, `class/${eventName}`), className);
    //         });
    //     })
    // }
    // useEffect(() => {
    //     addExampleCareerItems(['Career Day Fair']);
    //     addExampleClassItems(['CS449', 'CS394', 'CS330']);
    // }, []);
