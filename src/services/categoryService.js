const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
const asyncHandler = require('express-async-handler');
const Category = require('../models/categoryModel');
const factory = require('./handlerFactory');

const { uploadMixOfImages } = require('../middlewares/uploadImageMiddleware');

exports.uploadCategoryImage = uploadMixOfImages([
  { name: 'image', maxCount: 1 },
  { name: 'icon', maxCount: 1 },
]);

// Image processing
exports.resizeImage = asyncHandler(async (req, file, next) => {
  // 1) Image processing for category
  if (req.files.image) {
    const imageCategory = `category-image-${uuidv4()}-${Date.now()}.jpeg`;

    await sharp(req.files.image[0].buffer)
      .resize(600, 600)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`uploads/categories/${imageCategory}`);

    // save image into our db
    req.body.image = imageCategory;
  }

  // 2) Image processing for category icon
  if (req.files.icon) {
    const iconCategory = `category-icon-${uuidv4()}-${Date.now()}.jpeg`;
    await sharp(req.files.icon[0].buffer)
      .resize(100, 100)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`uploads/categories/${iconCategory}`);
    req.body.icon = iconCategory;
  }

  // Save image and icon into our db
  next();
});

// @des Get list of Categories
// @route GET /api/v1/categories
// @access Publics
exports.getCategories = factory.getAll(Category);

// @des Get specific category by Id
// @route GET /api/v1/categories/:id
// @access Public
exports.getCategory = factory.getOne(Category);

// @des Create Categories
// @route POST /api/v1/categories
// @access Private/Admin-Manager
exports.createCategory = factory.createOne(Category);

// @des update specific category by Id
// @route PUT /api/v1/categories/:id
// @access Private/Admin-Manager
exports.updateCategory = factory.updateOne(Category);

// @des delete specific category by Id
// @route DELETE /api/v1/categories/:id
// @access Private/Admin
exports.deleteCategory = factory.deleteOne(Category);
