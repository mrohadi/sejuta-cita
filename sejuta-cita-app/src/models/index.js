/**
 * Author: Muhammad Rohadi
 * Email: muhammadrohadi03@gmail.com
 * Purpose: Sejuta Cita Backend Engineer Assessment
 * Description: Starting point for every model
 */

import mongoose from "mongoose";
import User from "./user.model.js";
import Role from "./role.model.js";
import RefreshToken from "./refresh.token.js";

mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = User;
db.role = Role;
db.refreshToken = RefreshToken;

db.ROLES = ["admin", "user"];

export default db;
