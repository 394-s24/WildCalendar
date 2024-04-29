// Imports
import React, { useState, useEffect } from "react";
import { AutoComplete, message } from "antd";
import { getDatabase, ref, onValue, push, set } from "firebase/database";

const ClassSearch = ({ calendarRef }) => {

  // Search options, Selected class, Full class list
  const [options, setOptions] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [classesList, setClassesList] = useState([]);

  // Weekdays array matching 'daysOfWeek' indices
  const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  // Get classes from database on component mount
  useEffect(() => {
    const db = getDatabase();
    const classRef = ref(db, "NWUClass");
    onValue(classRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const temp_list = [];
        for (let id in data) {
          if (data[id][0].startTime) {
            temp_list.push(data[id]);
          }
        }
        setClassesList(temp_list);
      }
    });
  }, []);

  // Autocomplete functionality
  const autocomplete = (value) => {
    if (value === "") {
      setOptions([]);
      return;
    }
    const newOptions = classesList
      .filter(
        (classObj) =>
          classObj[0].groupId.toUpperCase().indexOf(value.toUpperCase()) !== -1
      )
      .map((classObj) => ({ value: classObj[0].groupId }));
    setOptions(newOptions);
  };

  // Set the currently selected class - called when clicking a class in the dropdown
  const onSelect = (value) => {
    const selectedClassObj = classesList.find(
      (classObj) => classObj[0].groupId === value
    )[0];
    selectedClassObj.title = selectedClassObj.groupId;  // Set the title property
    setSelectedClass(selectedClassObj);
  };

  // Re-Format new class data to match the calendar event format
  const buildClassEvent = (c) => {
    return {
      id: c.id,
      title: c.groupId,
      groupId: c.groupId,
      start: c.startDate,
      end: c.endDate,
      daysOfWeek: c.daysOfWeek,
      startTime: c.startTime,
      endTime: c.endTime,
      editable: false,
      NWUClass: true,
      description: ''
      
    };
  };

  // Called to add the actual calendar event when clicking the 'Time/Date' div of the selected class
  const addClassEvent = () => {
    const db = getDatabase();
    const eventRef = ref(db, "events");
    let event1 = calendarRef.current.getApi().getEventById(selectedClass.id);

    if (!event1) {
      const formattedClassEvent = buildClassEvent(selectedClass);

      // const newAutoIdObject = push(eventRef, formattedClassEvent);
      // const newAutoId = newAutoIdObject.key;

      const newEventRef = push(eventRef);
      const newAutoId = newEventRef.key;

      formattedClassEvent.firebaseId = newAutoId;

      set(newEventRef, formattedClassEvent);

      console.log('new auto id', newAutoId)
      
      
      // calendarRef.current.getApi().addEvent(formattedClassEvent);
      message.success("Class added to calendar.");
      console.log('formatted class event', formattedClassEvent);
    } 
    else {
      message.error("Course already added.")
    }
  };

  // String conversion to prettify times to display to user
  const convertTo12Hr = (time) => {
    let [hours, minutes] = time.substring(0, time.length - 7).split(":");
    const suffix = +hours < 12 ? "AM" : "PM";
    hours = +hours % 12 || 12;
    return `${hours}:${minutes} ${suffix}`;
  };

  // Ret
  return (
    <>
      <AutoComplete
        style={{
          width: 200,
        }}
        options={options}
        onSearch={autocomplete}
        onSelect={onSelect}
        placeholder="Search for Classes"
      />
      {selectedClass !== "" && (
        <div
          className="h-20 w-full flex flex-col justify-center items-center text-lg bg-gray-100 rounded-lg mt-2"
          onClick={addClassEvent}
        >
          <p className="text-center">{`${convertTo12Hr(
            selectedClass.startTime
          )} - ${convertTo12Hr(selectedClass.endTime)}`}</p>
          <p className="text-center">
            {selectedClass.daysOfWeek.map((day) => weekDays[day]).join(" ")}
          </p>
        </div>
      )}
    </>
  );
};

// Export
export default ClassSearch;