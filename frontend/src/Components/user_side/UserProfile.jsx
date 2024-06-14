import React, { useEffect, useState } from "react";
import axios from "axios";
import Unknown from "../../statics/user_side/Unknown.jpg";
import { useSelector } from "react-redux";

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const accessToken = useSelector((state) => state.auth.token);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!accessToken) {
        console.error("No access token available");
        return;
      }

      try {
        const response = await axios.get("http://127.0.0.1:8000/profiles/me/", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        setProfile(response.data.profile);
        setFormData(response.data.profile);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSave = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const accessToken = user?.access;

    if (!accessToken) {
      console.error("No access token available");
      return;
    }

    try {
      await axios.patch(
        `http://127.0.0.1:8000/profiles/update/${profile.username}/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setProfile(formData);
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
            {profile.profile_photo ? (
              <img
                src={profile.profile_photo}
                alt="Profile"
                className="h-24 w-24 rounded-full"
              />
            ) : (
              <img
                src={Unknown}
                alt="Profile"
                className="h-24 w-24 rounded-full"
              />
            )}
            <div className="ml-4">
              <h2 className="text-2xl font-bold">
                {profile.username || "N/A"}
              </h2>
              <p className="text-gray-600">{profile.email || "N/A"}</p>
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
                  Full Name
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name || ""}
                  onChange={handleChange}
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email || ""}
                  onChange={handleChange}
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phone_number"
                  value={formData.phone_number || ""}
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
                  value={formData.city || ""}
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
                  value={formData.gender || ""}
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
                  User Type
                </label>
                <select
                  name="is_tasker"
                  value={formData.is_tasker ? "Tasker" : "Normal User"}
                  onChange={(e) =>
                    setFormData((prevData) => ({
                      ...prevData,
                      is_tasker: e.target.value === "Tasker",
                    }))
                  }
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                >
                  <option value="Normal User">Normal User</option>
                  <option value="Tasker">Tasker</option>
                </select>
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
          <div>
            <p>
              <strong>Full Name:</strong> {profile.full_name || "N/A"}
            </p>
            <p>
              <strong>Email:</strong> {profile.email || "N/A"}
            </p>
            <p>
              <strong>Phone Number:</strong> {profile.phone_number || "N/A"}
            </p>
            <p>
              <strong>City:</strong> {profile.city || "N/A"}
            </p>
            <p>
              <strong>Gender:</strong> {profile.gender || "N/A"}
            </p>
            <p>
              <strong>User Type:</strong>{" "}
              {profile.is_tasker ? "Tasker" : "Normal User"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
