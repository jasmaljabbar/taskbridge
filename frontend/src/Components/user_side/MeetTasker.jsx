import React, { useState } from "react";
import { useSelector } from "react-redux";
import { FaBars, FaTimes } from "react-icons/fa";
import { TbListDetails, TbCalendarCheck } from "react-icons/tb";
import { TiMessages } from "react-icons/ti";
import { Link } from "react-router-dom";

const MeetTasker = () => {
  const taskerInfo = useSelector((state) => state.auth.taskerDetails);
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  if (!taskerInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-screen flex flex-col items-center">
      <div className="bg-slate-500 z-20 fixed w-full h-1/4  flex items-center justify-center">
        <img
          src={
            taskerInfo.work_photo
              ? `http://127.0.0.1:8000${taskerInfo.work_photo}`
              : "fallback_image_url"
          }
          alt="Tasker Work"
          className="w-full h-full object-cover"
        />
        <div className="absolute flex items-center z-20 top-[110%] left-[35%] transform -translate-x-1/2 -translate-y-1/2">
          <img
            className="w-32 h-32 rounded-full object-cover border-4 border-white"
            src={
              taskerInfo.profile_pic
                ? `http://127.0.0.1:8000${taskerInfo.profile_pic}`
                : "fallback_profile_photo_url"
            }
            alt="Tasker"
          />
          <h2 className="text-2xl font-bold ml-4 text-black">
            {taskerInfo.full_name}
          </h2>
        </div>
      </div>
      <div className="md:hidden fixed top-0 left-0 z-20 p-4">
        <button
          onClick={toggleSidebar}
          className="text-white focus:outline-none"
        >
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>
      <div
        className={`fixed top-40 left-0 h-full w-64 bg-gray-800 text-white p-3 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out z-10`}
      >
        <nav className="mt-10">
          <div className="mb-4">
            <Link
              to={`/details/${taskerInfo.user}?user=${taskerInfo.user}`}
              className="flex items-center py-2.5 px-4 rounded hover:bg-gray-700"
            >
              <TbListDetails className="mr-3" /> Details
            </Link>
            <Link
              to="message"
              className="flex items-center py-2.5 px-4 rounded hover:bg-gray-700"
            >
              <TiMessages className="mr-3" /> Message
            </Link>
            <Link
              to="history"
              className="flex items-center py-2.5 px-4 rounded hover:bg-gray-700"
            >
              <TbCalendarCheck className="mr-3" /> Book Now
            </Link>
          </div>
        </nav>
      </div>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-0"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
};

export default MeetTasker;