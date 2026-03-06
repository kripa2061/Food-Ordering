import foodModel from "../Model/FoodModel.js";
import fs from 'fs';

// Add food item
const addFood = async (req, res) => {
    try {
       
        let image_fileName = req.file ? req.file.filename : "";

        const food = new foodModel({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            image: image_fileName,
               isActive: true
        });

        await food.save();
        res.json({ success: true, message: "Food added" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};
const foodList=async(req,res)=>{
    try{
const foods=await foodModel.find({})
res.json({success:true,data:foods})
    }catch(error){
  res.json({ success: false, message: "Error" });
    }
}
const removefood=async(req,res)=>{
    try {
        
        const food=await foodModel.findById(req.body.id)
        if(!food){
               res.json({ success: false, message: "Food not available" });
        }
    fs.unlink(`Uploads/${food.image}`,()=>{})

        await foodModel.findByIdAndDelete(req.body.id)
          res.json({ success: true, message: "Food removed" });
    } catch (error) {
          res.json({ success: false, message: "Error" });
    }
}
const editFood = async (req, res) => {
  try {
    const { id } = req.params;
    const food = await foodModel.findById(id);
    if (!food) {
      return res.json({ success: false, message: "Food not available" });
    }

    let imageName = food.image;

    if (req.file) {
      fs.unlink(`Uploads/${food.image}`, () => {});
      imageName = req.file.filename;
    }

    await foodModel.findByIdAndUpdate(id, {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      image: imageName
    });

    res.json({ success: true, message: "Food edited" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};




const getFoodById = async (req, res) => {
  const food = await foodModel.findById(req.params.id);
  if (!food) return res.json({ success: false, message: "Food not found" });
  res.json({ success: true, data: food });
};
export { addFood,foodList,removefood,editFood,getFoodById };
