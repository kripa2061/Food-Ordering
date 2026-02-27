import { createContext, useEffect, useState } from 'react';
import axios from 'axios';

export const StoreContext = createContext(null);

const StoreContextProvider = ({ children }) => {
  const url = "http://localhost:5001";

  // State initialization with localStorage fallback
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("userData")) || null
  );
  const [cartItem, setCartItem] = useState(
    JSON.parse(localStorage.getItem("cartItem")) || {}
  );
  const [foodList, setFoodList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Persist token
  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  // Persist userData
  useEffect(() => {
    if (userData) localStorage.setItem("userData", JSON.stringify(userData));
    else localStorage.removeItem("userData");
  }, [userData]);

  // Persist cart
  useEffect(() => {
    localStorage.setItem("cartItem", JSON.stringify(cartItem));
  }, [cartItem]);

  // Fetch user data
  const fetchUser = async () => {
    if (!token) return;
    try {
      const { data } = await axios.get(`${url}/api/user/get`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.success) setUserData(data.user);
    } catch (err) {
      console.error("fetchUser error:", err);
    }
  };

  // Fetch food list
  const fetchFoodList = async () => {
    try {
      const { data } = await axios.get(`${url}/api/food/list`);
      setFoodList(data.data || []);
    } catch (err) {
      console.error("fetchFoodList error:", err);
    }
  };

  // Fetch cart
  const fetchCart = async () => {
    if (!token) return;
    try {
      const { data } = await axios.get(`${url}/api/cart/get`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCartItem(data.cartData || {});
    } catch (err) {
      console.error("fetchCart error:", err);
    }
  };

  // Add to cart
  const AddToCart = async (id) => {
    setCartItem(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    if (token && userData?._id) {
      try {
        await axios.post(`${url}/api/cart/add`, { itemId: id, userId: userData._id }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (err) {
        console.error("AddToCart error:", err);
      }
    }
  };

  // Remove from cart
  const RemoveFromCart = async (id) => {
    setCartItem(prev => {
      const newCart = { ...prev };
      if (!newCart[id]) return prev;
      if (newCart[id] === 1) delete newCart[id];
      else newCart[id] -= 1;
      return newCart;
    });
    if (token) {
      try {
        await axios.post(`${url}/api/cart/remove`, { itemId: id }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (err) {
        console.error("RemoveFromCart error:", err);
      }
    }
  };

  const getTotal = () => {
    return Object.entries(cartItem).reduce((acc, [id, qty]) => {
      const item = foodList.find(f => f._id === id);
      return item ? acc + item.price * qty : acc;
    }, 0);
  };

  const totalItems = Object.values(cartItem).reduce((a, b) => a + b, 0);

  // Load initial data
  useEffect(() => {
    const load = async () => {
      await fetchFoodList();
      if (token) {
        if (!userData) await fetchUser(); // fetch only if not in localStorage
        await fetchCart();
      }
      setLoading(false);
    };
    load();
  }, [token]);

  return (
    <StoreContext.Provider value={{
      cartItem,
      setCartItem,
      foodList,
      AddToCart,
      RemoveFromCart,
      getTotal,
      totalItems,
      token,
      setToken,
      userData,
      setUserData,
      url
    }}>
      {loading ? <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</div> : children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;