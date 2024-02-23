const mongoose = require("mongoose");

const schemaDesign = new mongoose.Schema(
  {
    products: [
      {
        type: mongoose.ObjectId,
        ref: "product",
      },
    ],

    payment: {},

    buyer: {
      type: mongoose.ObjectId,
      ref: "userModel",
    },

    status: {
      type: String,
      default: "Not Process",
      enum: ["Not Process", "Processing", "Shipped", "Delivered", "Canceled"],
    },
  },

  {
    timestamps: true,
  }
);

const orderModel = new mongoose.model("order", schemaDesign);
module.exports = orderModel;
