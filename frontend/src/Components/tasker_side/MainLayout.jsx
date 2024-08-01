import React from "react";
import { Outlet } from "react-router-dom";
import MessageSidebar from "./MessageSidebar"; // Adjust the path as necessary

function MainLayout() {
  return (
    <div className="flex w-[75%] h-screen pt-7">
      <MessageSidebar />
      <div className="flex-1   overflow-hidden">
        <Outlet className="h-full overflow-auto" />{" "}
      </div>
    </div>
  );
}

export default MainLayout;
