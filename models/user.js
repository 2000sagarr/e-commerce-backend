const mongoose = require("mongoose");
const crypto = require("crypto");
var uuidv1 = require("uuidv1");

// user schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 32,
      trim: true,
    },

    lastName: {
      type: String,
      maxlength: 32,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },

    userinfo: {
      type: String,
      trim: true,
    },

    encry_password: {
      type: String,
      required: true,
    },

    salt: {
      type: String,
    },

    role: {
      type: Number,
      default: 0,
    },

    purchases: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

// virtual fields
userSchema
  .virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = uuidv1();
    this.encry_password = this.securePassword(password);
  })
  .get(function () {
    return this._password;
  });

userSchema.methods = {
  /**
   * method to convert plain password to encrypted password
   *
   * @param {String} plainPassword - plain password
   * @returns {String} - encrypted password
   */
  securePassword: function (plainPassword) {
    if (!plainPassword) {
      return "";
    }

    try {
      return crypto
        .createHmac("sha256", this.salt)
        .update(plainPassword)
        .digest("hex");
    } catch (err) {
      return "";
    }
  },

  /**
   * authenticate user
   *
   * @param {String} plainPassword - plain password to authenticate user
   * @returns {Boolean} - return true is input password is matches stored password
   */

  authenticate: function (plainPassword) {
    return this.securePassword(plainPassword) === this.encry_password;
  },
};

module.exports = mongoose.model("User", userSchema);
