import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Register from "./Components/user_side/Register";
import Login from "./Components/user_side/Login";
import AddUser from "./Components/admin_side/AddUser";
import Navbar from "./Components/common/Navbar";
import { login } from "./redux/reducers/authSlice";
import UserProfile from "./Components/user_side/UserProfile";
import DebugTokenComponent from "./Components/Test";
import HomePage from "./Components/user_side/Home";
import NotFound from "./Components/common/NotFount";
import Signup from "./Components/tasker_side/Signup";
import Home from "./Components/tasker_side/Home";
import Dashboard from "./Components/tasker_side/Dashboard";
import { Toaster } from "react-hot-toast";
import Sidebar from "./Components/tasker_side/Sidebar";
import AdminLayout from "./Components/admin_side/Home/AdminLayout";
import TaskerLayout from "./Components/tasker_side/Home/TaskerLayout";
import Tasker_Listing from "./Components/admin_side/Tasker_Listing";
import UserList from "./Components/admin_side/UserList";
import Otp from "./Components/user_side/Otp";
import TaskCategory from "./Components/admin_side/TaskCategory";
import Tasker_profile from "./Components/tasker_side/Tasker_profile";
import Services from "./Components/user_side/Services";
import TaskShow from "./Components/tasker_side/TaskShow/TaskShow";
import TaskerProfile from "./Components/admin_side/TaskerProfile ";
import Filtered_tasker from "./Components/user_side/Services/Filtered_tasker";
import SearchTasker from "./Components/user_side/Services/SearchTasker ";
import Details from "./Components/user_side/Tasker/Details";
// import MeetTasker from "./Components/user_side/MeetTasker";
import UserTaskerLayout from "./Components/user_side/Tasker/UserTaskerLayout";
import Message from "./Components/user_side/Tasker/Message";
import BookNow from "./Components/user_side/Tasker/BookNow";

const ProtectedRoute = ({ element, isAuthenticated, redirectTo }) => {
  return isAuthenticated ? element : <Navigate to={redirectTo} replace />;
};

const App = () => {
  const accessToken = localStorage.getItem("token");

  const dispatch = useDispatch();
  const {
    isAuthenticated,
    isadmin,
    is_staff: isStaff,
  } = useSelector((state) => state.auth);

  useEffect(() => {
    if (accessToken) {
      if (isadmin) {
        dispatch(login({ accessToken }));
      } else {
        dispatch(login({ accessToken }));
      }
    }
  }, [dispatch, accessToken, isadmin]);

  return (
    <>
      <Toaster position="top-center" />
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/services" element={<Services />} />
          <Route path="/Filtered_tasker/:id" element={<Filtered_tasker />} />
          <Route path="/search_results" element={<SearchTasker />} />
          {/* <Route path="/meetTasker" element={<MeetTasker />} />  */}
          <Route
            path="/register"
            element={
              <ProtectedRoute
                element={<Register />}
                isAuthenticated={!isAuthenticated}
                redirectTo="/home"
              />
            }
          />
          <Route
            path="/login"
            element={
              <ProtectedRoute
                element={<Login />}
                isAuthenticated={!isAuthenticated}
                redirectTo="/home"
              />
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute
                element={<UserProfile />}
                isAuthenticated={isAuthenticated}
                redirectTo="/login"
              />
            }
          />

          <Route
            path="/"
            element={
              <ProtectedRoute
                element={<UserTaskerLayout />}
                isAuthenticated={isAuthenticated}
                redirectTo="/login"
              />
            }
          >
            <Route path="details/:id" element={<Details />} />
            <Route path="message" element={<Message />} />
            <Route path="booknow" element={<BookNow />} />
          </Route>

          <Route path="/debugging" element={<DebugTokenComponent />} />
          <Route path="*" element={<NotFound />} />

          {/* Tasker_side */}
          <Route
            path="/tasker_signup"
            element={
              <ProtectedRoute
                element={<Signup />}
                isAuthenticated={isAuthenticated}
                redirectTo="/tasker_home"
              />
            }
          />
          <Route
            path="/tasker_home"
            element={
              <ProtectedRoute
                element={<Home />}
                isAuthenticated={isAuthenticated}
                redirectTo="/tasker_login"
              />
            }
          />
          <Route
            path="/tasker"
            element={
              <ProtectedRoute
                element={<TaskerLayout />}
                isAuthenticated={isAuthenticated && isStaff}
                redirectTo="/tasker_login"
              />
            }
          >
            <Route path="tasker_dashboard" element={<Dashboard />} />
            <Route path="profile" element={<Tasker_profile />} />
            <Route path="taskshow" element={<TaskShow />} />
          </Route>
          {/* admin_side */}
          <Route
            path="/adduser"
            element={
              <ProtectedRoute
                element={<AddUser />}
                isAuthenticated={isAuthenticated && isadmin}
                redirectTo="/admin_login"
              />
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute
                element={<AdminLayout />}
                isAuthenticated={isAuthenticated && isadmin}
                redirectTo="/admin_login"
              />
            }
          >
            <Route path="user_list" element={<UserList />} />
            <Route path="tasker/:id" element={<TaskerProfile />} />
            <Route path="tasker_showing" element={<Tasker_Listing />} />
            <Route path="task_list" element={<TaskCategory />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
};

export default App;
