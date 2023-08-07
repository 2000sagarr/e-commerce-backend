const mongoose = require("mongoose");

const { ObjectId } = mongoose.Schema;

// product cart schema
const ProductCartSchema = new mongoose.Schema({
  product: {
    type: ObjectId,
    ref: "Product",
  },

  name: String,

  count: Number,

  price: Number,
});

// order schema
const orderSchema = new mongoose.Schema(
  {
    products: [ProductCartSchema],

    transaction_id: {},

    amount: Number,

    address: String,

    status: {
      type: String,
      default: "Recieved",
      enum: ["Cancelled", "Delivered", "Shipped", "Processing", "Recieved"],
    },

    updated: Date,

    user: {
      type: ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ProductCart", ProductCartSchema);
module.exports = mongoose.model("Order", orderSchema);
