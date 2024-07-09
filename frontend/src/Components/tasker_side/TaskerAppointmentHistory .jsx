import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaClock,
} from "react-icons/fa";

const TaskerAppointmentHistory = () => {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const accessToken = useSelector((state) => state.auth.token);

  useEffect(() => {
    const fetchAppointments = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/booking/appointment/taskerHistory/",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        console.log("API response data:", response.data); // Log the response data
        setAppointments(response.data);
      } catch (error) {
        console.log("Error fetching appointments:", error);
        toast.error("Failed to fetch appointment history");
      } finally {
        setIsLoading(false);
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

  const handleStatusChange = async (appointmentId, newStatus) => {
    if (!appointmentId) {
      toast.error("Invalid appointment ID");
      return;
    }
    try {
      console.log('Handling status change for appointment ID:', appointmentId);
      const response = await axios.post(
        `http://127.0.0.1:8000/booking/appointment/manage/${appointmentId}/${newStatus}/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      // Update the local state to reflect the status change
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment.id === appointmentId
            ? { ...appointment, status: newStatus }
            : appointment
        )
      );
      toast.success(`Appointment ${newStatus} successfully!`);
    } catch (error) {
      console.error("Error updating appointment status:", error);
      toast.error("Failed to update appointment status");
    }
  };
  
  return (
    <div className="min-h-screen py-12 px-4 ml-72 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">
          Appointment History
        </h1>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : appointments.length > 0 ? (
          <div className="space-y-6">
            {appointments.map((appointment) => {
              console.log("Rendering appointment:", appointment); // Log the appointment object
              return (
                <div
                  key={appointment.id}
                  className="bg-white shadow-lg rounded-lg overflow-hidden transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center space-x-2">
                        <FaCalendarAlt className="text-blue-500" />
                        <p className="text-lg font-semibold text-gray-700">
                          {appointment.date}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(
                            appointment.status
                          )}`}
                        >
                          {formatStatus(appointment.status)}
                        </span>
                        <span className="px-3 py-1 text-sm font-medium text-blue-800 bg-blue-100 rounded-full flex items-center">
                          <FaClock className="mr-1" />
                          {appointment.minimum_hours_to_work} hours
                        </span>
                      </div>
                    </div>
                    <div className="text-gray-600 space-y-2">
                      <p className="flex items-center">
                        <FaMapMarkerAlt className="mr-2 text-red-500" />
                        <span className="font-medium">Address:</span>{" "}
                        {appointment.address}
                      </p>
                      <p className="flex items-center">
                        <FaPhoneAlt className="mr-2 text-green-500" />
                        <span className="font-medium">Phone:</span>{" "}
                        {appointment.phone_number}
                      </p>
                    </div>
                    <div className="mt-4 flex space-x-2">
                      <button
                        onClick={() =>
                          handleStatusChange(appointment.id, "accepted")
                        }
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() =>
                          handleStatusChange(appointment.id, "rejected")
                        }
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg p-8 text-center">
            <p className="text-xl text-gray-600">No appointments found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskerAppointmentHistory;
