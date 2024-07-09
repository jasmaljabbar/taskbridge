import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  fetchTaskerDetails,
  fetchUserProfile,
} from "../../../redux/reducers/authSlice";

const BookNow = ({ taskerId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const accessToken = useSelector((state) => state.auth.token);
  const user_profile = useSelector((state) => state.auth.userProfile);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    employee: taskerId || "",
    minimum_hours_to_work: "",
    address: "",
    phone_number: "",
    date: "",
  });

  useEffect(() => {
    if (taskerId && user_profile) {
      setFormData((prevData) => ({
        ...prevData,
        employee: taskerId,
        address: user_profile?.address || "",
        phone_number: user_profile?.phone_number || "",
      }));
    }
  }, [taskerId, user_profile]);

  useEffect(() => {
    if (isModalOpen && taskerId) {
      setFormData((prevData) => ({
        ...prevData,
        employee: taskerId,
      }));
    }
  }, [isModalOpen, taskerId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const appointmentData = { ...formData };

    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/booking/appointments/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      toast.success("Appointment created successfully");
      setIsModalOpen(false);
    } catch (error) {
      toast.error("There was an error creating the appointment");
    }
  };

  const handleModalOpen = () => {
    if (!taskerId) {
      toast.error("Tasker details are not available");
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <button
        onClick={handleModalOpen}
        className=" w-full py-2 rounded-lg bg-blue-500 text-white  px-4  mb-4"
      >
        Request Appointment
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-50 backdrop-blur-sm"></div>
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg z-10">
            <h2 className="text-xl font-semibold mb-4">Book Tasker</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">
                  Minimum Hours to Work
                </label>
                <input
                  type="number"
                  name="minimum_hours_to_work"
                  value={formData.minimum_hours_to_work}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Phone Number</label>
                <input
                  type="text"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-300 text-gray-700 py-2 px-4 rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-4 rounded"
                >
                  Book Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookNow;
