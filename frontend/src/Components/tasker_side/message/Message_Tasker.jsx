import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import Chat from "../../user_side/Tasker/Chat";

const Message_Tasker = () => {
  const [messages, setMessages] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [error, setError] = useState(null);
  const [roomName, setRoomName] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const accessToken = useSelector((state) => state.auth.token);
  const socketRef = useRef(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/Chat_app/employee/rooms/",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setRooms(response.data);
        setRoomName(response.data[0].room_name)
        if (response.data.length > 0) {
          handleRoomSelect(response.data[0]);
        }
      } catch (err) {
        setError("Failed to fetch rooms");
      }
    };

    fetchRooms();
  }, [accessToken]);

  useEffect(() => {
    if (selectedRoom) {
      fetchMessages(selectedRoom.room_name);
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [selectedRoom, accessToken]);

  useEffect(() => {
    console.log("====================================");
    console.log(roomName);
    console.log("====================================");
    socketRef.current = new WebSocket(
      `ws://127.0.0.1:8000/ws/notification/${roomName}/`
    );

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, data.message]);
    };

    socketRef.current.onclose = () => {
      console.error("WebSocket disconnected");
    };

    socketRef.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  }, [newMessage]);

  const fetchMessages = async (roomName) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/Chat_app/api/rooms/${roomName}/messages/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setMessages(response.data);
    } catch (error) {
      setError("Failed to fetch messages");
    }
  };

  const handleRoomSelect = (room) => {
    setSelectedRoom(room);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRoom) {
      setError("Please select a room to send messages.");
      return;
    }

    try {
      await axios.post(
        `http://127.0.0.1:8000/Chat_app/api/create_message/${selectedRoom.room_name}/`,
        { message: newMessage },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setMessages((prevMessages) => [
        ...prevMessages,
        { message: newMessage, sender: "Tasker" }, // Replace with appropriate sender information
      ]);

      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      setError("Failed to send message. Please try again.");
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar for room selection */}
      <div className="w-[20vw] md:ml-64 bg-gray-100 border-r border-gray-300">
        <div className="p-4 bg-blue-500 text-white text-center">
          <h2 className="text-lg font-semibold">Rooms</h2>
        </div>
        <div className="p-4">
          {rooms.map((room) => (
            <div
              key={room.id}
              className={`p-2 mb-2 bg-white rounded-lg cursor-pointer ${
                selectedRoom === room
                  ? "bg-blue-500 text-black"
                  : "hover:bg-blue-500 hover:text-blue-600 transition"
              }`}
              onClick={() => handleRoomSelect(room)}
            >
              {room.user.name}
            </div>
          ))}
        </div>
      </div>

      {/* Main chat area */}
      <div className="w-[60vw] flex flex-col">
        <div className="p-4 bg-blue-500 mt-20 text-white text-center">
          <h2 className="text-lg font-semibold">Chat Room</h2>
        </div>
        <div className="flex-1 p-4 overflow-y-auto bg-gray-200">
          <div className="flex-grow overflow-y p-4">
            {messages.map((msg, index) => (
              <Chat
                key={index}
                message={msg.message}
                sender={msg.sender}
                isOwnMessage={msg.sender === "Tasker"} // Replace with appropriate sender identifier
              />
            ))}
          </div>
        </div>
        <div className="flex p-4 bg-gray-100 border-t border-gray-300">
          <input
            type="text"
            className="flex-1 p-2 border border-gray-300 rounded-lg"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button
            className="ml-2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            onClick={handleSubmit}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Message_Tasker;
