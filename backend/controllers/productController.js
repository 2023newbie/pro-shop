import Product from '../models/productModel.js'
import asyncHandler from '../middleware/asyncHandler.js'

// @desc    Fetch all products
// @route  GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res, next) => {
  const pageSize = 2
  const page = Number(req.query.pageNumber) || 1
  const count = await Product.countDocuments()
  const products = await Product.find({}).limit(pageSize).skip(pageSize * (page - 1))
  res.json({products, page, pages: Math.ceil(count / pageSize)})
})

// @desc    Fetch a product
// @route  GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id)
  if (product) {
    return res.json(product)
  } else {
    res.status(404)
    throw new Error('Resource not found')
  }
})

// @desc   Create a product
// @route  POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res, next) => {
  const product = new Product({
    name: 'Sameple name',
    price: 0,
    user: req.user._id,
    image: '/images/sample.jpg',
    brand: 'Sample brand',
    category: 'Sample category',
    countInStock: 0,
    numReviews: 0,
    description: 'Sample description',
  })

  const createdProduct = await product.save()
  res.status(201).json(createdProduct)
})

// @desc   Update a product
// @route  PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res, next) => {
  const { name, price, description, image, brand, category, countInStock } =
    req.body
  const product = await Product.findById(req.params.id)
  if (product) {
    product.name = name
    product.price = price
    product.description = description
    product.image = image
    product.brand = brand
    product.category = category
    product.countInStock = countInStock

    const updatedProduct = await product.save()
    res.status(201).json(updatedProduct)
  } else {
    res.status(404)
    throw new Error('Resource not found.')
  }
})

// @desc   Delete a product
// @route  DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id)
  if (product) {
    await product.deleteOne()
    res.status(201).json({ message: 'Success deleted product.' })
  } else {
    res.status(404)
    throw new Error('Index not found.')
  }
})

// @desc   Create a new review
// @route  POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res, next) => {
  const { rating, comment } = req.body

  const product = await Product.findById(req.params.id)
  if (product) {
    const alreadyReviewed = product.reviews.find(
      review => review.user.toString() === req.user._id.toString()
    )

    if (alreadyReviewed) {
      res.status(400)
      throw new Error('Product already reviewed.')
    }

    const review = {
      user: req.user._id,
      name: req.user.name,
      comment,
      rating: Number(rating),
    }

    product.reviews.push(review)
    product.numReviews = product.reviews.length
    await product.save()
    
    res.status(201).json({ message: 'Review added.'})
  } else {
    res.status(404)
    throw new Error('Index not found.')
  }
})

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview
}
