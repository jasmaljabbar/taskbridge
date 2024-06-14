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
import AdminLogin from "./Components/admin_side/AdminLogin";
import AdminDashboard from "./Components/admin_side/AdminDashboard";
import AddUser from "./Components/admin_side/AddUser";
import Navbar from "./Components/common/Navbar";
import { admin_login, login } from "./redux/reducers/authSlice";
import UserProfile from "./Components/user_side/UserProfile";
import DebugTokenComponent from "./Components/Test";
import HomePage from "./Components/user_side/Home";
import NotFound from "./Components/common/NotFount";
import Signup from "./Components/tasker_side/Signup";
import Home from "./Components/tasker_side/Home";
import Dashboard from "./Components/tasker_side/Dashboard";
import TaskerLogin from "./Components/tasker_side/TaskerLogin";
import { Toaster } from "react-hot-toast";
import Sidebar from "./Components/tasker_side/Sidebar";
import AdminLayout from "./Components/tasker_side/Home/AdminLayout";

const ProtectedRoute = ({ element, isAuthenticated, redirectTo }) => {
  return isAuthenticated ? element : <Navigate to={redirectTo} replace />;
};

const App = () => {
  // const {user} = useSelector((state)=>state.auth)
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const isAdmin = useSelector((state) => state.auth.isadmin);
  const is_staff = useSelector((state) => state.auth.is_staff);
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();

  useEffect(() => {
    if (token) {
      if(isAdmin){
        dispatch(admin_login({token}));
      }else{
        dispatch(login({ token }));
      }
    }
  }, [dispatch, token]);

  return (
    <>
      <Toaster position="top-center" />

      <Router>
        <Navbar />
        {/* <Sidebar /> */}
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<HomePage />} />
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
          {/* admin_side */}
          <Route
            path="/admin_login"
            element={
              <ProtectedRoute
                element={<AdminLogin />}
                isAuthenticated={!isAuthenticated}
                redirectTo="/dashboard"
              />
            }
          />
          <Route
            path="/adduser"
            element={
              <ProtectedRoute
                element={<AddUser />}
                isAuthenticated={isAuthenticated && isAdmin}
                redirectTo="/login"
              />
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute
                element={<AdminDashboard />}
                isAuthenticated={isAuthenticated && isAdmin}
                redirectTo="/admin_login"
              />
            }
          />
          <Route path="/debugging" element={<DebugTokenComponent />} />
          <Route path="*" element={<NotFound />} />

          {/* Tasker_side */}

          <Route
            path="/tasker_signup"
            element={
              <ProtectedRoute
                element={<Signup />}
                isAuthenticated={isAuthenticated}
                redirectTo="/login"
              />
            }
          />
          <Route
            path="/tasker_login"
            element={
              <ProtectedRoute
                element={<TaskerLogin />}
                isAuthenticated={isAuthenticated}
                redirectTo="/login"
              />
            }
          />
          <Route
            path="/tasker_home"
            element={
              <ProtectedRoute
                element={<Home />}
                isAuthenticated={isAuthenticated}
                redirectTo="/login"
              />
            }
          />
          <Route
            path="tasker"
            element={
              <ProtectedRoute
                element={<AdminLayout />}
                isAuthenticated={isAuthenticated && is_staff}
                redirectTo="/login"
              />
            }
          >
            <Route path="tasker_dashboard" element={<Dashboard />} />
          </Route>
          {/* <Route
            path="/tasker_dashboard"
            element={
              <ProtectedRoute
                element={<Dashboard />}
                isAuthenticated={isAuthenticated && is_staff}
                redirectTo="/login"
              />
            }
          /> */}
        </Routes>
      </Router>
    </>
  );
};

export default App;
