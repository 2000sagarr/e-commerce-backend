const express = require("express");
const router = express.Router();

const { isSignedIn, isAuthenticated, isAdimn } = require("../controllers/auth");
const { getUserById, pushOrderInPurchaseList } = require("../controllers/user");

const { updateStock } = require("../controllers/product");
const {
  getOrderById,
  createOrder,
  getAllOrders,
  updateStatus,
  getOrderStatus,
} = require("../controllers/order");

router.param("userId", getUserById);
router.param("orderId", getOrderById);

router.post(
  "/order/create/:userId",
  isSignedIn,
  isAuthenticated,
  pushOrderInPurchaseList,
  updateStock,
  createOrder
);

router.get(
  "/order/all/:userId",
  isSignedIn,
  isAuthenticated,
  isAdimn,
  getAllOrders
);

// status of order
router.get(
  "/order/status/:userId",
  isSignedIn,
  isAuthenticated,
  isAdimn,
  getOrderStatus
);

router.put(
  "/order/:orderId/status/:userId",
  isSignedIn,
  isAuthenticated,
  isAdimn,
  updateStatus
);
module.exports = router;
