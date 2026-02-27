import React, { useState, useContext } from 'react';
import { StoreContext } from '../../Context/Context';

import './Search.css';
import FoodDisplay from '../../Component/FoodDisplay/FoodDisplay';

const Search = () => {
  const { foodList } = useContext(StoreContext);
  const [query, setQuery] = useState('');

  // Filter foods based on search query
  const filteredFoods = foodList.filter(item =>
    item.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="search_container">
      <div className="search_input_wrap">
        <input
          type="text"
          placeholder="Search for a dish..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="search_results">
        {filteredFoods.length > 0 ? (
          filteredFoods.map(item => (
            <FoodDisplay
              key={item._id}
              id={item._id}
              name={item.name}
              image={item.image}
              price={item.price}
              description={item.description}
              category={item.category}
            />
          ))
        ) : (
          <p className="no_results">No dishes found.</p>
        )}
      </div>
    </div>
  );
};

export default Search;
