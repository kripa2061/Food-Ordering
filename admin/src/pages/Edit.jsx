import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { assets } from "../assets/admin_assets/assets";
import "./Add.css"; // same CSS as Add page

const Edit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const url = "http://localhost:5001";

  const [image, setImage] = useState(null);
  const [oldImage, setOldImage] = useState("");

  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: ""
  });

  useEffect(() => {
    axios.get(`${url}/api/food/${id}`).then((res) => {
      if (res.data.success) {
        setData(res.data.data);
        setOldImage(res.data.data.image);
      } else {
        toast.error("Food not found");
      }
    });
  }, [id]);

  const onChangeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", data.price);
    formData.append("category", data.category);
    if (image) formData.append("image", image);

    try {
      const res = await axios.post(`${url}/api/food/edit/${id}`, formData,{withCredentials:true});
      if (res.data.success) {
        toast.success("Food updated");
        navigate("/list");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="add-page">
      <h2>Edit Product</h2>

      <form className="add-form" onSubmit={submitHandler}>
        <div className="form-group image-upload">
          <p>Upload Image</p>
          <label htmlFor="image">
            <img
              src={
                image
                  ? URL.createObjectURL(image)
                  : oldImage
                  ? `${url}/Uploads/${oldImage}`
                  : assets.upload_area
              }
              alt="Upload area"
            />
          </label>
          <input
            type="file"
            id="image"
            hidden
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>

        <div className="form-group">
          <label>Product Name</label>
          <input
            type="text"
            name="name"
            value={data.name}
            onChange={onChangeHandler}
            placeholder="Enter product name"
            required
          />
        </div>

        <div className="form-group">
          <label>Product Description</label>
          <textarea
            name="description"
            value={data.description}
            onChange={onChangeHandler}
            placeholder="Enter description"
            style={{ height: "100px" }}
            required
          />
        </div>

        <div className="form-group">
          <label>Product Category</label>
          <select
            name="category"
            value={data.category}
            onChange={onChangeHandler}
            required
          >
            <option value="" disabled>
              Select category
            </option>
            <option value="salad">Salad</option>
            <option value="rolls">Rolls</option>
            <option value="dessert">Dessert</option>
            <option value="sandwich">Sandwich</option>
            <option value="cake">Cake</option>
            <option value="pure-veg">Pure Veg</option>
            <option value="pasta">Pasta</option>
            <option value="noodles">Noodles</option>
          </select>
        </div>

        <div className="form-group">
          <label>Product Price</label>
          <input
            type="number"
            name="price"
            value={data.price}
            onChange={onChangeHandler}
            placeholder="Enter price"
            required
          />
        </div>

        <button type="submit" className="submit-btn">
          Update
        </button>
      </form>
    </div>
  );
};

export default Edit;
