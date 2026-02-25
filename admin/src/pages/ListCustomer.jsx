import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import "./List.css";

const ListCustomer = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  const adminToken = localStorage.getItem("adminToken");
  const userToken = localStorage.getItem("userToken");
  const token = adminToken || userToken;
  const isAdmin = !!adminToken;
  const url = "http://localhost:5001";

  const fetchList = async () => {
    if (!token) {
      toast.error("Not authorized");
      return;
    }

    try {
      setLoading(true);
      let response;

      if (isAdmin) {
        response = await axios.get(`${url}/api/user/getUser`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.success) setList(response.data.data || []);
        else toast.error(response.data.message);
      } else {
        response = await axios.get(`${url}/api/user/get`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.success) setList([response.data.user]);
        else toast.error(response.data.message);
      }
    } catch {
      toast.error("Failed to fetch customers");
    } finally {
      setLoading(false);
    }
  };

const removeItem = async (userId) => {
  try {
    const response = await axios.delete(`${url}/api/user/removeuser/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.data.success) {
      toast.success("Customer deleted");
      fetchList();
    } else toast.error(response.data.message);
  } catch {
    toast.error("Delete failed");
  }
};

  useEffect(() => {
    fetchList();
  }, [location]);

  return (
    <div className="list-container">
      <h2>Customer List</h2>
      <div className="list-header">
        <b>ID</b>
        <b>Name</b>
        <b>Email</b>
        <b>Registered Date</b>
        <b>Actions</b>
      </div>

      {loading && <p>Loading...</p>}
      {!loading && list.length === 0 && <p>No customers found</p>}

      {!loading &&
        list.map((item) => (
          <div key={item._id} className="list-row">
            <p>{item._id.slice(0, 6)}</p>
            <p>{item.name}</p>
            <p>{item.email}</p>
            <p>
              {item.createdAt
                ? new Date(item.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : "—"}
            </p>
            <div className="action-buttons">
              {isAdmin && (
                <button className="delete-btn" onClick={() => removeItem(item._id)}>
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
    </div>
  );
};

export default ListCustomer;