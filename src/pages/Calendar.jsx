import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import rrulePlugin from '@fullcalendar/rrule'
import InteractionPlugin from '@fullcalendar/interaction';
import React, { useState, useEffect, useRef } from 'react';
import ClickEventPopup from '../components/ClickEventPopup';
import AddEventButtonPopup from '../components/AddEventPopup';
import { database } from '../firebase';
import {ref, onValue, push} from '@firebase/database';
// import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../components/Navbar.jsx";
import SearchClassEventButton from '../components/SearchClassEventButton.jsx'
import { ref, update, push, remove, onValue } from '@firebase/database';
import { message } from 'antd'

let clickedEvent = {
    id: "randomlyInitializedEvent",
    title: "Random Event",
    start: new Date('9999-03-28T11:00:00'),
    end: new Date('9999-03-28T12:20:00'),
    extendedProps: {
        description: ''
    }
};

let event_list = [
    {
        "CS449-Deep Learning": {
            0: {
                id: "event1",
                groupId: "CS449-Deep Learning",
                title: 'CS449',
                startTime: "11:00:00.000",
                endTime: "12:20:00.000",
                daysOfWeek: [2,4],
                startRecur: "2024-03-25",
                endRecur: "2024-06-05",
                editable: false,
                NWUClass: true,
                description: ""
            },
            1: {
            id: "event2",
            groupId: "CS449-Deep Learning",
            title: 'CS449-Lab',
            startTime: "14:00:00.000",
            endTime: "14:30:00.000",
            daysOfWeek: [3],
            startRecur: "2024-03-25",
            endRecur: "2024-06-05",
            editable: false,
            NWUClass: true,
            description: ""
            }
        },
        "CS496-1-Graduate Algorithm": {
            0: {
                id: "event3",
                groupId: "CS496-1-Graduate Algorithm",
                title: 'CS496-1',
                startTime: "09:30:00.000",
                endTime: "10:50:00.000",
                daysOfWeek: [2,4],
                startRecur: "2024-03-25",
                endRecur: "2024-06-05",
                editable: false,
                NWUClass: true,
                description: ""
            },
        },
        "CS394-Agile Software Development": {
            0: {
                id: "event4",
                groupId: "CS394-Agile Software Development",
                title: 'CS394',
                startTime: "09:30:00.000",
                endTime: "10:50:00.000",
                daysOfWeek: [1,3],
                startRecur: "2024-03-25",
                endRecur: "2024-06-05",
                editable: false,
                NWUClass: true,
                description: ""
            },
        }
    }
]

let recurringEvent = null;
// let class_list = null;

const dateTimeFormat = "YYYY-MM-DDTHH:mm:ss";
let calendarRefCopy = null;

