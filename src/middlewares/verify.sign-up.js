/**
 * Author: Muhammad Rohadi
 * Email: muhammadrohadi03@gmail.com
 * Purpose: Sejuta Cita Backend Engineer Assessment
 * Description: Implement middleware for sign up the user
 */

import db from "../models/index.js";
import responseObj from "../utils/response.js";

const ROLES = db.ROLES;
const User = db.user;

/**
 * Check whether user to register is already exist or not in database
 * @param {*} req Request body
 * @param {*} res Response
 * @param {*} next Callback
 */
const checkDuplicateUsernameOrEmail = (req, res, next) => {
  const resObj = Object.create(responseObj);
  // Username
  User.findOne({
    username: req.body.username,
  }).exec((err, user) => {
    if (err) {
      resObj.isError = true;
      resObj.errorDesc = err.message;
      resObj.data = {};

      res.status(500).send(resObj);
      return;
    }

    if (user) {
      resObj.isError = true;
      resObj.errorDesc = "Failed! Username is already exist!";
      resObj.data = {};

      res.status(400).send(resObj);
      return;
    }

    // Email
    User.findOne({ email: req.body.email }).exec((err, user) => {
      if (err) {
        resObj.isError = true;
        resObj.errorDesc = err.message;
        resObj.data = {};

        res.status(500).send(resObj);
        return;
      }

      if (user) {
        resObj.isError = true;
        resObj.errorDesc = "Failed! Email is already exist!";
        resObj.data = {};

        res.status(400).send(resObj);
      }

      next();
    });
  });
};

/**
 * Check whether role used to sign up the user exist in the database
 * @param {*} req Request body
 * @param {*} res Response
 * @param {*} next Callback function
 */
const checkRolesExisted = (req, res, next) => {
  const resObj = Object.create(responseObj);

  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        resObj.isError = true;
        resObj.errorDesc = `Failed! Role ${req.body.roles[i]} does not exist!`;
        resObj.data = {};

        res.status(400).send(resObj);
        return;
      }
    }
  }

  next();
};

export default {
  checkDuplicateUsernameOrEmail,
  checkRolesExisted,
};
