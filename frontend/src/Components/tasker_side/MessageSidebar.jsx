import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../redux/actions/authService";
import { useSelector } from "react-redux";
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
      console.log("====================================");
      console.log(response.data);
      console.log("====================================");
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  return (
    <div className="w-64 bg-gray-800 text-white h-full overflow-y-auto">
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Users</h2>
        <ul>
          {users.map((user) => (
            <li key={user.id} className="p-2 hover:bg-gray-700 rounded-md">
              <Link
                to={`/tasker/chat/${user.id}`}
                className="flex items-center py-2.5 px-4 rounded hover:bg-gray-700"
              >
                <img
                  src={user.profile_pic || "default-profile.png"}
                  alt={user.name}
                  className="w-10 h-10 rounded-full"
                />
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
