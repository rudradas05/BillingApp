import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  try {
    const { token } = req.headers;
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "No Authorised Login Again" });
    }
    const toekn_decode = jwt.verify(token, process.env.JWT_SECRET);
    req.body.userId = toekn_decode.id;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export default authUser;
