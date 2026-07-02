import './Config/env.js'

import express from "express";
import cors from "cors";
import foodRouter from "./Routes/FoodRoute.js";
import { connectDB } from "./Config/Database.js";
import UserRouter from "./Routes/UserRoute.js";
import orderRouter from "./Routes/orderRoute.js";
import path from "path";
import cartRouter from "./Routes/CartRoute.js";
import adminRouter from './Routes/adminRoute.js';
import cookieParser from 'cookie-parser'

const app = express();
const port = process.env.PORT || 3000;
const allowedOrigins = [
  "https://food-ordering-9ij3.onrender.com",
  "https://food-ordering-admin-yunn.onrender.com",
  //  "http://localhost:5173",
  // "http://localhost:5174",
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); 
    const trimmedOrigins = allowedOrigins.map(o => o.trim());
    if (trimmedOrigins.includes(origin)) callback(null, true);
    else callback(new Error("Not allowed by CORS"));
  },
  credentials: true, 
}));
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));

app.use("/api/food", foodRouter);
app.use("/api/user", UserRouter);
app.use("/api/order", orderRouter);
app.use("/api/cart",cartRouter);
app.use("/api/admin",adminRouter)

app.get("/", (req, res) => {
  res.send("API working");
});

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to DB:", err);
  });
