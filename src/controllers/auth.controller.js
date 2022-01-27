import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import authConfig from "../config/auth.config.js";
import db from "../models/index.js";

const User = db.user;
const Role = db.role;

/**
 * Sign-up controller
 * @param {*} req Request body
 * @param {*} res Response
 */
const signUpController = (req, res) => {
  const user = new User({
    username: req.body.username,
    password: bcrypt.hashSync(req.body.password, 8),
    email: req.body.email,
  });

  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (req.body.roles) {
      Role.find(
        {
          name: { $in: req.body.roles },
        },
        (err, roles) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          user.roles = roles.map((role) => role._id);
          user.save((err) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }

            res
              .status(400)
              .send({ message: "User was registered successfully!" });
          });
        }
      );
    } else {
      Role.findOne({ name: "user" }, (err, roles) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        user.roles = [roles._id];
        user.save((err) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          res.send({ message: "User was registered succussfully!" });
        });
      });
    }
  });
};

/**
 * Sign-in controller
 * @param {*} req Request body
 * @param {*} res Response
 */
const signInController = (req, res) => {
  User.findOne({ username: req.body.username })
    .populate("roles", "-__v")
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        res.status(404).send({ message: "User not found!" });
        return;
      }

      let passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res
          .status(401)
          .send({ accessToken: null, message: "Invalid Token!" });
      }

      let token = jwt.sign({ id: user.id }, authConfig.SECRET_KEY, {
        expiresIn: 86400, // 24 hours
      });

      let authorities = [];

      for (let i = 0; i < user.roles.length; i++) {
        authorities.push(`ROLE_${user.roles[i].name.toUpperCase()}`);
      }

      res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
        roles: authorities,
        accessToken: token,
      });
    });
};

export default {
  signUpController,
  signInController,
};
