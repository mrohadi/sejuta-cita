/**
 * Author: Muhammad Rohadi
 * Email: muhammadrohadi03@gmail.com
 * Purpose: Sejuta Cita Backend Engineer Assessment
 * Description: Implement all of logic about user resources
 */

import responseObj from "../utils/response.js";
import db from "../models/index.js";

const { user: User, role: Role, refreshToken: RefreshToken } = db;

/**
 * Get all users from the database. This controller can only hit by admin role
 * @param {*} req Request send
 * @param {*} res Response
 */
const getAllUsers = (req, res) => {
  const resObj = Object.create(responseObj);

  User.find()
    .populate("roles", "-__v")
    .exec(async (err, users) => {
      if (err) {
        resObj.isError = true;
        resObj.errorDesc = err.message;
        resObj.data = {};

        res.status(500).send(resObj);
        return;
      }

      resObj.isError = false;
      resObj.errorDesc = null;
      resObj.data = { users };

      res.status(200).send(resObj);
    });
};

/**
 * Find user by id, and then compare it with user logged in role.
 * If user logged in roles is admin return found user, otherwise check if
 * found user role equal to user logged in rele
 * @param {*} req Request send
 * @param {*} res Response
 */
const getUserById = (req, res) => {
  const resObj = Object.create(responseObj);

  // Find user by userId that passed throught request body
  User.findById(req.params.userId)
    .populate("roles", "-__v")
    .exec(async (err, user) => {
      if (err) {
        resObj.isError = true;
        resObj.errorDesc = err.message;
        resObj.data = {};

        res.status(500).send(resObj);
        return;
      }

      // Compare found user to logged in user
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
              resObj.isError = false;
              resObj.errorDesc = null;
              resObj.data = { user };

              res.status(200).send(resObj);
              return;
            }
            resObj.isError = true;
            resObj.errorDesc =
              "You need to be admin to see detail of this user";
            resObj.data = {};

            res.status(403).send(resObj);
            return;
          }

          resObj.isError = false;
          resObj.errorDesc = null;
          resObj.data = { user };

          res.status(200).send(resObj);
        });
    });
};

/**
 * Update specific user
 * @param {*} req Request
 * @param {*} res Response
 */
const updateUser = (req, res) => {
  const resObj = Object.create(responseObj);

  User.findById(req.params.userId).exec((err, user) => {
    if (err) {
      resObj.isError = true;
      resObj.errorDesc = err.message;
      resObj.data = {};

      res.status(500).send(resObj);
      return;
    }

    if (user.username !== null || user.username) {
      user.username = req.body.username;
    }

    if (user.email !== null || user.email) {
      user.email = req.body.email;
    }

    user.save((err, savedUser) => {
      if (err) {
        resObj.isError = true;
        resObj.errorDesc = err.message;
        resObj.data = {};

        res.status(500).send(resObj);
        return;
      }

      resObj.isError = false;
      resObj.errorDesc = null;
      resObj.data = { savedUser };

      res.status(200).send(resObj);
      return;
    });
  });
};

const deleteUser = (req, res) => {
  const resObj = Object.create(responseObj);

  //
  User.findByIdAndDelete(req.params.userId, (err, obj) => {
    if (err) {
      resObj.isError = true;
      resObj.errorDesc = err.message;
      resObj.data = {};

      res.status(500).send(resObj);
      return;
    }

    resObj.isError = false;
    resObj.errorDesc = null;
    resObj.data = { obj };

    res.status(200).send(resObj);
    return;
  });
};

export default {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
