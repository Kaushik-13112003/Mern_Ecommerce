const express = require("express");
const {
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
} = require("../controller/userController");
const { auth, adminController } = require("../Middleware/auth");
const router = express.Router();
const formidable = require("express-formidable");

router.post("/register", formidable(), registerController);
router.post("/login", loginController);
router.post("/forgotPassword", forgotPasswordController);

router.get("/get-user/:id", auth, getSingleUserController);
router.get("/get-all-user", getAllUserController);
router.get("/user-photo/:id", getUserPhotoController);

router.put("/update-profile/:id", auth, formidable(), updateProfileController);

//test
router.get("/test", auth, adminController, tokenController);

//protected router
router.get("/auth", auth, (req, res) => {
  res.status(200).send({ ok: true });
});

//admin router
router.get("/admin-auth", auth, adminController, (req, res) => {
  res.status(200).send({ ok: true });
});

//user orders
router.get("/orders", auth, getAllOrderController);

//admin orders
router.get(
  "/all-orders",
  auth,
  adminController,
  getAllAdminPageOrderController
);

//ststus update
router.put("/order-status/:id", auth, adminController, orderStatusController);

//delete order
router.delete("/delete-myorder/:id", deleteOrderByUserFromMyOrderController);
router.delete("/delete-all-myorder", deleteAllOrderByUserFromMyOrderController);

module.exports = router;
