import React, { useContext, useEffect } from 'react';
import { StoreContext } from '../../Context/Context';
import './Cart.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Cart = () => {

  const { RemoveFromCart, cartItem, getTotal, url, foodList, token } =
    useContext(StoreContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      toast.error("Please login first");
      navigate("/");
    }
  }, [token, navigate]);

  const handlecheckOut = () => {
    if (getTotal() > 0) {
      navigate('/order');
    } else {
      toast.error("Cart is empty");
      navigate('/');
    }
  };

  return (
    <div>
      <div className="cart">
        <div className="cart-item">
          <p>Item</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>

        {foodList.map((item) => {
          if (cartItem[item._id] > 0) {
            return (
              <div className="cart-item-display" key={item._id}>
                <img
                  src={url + "/uploads/" + item.image}
                  alt={item.name}
                />
                <p>{item.name}</p>
                <p>Rs.{item.price}</p>
                <p>{cartItem[item._id]}</p>
                <p>Rs.{item.price * cartItem[item._id]}</p>
                <p onClick={() => RemoveFromCart(item._id)}>⛌</p>
              </div>
            );
          }
          return null;
        })}
      </div>

      <div className="cart-footer">
        <div className="cart-buttom">
          <div className="subtotal">
            <p>Subtotal</p>
            <p>Rs.{getTotal()}</p>
          </div>

          <div className="delivery">
            <p>Delivery Fee</p>
            <p>Rs.{getTotal() === 0 ? 0 : 200}</p>
          </div>

          <div className="total">
            <p>Total</p>
            <p>Rs.{getTotal() === 0 ? 0 : getTotal() + 200}</p>
          </div>

          <button onClick={handlecheckOut}>
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
