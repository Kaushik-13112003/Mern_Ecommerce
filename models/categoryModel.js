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
      lowercase: true,
    },
  },

  {
    timestamps: true,
  }
);

const categoryModel = new mongoose.model("category", schemaDesign);
module.exports = categoryModel;
