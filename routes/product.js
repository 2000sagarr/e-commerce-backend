const express = require("express");
const router = express.Router();

const {
  getProductById,
  createProduct,
  getProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  photo,
  getAllUniqueCategories
} = require("../controllers/product");
const { getUserById } = require("../controllers/user");
const { isSignedIn, isAuthenticated, isAdimn } = require("../controllers/auth");

// params
router.param("userId", getUserById);
router.param("productId", getProductById);

// routes
router.post(
  "/product/create/:userId",
  isSignedIn,
  isAuthenticated,
  isAdimn,
  createProduct
);

router.get("/product/:productId", getProduct);
router.get("/product/photo/:productId", photo);

router.get("/products", getAllProducts);

router.put(
  "/product/:productId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdimn,
  updateProduct
);

router.delete(
  "/product/:productId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdimn,
  deleteProduct
);

router.get("/products/categories", getAllUniqueCategories)

module.exports = router;
