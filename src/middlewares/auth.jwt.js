import jwt from "jsonwebtoken";

import authConfig from "../config/auth.config.js";
import db from "../models/index.js";

const User = db.user;
const Role = db.role;

/**
 * Function to verify token that send throught http header request
 * @param {*} req Request body
 * @param {*} res Response
 * @param {*} next Callback function
 */
const verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({ message: "No token porvided!" });
  }

  jwt.verify(token, authConfig.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }

    req.userId = decoded.id;
    next();
  });
};

/**
 * Function to check whether the user has admin role to access admin recourse
 * @param {*} req Request body
 * @param {*} res Response
 * @param {*} next Callback function
 */
const isAdmin = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    Role.find(
      {
        _id: { $in: user.roles },
      },
      (err, roles) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "admin") {
            next();
            return;
          }
        }

        res.status(403).send({ message: "Required Admin Role!" });
        return;
      }
    );
  });
};

export default {
  verifyToken,
  isAdmin,
};
