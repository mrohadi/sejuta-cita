import db from "../models/index.js";

const ROLES = db.ROLES;
const User = db.user;

/**
 * Check whether user to register is already exist or not in database
 * @param {*} req Request body
 * @param {*} res Response
 * @param {*} next Callback
 */
const checkDuplicateUsernameOrEmail = (req, res, next) => {
  // Username
  User.findOne({
    username: req.body.username,
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (user) {
      res.status(400).send({ message: "Failed! Username is already exist!" });
      return;
    }

    // Email
    User.findOne({ email: req.body.email }).exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (user) {
        res.status(400).send({ message: "Failed! Email is already exist!" });
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
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        res.status(400).send({
          message: `Failed! Role ${req.body.roles[i]} does not exist!`,
        });
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
