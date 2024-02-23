const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const colors = require("colors");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");

//rest object
const app = express();
const port = process.env.PORT || 3000;

//middleware
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(morgan("dev"));
app.use(require("./router/router"));
app.use(require("./router/categoryRoutes"));
app.use(require("./router/productRoutes"));
// app.use(express.static(path.join(__dirname, "./client/dist")));

// //rest api
// app.use("*", function (req, res) {
//   res.sendFile(path.join(__dirname, "./client/dist/index.html"));
// });

//db
require("./db/db");

app.listen(port, () => {
  console.log("App is listining on port : " + colors.green(port));
});
