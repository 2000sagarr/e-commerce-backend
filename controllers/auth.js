const User = require("../models/user");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
var { expressjwt } = require("express-jwt");

// signup controller (Register)
exports.signup = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array()[0].msg,
    });
  }

  const user = new User(req.body);

  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        errors: "Not able to save user in db.",
      });
    }
    res.json({
      id: user._id,
      name: user.name,
      lastName: user.lastName,
      email: user.email,
    });
  });
};


exports.signin = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array()[0].msg,
    });
  }

  const { email, password } = req.body;

  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User (Email) doesn't exists",
      });
    }

    // check user password and req.body.password is same or not
    if (!user.authenticate(password)) {
      return res.status(400).json({
        error: "Email and password do not match",
      });
    }

    // create token
    const token = jwt.sign({ _id: user._id }, process.env.SECRET);
    // store token to cookie
    res.cookie("token", token, { expire: new Date() + 9999 });

    const { _id, name, email, role } = user;
    return res.json({ token, user: { _id, name, email, role } });
  });
};

exports.signout = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "User signout successfully!",
  });
};

// protected routes
// middleare
// expressjwt is middleware thats why we are not using next( ) in this middleware
exports.isSignedIn = expressjwt({
  secret: process.env.SECRET,
  userProperty: "auth",
  algorithms: ["HS256"],
});

// custom middleware
exports.isAuthenticated = (req, res, next) => {
  // profile set from frontend
  // auth set from isSignedIn middleware
  let checker = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!checker) {
    return res.status(403).json({
      message: "ACCESS DENIED!",
    });
  }
  next();
};

exports.isAdimn = (req, res, next) => {
  // 0 => regular user
  // 1 => admin
  if (req.profile.role === 0) {
    return res.status(403).json({
      error: "YOU ARE NOT ADMIN, ACCESS DENIED.",
    });
  }
  next();
};
