import { Button } from "@/components/Button";
import ClassSearch from "../components/ClassSearch";
import AddEventButtonPopup from "../components/AddEventPopup";
import {
  SettingOutlined,
  FilterOutlined,
  MenuOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import React, { useState, useEffect, useRef } from "react";
import { database } from "../firebase";
import { ref, update, push, remove, onValue } from "@firebase/database";
import { message } from "antd";
import { Modal, Form, DatePicker, Input } from "antd";

const Sidebar = ({ calendarRef }) => {
  const [searchMenuOpen, setSearchMenuOpen] = useState(false);
  const [eventMenuOpen, setEventMenuOpen] = useState(false);
  const [showAddEventButtonPopup, setShowAddEventButtonPopup] = useState(false);
  const handleCancel = () => {
    setSearchMenuOpen(false);
  };
  const handleCancelEvent = () => {
    setEventMenuOpen(false);
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <nav
      role="navigation"
      className={
        "bg-slate-50 z-20 border-r border-slate-100 shadow-sm absolute left-0 top-15 h-screen py-[4.5em] duration-300 ease-in-out md:fixed md:translate-x-0"
      }
    >
      {/* small */}
      <div
        className={`text-slate-500  sm:hidden relative flex flex-row justify-center items-center gap-6 h-12 w-screen sm:w-60 sm:h-screen overflow-hidden bg-gray-200`}
      >
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSearchMenuOpen(!searchMenuOpen)}
        >
          <SearchOutlined />
        </Button>
        <AddEventButtonPopup
          open={showAddEventButtonPopup}
          setOpen={setShowAddEventButtonPopup}
          calendarRef={calendarRef}
          buttonType="scr_small"
        />
        <Button variant="outline" size="sm">
          <SettingOutlined />
        </Button>
      </div>
      <Modal
        title="Search Classes"
        open={searchMenuOpen}
        onCancel={handleCancel}
      >
        <ClassSearch calendarRef={calendarRef}/>
      </Modal>
      {/* med */}
      <div className="my-10 px-3 hidden sm:flex lg:hidden flex-col justify-center items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSearchMenuOpen(!searchMenuOpen)}
        >
          <SearchOutlined />
        </Button>
        <AddEventButtonPopup
          open={showAddEventButtonPopup}
          setOpen={setShowAddEventButtonPopup}
          calendarRef={calendarRef}
          buttonType="scr_small"
        />
        <Button variant="outline" size="sm">
          <SettingOutlined />
        </Button>
      </div>
      {/* large */}
      <div className="my-10 hidden lg:flex flex-col justify-center gap-6 items-center px-3">
        <div className="bg-gray-200 p-2 flex flex-col justify-center rounded-md text-sm font-medium w-full">
          <p className="ms-1 mb-2 text-[16px]">Add Classes</p>
          <ClassSearch calendarRef={calendarRef}/>

          <div className="flex justify-start items-start mt-1">
            <Button variant="outline" size="tester">
              <FilterOutlined />
            </Button>
            <Button variant="outline" size="tester" className="ml-1">
              <MenuOutlined />
            </Button>
            <Button variant="outline" size="tester" className="ml-1">
              <PlusOutlined />
            </Button>
          </div>
        </div>
        <div className="bg-gray-200 p-2 flex flex-col justify-center rounded-md text-sm font-medium w-full">
          <p className="ms-1 mb-2 text-[16px]">New Event</p>
          <AddEventButtonPopup
            open={showAddEventButtonPopup}
            setOpen={setShowAddEventButtonPopup}
            calendarRef={calendarRef}
            buttonType="default"
          />
        </div>
        <Button variant="secondary" className="w-full flex justify-start">
          <SettingOutlined />
          <p className="ms-2 text-[16px]">Settings</p>
        </Button>
      </div>
    </nav>
  );
};

export default Sidebar;
