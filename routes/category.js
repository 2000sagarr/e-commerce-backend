const express = require("express");
const router = express.Router();

const {
  getCategoryById,
  createCategory,
  getAllCategory,
  getCategory,
  deleteCategory,
  updateCategory,
} = require("../controllers/category");
const { getUserById } = require("../controllers/user");
const { isSignedIn, isAuthenticated, isAdimn } = require("../controllers/auth");

// params
router.param("userId", getUserById);
router.param("categoryId", getCategoryById);

// routes
router.post(
  "/category/create/:userId",
  isSignedIn,
  isAuthenticated,
  isAdimn,
  createCategory
);

router.get("/category/:categoryId", getCategory);

router.get("/categorys", getAllCategory);

router.put(
  "/category/:categoryId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdimn,
  updateCategory
);

router.delete(
  "/category/:categoryId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdimn,
  deleteCategory
);

module.exports = router;
