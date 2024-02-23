const express = require("express");
const { auth, adminController } = require("../Middleware/auth");
const {
  createProductController,
  getAllProductController,
  getSingleProductController,
  deleteProductController,
  getPhotoController,
  updateProdcutController,
  filterProductController,
  productCountController,
  productPageController,
  searchProductController,
  relatedProductController,
  ProductCategoryController,
  brainTreeTokenController,
  braintreePaymentsController,
} = require("../controller/productController");
const formdiable = require("express-formidable");

const router = express.Router();

//create product
router.post(
  "/create-product",
  auth,
  adminController,
  formdiable(),
  createProductController
);

//all product
router.get("/all-product", getAllProductController);

//single product
router.get("/single-product/:slug", getSingleProductController);

//delete product
router.delete(
  "/delete-product/:slug",
  auth,
  adminController,
  deleteProductController
);

//get photo
router.get("/photo/:pid", getPhotoController);

//update product
router.put(
  "/update-product/:pid",
  auth,
  adminController,
  formdiable(),
  updateProdcutController
);

//filter product
router.post("/filter-product", filterProductController);

// //count
// router.get("/product-count", productCountController);

// //page
// router.get("/product-page/:page", productPageController);

router.get("/search/:keyword", searchProductController);

//similar
router.get("/related-product/:pid/:cid", relatedProductController);

//get product-catgeory
router.get("/product-category/:slug", ProductCategoryController);

//payment

//get token
router.get("/braintree/token", brainTreeTokenController);

//post
router.post("/braintree/payment", auth, braintreePaymentsController);

module.exports = router;
