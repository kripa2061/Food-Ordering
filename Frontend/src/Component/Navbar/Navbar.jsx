import React, { useContext, useState } from "react";
import { assets } from "../../assets/frontend_assets/assets";
import "./Navbar.css";
import { Link } from "react-router-dom";
import { StoreContext } from "../../Context/Context";

const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { totalItems, userData, logout } = useContext(StoreContext);

  const handleLogout = async () => {
    await logout();
    setShowLogin(true);
    setIsMenuOpen(false);
  };

  const handleMenuItemClick = (menuName) => {
    setMenu(menuName);
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`menu-overlay ${isMenuOpen ? "show" : ""}`}
        onClick={() => setIsMenuOpen(false)}
      ></div>

      <div className="container">
        {/* Logo */}
        <div className="logo">
          <Link to="/">
            <h1>ZestyBites</h1>
          </Link>
          <img src={assets.chilliPepper} alt="logo" />
        </div>

        {/* Navigation */}
        <div className={`nav ${isMenuOpen ? "mobile-open" : ""}`}>
          <ul>
            <li
              className={menu === "home" ? "active" : ""}
              onClick={() => handleMenuItemClick("home")}
            >
              <Link to="/">Home</Link>
            </li>

            <li
              className={menu === "menu" ? "active" : ""}
              onClick={() => handleMenuItemClick("menu")}
            >
              <a href="#explore-menu">Menu</a>
            </li>

            <li
              className={menu === "mobile-app" ? "active" : ""}
              onClick={() => handleMenuItemClick("mobile-app")}
            >
              <a href="#download-app">Mobile App</a>
            </li>

            <li
              className={menu === "contact-us" ? "active" : ""}
              onClick={() => handleMenuItemClick("contact-us")}
            >
              <a href="#footer">Contact Us</a>
            </li>

            {/* Mobile Login */}
            <li className="mobile-login">
              {!userData ? (
                <button
                  className="button"
                  onClick={() => {
                    setShowLogin(true);
                    setIsMenuOpen(false);
                  }}
                >
                  Sign In
                </button>
              ) : (
                <button
                  className="button"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              )}
            </li>
          </ul>
        </div>

        {/* Right Side */}
        <div className="sign-in">
          <ul>
            <li>
              <Link to="/search">
                <img src={assets.search_icon} alt="search" />
              </Link>
            </li>

            <li className="cart-icon">
              <Link to="/cart">
                <img
                  className="basket"
                  src={assets.basket_icon}
                  alt="cart"
                />
              </Link>

              {userData && totalItems > 0 && (
                <div className="dot">{totalItems}</div>
              )}
            </li>

            <li className="desktop-login">
              {!userData ? (
                <button
                  className="button"
                  onClick={() => setShowLogin(true)}
                >
                  Sign In
                </button>
              ) : (
                <div className="profile-dropdown">
                  <div className="profile-icon">
                    {userData.name.charAt(0).toUpperCase()}
                  </div>

                  <ul>
                    <Link to="/myorders">
                      <li>
                        <img
                          src={assets.parcel_icon}
                          alt=""
                        />
                        Orders
                      </li>
                    </Link>

                    <li onClick={handleLogout}>
                      <img
                        src={assets.logout_icon}
                        alt=""
                      />
                      Logout
                    </li>
                  </ul>
                </div>
              )}
            </li>
          </ul>
        </div>

        {/* Hamburger */}
        <div
          className={`hamburger ${isMenuOpen ? "active" : ""}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </>
  );
};

export default Navbar;