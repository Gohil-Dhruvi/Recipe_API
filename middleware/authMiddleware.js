const jwt = require("jsonwebtoken");
const User = require("../model/user.model");


exports.verifyUserToken = async (req, res, next) => {
  let authorization = req.headers["authorization"];
  if(!authorization){
    return res.status(500).json({message: 'token not found'});
  }
  let token = authorization.split(" ")[1];

  if (!token) {
    return res.status(400).json({ message: "Please Login Again" });
  }

  let { userId } = await jwt.verify(token, "user");
  const user = await User.findById(userId);
  if (user) {
    req.user = user;
    next();
  } else {
    return res.status(400).json({ message: "Invalid User" });
  }
};

exports.verifyAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};