import foodModel from "../Model/FoodModel.js";
import { supabase } from "../Config/supabase.js";

// Add Food
const addFood = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;

    if (!name || !description || !price || !category) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded",
      });
    }

    const file = req.file;
    const fileName = `images/${Date.now()}_${file.originalname}`;

    const { error } = await supabase.storage
      .from("products")
      .upload(fileName, file.buffer, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.mimetype,
      });

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    const { data } = supabase.storage
      .from("products")
      .getPublicUrl(fileName);

    const food = new foodModel({
      name,
      description,
      price,
      category,
      image: [data.publicUrl],
      isActive: true,
    });

    await food.save();

    res.json({
      success: true,
      message: "Food added successfully",
    });

  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// Food List
const foodList = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.json({
      success: true,
      data: foods,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// Remove Food
const removefood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id);

    if (!food) {
      return res.json({
        success: false,
        message: "Food not found",
      });
    }

    if (food.image && food.image.length > 0) {
      const filePaths = food.image.map((url) =>
        url.split("/products/")[1]
      );

      await supabase.storage
        .from("products")
        .remove(filePaths);
    }

    await foodModel.findByIdAndDelete(req.body.id);

    res.json({
      success: true,
      message: "Food removed successfully",
    });

  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// Edit Food
const editFood = async (req, res) => {
  try {
    const { id } = req.params;

    const food = await foodModel.findById(id);

    if (!food) {
      return res.json({
        success: false,
        message: "Food not found",
      });
    }

    let images = food.image;

    if (req.file) {

      // Delete old image
      if (food.image && food.image.length > 0) {
        const oldFiles = food.image.map((url) =>
          url.split("/products/")[1]
        );

        await supabase.storage
          .from("products")
          .remove(oldFiles);
      }

      // Upload new image
      const file = req.file;
      const fileName = `images/${Date.now()}_${file.originalname}`;

      const { error } = await supabase.storage
        .from("products")
        .upload(fileName, file.buffer, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.mimetype,
        });

      if (error) {
        return res.json({
          success: false,
          message: error.message,
        });
      }

      const { data } = supabase.storage
        .from("products")
        .getPublicUrl(fileName);

      images = [data.publicUrl];
    }

    await foodModel.findByIdAndUpdate(id, {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      image: images,
    });

    res.json({
      success: true,
      message: "Food updated successfully",
    });

  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// Get Food By ID
const getFoodById = async (req, res) => {
  try {
    const food = await foodModel.findById(req.params.id);

    if (!food) {
      return res.json({
        success: false,
        message: "Food not found",
      });
    }

    res.json({
      success: true,
      data: food,
    });

  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export {
  addFood,
  foodList,
  removefood,
  editFood,
  getFoodById,
};