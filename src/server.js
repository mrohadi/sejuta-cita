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

// Making simple request
app.get("/", (req, res) => {
  res.json({ message: "Welcome to SejutaCita API" });
});

authRoute(app);
userRoute(app);

// Set port, and listen for the requests
const PORT = process.env.PORT || 8089;
app.listen(PORT, () => {
  console.log(`Server running on port: http://localhost:${PORT}`);
});
