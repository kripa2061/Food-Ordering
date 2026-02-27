import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../Context/Context";
import "./PlaceOrder.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const PlaceOrder = () => {
  const { getTotal, foodList, cartItem, url, setCartItem, token } =
    useContext(StoreContext);
  const navigate = useNavigate();

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    phone: "",
  });

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const placeOrder = async (e) => {
    e.preventDefault();

    // build order items
    const orderItems = [];
    foodList.forEach((item) => {
      if (cartItem[item._id] > 0) {
        orderItems.push({
          name: item.name,
          price: item.price,
          quantity: cartItem[item._id],
        });
      }
    });

    const orderData = {
      address: data,
      items: orderItems,
      amount: getTotal() + 200,
    };

    if (!token) {
      toast.error("Please login to place an order");
      navigate("/cart");
      return;
    }

    try {
      // ✅ Minimal change: use Authorization header as Bearer token
      const response = await axios.post(url + "/api/order/place", orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setCartItem({}); // clear cart
        setData({
          firstName: "",
          lastName: "",
          email: "",
          street: "",
          city: "",
          phone: "",
        });
        window.location.replace(response.data.session_url);
      } else {
        toast.error(response.data.message || "Order failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Order failed");
    }
  };

  useEffect(() => {
    if (!token) {
      toast.error("Login to order");
      navigate("/cart");
    } else if (getTotal() === 0) {
      toast.error("Your cart is empty");
      navigate("/cart");
    }
  }, [token, getTotal, navigate]);

  return (
    <>
      <p className="title">Enter your Details</p>

      <div className="place-order">
        <form onSubmit={placeOrder} className="order-form">
          <div className="name-row">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={data.firstName}
              onChange={onChangeHandler}
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={data.lastName}
              onChange={onChangeHandler}
              required
            />
          </div>

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={data.email}
            onChange={onChangeHandler}
            required
          />

          <input
            type="text"
            name="street"
            placeholder="Street"
            value={data.street}
            onChange={onChangeHandler}
            required
          />

          <input
            type="text"
            name="city"
            placeholder="City"
            value={data.city}
            onChange={onChangeHandler}
            required
          />

          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={data.phone}
            onChange={onChangeHandler}
            required
          />

          <div className="cart-summary">
            <div className="row">
              <p>Subtotal</p>
              <p>Rs {getTotal()}</p>
            </div>

            <div className="row">
              <p>Delivery Fee</p>
              <p>Rs 200</p>
            </div>

            <div className="row total-row">
              <p>Total</p>
              <p>Rs {getTotal() + 200}</p>
            </div>

            <button type="submit">Place Order</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default PlaceOrder;