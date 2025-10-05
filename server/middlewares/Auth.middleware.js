import jwt from "jsonwebtoken";

const Auth = (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    console.log("JWT verify failed:", err.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default Auth;
