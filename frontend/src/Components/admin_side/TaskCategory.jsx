import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Unknown from "../../statics/user_side/Unknown.jpg";
import { FaPen, FaTrashCan } from "react-icons/fa6";
import EditUser from "./EditUser";
import AdminNavbar from "./AdminNavbar";
import { useSelector } from "react-redux";
import { API_URL_ADMIN } from "../../redux/actions/authService";

const TaskCategory = () => {
  const [taskInfo, setTaskInfo] = useState([]); // Initialize as an array
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });
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
    const { name, value } = e.target;
    setNewCategory({ ...newCategory, [name]: value });
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${API_URL_ADMIN}add_workcategory/`,
        newCategory,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      setTaskInfo([...taskInfo, response.data]);
      setNewCategory({ name: "", description: "" });
      setIsFormVisible(false);
    } catch (error) {
      alert(error.message);
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
        alert(error.message);
      }
    };

    if (accessToken) {
      fetchData();
    }
  }, [accessToken]);
  return (
    <div>
      <AdminNavbar />
      <div className="flex flex-col items-center h-screen w-full mt-3">
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
              {/* <th scope="col" className="px-6 py-3">
                Action
              </th> */}
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
                    {item.profile_pic ? (
                      <img
                        className="w-10 h-10 rounded-full"
                        src={`http://127.0.0.1:8000${item.profile_pic}`}
                        alt="profile picture"
                      />
                    ) : (
                      <img
                        className="w-10 h-10 rounded-full"
                        src={Unknown}
                        alt="profile picture"
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
                  {/* <td className="px-6 py-4 flex flex-row">
                    <FaPen onClick={() => handleModal(item.id)} />
                    <FaTrashCan
                      className="ml-3"
                      onClick={() => handleDelete(item.id)}
                    />
                  </td>
                  {item.isEditing ? (
                    <td>
                      <EditUser
                        id={item.id}
                        setTaskInfo={setTaskInfo}
                        item={item}
                      />{" "}
                    </td>
                  ) : null} */}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default TaskCategory;
