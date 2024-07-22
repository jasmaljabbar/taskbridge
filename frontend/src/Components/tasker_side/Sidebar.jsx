import React, { useState } from "react";
import {
  FaTable,
  FaUser,
  FaLock,
  FaGithub,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { TiMessages } from "react-icons/ti";
import {
  MdOutlineSubdirectoryArrowRight,
  MdOutlineHelpOutline,
  MdOutlineMenuBook,
  MdDashboard,
} from "react-icons/md";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <div className="md:hidden fixed top-0 left-0 z-20 p-4">
        <button
          onClick={toggleSidebar}
          className="text-white focus:outline-none"
        >
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      <div
        className={`fixed top-16 left-0 h-full w-64 bg-gray-800 text-white p-4 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out z-10`}
      >
        <nav className="mt-10">
          <div className="mb-4">
            <p className="text-gray-400 uppercase text-sm mb-2">General</p>
            <Link
              to={"/tasker/tasker_dashboard"}
              className="flex items-center py-2.5 px-4 rounded hover:bg-gray-700"
            >
              <MdDashboard className="mr-3" /> Dashboard
            </Link>
          </div>
          <div className="mb-4">
            <p className="text-gray-400 uppercase text-sm mb-2">Examples</p>
            <Link
              to=""
              className="flex items-center py-2.5 px-4 rounded hover:bg-gray-700"
            >
              <FaTable className="mr-3" /> Tables
            </Link>

            <Link
              to="/tasker/message_tasker"
              className="flex items-center py-2.5 px-4 rounded hover:bg-gray-700"
            >
              <TiMessages className="mr-3" /> Messages
            </Link>
            <Link
              to="/tasker/profile"
              className="flex items-center py-2.5 px-4 rounded hover:bg-gray-700"
            >
              <FaUser className="mr-3" /> Profile
            </Link>
            <Link
              to="/tasker/appointments"
              className="flex items-center py-2.5 px-4 rounded hover:bg-gray-700"
            >
              <FaLock className="mr-3" /> Appoinm
            </Link>
            <Link
              to="#"
              className="flex items-center py-2.5 px-4 rounded hover:bg-gray-700"
            >
              <MdOutlineSubdirectoryArrowRight className="mr-3" /> Submenus
            </Link>
          </div>
          <div>
            <p className="text-gray-400 uppercase text-sm mb-2">About</p>
            <Link
              to="#"
              className="flex items-center py-2.5 px-4 rounded hover:bg-gray-700"
            >
              <MdOutlineMenuBook className="mr-3" /> Premium Demo
            </Link>
            <Link
              to="#"
              className="flex items-center py-2.5 px-4 rounded hover:bg-gray-700"
            >
              <MdOutlineHelpOutline className="mr-3" /> About
            </Link>
            <Link
              to="#"
              className="flex items-center py-2.5 px-4 rounded hover:bg-gray-700"
            >
              <FaGithub className="mr-3" /> GitHub
            </Link>
          </div>
        </nav>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-0"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
};

export default Sidebar;
