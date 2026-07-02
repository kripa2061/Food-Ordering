import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const AdminProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await axios.get("https://food-ordering-backend-jygm.onrender.com/api/admin/check", { withCredentials: true });
        // const res = await axios.get("http://localhost:5001/api/admin/check", { withCredentials: true });
        setIsLoggedIn(res.data.success);
      } catch {
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };
    checkAdmin();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!isLoggedIn) return <Navigate to="/sign" replace />;

  return children;
};

export default AdminProtectedRoute; 