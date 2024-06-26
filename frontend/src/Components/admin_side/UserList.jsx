import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Unknown from "../../statics/user_side/Unknown.jpg";
import EditUser from "./EditUser";
import AdminNavbar from "./AdminNavbar";
import { useSelector } from "react-redux";
import { API_URL_ADMIN } from "../../redux/actions/authService";
import ConfirmModal from "../common/ConfirmModal";

function UserList() {
  const [usersInfo, setUsersInfo] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentTaskerId, setCurrentTaskerId] = useState(null);
  const [modalMessage, setModalMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState(() => {});
  const accessToken = useSelector((state) => state.auth.token);
  const navigate = useNavigate();

  const handleRequest = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/adminside/accepting_request/",
        { id: currentTaskerId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log(response.data);
      setUsersInfo(usersInfo.filter((user) => user.id !== currentTaskerId));
      setShowModal(false);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleUserAction = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/adminside/user_action/",
        { id: currentTaskerId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log(response.data);
      setCurrentTaskerId(null);
      // Update the user's is_active status in the state
      setUsersInfo((prevUsersInfo) =>
        prevUsersInfo.map((user) =>
          user.id === currentTaskerId
            ? { ...user, is_active: !user.is_active }
            : user
        )
      );

      setShowModal(false);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleModal = (id, message, action) => {
     (id);
    setModalMessage(message);
    setConfirmAction(() => action);
    if (currentTaskerId) {
      setShowModal(true);
    }

  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL_ADMIN}dashboard/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setUsersInfo(response.data);
        console.log("Fetched users:", response.data);
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
      <ConfirmModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={confirmAction}
        message={modalMessage}
        confirmText="Yes, I am sure"
      />
      <div className="flex flex-col items-center h-screen w-full mt-3">
        <h1 className="text-purple-950 text-4xl font-bold">Users</h1>
        <button
          type="button"
          onClick={() => navigate("/adduser")}
          className="ml-52 mr-auto bg-purple-950 text-white border rounded-xl border-purple-950 px-4 py-3 mt-6 mb-4"
        >
          Add User +
        </button>
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
                Role
              </th>
              <th scope="col" className="px-6 py-3">
                Active
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(usersInfo) &&
              usersInfo.map((item) => (
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
                      <div className="font-normal text-gray-500">
                        {item.email}
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div>{item.is_staff ? <p>Tasker</p> : <p>User</p>}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div>
                        {item.is_active ? (
                          <button
                            className="bg-blue-500 text-white md:px-4 md:py-2 px-2 py-0.5 text-[12px] md:text-md font-semibold rounded-lg hover:bg-red-600"
                            onClick={() =>
                              {setCurrentTaskerId(item.id)
                              handleModal(
                                item.id,
                                "Are you sure you want to deactivate this user?",
                                handleUserAction
                              )}
                            }
                          >
                            Active
                          </button>
                        ) : (
                          <button
                            className="bg-orange-500 text-white md:px-4 md:py-2 px-2 py-0.5 text-[12px] md:text-md font-semibold rounded-lg hover:bg-green-600"
                            onClick={() =>
                              {setCurrentTaskerId(item.id)
                              handleModal(
                                item.id,
                                "Are you sure you want to activate this user?",
                                handleUserAction
                              )}
                            }
                          >
                            Inactive
                          </button>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 flex flex-row">
                    {item.requested_to_tasker ? (
                      <button
                        className="bg-blue-500 text-white md:px-4 md:py-2 px-2 py-0.5 text-[12px] md:text-md font-semibold rounded-lg hover:bg-green-600"
                        onClick={() =>
                          {setCurrentTaskerId(item.id)
                          handleModal(
                            item.id,
                            "Are you sure you want to confirm this request?",
                            handleRequest
                          )}
                        }
                      >
                        TaskerRequest
                      </button>
                    ) : null}
                  </td>
                  {item.isEditing ? (
                    <td>
                      <EditUser
                        id={item.id}
                        setUsersInfo={setUsersInfo}
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
}

export default UserList;
