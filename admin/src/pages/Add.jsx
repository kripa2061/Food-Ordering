import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { assets } from '../assets/admin_assets/assets'
import './Add.css'
import { toast } from 'react-toastify'

const Add = () => {
    const [image, setImage] = useState(null)
    const [data, setData] = useState({
        name: "",
        description: "",
        price: "",
        category: ""
    })

    const onChangeHandler = (event) => {
        const { name, value } = event.target
        setData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const url = "https://food-ordering-backend-jygm.onrender.com"

        const formData = new FormData()
        formData.append("name", data.name)
        formData.append("description", data.description)
        formData.append("price", Number(data.price))
        formData.append("category", data.category)
        formData.append("image", image)

        try {
            const response = await axios.post(`${url}/api/food/add`, formData,{withCredentials:true})

            if (response.data.success) {
                toast.success("Food added successfully!")

                setData({
                    name: "",
                    description: "",
                    price: "",
                    category: ""
                })
                setImage(null)
            } else {
                toast.error(response.data.message)
            }

        } catch (error) {
            toast.error("Something went wrong!")
        }
    }

    useEffect(() => {
        console.log(data)
    }, [data])

    return (
        <div className="add-page">
            <h2>Add New Product</h2>

            <form className="add-form" onSubmit={handleSubmit}>
                <div className="form-group image-upload">
                    <p>Upload Image</p>
                    <label htmlFor='image'>
                        <img
                            src={image ? URL.createObjectURL(image) : assets.upload_area}
                            alt="Upload area"
                        />
                    </label>
                    <input
                        onChange={(e) => setImage(e.target.files[0])}
                        type="file"
                        id="image"
                        hidden
                        required
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
                        style={{ height: '120px' }}
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
                        <option value="" disabled>Select category</option>
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

                <button type="submit" className="submit-btn">Add</button>
            </form>
        </div>
    )
}

export default Add
