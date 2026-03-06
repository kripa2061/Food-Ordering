import express from "express";
import { getDashboardData } from "../Controller/Dashboard.js";
import adminOnly from "../Middleware/adminauth.js";
const adminRouter=express.Router();
adminRouter.get("/dashboard",getDashboardData);
adminRouter.get("/check", adminOnly, (req, res) => {
  // If middleware passes, token is valid
  res.json({ success: true });
});
export default adminRouter;