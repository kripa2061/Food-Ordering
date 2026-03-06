import React, { useState, useEffect } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const url = "http://localhost:5001";
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);


  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await axios.get(`${url}/api/admin/check`, {
          withCredentials: true, 
        });
        if (res.data.success) {
          setIsLoggedIn(true);
          navigate("/add"); // redirect to admin panel
        }
      } catch (err) {
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };
    checkAdmin();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${url}/api/user/adminlogin`,
        { email, password },
        { withCredentials: true } // cookie will be set automatically
      );

      if (!res.data.success) return alert(res.data.message);

      // No localStorage needed! Token is in HttpOnly cookie
      navigate("/add"); // redirect to admin panel
    } catch (err) {
      alert("Server error");
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="login-page">
      <div className="login-card">

        {/* LEFT IMAGE */}
        <div className="login-left">
          <h1>Admin Panel</h1>
          <p>Manage orders, users & products</p>
        </div>

        {/* RIGHT FORM */}
        <div className="login-right">
          <h2>Welcome Back 👋</h2>
          <p>Please login to continue</p>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <i className="fa fa-envelope"></i>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <i className="fa fa-lock"></i>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="admin-login-button">Login</button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Login;