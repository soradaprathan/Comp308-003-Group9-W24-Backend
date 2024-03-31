const jwt = require("jsonwebtoken");
const User = require("../models/user");
require("dotenv").config();

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: 3 * 24 * 60 * 60,
  });
};

const requireAuth = (req, res, next) => {
  console.log("context" + req.cookies.jwt);
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.status(401).json({ message: "Authentication error." });
      } else {
        try {
          const user = await User.findById(decodedToken.id).select("-password");
          if (user) {
            req.user = user;
            next();
          } else {
            res.status(401).json({ message: "User not found." });
          }
        } catch (error) {
          console.error("Error in the authentication middleware:", error);
          res.status(401).json({ message: "Authentication error." });
        }
      }
    });
  } else {
    console.log("Token not found.");
    res.status(401).json({ message: "Authentication required." });
  }
};

const checkRole = (roles) => (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        res.status(403).json({ message: "Access denied: Invalid token." });
      } else {
        User.findById(decodedToken.id)
          .then((user) => {
            if (user && roles.includes(user.role)) {
              next();
            } else {
              res.status(403).json({
                message:
                  "Access denied: You do not have permission to view this page.",
              });
            }
          })
          .catch((err) => {
            res.status(500).json({
              message: "An error occurred while verifying user role.",
            });
          });
      }
    });
  } else {
    res.status(401).json({ message: "Not authenticated: No token provided." });
  }
};

module.exports = { createToken, requireAuth, checkRole };
