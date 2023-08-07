const express = require("express");
const router = express.Router();
const { signout, signup, signin, isSignedIn } = require("../controllers/auth");
const { check } = require("express-validator");

// validations
const signUpValidations = [
  check("name")
    .isLength({ min: 2 })
    .withMessage("Name should be atleast 2 letter."),
  check("email").isEmail().withMessage("Email is required."),
  check("password")
    .isLength({ min: 5 })
    .withMessage("Password should be atleast 5 letter"),
];

const signInValidations = [
  check("email").isEmail().withMessage("Email is required."),
  check("password").isLength({ min: 5 }).withMessage("Password field required"),
];



router.post("/signup", signUpValidations, signup);

router.post("/signin", signInValidations, signin);

router.get("/signout", signout);

router.get("/testrouter", isSignedIn, (req, res) => {
  res.json(req.auth);
});

module.exports = router;
