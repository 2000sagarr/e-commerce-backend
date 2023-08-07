const Product = require("../models/product");
const formidable = require("formidable");

const _ = require("lodash");
const fs = require("fs");

// get product by id middlewares
exports.getProductById = (req, res, next, id) => {
  Product.findById(id)
    .populate("category")
    .exec((err, product) => {
      if (err || !product) {
        return res.status(400).json({
          error: "Product not found in db",
        });
      }
      req.product = product;
      next();
    });
};

// save product to db
exports.createProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "Problem with image",
      });
    }

    // destructure fields
    const { name, description, price, category, stock } = fields;

    // validation
    if (!name || !description || !price || !category || !stock) {
      return res.status(400).json({
        error: "Please include all fields. ",
      });
    }

    let product = new Product(fields);

    // handle file
    if (file.photo) {
      if (file.photo.size > 2 * 1024 * 1024) {
        return res.status(400).json({
          error: "File size is too big!",
        });
      }
      product.photo.data = fs.readFileSync(file.photo.filepath);
      product.photo.contentType = file.photo.mimetype;
    }

    // save to db
    product.save((err, product) => {
      if (err) {
        return res.status(400).json({
          error: "Saving product failed!",
        });
      }
      return res.json(product);
    });
  });
};

// get product
exports.getProduct = (req, res) => {
  req.product.photo = undefined;
  return res.json(req.product);
};

// middleware
exports.photo = (req, res, next) => {
  if (req.product.photo.data) {
    res.set("Content-Type", req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
  next();
};

// get all products
exports.getAllProducts = (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : 8;
  const sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  Product.find()
    .select("-photo") // remove photo
    .populate("category")
    .sort([[sortBy, "asc"]])
    .limit(limit)
    .exec((err, products) => {
      if (err) {
        return res.status(400).json({
          error: "Not able to get products",
        });
      }
      return res.json(products);
    });
};

// update product
exports.updateProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "Problem with image",
      });
    }

    // updation code
    let product = req.product;
    product = _.extend(product, fields);

    // handle file
    if (file.photo) {
      if (file.photo.size > 2 * 1024 * 1024) {
        return res.status(400).json({
          error: "File size is too big!",
        });
      }
      product.photo.data = fs.readFileSync(file.photo.filepath);
      product.photo.contentType = file.photo.mimetype;
    }

    // save to db
    product.save((err, product) => {
      if (err) {
        return res.status(400).json({
          error: "Updation of product failed!",
        });
      }
      return res.json(product);
    });
  });
};

// delete product
exports.deleteProduct = (req, res) => {
  const product = req.product;
  product.remove((err) => {
    if (err) {
      return res.status(400).json({
        error: "FAIL TO DELETE PRODUCT",
      });
    }
    return res.json({
      message: "Product deleted successfully!",
    });
  });
};

// get all unique categories
exports.getAllUniqueCategories = (req, res) => {
  Product.distinct("category", {}, (err, categories) => {
    if (err) {
      return res.status(400).json({
        error: "No category found",
      });
    }
    return res.json(categories);
  });
};

// middleware
// update stock and sold item
exports.updateStock = (req, res, next) => {
  let myOperations = req.body.order.products.map((prod) => {
    return {
      updateOne: {
        filter: { _id: prod._id },
        update: { $inc: { stock: -prod.count, sold: +prod.count } },
      },
    };
  });
  Product.bulkWrite(myOperations, {}, (err, products) => {
    if (err) {
      return res.status(400).json({
        error: "Bulk operations failed",
      });
    }
    next();
  });
};
