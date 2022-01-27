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

  _connect() {
    db.mongoose
      .connect(
        `mongodb://${dbConfig.USERNAME}:${dbConfig.PASSWORD}@${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}?authSource=admin`,
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        }
      )
      .then(() => {
        console.log("Database connection successfull!");
        this.initial();
      })
      .catch((err) => console.log("Connection error", err));
  }

  /**
   * Populate user and admin roles if it doesn't exist yet on database
   */
  initial() {
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
}

export default new DBConnection();
