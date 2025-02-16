// import jwt from "jsonwebtoken";

// const authUser = async (req, res, next) => {
//   try {
//     const { token } = req.headers;
//     if (!token) {
//       return res
//         .status(401)
//         .json({ success: false, message: "No Authorised Login Again" });
//     }
//     const token_decode = jwt.verify(token, process.env.JWT_SECRET);
//     req.body.userId = token_decode.id;
//     next();
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// export default authUser;

import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  const token = req.cookies.token; // Extract token from cookies

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Login Again",
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.id) {
      req.body.userId = decoded.id;
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
