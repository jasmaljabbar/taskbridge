import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTaskerProfile } from "../../redux/reducers/tasker_authSlice";
import { fetchUserProfile } from "../../redux/reducers/authSlice";
import Select from "react-select";
import tasker_authService from "../../redux/actions/tasker_authService";
import { Formik, Form, Field, ErrorMessage, useField } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Unknown from "../../statics/user_side/Unknown.jpg";

const TaskerProfile = () => {
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.tasker_auth.user);
  const accessToken = useSelector((state) => state.auth.token);
  const [editing, setEditing] = useState(false);
  const [taskerData, setTaskerData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [workCategories, setWorkCategories] = useState([]);
  const [error, setError] = useState("");

  const fetchData = async () => {
    if (accessToken) {
      try {
        const taskerProfileResponse = await dispatch(
          fetchTaskerProfile(accessToken)
        );

        const userProfileResponse = await dispatch(
          fetchUserProfile(accessToken)
        );

        setTaskerData(taskerProfileResponse.payload);
        setUserData(userProfileResponse.payload.profile);
      } catch (error) {
        console.error("Error fetching profiles:", error);
        setError("Failed to fetch profiles. Please try again.");
      }
    }
  };

  useEffect(() => {
    fetchData(); // Initial fetch when component mounts or accessToken changes
  }, [dispatch, accessToken]);

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
        setError("Failed to fetch work categories. Please try again.");
      }
    };
    fetchWorkCategories();
  }, []);

  const validationSchema = Yup.object().shape({
    full_name: Yup.string().required("Full Name is required"),
    phone_number: Yup.string()
      .matches(/^\d{10}$/, "Phone number must be 10 digits")
      .required("Phone number is required"),
    aadhar_number: Yup.string()
      .matches(/^\d{12}$/, "Aadhar number must be 12 digits")
      .required("Aadhar number is required"),
    city: Yup.string().required("City is required"),
    state: Yup.string().required("State is required"),
    address: Yup.string().required("Address is required"),
    task: Yup.object()
      .shape({
        value: Yup.number().required("Work Category ID is required"),
        label: Yup.string().required("Work Category Label is required"),
      })
      .nullable()
      .required("Task is required"),
    task_fee: Yup.number()
      .typeError("Service charge must be a number")
      .required("Service charge is required"),
    work_photo: Yup.mixed(),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const formData = new FormData();
      formData.append("full_name", values.full_name);
      formData.append("phone_number", values.phone_number);
      formData.append("aadhar_number", values.aadhar_number);
      formData.append("address", values.address);
      formData.append("city", values.city);
      formData.append("state", values.state);

      Object.keys(values).forEach((key) => {
        if (values[key] !== taskerData[key]) {
          if (key === "task" && values[key]) {
            formData.append("task", values[key].value);
          } else if (key === "work_photo") {
            if (values[key] instanceof File) {
              formData.append("work_photo", values[key]);
            }
          } else {
            formData.append(key, values[key]);
          }
        }
      });

      if (values.work_photo instanceof File) {
        formData.append("work_photo", values.work_photo);
      }
      formData.append("task", values.task.value);
      formData.append("task_fee", values.task_fee);

      const response = await axios.put(
        "http://127.0.0.1:8000/task_workers/update/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setTaskerData((prevData) => ({
        ...prevData,
        ...response.data,
      }));

      fetchData();

      setEditing(false);
      dispatch(fetchTaskerProfile(accessToken));
      resetForm();
    } catch (error) {
      console.error("Error saving profile:", error);
      setError("Failed to save profile. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!taskerData || !userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-10">
      <div className="max-w-4xl w-full bg-white shadow-lg rounded-lg p-8">
        <div className="flex items-center justify-between border-b pb-6 mb-6">
          <div className="flex items-center">
            <img
              src={userData.profile_photo || Unknown}
              alt="Profile"
              className="w-10 h-10 rounded-full"
            />
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
        {error && <div className="text-red-500 mb-4">{error}</div>}
        {editing ? (
          <Formik
            initialValues={{
              full_name: taskerData.full_name || "",
              phone_number: taskerData.phone_number || "",
              aadhar_number: taskerData.aadhar_number || "",
              city: taskerData.city || "",
              state: taskerData.state || "",
              address: taskerData.address || "",
              task: taskerData.task
                ? {
                    value: taskerData.task.id || taskerData.task,
                    label: taskerData.task.name || "Unknown",
                  }
                : null,
              task_fee: taskerData.task_fee || "",
              work_photo: taskerData.work_photo || null,
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ setFieldValue, values, isSubmitting }) => (
              <Form className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="mb-1 block">Full Name</label>
                  <Field
                    name="full_name"
                    className="border rounded-md border-black p-3 w-full"
                    placeholder="Full Name"
                  />
                  <ErrorMessage
                    name="full_name"
                    component="div"
                    className="text-red-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block">Phone Number</label>
                  <Field
                    name="phone_number"
                    className="border rounded-md border-black p-3 w-full"
                    placeholder="Phone Number"
                  />
                  <ErrorMessage
                    name="phone_number"
                    component="div"
                    className="text-red-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block">Aadhar Number</label>
                  <Field
                    name="aadhar_number"
                    className="border rounded-md border-black p-3 w-full"
                    placeholder="Aadhar Number"
                  />
                  <ErrorMessage
                    name="aadhar_number"
                    component="div"
                    className="text-red-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block">City</label>
                  <Field
                    name="city"
                    className="border rounded-md border-black p-3 w-full"
                    placeholder="City"
                  />
                  <ErrorMessage
                    name="city"
                    component="div"
                    className="text-red-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block">State</label>
                  <Field
                    name="state"
                    className="border rounded-md border-black p-3 w-full"
                    placeholder="State"
                  />
                  <ErrorMessage
                    name="state"
                    component="div"
                    className="text-red-500"
                  />
                </div>
                <div className="col-span-2">
                  <label className="mb-1 block">Address</label>
                  <Field
                    as="textarea"
                    name="address"
                    className="border rounded-md border-black p-3 w-full"
                    placeholder="Address"
                  />
                  <ErrorMessage
                    name="address"
                    component="div"
                    className="text-red-500"
                  />
                </div>
                <div className="col-span-2">
                  <label className="mb-1 block">Task</label>
                  <Select
                    onChange={(option) => setFieldValue("task", option)}
                    options={workCategories}
                    value={values.task}
                    className="border rounded-md border-black p-3 w-full"
                    placeholder="Select task"
                  />
                  <ErrorMessage
                    name="task"
                    component="div"
                    className="text-red-500"
                  />
                </div>
                <div className="col-span-2">
                  <label className="mb-1 block">
                    Service Charge for {values.task.label}
                  </label>
                  <Field
                    name="task_fee"
                    type="number"
                    className="border rounded-md border-black p-3 w-full"
                    placeholder="Service Charge"
                  />
                  <ErrorMessage
                    name="task_fee"
                    component="div"
                    className="text-red-500"
                  />
                </div>
                <div className="col-span-2">
                  <label className="mb-1 block">Work Photo</label>
                  {values.work_photo &&
                    !(values.work_photo instanceof File) && (
                      <div className="mb-2">
                        <img
                          src={values.work_photo}
                          alt="Current work photo"
                          className="w-32 h-32 object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => setFieldValue("work_photo", null)}
                          className="mt-2 text-red-500"
                        >
                          Remove Photo
                        </button>
                      </div>
                    )}
                  <input
                    type="file"
                    name="work_photo"
                    onChange={(event) => {
                      const file = event.currentTarget.files[0];
                      if (file) {
                        setFieldValue("work_photo", file);
                      }
                    }}
                    className="border rounded-md border-black p-3 w-full"
                  />
                  <ErrorMessage
                    name="work_photo"
                    component="div"
                    className="text-red-500"
                  />
                </div>

                <div className="col-span-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full bg-blue-900 text-white rounded-md py-2 px-4 hover:bg-blue-500 transition duration-300 mt-6 ${
                      isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="w-full bg-red-500 text-white rounded-md py-2 px-4 hover:bg-red-700 transition duration-300 mt-2"
                  >
                    Cancel
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        ) : (
          <div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Full Name</h3>
              <p>{taskerData.full_name || "N/A"}</p>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Phone Number</h3>
              <p>{taskerData.phone_number || "N/A"}</p>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Aadhar Number</h3>
              <p>{taskerData.aadhar_number || "N/A"}</p>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold">City</h3>
              <p>{taskerData.city || "N/A"}</p>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold">State</h3>
              <p>{taskerData.state || "N/A"}</p>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Address</h3>
              <p>{taskerData.address || "N/A"}</p>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Task</h3>
              <p>
                {taskerData.task
                  ? typeof taskerData.task === "object"
                    ? `${taskerData.task.name || "Unknown"} (ID: ${
                        taskerData.task.id || "N/A"
                      }) - ₹${taskerData.task_fee || "N/A"}`
                    : `Task ID: ${taskerData.task} - ₹${
                        taskerData.task_fee || "N/A"
                      }`
                  : "N/A (Task data not available)"}
              </p>
              {/* <p>Raw task data: {JSON.stringify(taskerData.task)}</p> */}
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Work Photo</h3>
              {taskerData.work_photo ? (
                <img
                  src={taskerData.work_photo}
                  alt="Work photo"
                  className="w-32 h-32 object-cover"
                />
              ) : (
                <p>No work photo available</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskerProfile;
