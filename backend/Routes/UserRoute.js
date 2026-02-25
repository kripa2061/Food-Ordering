
import express from "express";
import { adminLogin,getAllUser,getUser,loginUser,registerUser, removeUser, verifyOtp,} from "../Controller/UserController.js";
import authMiddleware from "../Middleware/auth.js";
import adminOnly from "../Middleware/adminauth.js";

const UserRouter = express.Router();

UserRouter.post("/register", registerUser);
UserRouter.post("/login", loginUser);
UserRouter.post("/verify-otp", verifyOtp);

UserRouter.get("/get", authMiddleware, getUser);

UserRouter.post("/adminlogin", adminLogin);
UserRouter.delete("/removeuser/:id", authMiddleware, adminOnly, removeUser);
UserRouter.get(
  "/getUser",
  authMiddleware,
  adminOnly,
  getAllUser
);
export default UserRouter;
