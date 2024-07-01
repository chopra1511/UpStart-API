const jwt = require("jsonwebtoken");
const Credentials = require("../models/credentials");

const secret = process.env.JWT_SECRET;

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    console.log("No token provided");
    return res.sendStatus(403); // Forbidden
  }

  jwt.verify(token, secret, (err, user) => {
    if (err) {
      console.log("Token verification failed:", err);
      return res.sendStatus(403); // Forbidden
    }
    req.user = user;
    console.log("Token verified, user:", user);
    next();
  });
};

module.exports = authenticateToken;
