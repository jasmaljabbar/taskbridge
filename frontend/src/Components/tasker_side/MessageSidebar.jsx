import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../redux/actions/authService";
import { useSelector } from "react-redux";
import Unknown from "../../statics/user_side/Unknown.jpg";
import { Link } from "react-router-dom";

function MessageSidebar() {
  const [taskerId, setTaskerId] = useState(null);
  const [users, setUsers] = useState([]);
  const accessToken = useSelector((state) => state.auth.token);

  useEffect(() => {
    const storedTaskerId = localStorage.getItem("user");
    const user = JSON.parse(storedTaskerId);
    setTaskerId(user.user_id);
    fetchUsers(user.user_id);
  }, []);

  const fetchUsers = async (id) => {
    try {
      const response = await axios.get(
        `${BASE_URL}api/chat/users-chat-with-tasker/${id}/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  if (!users) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-gray-900 text-white h-full overflow-y-auto">
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Users</h2>
        <ul>
          {users.map((user) => (
            <li key={user.id} className="p-2 hover:bg-gray-700 rounded-md border-b border-gray-600">
              <Link
                to={`/tasker/chat/${user.id}`}
                className="flex items-center py-2.5 px-4 rounded hover:bg-gray-700"
              >
               {user.profile_pic ?(
                <img
                src={user.profile_pic || "default-profile.png"}
                alt={user.name}
                className="w-10 h-10 rounded-full"
              />
               ):
               <img
                  src={Unknown}
                  alt={user.name}
                  className="w-10 h-10 rounded-full"
                />
                }
                <span className="ml-3">
                  {user.name} {user.last_name}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default MessageSidebar;
