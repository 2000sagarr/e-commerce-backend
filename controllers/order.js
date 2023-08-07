const Order = require("../models/order");

// middleware
// get order by id
exports.getOrderById = (req, res, next, id) => {
  Order.findById(id)
    .populate("products.product", "name price")
    .exec((err, order) => {
      if (err) {
        return res.status(400).json({
          error: "No order found in db",
        });
      }
      req.order = order;
      next();
    });
};

// save order
exports.createOrder = (req, res) => {
  req.body.order.user = req.profile;
  const order = new Order(req.body.order);
  order.save((err, order) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to save order in db",
      });
    }

    return res.json(order);
  });
};

// get all orders
exports.getAllOrders = (req, res) => {
  Order.find()
    .populate("user", "_id name email")
    .exec((err, orders) => {
      if (err) {
        return res.status(400).json({
          error: "No orders found",
        });
      }
      return orders;
    });
};

exports.updateStatus = (req, res) => {
  return res.json(Order.schema.path("status").enumValues);
};

exports.getOrderStatus = (res, req) => {
  Order.update(
    { _id: req.body.orderId },
    { $set: { status: req.body.status } },
    (err, order) => {
      if (err) {
        return res.status(400).json({
          error: "Cannot update order status",
        });
      }
      return res.json(order);
    }
  );
};
