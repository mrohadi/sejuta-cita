import mongoose from "mongoose";

/**
 * Schema of the user that define structure of the user document in mongoDB
 */
export default mongoose.model(
  "User",
  new mongoose.Schema({
    username: String,
    password: String,
    age: Number,
    email: String,
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
      },
    ],
  })
);
