import React, { useState, useEffect } from "react";
import { AutoComplete } from "antd";
// import { cs_classes_list } from "@/lib/courseData";
import { getDatabase, ref, onValue } from "firebase/database";

const ClassSearch = ({ calendarRef }) => {
  const [options, setOptions] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [cs_classes_list, setCsClassesList] = useState([]);

  const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const DuplicateAddError = () => {
    console.log("already added");
  };

  useEffect(() => {
    const db = getDatabase();
    const classRef = ref(db, "NWUClass");
    onValue(classRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const temp_list = [];
        for (let id in data) {
          temp_list.push(data[id]);
        }
        setCsClassesList(temp_list);
      }
    });
  }, []);

  const handleSearch = (value) => {
    if (value === "") {
      setOptions([]);
      return;
    }
    const newOptions = cs_classes_list
      .filter(
        (classObj) =>
          classObj[0].groupId.toUpperCase().indexOf(value.toUpperCase()) !== -1
      )
      .map((classObj) => ({ value: classObj[0].groupId }));
    setOptions(newOptions);
  };

  const onSelect = (value) => {
    console.log(value);
    console.log(cs_classes_list[0][0].groupId);
    const selectedClassObj = cs_classes_list.find(
      (classObj) => classObj[0].groupId === value
    )[0];
    setSelectedClass(selectedClassObj);
    console.log(selectedClass);
  };

  const addClassEvent = () => {
    console.log(selectedClass);
    let event1 = calendarRef.current.getApi().getEventById(selectedClass.id);
    console.log(event1);
    if (!event1) {
      calendarRef.current.getApi().addEvent(selectedClass);
    } else {
      DuplicateAddError();
    }
  };

  const convertTo12Hr = (time) => {
    let [hours, minutes] = time.substring(0, time.length - 7).split(":");
    const suffix = +hours < 12 ? "AM" : "PM";
    hours = +hours % 12 || 12;
    return `${hours}:${minutes} ${suffix}`;
  };

  return (
    <>
      <AutoComplete
        style={{
          width: 200,
        }}
        options={options}
        onSearch={handleSearch}
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
export default ClassSearch;
