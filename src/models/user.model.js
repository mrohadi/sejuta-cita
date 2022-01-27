/**
 * Author: Muhammad Rohadi
 * Email: muhammadrohadi03@gmail.com
 * Purpose: Sejuta Cita Backend Engineer Assessment
 * Description: This file is intented for defining User data model and schema
 */

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
