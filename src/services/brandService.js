const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
const asyncHandler = require('express-async-handler');

const factory = require('./handlerFactory');
const Brand = require('../models/brandModel');

const { uploadSingleImage } = require('../middlewares/uploadImageMiddleware');

exports.uploadBrandImage = uploadSingleImage('image');

// Image processing
exports.resizeImage = asyncHandler(async (req, file, next) => {
  const filename = `brand-${uuidv4()}-${Date.now()}.jpeg`;

  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`uploads/brands/${filename}`);
  }

  // save image into our db
  req.body.image = filename;
  next();
});

// @des Get list of brands
// @route GET /api/v1/brands
// @access Public
exports.getBrands = factory.getAll(Brand);

// @des Get specific brand by Id
// @route GET /api/v1/brands/:id
// @access Public
exports.getBrand = factory.getOne(Brand);

// @des Create brand
// @route POST /api/v1/brands
// @access Private/Admin-Manager
exports.createBrand = factory.createOne(Brand);

// @des update specific brand by Id
// @route PUT /api/v1/brands/:id
// @access Private/Admin-Manager
exports.updateBrand = factory.updateOne(Brand);

// @des delete specific brand by Id
// @route DELETE /api/v1/brands/:id
// @access Private/Admin
exports.deleteBrand = factory.deleteOne(Brand);
