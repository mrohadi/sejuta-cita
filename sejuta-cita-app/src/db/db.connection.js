/**
 * Author: Muhammad Rohadi
 * Email: muhammadrohadi03@gmail.com
 * Purpose: Sejuta Cita Backend Engineer Assessment
 * Description: Implement database connection to mongodb and initialize
 *              the database and roles if doesn not exist
 */

import bcrypt from "bcryptjs";
import dbConfig from "../config/db.config.js";
import db from "../models/index.js";

/**
 * Define database connection to mongodb,
 * store URI in environment vairable for security purposes
 */
class DBConnection {
  constructor() {
    this._connect();
  }

  Role = db.role;
  User = db.user;

  _connect() {
    db.mongoose
      .connect(dbConfig.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log("Database connection successfull!");
        this.initialRoles();
      })
      .then(() => {
        this.initialAdminUser();
      })
      .catch((err) => console.log("Connection error", err));
  }

  /**
   * Populate user and admin roles if it doesn't exist yet on database
   */
  async initialRoles() {
    this.Role.estimatedDocumentCount((err, count) => {
      if (!err && count === 0) {
        new this.Role({
          name: "user",
        }).save((err) => {
          if (err) {
            console.log("error", err);
          }

          console.log("added 'user' to roles collection");
        });

        new this.Role({
          name: "admin",
        }).save((err) => {
          if (err) {
            console.log("error", err);
          }

          console.log("added 'admin' to roles collection");
        });
      }
    });
  }

  /**
   * Populate new admin user if it does not exist!
   */
  async initialAdminUser() {
    const adminUser = await this.User.find({ username: "admin" });
    if (adminUser.length === 0) {
      const adminUser = new this.User({
        username: "admin",
        password: bcrypt.hashSync("admin", 8),
        email: "admin@gmail.com",
      });

      adminUser.save((err) => {
        if (err) {
          console.log(err.message);
          return;
        }

        this.Role.findOne({ name: "admin" }, (err, role) => {
          if (err) {
            console.log(err.message);
            return;
          }

          adminUser.roles = [role._id];
          adminUser.save((err) => {
            if (err) {
              console.log(err.message);
              return;
            }

            console.log(adminUser);
          });
        });
      });
    }
  }
}

export default new DBConnection();
