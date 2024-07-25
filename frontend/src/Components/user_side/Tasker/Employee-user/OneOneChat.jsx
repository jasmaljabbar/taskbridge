import React, { useEffect, useState, useReducer, useRef } from "react";
import { json, useLocation, useNavigate } from "react-router-dom";
import useAxios from "../../../../AxiosConfig/Axios";
import Swal from "sweetalert2";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import { Toaster } from "react-hot-toast";
import { toast } from "react-hot-toast";
import EmojiPicker from "emoji-picker-react";
import { useDispatch, useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { useParams } from "react-router-dom";
import { BASE_URL } from "../../../../redux/actions/authService";
import axios from "axios";

function OneOneChat() {
  const navigate = useNavigate();
  const [choosenemoji, setChooseneemoji] = useState(null);
  const [emoji, setEmoji] = useState(false);
  const [data, setData] = useState([]);
  const [messages, setMessages] = useState([]);
  const [users_taskerside, setUser_tasekerside] = useState(null);
  const [employee, setEmployee] = useState([]);
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  const location = useLocation();
  const { user_in, tasker_in } = location.state || {};
  const accessToken = useSelector((state) => state.auth.token);
  const searchParams = new URLSearchParams(location.search);
  const taskerId = searchParams.get("user.id");
  const axiosInstance = useAxios();
  const messageRef = useRef();
  const taskerInfo = useSelector((state) => state.auth.taskerDetails);
  const user_profile = useSelector((state) => state.auth.token);
  const user_info = jwtDecode(user_profile);
  const userInfo = useSelector((state) => state.auth.user);
  const lastMessageRef = useRef(null);
  const { id } = useParams();

  console.log("====================================");
  console.log("taskerinfo:", user_info, "user info:", id);
  console.log("====================================");

  const currentUsers = localStorage.getItem("userDetails");
  const Employee = JSON.parse(currentUsers);
  let employeeId;
  let userId;
  let sender;
  let receiver;
  let currentUser;
  let currentrole;
  if (user_info) {
    if (user_info.is_staff === false) {
      employeeId = taskerInfo.user.id;
      userId = user_info.user_id;
      sender = user_info.user_id;
      receiver = taskerInfo.user.id;
      currentUser = user_info.user_id;
    } else if (user_info.is_staff === true) {
      userId = id;
      employeeId = user_info.user_id;
      sender = employeeId;
      receiver = id;
      currentUser = employeeId;
    }
  } else {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });

    Toast.fire({
      icon: "error",
      title: "Please Login",
    });
  }

  useEffect(() => {
    if (!userId) {
      navigate("/login");
    }
    GetUser();
    GetEmployee();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (user_info.is_staff) {
        try {
          const response = await axios.get(
            `${BASE_URL}dashboard/UserProfileDetailView/${id}/`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          setUser_tasekerside(response.data);

          return response.data;
        } catch (error) {
          console.error(error.response ? error.response.data : error);
        }
      }
    };

    fetchData();
  }, [user_info.is_staff, id, accessToken]);
  const GetUser = async () => {
    try {
      const response = await axiosInstance.get(
        `${BASE_URL}dashboard/employeeindividualPermission/${employeeId}/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.status === 200) {
        setEmployee(response.data);
      }
    } catch (error) {
      console.error("Error fetching employee data:", error);

      // Handle the error appropriately, e.g., show a user-friendly message
    }
  };

  const GetEmployee = async () => {
    const response = await axiosInstance.get(
      `${BASE_URL}account/api/userindivual/${userId}/`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (response.status === 200) {
      setUser(response.data);
    }
  };

  const handleMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error("Cannot be empty");
      return false;
    }
    const messageValue = message;
    if (client.readyState === W3CWebSocket.OPEN) {
      const newMessage = {
        id: Date.now(), // Temporary ID
        message: messageValue,
        sender: { id: sender },
        receiver: { id: receiver },
        date: new Date().toISOString(),
        is_read: false,
      };
      client.send(JSON.stringify(newMessage));

      // Add the new message to the state immediately
      setMessages((prevMessages) => [...prevMessages, newMessage]);

      setMessage("");
      setEmoji(false);
    } else {
      console.error("WebSocket not open yet. Message not sent.");
    }
  };
  const client = new W3CWebSocket(
    `ws://127.0.0.1:8000/ws/chat/${sender}_${receiver}/`
  );

  useEffect(() => {
    GetMessage();
  }, [sender, receiver]);

  const GetMessage = async () => {
    try {
      const response = await axiosInstance.get(
        `${BASE_URL}api/chat/message/${sender}/${receiver}/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setMessages(response.data);
      console.log("message is the ", response.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    client.onopen = () => {
      console.log("websocket client connected");
    };

    client.onerror = (error) => {
      console.error("WebSocket error:", error.message);
      console.error("WebSocket error:", error.message);
    };
    client.onclose = () => {
      console.log("WebSocket client disconnected");
    };
    return () => {
      client.close();
    };
  }, [sender, receiver]);

  useEffect(() => {
    client.onerror = (error) => {
      console.error("WebSocket Error: ", error);
    };

    client.onclose = (event) => {
      if (event.wasClean) {
        console.log(
          `Closed cleanly, code=${event.code}, reason=${event.reason}`
        );
      } else {
        console.warn("Connection died");
      }
    };
  }, []);

  useEffect(() => {
    client.onmessage = (event) => {
      try {
        const dataFromServer = JSON.parse(event.data);

        if (dataFromServer && dataFromServer.message) {
          const newMessage = {
            id: dataFromServer.id || Date.now(),
            message: dataFromServer.message,
            sender: dataFromServer.sender
              ? { id: dataFromServer.sender.id }
              : {},
            receiver: dataFromServer.receiver
              ? { id: dataFromServer.receiver.id }
              : {},
            date: dataFromServer.date || new Date().toISOString(),
            is_read: dataFromServer.is_read || false,
          };

          console.log("Processed new message:", newMessage);

          setMessages((prevMessages) => {
            // Check if the message is already in the state
            if (!prevMessages.some((msg) => msg.id === newMessage.id)) {
              // Only add the message if it's from the other user
              if (newMessage.sender.id !== currentUser) {
                return [...prevMessages, newMessage];
              }
            }
            return prevMessages;
          });
        } else {
          console.warn(
            "Received WebSocket data in unexpected format:",
            dataFromServer
          );
        }
      } catch (error) {
        console.error("Error processing WebSocket message:", error);
        console.error("Raw data that caused the error:", event.data);
      }
    };
  }, [currentUser]);

  const handleEmoji = () => {
    setEmoji(true);
  };

  const handleInputEmoji = (emoji) => {
    const emojiChar = emoji.emoji;
    setMessage((prvs) => prvs + emojiChar);
  };

  const handleCancel = () => {
    setEmoji(false);
  };

  const scrollToBottom = () => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <>
      <div className="flex h-[70%] mt-52  antialiased text-gray-800  bg-gray-50">
        <div className="flex flex-row h-full w-full overflow-x-hidden">
          <div className="flex flex-col flex-auto h-full p-6">
            <div className="flex flex-col flex-auto flex-shrink-0  rounded-2xl bg-white shadow-lg h-full p-4">
              <div className="flex flex-col h-full overflow-x-auto hide-scrollbar mb-4">
                {messages && messages.length > 0 ? (
                  <div className="flex flex-col   h-full">
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        ref={
                          index === messages.length - 1 ? lastMessageRef : null
                        }
                        className={`col-start-${
                          message.sender.id === currentUser ? "6" : "1"
                        } col-end-${
                          message.sender.id === currentUser ? "13" : "8"
                        } p-3 rounded-lg`}
                      >
                        <div
                          className={`flex flex-row items-center ${
                            message.sender.id === currentUser
                              ? "justify-start flex-row-reverse"
                              : "justify-start"
                          }`}
                        >
                          {message.sender.id !== currentUser && (
                            <>
                              {taskerInfo ? (
                                <img
                                  src={
                                    taskerInfo.profile_pic
                                      ? `http://127.0.0.1:8000${taskerInfo.profile_pic}`
                                      : "fallback_image_url"
                                  }
                                  alt="Receiver"
                                  className="w-10 h-10 rounded-full mr-3"
                                />
                              ) : user_info ? (
                                <img
                                  src={
                                    user_info.profile_photo
                                      ? `${users_taskerside.profile_photo}`
                                      : "fallback_image_url"
                                  }
                                  alt="U"
                                  className="w-10 h-10 rounded-full mr-3"
                                />
                              ) : (
                                <img
                                  src="default_image_url" // replace this with your imported default image
                                  alt="Default"
                                  className="w-full h-full rounded-full"
                                />
                              )}
                            </>
                          )}

                          <div
                            className={`relative ml-3 text-sm bg-${
                              message.sender.id === currentUser
                                ? "indigo-100"
                                : "white"
                            } py-2 px-4 shadow rounded-xl`}
                          >
                            <div>{message.message}</div>
                            <span className="absolute text-xs bottom-0 right-0 -mb-5 mr-2 text-gray-500">
                              {moment(message.date).format("LT")}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col h-full justify-center items-center text-gray-500">
                    No messages yet
                  </div>
                )}
              </div>
              {emoji && (
                <div className="flex justify-center">
                  <EmojiPicker onEmojiClick={handleInputEmoji} />
                  <button className="mt-2 text-red-500" onClick={handleCancel}>
                    X
                  </button>
                </div>
              )}
              <div className="flex flex-row items-center h-16 rounded-xl bg-white w-full px-4">
                <div>
                  <button
                    className="flex items-center justify-center text-gray-400 hover:text-gray-600"
                    onClick={handleEmoji}
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </button>
                </div>
                <div className="flex-grow ml-4">
                  <div className="relative w-full">
                    <input
                      type="text"
                      className="flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10"
                      placeholder="Type your message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      ref={messageRef}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          handleMessage(e);
                        }
                      }}
                    />
                  </div>
                </div>
                <div className="ml-4">
                  <button
                    className="flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium rounded-xl px-4 py-1"
                    onClick={handleMessage}
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </>
  );
}

export default OneOneChat;
