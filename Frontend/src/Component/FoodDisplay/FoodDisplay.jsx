import React, { useContext, useState } from 'react';
import { assets } from '../../assets/frontend_assets/assets';
import './FoodDisplay.css';
import { StoreContext } from '../../Context/Context';
import LoginPopup from '../LoginPopUp/Loginpopup';

const FoodDisplay = ({ id, name, image, price, description }) => {
  const { cartItem, AddToCart, RemoveFromCart, url, token } = useContext(StoreContext);
  const [showLogin, setShowLogin] = useState(false);

  const handleCart = () => {
    if (!token) {
      setShowLogin(true); // show login popup if not logged in
    } else {
      AddToCart(id); // add item if logged in
    }
  };

  return (
    <>
      <LoginPopup showLogin={showLogin} setShowLogin={setShowLogin} />

      <div className="food_display">
        <div className="food_image_wrap">
          <img
            className="food_image"
            src={url + "/uploads/" + image}
            alt={name}
          />
        </div>
        <div className="food_price_wrap">
          <h3 className="food_price">Rs.{price}</h3>
        </div>
        <div className="count">
          {!cartItem[id] ? (
            <img
              className='count_img'
              onClick={handleCart}
              src={assets.add_icon_white}
              alt="Add white"
            />
          ) : (
            <>
              <img
                onClick={() => RemoveFromCart(id)}
                src={assets.remove_icon_red}
                alt="Remove red"
              />
              <span>{cartItem[id]}</span>
              <img
                onClick={() => AddToCart(id)}
                src={assets.add_icon_green}
                alt="Add green"
              />
            </>
          )}
        </div>

        <div className="food_header">
          <div className="food_name_wrap">
            <h4>{name}</h4>
          </div>
          <div className="food_rating_wrap">
            <img className="food_rating" src={assets.rating_starts} alt="Rating stars" />
          </div>
        </div>

        <div className="food_description_wrap">
          <p className="food_description">{description}</p>
        </div>


      </div>
    </>
  );
};

export default FoodDisplay;
