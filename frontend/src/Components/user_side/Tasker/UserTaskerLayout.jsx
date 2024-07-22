import React from "react";
import { Outlet } from "react-router-dom";
import MeetTasker from "../MeetTasker";

const UserTaskerLayout = () => {
  return (
    <div className="flex">
      <div className=" h-8">
        <MeetTasker />
      </div>
      <div className="h-full flex items-center justify-center ml-[30%] w-[60vw] mt-56">
        <Outlet />
      </div>
    </div>
  );
};

export default UserTaskerLayout;
