import React from 'react'
import Sidebar from "../Sidebar";
import { Outlet } from "react-router-dom";

const TaskerLayout = () => {
  return (
    <div className="flex">
    <div>
      <Sidebar />
    </div>
    <div>
      <Outlet />
    </div>
  </div>
  )
}

export default TaskerLayout
