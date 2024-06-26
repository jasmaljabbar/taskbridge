import React, { useEffect, useState } from "react";
import axios from "axios";
import Unknown from "../../statics/user_side/Unknown.jpg";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserProfile } from "../../redux/reducers/authSlice";

const UserProfile = () => {
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.auth.user); // Redux state
  const accessToken = useSelector((state) => state.auth.token); // Access token from auth slice

  const [profile_data, setprofile_data] = useState([]);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    address: "",
    city: "",
    gender: "",
    profile_photo: null,
  });

  useEffect(() => {
    const a = async () => {
      if (accessToken) {
        const user_profile = await dispatch(fetchUserProfile(accessToken));

        setprofile_data(user_profile.payload?.profile);
      }
    };
    a();
  }, [dispatch, accessToken]);

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile_data.username || "",
        email: profile_data.email || "",
        phone_number: profile_data.phone_number || "",
        address: profile_data.address || "",
        city: profile_data.city || "",
        gender: profile_data.gender || "",
        profile_photo: profile_data.profile_photo || null,
      });
    }
  }, [profile_data]);

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
      formDataToSend.append(key, formData[key]);
    }
    try {
      await axios.put(
        "http://127.0.0.1:8000/profiles/update/",
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      dispatch(fetchUserProfile(accessToken));
      setprofile_data(formData);
      console.log("====================================");
      console.log(formData);
      console.log("====================================");
      setEditing(false);
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full bg-white shadow-lg rounded-lg p-8">
        <div className="flex items-center justify-between border-b pb-6 mb-6">
          <div className="flex items-center">
            {profile_data.profile_photo ? (
              <img
                src={profile_data.profile_photo}
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
                {profile_data.username || "N/A"}
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
                  className="mt-1 p-2 cursor-pointer block w-full border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 p-2 block cursor-pointer w-full border border-gray-300 rounded-md"
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
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Profile Photo
                </label>
                <input
                  type="file"
                  name="profile_photo"
                  // value={formData.profile_photo}
                  onChange={handleFileChange}
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
                Email
              </label>
              <input
                value={profile_data.email || ""}
                className="mt-1 p-2 outline-none cursor-pointer block w-full border border-gray-300 rounded-md"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                value={profile_data.phone_number || ""}
                className="mt-1 p-2 outline-none cursor-pointer block w-full border border-gray-300 rounded-md"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                value={profile_data.address || ""}
                className="mt-1 p-2 block w-full cursor-pointer border outline-none border-gray-300 rounded-md"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                City
              </label>
              <input
                value={profile_data.city || ""}
                className="mt-1 p-2 block outline-none w-full border cursor-pointer border-gray-300 rounded-md"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Gender
              </label>
              <input
                value={profile_data.gender || ""}
                className="mt-1 p-2 outline-none cursor-pointer block w-full border border-gray-300 rounded-md"
                readOnly
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
