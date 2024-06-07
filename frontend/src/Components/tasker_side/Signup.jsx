import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { tasker_register } from "../../redux/reducers/tasker_authSlice";
import tasker_authService from "../../redux/actions/tasker_authService";
import Select from "react-select";

const Signup = () => {
  const [formData, setFormData] = useState({
    full_name: "",
    phone_number: "",
    tasks: [],
    city: "",
    state: "",
    address: "",
    service_charge: "",
  });

  const [workCategories, setWorkCategories] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, isAuthenticated } = useSelector((state) => state.tasker_auth);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (selectedOptions) => {
    setFormData({
      ...formData,
      tasks: selectedOptions.map((option) => option.value),
    });
  };

  useEffect(() => {
    const fetchWorkCategories = async () => {
      try {
        const categories = await tasker_authService.getWorkCategories();
        setWorkCategories(
          categories.map((category) => ({
            value: category.id,
            label: category.name,
          }))
        );
      } catch (error) {
        console.error("Failed to fetch work categories:", error);
      }
    };

    fetchWorkCategories();
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const accessToken = user?.access;
    if (!accessToken) {
      console.error("No access token available");
      return;
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(tasker_register(formData));
    if (isAuthenticated) {
      navigate("/login");
      setFormData({
        full_name: "",
        phone_number: "",
        tasks: [],
        city: "",
        state: "",
        address: "",
        service_charge: "",
      });
    }
  };

  return (
    <div className="flex justify-center items-center h-full p-10">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-3xl">
        <h1 className="text-4xl font-bold mb-6 text-center">Sign Up</h1>
        <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit}>
          <div className="col-span-2">
            <label className="mb-1 block">Full Name</label>
            <input
              onChange={handleChange}
              value={formData.full_name}
              name="full_name"
              className="border rounded-md border-black p-3 w-full"
              type="text"
              placeholder="Full Name"
            />
          </div>
          <div>
            <label className="mb-1 block">Phone Number</label>
            <input
              onChange={handleChange}
              value={formData.phone_number}
              name="phone_number"
              className="border rounded-md border-black p-3 w-full"
              type="text"
              placeholder="Phone Number"
            />
          </div>
          <div>
            <label className="mb-1 block">Tasks</label>
            <Select
              onChange={handleSelectChange}
              options={workCategories}
              isMulti
              className="border rounded-md border-black p-3 w-full"
              placeholder="Select tasks"
            />
          </div>
          <div>
            <label className="mb-1 block">City</label>
            <input
              onChange={handleChange}
              value={formData.city}
              name="city"
              className="border rounded-md border-black p-3 w-full"
              type="text"
              placeholder="City"
            />
          </div>
          <div>
            <label className="mb-1 block">State</label>
            <input
              onChange={handleChange}
              value={formData.state}
              name="state"
              className="border rounded-md border-black p-3 w-full"
              type="text"
              placeholder="State"
            />
          </div>
          <div className="col-span-2">
            <label className="mb-1 block">Address</label>
            <textarea
              onChange={handleChange}
              value={formData.address}
              name="address"
              className="border rounded-md border-black p-3 w-full"
              placeholder="Address"
            />
          </div>
          <div className="col-span-2">
            <label className="mb-1 block">Service Charge</label>
            <input
              onChange={handleChange}
              value={formData.service_charge}
              name="service_charge"
              className="border rounded-md border-black p-3 w-full"
              type="number"
              placeholder="Service Charge"
            />
          </div>
          <div className="col-span-2">
            <button
              type="submit"
              className="w-full bg-blue-900 text-white rounded-md py-2 px-4 hover:bg-blue-500 transition duration-300 mt-6"
            >
              Register
            </button>
          </div>
        </form>
        {error && <p className="mt-4 text-red-600">{error}</p>}
        <p className="mt-4 block text-sm font-medium leading-6 text-gray-900 text-center">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-700 cursor-pointer"
          >
            Log in
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;
