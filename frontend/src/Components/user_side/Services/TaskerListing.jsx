import React, { useEffect, useState } from "react";
import axios from "axios";
import gardener from "../../../statics/user_side/worker_image/gardener-cleaning.png";
import { API_URL } from "../../../redux/actions/authService";

const TaskerListing = () => {
  const [taskersInfo, setTaskersInfo] = useState([]); // Initialize as an array

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}taskers/`, {});
        setTaskersInfo(response.data);
      } catch (error) {
        alert(error.message);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">
          Hire a trusted Tasker presto.
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {taskersInfo.map((tasker, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <img
                src={tasker.profile_pic || gardener}
                alt={tasker.full_name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">
                  {tasker.full_name}
                </h2>
                <p className="text-gray-600 mb-4">{tasker.address}</p>
                <p className="text-gray-800">Phone: {tasker.phone_number}</p>
                <p className="text-gray-800">
                  Service Charge: {tasker.service_charge}
                </p>
                <p className="text-gray-800">City: {tasker.city}</p>
                <p className="text-gray-800">State: {tasker.state}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskerListing;
