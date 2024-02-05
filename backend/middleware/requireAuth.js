const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const requireAuth = async (req, res, next) => {
  // verify user is authenticated
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "Authorization token required" });
  }

  const token = authorization.split(" ")[1];

  try {
    const { _id } = jwt.verify(token, process.env.SECRET);

    // Fetch the user by _id and select the username along with _id
    const user = await User.findOne({ _id }).select("_id username");
    if (!user) {
      return res
        .status(401)
        .json({ error: "Request is not authorized, user not found" });
    }

    // Attach the user object to the request for use in subsequent middleware or route handlers
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: "Request is not authorized" });
  }
};

module.exports = requireAuth;
