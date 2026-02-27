import UserModel from "../Model/UserModel.js";
import bcrypt, { compare } from "bcrypt";
import validator from "validator";
import jwt from "jsonwebtoken";
import { transporter } from "../NodeMailer.js";

const createToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

const otpStore = new Map(); 

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) return res.json({ success: false, message: "Missing details" });

  try {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) return res.json({ success: false, message: "User already exists" });

    if (!validator.isEmail(email)) return res.json({ success: false, message: "Invalid email" });
    if (password.length < 8) return res.json({ success: false, message: "Password must be at least 8 chars" });
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must contain uppercase, lowercase, number, special character and be at least 8 characters long"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const OTP = String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = Date.now() + 10 * 60 * 1000;

    otpStore.set(email, { name, hashedPassword, otp: OTP, expiresAt });

    await transporter.sendMail({
      from: process.env.SENDERMAIL,
      to: email,
      subject: "Your OTP for Zestybites",
      text: `Your OTP is ${OTP}. It expires in 10 minutes.`,
    });

    res.json({ success: true, message: "OTP sent to email. Verify to complete registration." });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const temp = otpStore.get(email);
    if (!temp) return res.json({ success: false, message: "No OTP request found" });

    if (temp.otp !== otp || temp.expiresAt < Date.now()) {
      otpStore.delete(email);
      return res.json({ success: false, message: "Invalid or expired OTP" });
    }

    const newUser = new UserModel({
      name: temp.name,
      email,
      password: temp.hashedPassword,
      isAccountVerify: true,
    });

    await newUser.save();
    otpStore.delete(email);

    const token = createToken(newUser._id);
    res.json({ success: true, message: "Account created successfully", token });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) return res.json({ success: false, message: "User doesn't exist" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.json({ success: false, message: "Invalid credentials" });

    const token = createToken(user._id);
    res.json({ success: true, token });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};


const getUser = async (req, res) => {
  try { 

    const authHeader = req.headers.authorization;
    if (!authHeader) return res.json({ success: false, message: "No token provided" });
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await UserModel.findById(decoded.id).select("name email isAccountVerify");
    if (!user) return res.json({ success: false, message: "User does not exist" }); 
    res.json({ success: true, user }); 
 
  } catch (error) { 
    res.json({ success: false, message: error.message }); 
  } 
};

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = {
      id: "admin123",
      email: "kripabastola73@gmail.com",
      password: bcrypt.hashSync("kripa@123", 10),
    };
    if (email !== admin.email) {
      return res.json({ success: false, message: "Email does not match" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Password does not match" });
    }

    const token = createToken(admin.id);

    res.json({ success: true, token });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const getAllUser = async (req, res) => {
  try {
    const users = await UserModel.find();
    if (!users || users.length === 0) {
      res.json({ success: false, message: "No users found" });
    } else {
      res.json({ success: true, data: users });
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


const removeUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserModel.findByIdAndDelete(id);
    if (!user) return res.json({ success: false, message: "User not found" });
    res.json({ success: true, data: user });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export { registerUser, verifyOtp, loginUser, getUser ,adminLogin,getAllUser,removeUser };