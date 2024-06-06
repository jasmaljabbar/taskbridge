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
import Navbar from "./Components/user_side/Home/Navbar";
import { login } from "./redux/auth/authSlice";
import UserProfile from "./Components/user_side/UserProfile";
import DebugTokenComponent from "./Components/Test";
import HomePage from "./Components/user_side/Home";
import NotFound from "./Components/common/NotFount";

const ProtectedRoute = ({ element, isAuthenticated, redirectTo }) => {
  return isAuthenticated ? element : <Navigate to={redirectTo} replace />;
};

const App = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const isAdmin = useSelector((state) => state.auth.isadmin);
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();

  useEffect(() => {
    if (token) {
      dispatch(login({ token }));
    }
  }, [dispatch, token]);

  return (
    <Router>
      <Navbar />
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
        {/* addmin_side */}
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
              isAuthenticated={isAuthenticated}
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
        <Route path="/debuging" element={<DebugTokenComponent />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

const AdminRoutes = () => {
  return (
    <Routes>
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute
            element={<AdminDashboard />}
            isAuthenticated={
              useSelector((state) => state.auth.isAuthenticated) &&
              useSelector((state) => state.auth.isAdmin)
            }
            redirectTo="/admin_login"
          />
        }
      />
      <Route
        path="/adduser"
        element={
          <ProtectedRoute
            element={<AddUser />}
            isAuthenticated={
              useSelector((state) => state.auth.isAuthenticated) &&
              useSelector((state) => state.auth.isAdmin)
            }
            redirectTo="/admin_login"
          />
        }
      />
      {/* Add more admin-specific routes here */}
    </Routes>
  );
};

export default App;
