import React from "react";
import { Outlet } from "react-router-dom";
import MeetTasker from "../MeetTasker";

const UserTaskerLayout = () => {
  return (
    <div>
      <div className=" w-full h-20">
        <MeetTasker />
      </div>
      <div className="h-full mt-52">
        <Outlet />
      </div>
    </div>
  );
};

export default UserTaskerLayout;
