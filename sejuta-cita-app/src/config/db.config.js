/**
 * Author: Muhammad Rohadi
 * Email: muhammadrohadi03@gmail.com
 * Purpose: Sejuta Cita Backend Engineer Assessment
 * Description: Define database configuration
 */
import dotenv from "dotenv";

dotenv.config();

const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env;

export default {
  url: `mongodb://${DB_USER || "admin"}:${DB_PASSWORD || "admin"}@${
    DB_HOST || "localhost"
  }:${DB_PORT || "27017"}/${DB_NAME || "sejuta_cita_db"}?authSource=admin`,
};
