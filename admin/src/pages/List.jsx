import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import './List.css'

const List = () => {
  const [list, setList] = useState([]);
  // const url = "https://food-ordering-backend-jygm.onrender.com";
     const url = "http://localhost:5001"
  const navigate = useNavigate();
  const location = useLocation();

  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`,{withCredentials:true});
      if (response.data.success) {
        setList(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to fetch list");
    }
  };

  const removeItem = async (foodId) => {
    try {
      const response = await axios.post(`${url}/api/food/delete`, { id: foodId },{withCredentials:true});
      if (response.data.success) {
        toast.success("Item removed");
        fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  // Refetch whenever location changes (e.g., after editing)
  useEffect(() => {
    fetchList();
  }, [location]);

  return (
    <div className="list-container">
      <h2>Food List</h2>
      <div className="list-header">
        <b>Image</b>
        <b>Name</b>
        <b>Category</b>
        <b>Price</b>
        <b>Action</b>
      </div>

      {list.map((item) => (
        <div key={item._id} className="list-row">
         
          <img
  className="food_image"
  src={item.image?.[0]}
  alt={name}
/>
          <p>{item.name}</p>
          <p>{item.category}</p>
          <p>Rs. {item.price}</p>
       <div className="action-buttons">
  <button className="edit-btn" onClick={() => navigate(`/edit/${item._id}`)}>Edit</button>
  <button className="delete-btn" onClick={() => removeItem(item._id)}>Delete</button>
</div>

        </div>
      ))}
    </div>
  );
};

export default List;
