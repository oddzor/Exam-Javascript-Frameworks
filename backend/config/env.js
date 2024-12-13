require("dotenv").config();

const ENDPOINT_URL = process.env.ENDPOINT_URL;
const BACKEND = process.env.BACKEND;
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const JWT_SECRET = process.env.JWT_SECRET;
const PORT = process.env.PORT;

if (
  !ENDPOINT_URL ||
  !BACKEND ||
  !ADMIN_USERNAME ||
  !ADMIN_PASSWORD ||
  !JWT_SECRET ||
  !PORT
) {
  console.error(
    "Missing required environment variables. Please check your .env file."
  );
  process.exit(1);
}

module.exports = {
  ENDPOINT_URL,
  BACKEND,
  ADMIN_USERNAME,
  ADMIN_PASSWORD,
  JWT_SECRET,
  PORT,
};
