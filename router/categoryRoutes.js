const express = require("express");
const { auth, adminController } = require("../Middleware/auth");
const {
  createCategoryController,
  updateCategoryController,
  deleteCategoryController,
  getAllCategoryController,
  getSingleCategoryController,
} = require("../controller/categoryController");
const router = express.Router();

router.post(
  "/create-category",
  auth,
  adminController,
  createCategoryController
);

router.put(
  "/update-category/:id",
  auth,
  adminController,
  updateCategoryController
);

//all category
router.get("/all-category", getAllCategoryController);

//single category
router.get("/single-category/:id", getSingleCategoryController);

router.delete(
  "/delete-category/:id",
  auth,
  adminController,
  deleteCategoryController
);
module.exports = router;
