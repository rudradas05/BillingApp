import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  const token = req.cookies._vercel_jwt;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Login Again",
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.id) {
      req.userId = decoded.id;
    } else {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }

    next();
  } catch (error) {
    console.error("JWT Verification Error:", error);

    return res.status(401).json({
      success: false,
      message: "Unauthorized: Invalid or expired token",
    });
  }
};

export default authUser;
