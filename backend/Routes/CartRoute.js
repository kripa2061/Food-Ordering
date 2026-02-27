import express from "express";
import authMiddleware from "../Middleware/auth.js";
import { addToCart, getCart, removeFromCart } from "../Controller/CartController.js";

const cartRouter=express.Router();
cartRouter.post("/add",authMiddleware,addToCart);
cartRouter.post("/remove",authMiddleware,removeFromCart);
cartRouter.get("/get",authMiddleware,getCart);
export default cartRouter;