import React, { useState } from "react";
import { AutoComplete } from "antd";
import { cs_classes_list } from "@/lib/courseData";

const ClassSearch = ({ calendarRef }) => {
  const [options, setOptions] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");

  const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const DuplicateAddError = () => {
    console.log("already added");
  };

  const handleSearch = (value) => {
    if (value === "") {
      setOptions([]);
      return;
    }
    const newOptions = cs_classes_list
      .filter(
        (classObj) =>
          classObj.title.toUpperCase().indexOf(value.toUpperCase()) !== -1
      )
      .map((classObj) => ({ value: classObj.title }));
    setOptions(newOptions);
  };

  const onSelect = (value) => {
    const selectedClassObj = cs_classes_list.find(
      (classObj) => classObj.title === value
    );
    setSelectedClass(selectedClassObj);
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
            <p className="text-center">{`${selectedClass.startTime} - ${selectedClass.endTime}`}</p>
            <p className="text-center">{selectedClass.daysOfWeek.map(day => weekDays[day]).join(' ')}</p>
          </div>
      )}
    </>
  );
};
export default ClassSearch;