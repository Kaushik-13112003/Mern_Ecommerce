const { hashPassword, normalPassword } = require("../helper/password");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModels");
const fs = require("fs");
const orderModel = require("../models/orderModel");

const registerController = async (req, res) => {
  try {
    let { name, email, password, role, address, phone } = req.fields;
    let { photo } = req.files;

    if (!name) {
      return res.status(400).json({ message: "please complete name field" });
    }
    if (!email) {
      return res.status(400).json({ message: "please complete email field" });
    }
    if (!password) {
      return res
        .status(400)
        .json({ message: "please complete password field" });
    }
    if (!phone) {
      return res.status(400).json({ message: "please complete phone field" });
    }
    if (!address) {
      return res.status(400).json({ message: "please complete address field" });
    }

    if (!photo) {
      return res.status(400).json({ message: "please upload photo" });
    }

    //isExist
    const isExist = await userModel.findOne({ email: email });

    if (isExist) {
      return res.status(400).json({ message: "E-Mail already Exists" });
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^\d{10}$/;

      if (!phoneRegex.test(phone)) {
        return res.status(400).json({ message: "Invalid Mobile " });
      }

      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid E-Mail Format" });
      } else {
        password = await hashPassword(password);

        const newUser = new userModel({
          name,
          email,
          phone,
          password,
          address,
          // role,
        });

        if (photo) {
          newUser.photo.data = fs.readFileSync(photo.path);
          newUser.photo.contentType = photo.type;
        }

        await newUser.save();
        return res.status(200).json({ message: "User Regisered Successfully" });
      }
    }
  } catch (err) {
    console.log(err);
  }
};

const loginController = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ message: "please complete email field" });
    }
    if (!password) {
      return res
        .status(400)
        .json({ message: "please complete password field" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid E-Mail Format" });
    }
    //verify email & password
    const verify = await userModel.findOne({ email: email }).select("-photo");

    if (verify) {
      //decode password
      let isMatch = await normalPassword(password, verify.password);

      if (isMatch) {
        //let token
        let token = await jwt.sign({ _id: verify._id }, process.env.TOKEN, {
          expiresIn: "100d",
        });

        console.log(token);
        return res.status(200).json({
          message: "Login Successfully",
          loginData: verify,
          token: token,
          role: verify.role,
        });
      } else {
        return res.status(400).json({ message: "Wrong Credentials" });
      }
    } else {
      return res.status(400).json({ message: "Wrong Credentials" });
    }
  } catch (err) {
    console.log(err);
  }
};

const tokenController = (req, res) => {
  res.send("Protected");
};

//forgot
const forgotPasswordController = async (req, res) => {
  try {
    let { email, newpassword } = req.body;

    if (!email) {
      return res.status(400).json({ message: "please complete email field" });
    }
    if (!newpassword) {
      return res
        .status(400)
        .json({ message: "please complete newpassword field" });
    }

    //find
    const findUser = await userModel.findOne({ email: email });

    if (!findUser) {
      return res.status(400).json({ message: "User Not Found" });
    }

    if (findUser) {
      //hash
      let hash = await hashPassword(newpassword);
      await userModel.findByIdAndUpdate(
        { _id: findUser._id },
        { password: hash }
      );

      return res.status(200).json({ message: "password updated successfully" });
    }
  } catch (err) {
    console.log(err);
  }
};

//update

const updateProfileController = async (req, res) => {
  try {
    let { id } = req.params;
    let { name, email, address, phone } = req.fields;
    let { photo } = req.files;

    const loginData = await userModel
      .findByIdAndUpdate({ _id: id }, { ...req.fields }, { new: true })
      .select("-photo");

    if (photo) {
      loginData.photo.data = fs.readFileSync(photo.path);
      loginData.photo.contentType = photo.type;
    }

    await loginData.save();
    return res.status(200).send({
      loginData: loginData,
      message: "Profile Updated Successfully",
    });
  } catch (err) {
    console.log(err);
  }
};

//photo
const getUserPhotoController = async (req, res) => {
  try {
    let { id } = req.params;

    let findPhoto = await userModel.findById({ _id: id }).select("photo");

    if (findPhoto.photo.data) {
      return res.status(200).send(findPhoto.photo.data);
    } else {
      return res.status(400).json({ message: "No Profile Picture Found" });
    }
  } catch (err) {
    console.log(err);
  }
};

//forgot
const getSingleUserController = async (req, res) => {
  try {
    let { id } = req.params;

    const findUser = await userModel.findById(id).select("-photo");

    if (findUser) {
      return res.status(200).json({ findUser: findUser });
    } else {
      return res.status(400).json({ message: "User Not Found" });
    }
  } catch (err) {
    console.log(err);
  }
};

//forgot
const getAllUserController = async (req, res) => {
  try {
    const findUser = await userModel.find();

    if (findUser) {
      return res.status(200).json({ findUser: findUser });
    } else {
      return res.status(400).json({ message: "Users Not Found" });
    }
  } catch (err) {
    console.log(err);
  }
};
//orders
const getAllOrderController = async (req, res) => {
  try {
    let allOrders = await orderModel
      .find({ buyer: req.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name")
      .sort({ createdAt: -1 });

    if (allOrders) {
      return res.status(200).json({ allOrders: allOrders });
    } else {
      return res.status(400).json({ message: "No Order Yet" });
    }
  } catch (err) {
    console.log(err);
  }
};

//all orders
const getAllAdminPageOrderController = async (req, res) => {
  try {
    let allOrders = await orderModel
      .find()
      .populate("products", "-photo")
      .populate("buyer", "name")
      .sort({ createdAt: -1 });

    if (allOrders) {
      return res.status(200).json({ allOrders: allOrders });
    } else {
      return res.status(400).json({ message: "No Order Yet" });
    }
  } catch (err) {
    console.log(err);
  }
};

const orderStatusController = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updateStatus = await orderModel.findByIdAndUpdate(
      { _id: id },
      { status },
      { new: true }
    );
    return res
      .status(200)
      .json({ updateStatus: updateStatus, message: "Order Status Updated" });
  } catch (err) {
    console.log(err);
  }
};

//delete order
const deleteOrderByUserFromMyOrderController = async (req, res) => {
  try {
    let { id } = req.params;

    let deleteMyOrder = await orderModel.findByIdAndDelete({ _id: id });

    if (deleteMyOrder) {
      return res.status(200).json({ message: " Deleted Successfully" });
    }
  } catch (err) {
    console.log(err);
  }
};

//delete order
const deleteAllOrderByUserFromMyOrderController = async (req, res) => {
  try {
    let deleteMyAllOrder = await orderModel.deleteMany({});

    if (deleteMyAllOrder) {
      return res.status(200).json({ message: " Deleted Successfully" });
    }
  } catch (err) {
    console.log(err);
  }
};
module.exports = {
  registerController,
  loginController,
  tokenController,
  forgotPasswordController,
  getSingleUserController,
  updateProfileController,
  getAllOrderController,
  getAllAdminPageOrderController,
  orderStatusController,
  deleteOrderByUserFromMyOrderController,
  deleteAllOrderByUserFromMyOrderController,
  getAllUserController,
  getUserPhotoController,
};
