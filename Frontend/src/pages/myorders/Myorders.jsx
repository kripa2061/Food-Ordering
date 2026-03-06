import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { StoreContext } from "../../Context/Context";
import { assets } from "../../assets/frontend_assets/assets";
import "./Myorders.css";

const Myorders = () => {
  const { url,userData } = useContext(StoreContext);
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const res = await axios.post(
        url + "/api/order/userorder",
        {},
        {
         withCredentials:true, 
        }
      );
      setOrders(res.data.data || []);
    } catch (err) {
      console.error("fetchOrders error:", err);
    }
  };

  useEffect(() => {
    if (userData) fetchOrders();
  }, [userData]);

  return (
    <div className="myorders-wrapper">
      <h2 className="myorders-title">Your Orders</h2>

      <div className="myorders">
        {orders.length === 0 && (
          <p className="no-orders">You have no orders yet.</p>
        )}

        {orders.map((order, idx) => (
          <div className="order-card" key={idx}>
            {/* Icon */}
            <img src={assets.parcel_icon} alt="order" className="order-icon" />

            {/* Order content */}
            <div className="order-content">
              {/* Order Items */}
              <div className="order-items">
                {order.items.map((food, index) => (
                  <span key={index} className="food-item">
                    {food.name} x {food.quantity}
                  </span>
                ))}
              </div>

              {/* Total */}
              <p className="order-amount">
                <strong>Total:</strong> Rs. {order.amount}.00
              </p>

              {/* Status */}
              <p
                className={`order-status ${order.status
                  .toLowerCase()
                  .replace(/\s/g, "")}`}
              >
                <span>&#x25cf;</span> <strong>{order.status}</strong>
              </p>

              {/* Track button */}
              <button onClick={() => fetchOrders()}>Track Order</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Myorders;