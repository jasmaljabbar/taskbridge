import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Unknown from "../../statics/user_side/Unknown.jpg";
import { FaPen } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { API_URL_ADMIN } from "../../redux/actions/authService";
import EditTask from "./EditTask";
import { CgUnblock } from "react-icons/cg";
import { MdBlock } from "react-icons/md";
import toast from "react-hot-toast";

const TaskCategory = () => {
  const [taskInfo, setTaskInfo] = useState([]); // Initialize as an array
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    work_image: null,
  });
  const [isFormVisible, setIsFormVisible] = useState(false);
  const accessToken = useSelector((state) => state.auth.token);
  const navigate = useNavigate();

  const handleModal = (id) => {
    const updated = taskInfo.map((item) =>
      item.id === id ? { ...item, isEditing: !item.isEditing } : item
    );
    setTaskInfo(updated);
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "work_image") {
      setNewCategory({ ...newCategory, [name]: files[0] });
    } else {
      setNewCategory({ ...newCategory, [name]: value });
    }
  };

  const handleEdit = (id) => {
    const updated = taskInfo.map((item) =>
      item.id === id ? { ...item, isEditing: !item.isEditing } : item
    );
    setTaskInfo(updated);
  };

  const handleBlock = async (id) => {
    try {
      const response = await axios.post(
        `${API_URL_ADMIN}work/block/${id}/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // Toggle the blocked status in the state
      const updated = taskInfo.map((item) =>
        item.id === id ? { ...item, blocked: !item.blocked } : item
      );
      setTaskInfo(updated);

      // You might want to show a more specific message based on the new blocked status
      toast.success(response.data.status);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", newCategory.name);
    formData.append("description", newCategory.description);
    if (newCategory.work_image) {
      formData.append("work_image", newCategory.work_image);
    }

    try {
      const response = await axios.post(
        `${API_URL_ADMIN}add_workcategory/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setTaskInfo([...taskInfo, response.data]);
      setNewCategory({ name: "", description: "", work_image: null });
      setIsFormVisible(false);
    } catch (error) {
      toast.alert(error.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL_ADMIN}workcategory/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setTaskInfo(response.data);
      } catch (error) {
        toast.alert(error.message);
      }
    };

    if (accessToken) {
      fetchData();
    }
  }, [accessToken]);

  useEffect(() => {
    console.log("====================================");
    console.log(taskInfo);
    console.log("====================================");
  }, [taskInfo]);

  return (
    <div className="flex items-center justify-center ml-32">
      <div className="flex flex-col items-center p-6  h-screen w-[90%] mt-14">
        <h1 className="text-purple-950 text-4xl font-bold">Taskes</h1>
        <button
          type="button"
          onClick={() => setIsFormVisible(!isFormVisible)}
          className="ml-52 mr-auto bg-purple-950 text-white border rounded-xl border-purple-950 px-4 py-3 mt-6 mb-4"
        >
          Add Task Category +
        </button>
        {isFormVisible && (
          <form
            onSubmit={handleAddCategory}
            className="w-3/4 mb-4 p-4 border rounded bg-gray-50"
            encType="multipart/form-data"
          >
            <div className="mb-2">
              <input
                type="text"
                name="name"
                value={newCategory.name}
                onChange={handleInputChange}
                placeholder="Category Name"
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-2">
              <textarea
                name="description"
                value={newCategory.description}
                onChange={handleInputChange}
                placeholder="Category Description"
                className="w-full p-2 border rounded"
              ></textarea>
            </div>
            <div className="mb-2">
              <input
                type="file"
                name="work_image"
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <button
              type="submit"
              className="bg-purple-950 text-white px-4 py-2 rounded"
            >
              Add Category
            </button>
          </form>
        )}
        <table className="w-3/4 text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 ml-6">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Display Picture
              </th>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Description
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(taskInfo) &&
              taskInfo.map((item) => (
                <tr
                  key={item.id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <td className="w-4 p-4">
                    {item.work_image ? (
                      <img
                        className="w-10 h-10 rounded-full"
                        src={`http://127.0.0.1:8000${item.work_image}`}
                        alt="work image"
                        onError={(e) => (e.target.src = Unknown)} // Fallback to Unknown image if there's an error
                      />
                    ) : (
                      <img
                        className="w-10 h-10 rounded-full"
                        src={Unknown}
                        alt="unknown work image"
                      />
                    )}
                  </td>

                  <td
                    scope="row"
                    className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    <div className="ps-3">
                      <div className="text-base font-semibold">{item.name}</div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div>{item.description}</div>
                  </td>
                  <td className="px-6 py-4 flex flex-row">
                    <FaPen onClick={() => handleModal(item.id)} />

                    {item.blocked ? (
                      <MdBlock
                        className="ml-3 text-red-500"
                        onClick={() => handleBlock(item.id)}
                        title="Unblock this category"
                      />
                    ) : (
                      <CgUnblock
                        className="ml-3 text-green-500"
                        onClick={() => handleBlock(item.id)}
                        title="Block this category"
                      />
                    )}
                  </td>
                  {item.isEditing ? (
                    <td>
                      <EditTask
                        id={item.id}
                        setTaskInfo={setTaskInfo}
                        item={item}
                      />{" "}
                    </td>
                  ) : null}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskCategory;
