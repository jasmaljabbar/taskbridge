import React, { useEffect, useState } from "react";
import axios from "axios";
import Unknown from "../../statics/user_side/Unknown.jpg";
import { useSelector, useDispatch } from "react-redux";
import { fetchTaskerProfile } from "../../redux/reducers/tasker_authSlice";
import { fetchUserProfile } from "../../redux/reducers/authSlice";

const TaskerProfile = () => {
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.tasker_auth.user);
  const accessToken = useSelector((state) => state.auth.token);

  const [editing, setEditing] = useState(false);
  const [taskerData, setTaskerData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    full_name: "",
    aadhar_number: "",
    phone_number: "",
    address: "",
    city: "",
    tasks: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      if (accessToken) {
        try {
          const taskerProfileResponse = await dispatch(
            fetchTaskerProfile(accessToken)
          );
          const userProfileResponse = await dispatch(
            fetchUserProfile(accessToken)
          );
          console.log("====================================");
          console.log(taskerProfileResponse);
          console.log("====================================");
          setTaskerData(taskerProfileResponse.payload);
          setUserData(userProfileResponse.payload.profile);
        } catch (error) {
          console.error("Error fetching profiles:", error);
        }
      }
    };

    fetchData();
  }, [dispatch, accessToken]);

  useEffect(() => {
    if (taskerData) {
      setFormData({
        full_name: taskerData.full_name || "",
        phone_number: taskerData.phone_number || "",
        aadhar_number: taskerData.aadhar_number || "",
        address: taskerData.address || "",
        tasks: taskerData.tasks || [],
        city: taskerData.city || "",
        state: taskerData.state || "",
        service_charge: taskerData.service_charge || "",
      });
    }
  }, [taskerData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({ ...prevData, profile_photo: file }));
  };

  const handleSave = async () => {
    if (!accessToken) {
      console.error("No access token available");
      return;
    }

    const formDataToSend = new FormData();
    for (const key in formData) {
      if (key === "tasks") {
        formDataToSend.append(key, JSON.stringify(formData[key]));
      } else {
        formDataToSend.append(key, formData[key]);
      }
    }

    try {
      await axios.put(
        "http://127.0.0.1:8000/task_workers/UpdateTaskerProfile/",
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setEditing(false);
      dispatch(fetchTaskerProfile(accessToken));
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  if (!taskerData || !userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:scroll-px-10">
      <div className="max-w-4xl w-full bg-white shadow-lg rounded-lg p-8">
        <div className="flex items-center justify-between border-b pb-6 mb-6">
          <div className="flex items-center">
            {userData.profile_photo ? (
              <img
                src={userData.profile_photo}
                alt="Profile"
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <img
                src={Unknown}
                alt="Profile"
                className="w-10 h-10 rounded-full"
              />
            )}
            <div className="ml-4">
              <h2 className="text-2xl font-bold">
                {userData.username || "N/A"}
              </h2>
            </div>
          </div>
          <button
            onClick={() => setEditing(true)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Edit Profile
          </button>
        </div>
        {editing ? (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Aadhar Number
                </label>
                <input
                  type="text"
                  name="aadhar_number"
                  value={formData.aadhar_number}
                  onChange={handleChange}
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tasks
                </label>
                <input
                  type="text"
                  name="tasks"
                  value={formData.tasks.map((task) => task.name).join(", ")}
                  onChange={handleChange}
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  state
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  service_charge
                </label>
                <input
                  type="text"
                  name="service_charge"
                  value={formData.service_charge}
                  onChange={handleChange}
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => setEditing(false)}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <p className="mt-1 p-2 block w-full border border-gray-300 rounded-md">
                {taskerData.full_name}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Aadhar Number
              </label>
              <p className="mt-1 p-2 block w-full border border-gray-300 rounded-md">
                {taskerData.aadhar_number}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <p className="mt-1 p-2 block w-full border border-gray-300 rounded-md">
                {taskerData.phone_number}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <p className="mt-1 p-2 block w-full border border-gray-300 rounded-md">
                {taskerData.address}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                City
              </label>
              <p className="mt-1 p-2 block w-full border border-gray-300 rounded-md">
                {taskerData.city}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tasks
              </label>
              <ul className="mt-1 p-2 block w-full border border-gray-300 rounded-md list-disc list-inside">
                {taskerData.tasks.map((task) => (
                  <li key={task.id}>{task.name}</li>
                ))}
              </ul>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                state
              </label>
              <p className="mt-1 p-2 block w-full border border-gray-300 rounded-md">
                {taskerData.state}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                service_charge
              </label>
              <p className="mt-1 p-2 block w-full border border-gray-300 rounded-md">
                {taskerData.service_charge}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskerProfile;
