import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { assets } from "../assets/admin_assets/assets";
import "./Order.css";
import { CircleX } from 'lucide-react';
const Order = ({ url }) => {
  const [orders, setOrders] = useState([]);

  // Fetch all orders
  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(url + "/api/order/list");
      if (response.data.success) {
        setOrders(response.data.data);
      } else {
        toast.error("Failed to fetch orders");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  // Delete order
  const deleteHandler = async (orderId) => {
    try {
      const response = await axios.post(
        `${url}/api/order/deleteOrderbyId/${orderId}`
      );

      if (response.data.success) {
        toast.success("Order deleted successfully");
        fetchAllOrders();
      } else {
        toast.error("Failed to delete order");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  // Update order status
  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(url + "/api/order/status", {
        orderId,
        status: event.target.value,
      });

      if (response.data.success) {
        fetchAllOrders();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status");
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <div className="order-page">
      <h3>Order Page</h3>

      {orders.length === 0 && (
        <p className="no-orders">No orders found</p>
      )}

      <div className="orders-wrapper">
        {orders.map((orderItem) => (
          <div className="order-card" key={orderItem._id}>
            <img
              src={assets.parcel_icon}
              alt="order"
              className="order-icon"
            />

            <div className="order-content">
              <div className="order-items">
            
                <p>  <CircleX size={24} color="currentColor"  className="delete"   onClick={() => deleteHandler(orderItem._id)} /></p>

                {orderItem.items.map((item, idx) => (
                  <span key={idx}>
                    {item.name} x {item.quantity}
                    {idx !== orderItem.items.length - 1 ? ", " : ""}
                  </span>
                ))}
              </div>

              <div className="customer-info">
                <p>
                  <b>Name:</b> {orderItem.address.firstName}{" "}
                  {orderItem.address.lastName}
                </p>
                <p>
                  <b>Address:</b> {orderItem.address.street},{" "}
                  {orderItem.address.city}
                </p>
                <p>{orderItem.address.phone}</p>
              </div>

              <div className="order-details">
                <span>Items: {orderItem.items.length}</span>
                <span>Rs. {orderItem.amount}</span>
                <span>{orderItem.ispaid}</span>
              </div>

              <select
                className="order-status-select"
                value={orderItem.status}
                onChange={(event) =>
                  statusHandler(event, orderItem._id)
                }
              >
                <option value="Food processing">Food processing</option>
                <option value="Packaging">Packaging</option>
                <option value="Out for delivery">
                  Out for delivery
                </option>
                <option value="Delivered">Delivered</option>
                <option value="order cancelled">Order Cancelled</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Order;
