const Category = require("../models/category");

// get category by id ==> middleware
exports.getCategoryById = (req, res, next, id) => {
  Category.findById(id).exec((err, category) => {
    if (err || !category) {
      return res.status(400).json({
        error: "Category not found in db",
      });
    }
    req.category = category;
    next();
  });
};

// add category to db
exports.createCategory = (req, res) => {
  const category = new Category(req.body);

  category.save((err, category) => {
    if (err || !category) {
      return res.status(400).json({
        error: "Not able to save category",
      });
    }
    return res.json({ category });
  });
};

// get category using if
exports.getCategory = (req, res) => {
  return res.json(req.category);
};

// get all categories
exports.getAllCategory = (req, res) => {
  Category.find((err, categories) => {
    if (err || !categories) {
      return res.status(400).json({
        error: "Not able to get categorys",
      });
    }

    return res.json(categories);
  });
};

// update category
exports.updateCategory = (req, res) => {
  const category = req.category;
  category.name = req.body.name;
  category.save((err, updatedCategory) => {
    if (err) {
      return res.status(400).json({
        error: "FAIL TO UPDATE CATEGORY",
      });
    }
    return res.json(updatedCategory);
  });
};

// delete category
exports.deleteCategory = (req, res) => {
  const category = req.category;
  category.remove((err) => {
    if (err ) {
      return res.status(400).json({
        error: "FAIL TO DELETE CATEGORY",
      });
    }
    return res.json({
      message: "Category deleted successfully!",
    });
  });
};

