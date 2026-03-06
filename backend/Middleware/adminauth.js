import jwt from "jsonwebtoken";

const adminOnly = (req, res, next) => {
  try {
    const token = req.cookies.adminToken; // read cookie

    if (!token) return res.json({ success: false, message: "No token, access denied" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.id !== "admin123") {
      return res.json({ success: false, message: "Admin access denied" });
    }

    req.userId = decoded.id; // you can use it in next middlewares
    next();
  } catch (err) {
    return res.json({ success: false, message: "Invalid or expired token" });
  }
};

export default adminOnly;