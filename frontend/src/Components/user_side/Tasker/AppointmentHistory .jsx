import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const AppointmentHistory = () => {
  const [appointments, setAppointments] = useState([]);
  const accessToken = useSelector((state) => state.auth.token);
  const taskerInfo = useSelector((state) => state.auth.taskerDetails);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/booking/appointment/history/",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setAppointments(response.data);
      } catch (error) {
        console.log("Error fetching appointments:", error);
        toast.error("Failed to fetch appointment history");
      }
    };

    if (accessToken) {
      fetchAppointments();
    }
  }, [accessToken]);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatStatus = (status) => {
    if (!status) return "Unknown";

    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className=" min-h-screen py-12 px-4 ml-72  sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Appointment History
        </h1>
        {appointments.length > 0 ? (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="border-b border-gray-200 last:border-b-0"
              >
                <div className="p-6 hover:bg-gray-50 transition duration-150 ease-in-out">
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-lg font-semibold text-gray-700">
                      {appointment.date}
                    </p>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(
                          appointment.status
                        )}`}
                      >
                        {formatStatus(appointment.status)}
                      </span>
                      <span className="px-3 py-1 text-sm font-medium text-blue-800 bg-blue-100 rounded-full">
                        {appointment.minimum_hours_to_work} hours
                      </span>
                    </div>
                  </div>
                  <div className="text-gray-600">
                    <p className="mb-2">
                      <span className="font-medium">Address:</span>{" "}
                      {appointment.address}
                    </p>
                    <p>
                      <span className="font-medium">Phone:</span>{" "}
                      {appointment.phone_number}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg p-6 text-center">
            <p className="text-gray-600">No appointments found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentHistory;
