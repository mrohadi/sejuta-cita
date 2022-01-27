/**
 * Author: Muhammad Rohadi
 * Email: muhammadrohadi03@gmail.com
 * Purpose: Sejuta Cita Backend Engineer Assessment
 * Description: This file is intented for the startup of the service
 */

import express from "express";
import cors from "cors";

import dbConfig from "./config/db.config.js";
import db from "./models/index.js";
import DBConnection from "./db/db.connection.js";
import authRoute from "./routes/auth.routes.js";
import userRoute from "./routes/user.routes.js";

const app = express();

var corsOptions = {
  origin: "http://localhost:8082",
};

// Use CORS for the app
app.use(cors(corsOptions));

// Parse the requests of content-type - application/json
app.use(express.json());

// Parse the requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded());

// Simple request
app.get("/", (req, res) => {
  res.json({ message: "Welcome to SejutaCita API" });
});

// Authentication request
authRoute(app);

// User resources request
userRoute(app);

// Set port, and listen for the requests
const PORT = process.env.PORT || 8089;
app.listen(PORT, () => {
  console.log(`Server running on port: http://localhost:${PORT}`);
});
