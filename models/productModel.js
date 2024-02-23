const mongoose = require("mongoose");

const schemaDesign = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      require: true,
    },

    slug: {
      type: String,
      require: true,
    },

    des: {
      type: String,
      require: true,
    },

    price: {
      type: Number,
      require: true,
    },

    category: {
      type: mongoose.ObjectId,
      ref: "category",
      require: true,
    },

    quantity: {
      type: Number,
      require: true,
    },

    photo: {
      data: Buffer,
      contentType: String,
    },

    shipping: {
      type: String,
    },
  },

  {
    timestamps: true,
  }
);

const productModel = new mongoose.model("product", schemaDesign);
module.exports = productModel;
