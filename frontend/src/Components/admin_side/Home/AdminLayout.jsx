import React from "react";
import Admin_Sidebar from "../Admin_Sidebar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="flex">
      <div>
        <Admin_Sidebar />
      </div>
      <div className="flex-1 flex   items-center justify-center">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
