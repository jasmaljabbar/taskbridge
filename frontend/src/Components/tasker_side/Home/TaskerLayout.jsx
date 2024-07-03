import React from "react";
import Sidebar from "../Sidebar";
import { Outlet } from "react-router-dom";

const TaskerLayout = () => {
  return (
    <div className="flex h-screen">
      <div className="w-1/9">
        <Sidebar />
      </div>
      <div className="flex-1 flex pt-96  items-center justify-center">
        <Outlet />
      </div>
    </div>
  );
};

export default TaskerLayout;
