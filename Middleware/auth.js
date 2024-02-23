const userModel = require("../models/userModels");
const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  try {
    const decode = jwt.verify(req.headers.authorization, process.env.TOKEN);

    req.user = decode;
    next();
  } catch (err) {
    console.log(err);
  }
};

//adminController
const adminController = async (req, res, next) => {
  try {
    //compare role of user
    console.log(req.user);
    let compare = await userModel.findById(req.user._id);

    // res.send(compare);

    if (compare.role !== 1) {
      return res.status(400).json({ error: "Unauthorized Access" });
    } else {
      next();
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = { auth, adminController };
