const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const sequelize = require("./sequelize");
const authRoutes = require("./routes/authRoutes");
const userRoutes =  require('./routes/userRoutes')
const app =  express()
const port = process.env.PORT || 8000;

app.use(express.json());

console.log(process.env.DATABASE_PORT);

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes)

app.listen(port, async () => {
  try {
    console.log(`server running on http://localhost:${port}`);
    await sequelize.authenticate();
    console.log("Connection successfully established with the database");
  } catch (error) {
    console.log("Sorry Could not establish db connection " + error.message);
  }
});
