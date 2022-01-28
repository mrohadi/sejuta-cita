/**
 * Author: Muhammad Rohadi
 * Email: muhammadrohadi03@gmail.com
 * Purpose: Sejuta Cita Backend Engineer Assessment
 * Description: Implement all of logic about authentication
 */

import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import authConfig from "../config/auth.config.js";
import db from "../models/index.js";
import responseObj from "../utils/response.js";

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

  const resObj = Object.create(responseObj);

  user.save((err, user) => {
    if (err) {
      resObj.isError = true;
      resObj.errorDesc = err.message;
      resObj.data = {};

      res.status(500).send(resObj);
      return;
    }

    if (req.body.roles) {
      Role.find(
        {
          name: { $in: req.body.roles },
        },
        (err, roles) => {
          if (err) {
            resObj.isError = true;
            resObj.errorDesc = err.message;
            resObj.data = {};

            res.status(500).send(resObj);
            return;
          }

          user.roles = roles.map((role) => role._id);
          user.save((err) => {
            if (err) {
              resObj.isError = true;
              resObj.errorDesc = err.message;
              resObj.data = {};

              res.status(500).send(resObj);
              return;
            }

            resObj.isError = true;
            resObj.errorDesc = "User was registered successfully!";
            resObj.data = {};

            res.status(400).send(resObj);
          });
        }
      );
    } else {
      Role.findOne({ name: "user" }, (err, roles) => {
        if (err) {
          resObj.isError = true;
          resObj.errorDesc = err.message;
          resObj.data = {};

          res.status(500).send(resObj);
          return;
        }

        user.roles = [roles._id];
        user.save((err) => {
          if (err) {
            resObj.isError = true;
            resObj.errorDesc = err.message;
            resObj.data = {};

            res.status(500).send(resObj);
            return;
          }

          resObj.isError = false;
          resObj.errorDesc = null;
          resObj.data = { message: "User was registered succussfully!" };

          res.send(resObj);
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
      const resObj = Object.create(responseObj);

      if (err) {
        resObj.isError = true;
        resObj.errorDesc = err.message;

        res.status(500).send(resObj);
        return;
      }

      if (!user) {
        resObj.isError = true;
        resObj.errorDesc = "User Not Found!";

        return res.status(404).send(resObj);
      }

      let passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        resObj.isError = true;
        resObj.errorDesc = "Invalid Password!";

        return res.status(401).send(resObj);
      }

      let token = jwt.sign({ id: user.id }, authConfig.SECRET_KEY, {
        expiresIn: authConfig.jwtExpiration,
      });

      let refreshToken = await RefreshToken.createToken(user);

      let authorities = [];

      for (let i = 0; i < user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
      }

      resObj.isError = false;
      resObj.errorDesc = null;
      resObj.data = {
        id: user._id,
        username: user.username,
        email: user.email,
        roles: authorities,
        accessToken: token,
        refreshToken: refreshToken,
      };

      responseObj.data = res.status(200).send(resObj);
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
  const resObj = Object.create(responseObj);

  if (requestToken === null) {
    resObj.isError = true;
    resObj.errorDesc = "Refresh Token is required!";

    return res.status(403).json(resObj);
  }

  try {
    let refreshToken = await RefreshToken.findOne({ token: requestToken });

    if (!refreshToken) {
      resObj.isError = true;
      resObj.errorDesc = "Refresh Token is not in database!";

      res.status(403).json(resObj);
      return;
    }

    if (RefreshToken.verifyExpiration(refreshToken)) {
      RefreshToken.findByIdAndRemove(refreshToken._id, {
        useFindAndModify: false,
      }).exec();

      resObj.isError = true;
      resObj.errorDesc =
        "Refresh Token was expired! Please make a new sign in!";

      res.status(403).json(resObj);
      return;
    }

    let newAccessToken = jwt.sign(
      { id: refreshToken.user._id },
      authConfig.SECRET_KEY,
      { expiresIn: authConfig.jwtExpiration }
    );

    resObj.isError = false;
    resObj.errorDesc = null;
    resObj.data = {
      accessToken: newAccessToken,
      refreshToken: refreshToken.token,
    };

    return res.status(200).json(resObj);
  } catch (err) {
    resObj.isError = true;
    resObj.errorDesc = err.message;

    return res.status(500).send(resObj);
  }
};

export default {
  signUpController,
  signInController,
  refreshToken,
};
