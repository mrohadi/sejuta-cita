import express from "express";
import bodyParse from "body-parser";

const app = express();

app.use(bodyParse.json());

app.get("/", (req, res) => {
  console.log("[TEST]");
  res.send("Welcome to the API");
});

export default app;
