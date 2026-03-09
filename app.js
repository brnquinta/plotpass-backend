const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const usersRouter = require("./routes/users");

const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/plotpassdb")
  .then(() => console.log("MongoDB conectado"))
  .catch((err) => console.log(err));

app.use(cors());
app.use(express.json());

app.use("/users", usersRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

