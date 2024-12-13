const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { BACKEND, PORT } = require("./config/env");

const authRoutes = require("./routes/authRoutes");
const waitlistRoutes = require("./routes/waitlistRoutes");
const cvRoutes = require("./routes/cvRoutes");
const userRoutes = require("./routes/userRoutes");
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/waitlist", waitlistRoutes);
app.use("/api/cvs", cvRoutes);
app.use("/api/users", userRoutes);

app.listen(PORT, () => {
  console.log(`Auth server running on ${BACKEND}`);
});
