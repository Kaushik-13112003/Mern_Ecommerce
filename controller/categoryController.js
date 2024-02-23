let slugify = require("slugify");
const categoryModel = require("../models/categoryModel");

//create
const createCategoryController = async (req, res) => {
  try {
    let { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "name is required" });
    }

    //distinct
    let isExist = await categoryModel.findOne({ name: name });

    if (isExist) {
      return res.status(400).json({ message: "Category Already Exists" });
    } else {
      let newCat = new categoryModel({ name, slug: slugify(name) });
      await newCat.save();
      return res
        .status(200)
        .json({ message: "New Category Created", newCat: newCat });
    }
  } catch (err) {
    console.log(err);
  }
};

//update
const updateCategoryController = async (req, res) => {
  try {
    let { name } = req.body;
    const { id } = req.params;

    if (!name) {
      return res.status(400).json({ message: "name is required" });
    }

    let category = await categoryModel.findByIdAndUpdate(
      { _id: id },
      { name, slug: slugify(name) },
      { new: true }
    );
    return res
      .status(200)
      .json({ message: " Category Updates", newCat: category });
  } catch (err) {
    console.log(err);
  }
};

const getAllCategoryController = async (req, res) => {
  try {
    let allCat = await categoryModel.find().sort({ createdAt: -1 });
    return res.status(200).json({ allCat: allCat });
  } catch (err) {
    console.log(err);
  }
};

const getSingleCategoryController = async (req, res) => {
  try {
    let { id } = req.params;
    let singleCat = await categoryModel.findOne({ _id: id });

    if (singleCat) {
      return res.status(200).json({ singleCat: singleCat });
    } else {
      return res.status(400).json({ message: "Category not found" });
    }
  } catch (err) {
    console.log(err);
  }
};

const deleteCategoryController = async (req, res) => {
  try {
    const { id } = req.params;

    await categoryModel.findByIdAndDelete({ _id: id });
    return res.status(200).json({ message: " Category Deleted" });
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  createCategoryController,
  updateCategoryController,
  deleteCategoryController,
  getAllCategoryController,
  getSingleCategoryController,
};