const CalendarPage = () => {

    const calendarRef = React.useRef(null);

    const [class_list, setClassList] = useState(null);

    const [eventsInCalendar, setEventsInCalendar] = useState(event_list);

    const [showClickEventPopup, setShowClickEventPopup] = useState(false);

    const [showAddEventButtonPopup, setShowAddEventButtonPopup] = useState(false);

    const [messageApi, contextHolder] = message.useMessage();

    const addRecurringError = () => {
        messageApi.open({
          type: 'error',
          content: 'The course has already been added!',
        });
      };

    useEffect( () => {
        calendarRefCopy = fetchCalendarRef();
        fetEventsFromDB();
        fetClassesFromDB();
        console.log('useEffect called!')
        // const updates = {};
        // updates[`/NWUClass`] = event_list[0];
        // await update(ref(database), updates)
        //     .catch((error) => {
        //         console.error("Error adding new item: ", error);
        //     });
      }, []);
    
    const fetEventsFromDB = () => {
        const eventsRef = ref(database, 'events');
        const eventListener = onValue(eventsRef, (snapshot) =>
        {
            const eventData = snapshot.val();
            let tmp_list = []//event_list[]

            // event_list.map((item) => {
            //     Object.entries(item).map(([_, content]) => {
            //         Object.entries(content).map(
            //             ([_, content1]) => {
            //                 tmp_list = [
            //                     ...tmp_list,
            //                     content1
            //                 ]
            //             }
            //         )
            //     })
            // })

            if(eventData)
            {
                Object.entries(eventData).forEach(([_, item]) => {
                    tmp_list = [
                        ...tmp_list,
                        item
                    ]
                });
                setEventsInCalendar(tmp_list);
            } 
        });
    
        return () => {
          eventListener();
        };
    }

    const fetClassesFromDB = () => {
        const classesRef = ref(database, 'NWUClass');

        const classListener = onValue(classesRef, (snapshot) =>
        {
            const classData = snapshot.val();
            if(classData)
            {
                setClassList(classData);
            } 
        });
    
        return () => {
          classListener();
        };
    }

    const changeClickedEvent = (aEvent) => {
        clickedEvent = aEvent;
        return Promise.resolve();
    }

    const fetchCalendarRef = () => {
        return calendarRef;
    }

    const onEventClickCustom = (info) => {
        console.log("onClick!");
        //console.log(info.event.extendedProps.hasOwnProperty("groupId"))
        changeClickedEvent(info.event).then(
            () => {
                setShowClickEventPopup(true);
                //console.log(clickedEvent);
            }
        );
    };

    const onEventRemove = async (changedInfo) => {
        console.log("onRemove!");
        let newEvent = changedInfo.event.toPlainObject({'collapseExtendedProps': true});
        await remove(ref(database, `events/${newEvent.id}`))
            .catch((error) => {
                console.error("Error removing new item: ", error);
            });
        eventsInCalendar.map(async (item) => {
            if(newEvent.groupId !== '' && item.groupId == newEvent.groupId && item.id !== newEvent.id)
            {
                let event1 = calendarRef.current.getApi().getEventById(item.id);
                if(event1)
                {
                    event1.remove();
                    await remove(ref(database, `events/${item.id}`))
                    .catch((error) => {
                        console.error("Error removing new item: ", error);
                    });
                }
            }
        })
    };

    const onEventAdd = async (addInfo) => {
        console.log("onAdd!");
        let newEvent = addInfo.event.toPlainObject({'collapseExtendedProps': true})

        if(recurringEvent.id === newEvent.id && recurringEvent.groupId === newEvent.groupId)
        {
            newEvent = recurringEvent;
        }

        //console.log(addInfo.event)
        const updates = {};
        updates[`/events/${newEvent.id}`] = newEvent;
        await update(ref(database), updates)
            .catch((error) => {
                console.error("Error adding new item: ", error);
            });
    };

    const onEventChange = async (changedInfo) => {
        console.log("onChange!");
        let newEvent = changedInfo.event.toPlainObject({'collapseExtendedProps': true});
        const updates = {};
        updates[`/events/${newEvent.id}`] = newEvent;
        await update(ref(database), updates)
            .catch((error) => {
                console.error("Error adding new item: ", error);
            });
    }

    const addanEvent = (newEvent) => {
        //
        newEvent['editable'] = false;
        recurringEvent = newEvent;
        let event1 = calendarRef.current.getApi().getEventById(newEvent.id);
        if(!event1)
        {
            calendarRef.current.getApi().addEvent(newEvent);
        }
        else{
            addRecurringError();
        }
        //console.log(recurringEvent)
    }

    return (
        <div>
         {contextHolder}
         <Navbar />
         <div className='p-5'>
            <div className='flex gap-2 py-4'>
                <AddEventButtonPopup
                    open={showAddEventButtonPopup}
                    setOpen={setShowAddEventButtonPopup}
                    calendarRef={calendarRefCopy}
                />
                <SearchClassEventButton onEventAdd={addanEvent} class_list={class_list}/>
            </div>
            <div>
                <FullCalendar
                    ref={calendarRef}
                    plugins={[dayGridPlugin, timeGridPlugin, InteractionPlugin, rrulePlugin]}
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
         </div>
        </div>
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

    const addExampleClassItems = (eventNames) => {

        eventNames.forEach(eventName => {
            const ClassRef = ref(database, 'className');
            const exampleClassItems = [
                {
                    eventName: eventName,
                    description: 'Deep Learning taught by Professor Bryan Pardo',
                    start: '2024-03-4T11:00:00',
                    end: '2024-04-3T12:20:00',
                    location: 'Tech LR5'
                },

                {
                    eventName: eventName,
                    description: 'Agile Software Development taught by Professor Chris Riesbeck',
                    start: '2024-03-4T9:30:00',
                    end: '2024-04-3T10:50:00',
                    location: 'Tech LR5'
                },

                {
                    eventName: eventName,
                    description: 'Human Computer Interaction taught by Professor Victoria Chavez',
                    start: '2024-03-4T14:30:00',
                    end: '2024-04-3T16:00:00',
                    location: 'Tech LR3'
                },
            ];

            exampleClassItems.forEach((className) => {
                push(ref(database, `class/${eventName}`), className);
            });
        })
    }
    // useEffect(() => {
    //     addExampleCareerItems(['Career Day Fair']);
    //     addExampleClassItems(['CS449', 'CS394', 'CS330']);
    // }, []);
