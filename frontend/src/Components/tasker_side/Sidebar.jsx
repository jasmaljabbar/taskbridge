// src/components/Sidebar.js
import React from "react";
import { MdOutlineFormatAlignCenter } from "react-icons/md";
import { FaTable, FaUser, FaLock, FaGithub } from "react-icons/fa";
import { MdOutlineSubdirectoryArrowRight } from "react-icons/md";
import { MdOutlineHelpOutline } from "react-icons/md";
import { MdOutlineMenuBook } from "react-icons/md";
import { MdDashboard } from "react-icons/md";

const Sidebar = () => {
  return (
    <div className="w-64 bg-gray-800 text-white h-screen p-4">
      <h2 className="text-2xl font-bold">
        Admin <span className="text-yellow-400">One</span>
      </h2>
      <nav className="mt-10">
        <div className="mb-4">
          <p className="text-gray-400 uppercase text-sm mb-2">General</p>
          <a
            href="/tasker/tasker_dashboard"
            className="flex items-center py-2.5 px-4 rounded hover:bg-gray-700"
          >
            <MdDashboard className="mr-3" /> Dashboard
          </a>
        </div>
        <div className="mb-4">
          <p className="text-gray-400 uppercase text-sm mb-2">Examples</p>
          <a
            href="/admin/jesmal"
            className="flex items-center py-2.5 px-4 rounded hover:bg-gray-700"
          >
            <FaTable className="mr-3" /> Tables
          </a>
          <a
            href="/admin/forms"
            className="flex items-center py-2.5 px-4 rounded hover:bg-gray-700"
          >
            <MdOutlineSubdirectoryArrowRight className="mr-3" /> Forms
          </a>
          <a
            href="#"
            className="flex items-center py-2.5 px-4 rounded hover:bg-gray-700"
          >
            <FaUser className="mr-3" /> Profile
          </a>
          <a
            href="#"
            className="flex items-center py-2.5 px-4 rounded hover:bg-gray-700"
          >
            <FaLock className="mr-3" /> Login
          </a>
          <a
            href="#"
            className="flex items-center py-2.5 px-4 rounded hover:bg-gray-700"
          >
            <MdOutlineSubdirectoryArrowRight className="mr-3" /> Submenus
          </a>
        </div>
        <div>
          <p className="text-gray-400 uppercase text-sm mb-2">About</p>
          <a
            href="#"
            className="flex items-center py-2.5 px-4 rounded hover:bg-gray-700"
          >
            <MdOutlineMenuBook className="mr-3" /> Premium Demo
          </a>
          <a
            href="#"
            className="flex items-center py-2.5 px-4 rounded hover:bg-gray-700"
          >
            <MdOutlineHelpOutline className="mr-3" /> About
          </a>
          <a
            href="#"
            className="flex items-center py-2.5 px-4 rounded hover:bg-gray-700"
          >
            <FaGithub className="mr-3" /> GitHub
          </a>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
