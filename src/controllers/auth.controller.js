import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import authConfig from "../config/auth.config.js";
import db from "../models/index.js";

const { user: User, role: Role, refreshToken: RefreshToken } = db;

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
const signInController = async (req, res) => {
  User.findOne({
    username: req.body.username,
  })
    .populate("roles", "-__v")
    .exec(async (err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      let passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      }

      let token = jwt.sign({ id: user.id }, authConfig.SECRET_KEY, {
        expiresIn: authConfig.jwtExpiration,
      });

      let refreshToken = await RefreshToken.createToken(user);

      let authorities = [];

      for (let i = 0; i < user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
      }
      res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
        roles: authorities,
        accessToken: token,
        refreshToken: refreshToken,
      });
    });
};

/**
 *
 * @param {} req
 * @param {*} res
 * @returns
 */
const refreshToken = async (req, res) => {
  const { refreshToken: requestToken } = req.body;

  if (requestToken === null) {
    return res.status(403).json({ message: "Refresh Token is required!" });
  }

  try {
    let refreshToken = await RefreshToken.findOne({ token: requestToken });

    if (!refreshToken) {
      res.status(403).json({ message: "Refresh Token is not in database!" });
      return;
    }

    if (RefreshToken.verifyExpiration(refreshToken)) {
      RefreshToken.findByIdAndRemove(refreshToken._id, {
        useFindAndModify: false,
      }).exec();

      res.status(403).json({
        message: "Refresh Token was expired! Please make a new sign in",
      });
      return;
    }

    let newAccessToken = jwt.sign(
      { id: refreshToken.user._id },
      authConfig.SECRET_KEY,
      { expiresIn: authConfig.jwtExpiration }
    );

    return res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: refreshToken.token,
    });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

export default {
  signUpController,
  signInController,
  refreshToken,
};
