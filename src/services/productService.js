const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
const asyncHandler = require('express-async-handler');

const { uploadMixOfImages } = require('../middlewares/uploadImageMiddleware');
const Product = require('../models/productModel');
const factory = require('./handlerFactory');

exports.uploadProductImages = uploadMixOfImages([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 5 },
]);

exports.resizeProductImages = asyncHandler(async (req, res, next) => {
  // 1) Image processing for imageCover
  if (req.files.imageCover) {
    const imageCoverFileName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;

    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat('jpeg')
      .jpeg({ quality: 95 })
      .toFile(`uploads/products/${imageCoverFileName}`);

    // save image into our db
    req.body.imageCover = imageCoverFileName;
  }

  // if (req.files.imageCover) {
  //   req.body.imageCover = [];
  //   await Promise.all(
  //     req.files.imageCover.map(async (img, index) => {
  //       const imageCoverFileName = `product-${uuidv4()}-${Date.now()}-product.jpeg`;

  //       if (req.files) {
  //         await sharp(req.files.imageCover[0].buffer)
  //           .resize(2000, 1333)
  //           .toFormat('jpeg')
  //           .jpeg({ quality: 95 })
  //           .toFile(`uploads/products/${imageCoverFileName}`);

  //         // save image into our db
  //         req.body.imageCover.push(imageCoverFileName);
  //       }
  //     })
  //   );
  // }

  // 2) Image processing for images
  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (img, index) => {
        const imageName = `product1-${uuidv4()}-${Date.now()}-product.jpeg`;

        if (req.files) {
          await sharp(img.buffer)
            .resize(2000, 1333)
            .toFormat('jpeg')
            .jpeg({ quality: 95 })
            .toFile(`uploads/products/${imageName}`);
        }

        // save image into our db
        req.body.images.push(imageName);
      })
    );
  }
  next();
});

// @des Get list of Products
// @route GET /api/v1/products
// @access Public
exports.getProducts = factory.getAll(Product);

// @des Get specific product by Id
// @route GET /api/v1/products/:id
// @access Public
exports.getProduct = factory.getOne(Product, 'reviews');

// @des Create products
// @route POST /api/v1/products
// @access Private/Admin-Manager
exports.createProduct = factory.createOne(Product);

// @des update specific product by Id
// @route PUT /api/v1/products/:id
// @access Private/Admin-Manager
exports.updateProduct = factory.updateOne(Product);

// @des delete specific product by Id
// @route DELETE /api/v1/products/:id
// @access Private/Admin
exports.deleteProduct = factory.deleteOne(Product);
