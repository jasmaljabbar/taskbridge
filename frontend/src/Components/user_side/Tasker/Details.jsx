import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchTaskerDetails } from "../../../redux/reducers/authSlice";

const Details = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const accessToken = useSelector((state) => state.auth.token);
  const taskerInfo = useSelector((state) => state.auth.taskerDetails);
  const searchParams = new URLSearchParams(location.search);
  const taskerId = searchParams.get("user");

  useEffect(() => {
    if (accessToken && taskerId) {
      dispatch(fetchTaskerDetails({ user_id: taskerId, token: accessToken }));
    }
  }, [dispatch, accessToken, taskerId]);

  if (!taskerInfo) {
    console.log('====================================');
    console.log();
    console.log('====================================');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl font-semibold text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 max-w-3xl mx-auto px-4">
      <div className="md:w-2/3 space-y-4">
        <div className="bg-slate-800 text-white p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">About Me</h3>
          <p className="text-sm">
            {taskerInfo.full_name} is a much-driven {taskerInfo.task?.name} with
            a passion for leveraging innovative strategies to drive brand growth
            and customer engagement in the ever-evolving digital landscape.
            <br />
            Feel free to reach me out for any specific queries.
          </p>
        </div>

        <div className="bg-slate-800 text-white p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Contact Here</h3>
          <div className="space-y-2 text-sm">
            <p className="flex items-center">
              <span className="mr-2">📞</span> {taskerInfo.phone_number}
            </p>
            <p className="flex items-center">
              <span className="mr-2">📍</span> {taskerInfo.address}
            </p>
          </div>
        </div>
      </div>

      <div className="md:w-1/3 space-y-4">
        <Link to="/message">
          <button className="w-full bg-orange-400 text-white py-2 rounded-lg">
            Message
          </button>
        </Link>
        <button className="w-full bg-red-500 text-white py-2 rounded-lg">
          Report
        </button>
      </div>
    </div>
  );
};

export default Details;
