import React from "react";
import { Outlet } from "react-router-dom";
import MeetTasker from "../MeetTasker";

const UserTaskerLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <div className="h-full">
        <MeetTasker />
      </div>
      <div className="flex-1 flex items-center justify-center ml-[30%] w-[60vw]  relative">
        <div className="absolute top-0 left-0 w-[80%] h-full overflow-hiden">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default UserTaskerLayout;
