import React from "react";
import { Outlet } from "react-router-dom";
import MessageSidebar from "./MessageSidebar"; // Adjust the path as necessary

function MainLayout() {
  return (
    <div className="flex h-screen pt-7">
      <MessageSidebar />
      <div className="flex-1  bg-gray-100 overflow-hidden">
        <Outlet className="h-full overflow-auto" />{" "}
      </div>
    </div>
  );
}

export default MainLayout;
