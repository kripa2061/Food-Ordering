import React, { useContext } from 'react';
import { StoreContext } from '../../Context/Context';
import FoodDisplay from '../FoodDisplay/FoodDisplay';
import './Food_list.css';

const Food_list = ({ category }) => {
  const { foodList,url } = useContext(StoreContext);
  const filteredList = !category || category.toLowerCase() === "all"
    ? foodList
    : foodList.filter(item => item.category.toLowerCase() === category.toLowerCase());

  return (
    <>
      <div className="text">
        <h2>Top Dishes Near You</h2>
      </div>
      <div className="food_list" id="food_list">
        {filteredList.map(item => (
          <FoodDisplay
            key={item._id}
            id={item._id}
            name={item.name}
            image={item.image?.[0]}
            price={item.price}
            description={item.description}
            category={item.category}
          />
        ))}
      </div>
    </>
  );
};

export default Food_list;
