import React, { useContext, useState } from 'react';
import { assets } from '../../assets/frontend_assets/assets';
import './Navbar.css';
import { Link } from 'react-router-dom';
import { StoreContext } from '../../Context/Context';
import axios from 'axios';

const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("home");
  const { cartItem, totalItems, url, userData, logout } = useContext(StoreContext);

  const handleLogout = async () => {
    await logout();
    setShowLogin(true);
  };

  return (
    <div className="container">
      <div className="logo">
        <Link to="/"><h1>ZestyBites</h1></Link>
        <img src={assets.chilliPepper} alt="Logo" />
      </div>
      <div className="nav">
        <ul>
          <li onClick={() => setMenu("home")} className={menu === "home" ? "active" : ""}><Link to="/">Home</Link></li>
          <li onClick={() => setMenu("menu")} className={menu === "menu" ? "active" : ""}><a href="#explore-menu">Menu</a></li>
          <li onClick={() => setMenu("mobile-app")} className={menu === "mobile-app" ? "active" : ""}><a href="#download-app">Mobile-app</a></li>
          <li onClick={() => setMenu("contact-us")} className={menu === "contact-us" ? "active" : ""}><a href="#footer">Contact Us</a></li>
        </ul>
      </div>
      <div className="sign-in">
        <ul>
          <li><Link to="/search"><img src={assets.search_icon} alt="Search" /></Link></li>
          <li>
            <Link to="/cart"><img className="basket" src={assets.basket_icon} alt="Cart" /></Link>
            {userData && totalItems > 0 && <div className="dot">{totalItems}</div>}
          </li>
          <li>
            {!userData ? (
              <button className="button" onClick={() => setShowLogin(true)}>Sign in</button>
            ) : (
              <div className='profile-dropdown'>
                <div className='profile-icon'>{userData?.name[0].toUpperCase()}</div>
                <ul>
                  <Link to="/myorders"><li><img src={assets.parcel_icon} />Orders</li></Link>
                  <li onClick={handleLogout}><img src={assets.logout_icon} />Logout</li>
                </ul>
              </div>
            )}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;