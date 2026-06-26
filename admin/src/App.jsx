import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./Component/Navbar";
import Sidebar from "./Component/Sidebar";
import Add from "./pages/Add";
import List from "./pages/List";
import Order from "./pages/Order";
import Edit from "./pages/Edit";
import Login from "./Component/Login";
import AdminProtectedRoute from "./Component/AdminProtectedRoutes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import { useState } from "react";
import ListCustomer from "./pages/ListCustomer";
import Dashboard from "./pages/Dashboard";

const App = () => {
  const url = "https://food-ordering-backend-jygm.onrender.com";
  const location = useLocation();
  const token = localStorage.getItem("adminToken");


  const showLayout = token && location.pathname !== "/sign";

  return (
    <div className="app-container">
      {showLayout && <Navbar />}
      <div className="main-content">
        {showLayout && <Sidebar />}
        <div className="page-content">
          <Routes>

            <Route path="/sign" element={<Login />} />


            <Route
              path="/"
              element={
                <AdminProtectedRoute>
                  <Dashboard />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/add"
              element={
                <AdminProtectedRoute>
                  <Add />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/add"
              element={
                <AdminProtectedRoute>
                  <Add />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/list"
              element={
                <AdminProtectedRoute>
                  <List />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/order"
              element={
                <AdminProtectedRoute>
                  <Order url={url} />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/edit/:id"
              element={
                <AdminProtectedRoute>
                  <Edit />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/user"
              element={
                <AdminProtectedRoute>
                  <ListCustomer url={url} />
                </AdminProtectedRoute>
              }
            />

          </Routes>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={1800}
        pauseOnHover={false}
        theme="colored"
      />
    </div>
  );
};

export default App;
