const mongoose = require("mongoose");
const colors = require("colors");
const DB = process.env.DB;

mongoose
  .connect(DB)
  .then(() => {
    console.log(colors.green("Database Connected Successfully"));
  })
  .catch((err) => {
    console.log(colors.red("Database Not Connected"));
  });
