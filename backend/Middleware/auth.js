import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {


  const token = req.cookies?.token;
 if (!token) {
    return res.status(401).json({ success: false, message: "Access denied, no token provided" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;      
    req.body = req.body || {};
    req.body.userId = decoded.id; 
    next();
  } catch (error) {
    return res.json({ success: false, message: "Invalid token" });
  }
};

export default authMiddleware;