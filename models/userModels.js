const mongoose = require("mongoose");
const validator = require("validator");

const schemaDesign = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      require: true,
    },

    email: {
      type: String,
      require: true,
      unique: true,
    },

    password: {
      type: String,
      require: true,
    },

    photo: {
      data: Buffer,
      contentType: String,
    },

    phone: {
      type: Number,
      require: true,
    },

    address: {
      type: {},
      require: true,
    },

    role: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const userModel = new mongoose.model("userModel", schemaDesign);
module.exports = userModel;
