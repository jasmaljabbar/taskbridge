import React from "react";
import { FaTable, FaUser, FaLock, FaGithub } from "react-icons/fa";
import { MdOutlineSubdirectoryArrowRight } from "react-icons/md";
import { MdOutlineHelpOutline } from "react-icons/md";
import { MdOutlineMenuBook } from "react-icons/md";
import { MdDashboard } from "react-icons/md";
import { FaUsers } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { GrUserWorker } from "react-icons/gr";

const Admin_Sidebar = () => {
  return (
    <div className="w-64 bg-gray-800 text-white h-screen p-4">
      <h2 className="text-2xl font-bold">
        Admin <span className="text-yellow-400">One</span>
      </h2>
      <nav className="mt-10">
        <div className="mb-4">
          <Link
            to={""}
            className="flex items-center py-2.5 px-4 rounded hover:bg-gray-700"
          >
            <MdDashboard className="mr-3" /> Dashboard
          </Link>
        </div>
        <div className="mb-4">
          <Link
            to={"/admin/tasker_showing"}
            className="flex items-center py-2.5 px-4 rounded hover:bg-gray-700"
          >
            <GrUserWorker className="mr-3" /> Taskers
          </Link>

          <Link
            to={"/admin/user_list"}
            className="flex items-center py-2.5 px-4 rounded hover:bg-gray-700"
          >
            <FaUsers className="mr-3" /> Users
          </Link>
          <Link
            to={"/admin/task_list"}
            className="flex items-center py-2.5 px-4 rounded hover:bg-gray-700"
          >
            <FaUser className="mr-3" /> Task Category
          </Link>
          <Link
            to="#"
            className="flex items-center py-2.5 px-4 rounded hover:bg-gray-700"
          >
            <FaLock className="mr-3" /> Login
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
  );
};

export default Admin_Sidebar;
