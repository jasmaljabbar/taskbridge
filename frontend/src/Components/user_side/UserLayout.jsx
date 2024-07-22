import React from "react";
import { Outlet } from "react-router-dom";
import UserNavbar from "../common/UserNavbar";

const UserLayout = () => {
  return (
    <div>
      <UserNavbar />

      <div className=" mt-[5%]">
        <Outlet />
      </div>
    </div>
  );
};

export default UserLayout;
