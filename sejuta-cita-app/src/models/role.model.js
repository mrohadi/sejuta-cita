/**
 * Author: Muhammad Rohadi
 * Email: muhammadrohadi03@gmail.com
 * Purpose: Sejuta Cita Backend Engineer Assessment
 * Description: This file is intented for defining Role data model and schema
 */

import mongoose from "mongoose";

/**
 * Schema of the role that define structure of the Role document in mongoDB
 */
export default mongoose.model(
  "Role",
  new mongoose.Schema({
    name: String,
  })
);
