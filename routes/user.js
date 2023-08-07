const express = require("express");
const router = express.Router();

const { getUserById, getUser, updateUser, userPurchaseList } = require("../controllers/user");
const { isAuthenticated, isSignedIn } = require("../controllers/auth");

// params

/**
 * 
 */
router.param("userId", getUserById);


// routes
// get user by id
router.get("/user/:userId", isSignedIn, isAuthenticated, getUser);

// update user
router.put("/user/:userId", isSignedIn, isAuthenticated, updateUser);

// get user orders
router.get("/orders/user/:userId", isSignedIn, isAuthenticated, userPurchaseList);

module.exports = router;
