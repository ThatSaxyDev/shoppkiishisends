const express = require('express')
const productRouter = express.Router()
const auth = require('../middlewares/auth')
const { Product } = require('../models/product')

productRouter.get('/api/products', auth, async (req, res) => {
  try {
    const products = await Product.find({ category: req.query.category })
    res.json(products)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// GET REQUEST TO SEARCH PRODUCTS
productRouter.get('/api/products/search/:name', auth, async (req, res) => {
  try {
    const products = await Product.find({
      name: { $regex: req.params.name, $options: 'i' },
    })
    res.json(products)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// post request to rate products
productRouter.post('/api/rate-product', auth, async (req, res) => {
  try {
    const { id, rating } = req.body
    let product = await Product.findById(id)

    for (let i = 0; i < product.ratings.length; i++) {
      if (product.ratings[i].userId == req.user) {
        product.ratings.splice(i, 1)
        break
      }
    }

    const ratingSchema = {
      userId: req.user,
      rating,
    }

    product.ratings.push(ratingSchema)
    product = await product.save()
    res.json(product)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// deal of the day
productRouter.get('/api/deal-of-the-day', auth, async (req, res) => {
  try {
    let products = await Product.find({})

    products = products.sort((product1, product2) => {
      let product1Sum = 0
      let product2Sum = 0

      for (let i = 0; i < product1.ratings.length; i++) {
        product1Sum += product1.ratings[i].rating
      }

      for (let i = 0; i < product2.ratings.length; i++) {
        product2Sum += product2.ratings[i].rating
      }
      return product1Sum < product2Sum ? 1 : -1
    })

    res.json(products[0])
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

module.exports = productRouter
