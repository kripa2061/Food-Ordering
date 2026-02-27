import React from 'react'

import { menu_list } from '../../assets/frontend_assets/assets'
import './ExploreMenu.css';
const ExploreMenu = ({ category, setCategory }) => {



  return (
    <div className='explore-menu' id="explore-menu">
      <div className="text">
        <h1>Explore Our Menu</h1>
        <p>Craving something tasty? Explore our wide variety of flavorful dishes made to delight every bite!</p>
      </div>

      <div className='explore-menu2'>
        {menu_list.map((Item,index) => (
          <div key={index} onClick={() => setCategory(prev => prev === Item.menu_name ? "All" : Item.menu_name)}>
            <div className="wrap">
             
              <img
                className={category === Item.menu_name ? 'active1' : ''}
                src={Item.menu_image}
                alt={Item.menu_name}
              />
               <h3>{Item.menu_name}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ExploreMenu;
