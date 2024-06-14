import React, { useEffect } from "react";
import Img1 from "../../statics/user_side/images/login.jpg";
import { FiSearch } from "react-icons/fi";
import WorkCategory from "../user_side/Home/work_catogory";
import BestWorker from "../user_side/Home/Best_worker";
import Add1 from "../user_side/Home/Add1";

import Services from "../user_side/Home/Services";
import Footer from "../user_side/Home/Footer";

// import axios from 'axios';

// const API_URL = 'http://127.0.0.1:8000/account/api';

// axios.defaults.withCredentials = true;
// axios.defaults.headers.post['Content-Type'] = 'application/json';



const HomePage = () => {
  // useEffect(() => {
  //   const fetchProfile = async () => {
  //     const user = JSON.parse(localStorage.getItem("user"));
  //     const accessToken = user?.access;

  //     if (!accessToken) {
  //       console.error("No access token available");
  //       return;
  //     }

  //     try {
  //       const response = await axios.get(
  //         "http://127.0.0.1:8000/account/api/home/",
  //         {
  //           headers: {
  //             Authorization: `Bearer ${accessToken}`,
  //           },
  //           withCredentials: true,
  //         }
  //       );

  //       const userInfo = response.data.user;
  //       if (userInfo) {
  //         sessionStorage.setItem("username", userInfo.username);
  //         sessionStorage.setItem("email", userInfo.email);
  //         console.log("====================================");
  //         console.log(userInfo.username, userInfo.email);
  //         console.log("====================================");
  //       }
  //     } catch (error) {
  //       console.error("Error fetching username and email:", error);
  //     }
  //   };

  //   fetchProfile();
  // }, []);

  return (
    <div className="w-full h-screen">
      <div className="w-full h-full flex items-center justify-center  -mt-20">
        <div className="ml-4 w-1/4 me-32 md:pt-28 absolute left-0 md:block hidden">
          <img
            src={Img1}
            alt="Login"
            className="w-full -ms-20 object-cover h-96"
          />
        </div>
        <div className="px-4 md:px-0">
          <h1 className="md:text-7xl text-center text-2xl font-bold text-cyan-600">
            Book trusted
          </h1>
          <h1 className="md:text-7xl text-center text-2xl font-bold text-cyan-600">
            help for home tasks
          </h1>
          <h1 className="md:text-7xl text-center text-2xl font-bold text-cyan-600">
            Life of joy
          </h1>
          <p className="mt-8 text-center font-semibold text-gray-600">
            Welcome to our center where every person is treated with high
            attention.
          </p>
          <p className="mt-4 text-center font-semibold text-gray-600">
            What do you need help with?
          </p>

          <form className="flex justify-center">
            <div className="flex mt-6">
              <input
                className="border w-[30vw] text-gray-600 font-semibold h-[7vh] border-gray-400 p-2 pl-6 outline-none border-r-0 rounded-bl-full rounded-tl-full"
                type="text"
                placeholder="Search"
              />
              <button className="bg-blue-700 rounded-tr-full rounded-br-full w-20 flex justify-center items-center">
                <FiSearch className="text-white text-2xl" />
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="flex items-center border-b-2 px-52 justify-center">
        <WorkCategory />
      </div>
      <h1 className="flex items-center justify-center text-3xl font-bold text-blue-950 py-4">
        Best Worker
      </h1>
      <div className="flex items-center border-b-2 px-52 justify-center">
        <BestWorker />
      </div>
      <div className="overflow-hidden">
        <Add1 />
      </div>
      <h1 className="flex items-center pt-7 text-violet-800 justify-center text-xl font-semibold">
        Tasks Organized for All Types
      </h1>
      <h1 className="flex flex-col items-center justify-center pt-7 text-5xl font-bold text-blue-950">
        <div>Check Out</div>
        <div>Some of Our Common Services</div>
      </h1>
      <div className="flex justify-center pt-5">
        <Services />
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
};

export default HomePage;
