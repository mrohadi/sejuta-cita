/**
 * Author: Muhammad Rohadi
 * Email: muhammadrohadi03@gmail.com
 * Purpose: Sejuta Cita Backend Engineer Assessment
 * Description: Implement authentication middleware
 */

import jwt from "jsonwebtoken";

import authConfig from "../config/auth.config.js";
import db from "../models/index.js";
import responseObj from "../utils/response.js";

const User = db.user;
const Role = db.role;

const { TokenExpiredError } = jwt;

/**
 *
 * @param {} err
 * @param {*} res
 * @returns
 */
const catchErrror = (err, res) => {
  const resObj = Object.create(responseObj);

  if (err instanceof TokenExpiredError) {
    resObj.isError = true;
    resObj.errorDesc = err.message;
    resObj.data = { message: "Unauthorized! Access Token was expired!" };

    return res.status(401).send(resObj);
  }

  resObj.isError = true;
  resObj.errorDesc = err.message;
  resObj.data = {};

  return res.status(401).send(resObj);
};

/**
 * Function to verify token that send throught http header request
 * @param {*} req Request body
 * @param {*} res Response
 * @param {*} next Callback function
 */
const verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    const resObj = Object.create(responseObj);
    resObj.isError = true;
    resObj.errorDesc = "No token porvided!";
    resObj.data = {};

    res.status(403).send(resObj);
    return;
  }

  jwt.verify(token, authConfig.SECRET_KEY, (err, decoded) => {
    if (err) {
      return catchErrror(err, res);
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
    const resObj = Object.create(responseObj);

    if (err) {
      resObj.isError = true;
      resObj.errorDesc = err.message;
      resObj.data = {};

      res.status(500).send(resObj);
      return;
    }

    Role.find(
      {
        _id: { $in: user.roles },
      },
      (err, roles) => {
        if (err) {
          resObj.isError = true;
          resObj.errorDesc = err.message;
          resObj.data = {};

          res.status(500).send(resObj);
          return;
        }

        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "admin") {
            next();
            return;
          }
        }

        resObj.isError = true;
        resObj.errorDesc = "Required Admin Role!";
        resObj.data = {};

        res.status(403).send(resObj);
        return;
      }
    );
  });
};

const isAdminOrUser = (req, res, next) => {
  const resObj = Object.create(responseObj);

  User.findById(req.params.userId)
    .populate("roles", "-__v")
    .exec(async (err, user) => {
      if (err) {
        resObj.isError = true;
        resObj.errorDesc = err.message;
        data = {};

        res.status(500).send(resObj);
        return;
      }

      User.findById(req.userId)
        .populate("roles", "-__v")
        .exec(async (err, userLoggedIn) => {
          if (err) {
            resObj.isError = true;
            resObj.errorDesc = err.message;
            resObj.data = {};

            res.status(500).send(resObj);
            return;
          }

          if (userLoggedIn.roles.length === 1) {
            if (req.params.userId === req.userId) {
              next();
              return;
            }

            resObj.isError = true;
            resObj.errorDesc = "You Need To Be Admin To Do This Action!";
            resObj.data = {};

            res.status(403).send(resObj);
            return;
          }

          next();
          return;
        });
    });
};

export default {
  verifyToken,
  isAdmin,
  isAdminOrUser,
};
