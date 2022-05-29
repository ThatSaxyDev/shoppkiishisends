const express = require('express')
const adminRouter = express.Router()
const admin = require('../middlewares/admin')
const { Product } = require('../models/product')
const Order = require('../models/order')

// ADD PRODUCT
adminRouter.post('/admin/add-product', admin, async (req, res) => {
  try {
    const { name, description, images, quantity, price, category } = req.body
    let product = new Product({
      name,
      description,
      images,
      quantity,
      price,
      category,
    })
    product = await product.save()
    res.json(product)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

//GET ALL PRODUCTS
adminRouter.get('/admin/get-products', admin, async (req, res) => {
  try {
    const products = await Product.find({})
    res.json(products)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

//DELETE PRODUCT
adminRouter.post('/admin/delete-product', admin, async (req, res) => {
  try {
    const { id } = req.body
    let product = await Product.findByIdAndDelete(id)
    res.json(product)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// GET ALL ORDERS
adminRouter.get('/admin/get-orders', admin, async (req, res) => {
  try {
    const orders = await Order.find({})
    res.json(orders)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// CHANGE ORDER STATUS
adminRouter.post('/admin/change-order-status', admin, async (req, res) => {
  try {
    const { id, status } = req.body
    let order = await Order.findById(id)
    order.status += 1
    order = await order.save()
    res.json(order)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// analytics
adminRouter.get('/admin/analytics', admin, async (req, res) => {
  try {
    const orders = await Order.find({})
    let totalEarnings = 0

    for (let i = 0; i < orders.length; i++) {
      for (let j = 0; j < orders[i].products.length; j++) {
        totalEarnings +=
          orders[i].products[j].quantity * orders[i].products[j].product.price
      }
    }
    // fetch product category
    let mobileEarnings = await fetchProductCategory('Mobiles')
    let essentialsEarnings = await fetchProductCategory('Essentials')
    let appliancesEarnings = await fetchProductCategory('Appliances')
    let booksEarnings = await fetchProductCategory('Books')
    let fashionEarnings = await fetchProductCategory('Fashion')

    let earnings = {
      totalEarnings,
      mobileEarnings,
      essentialsEarnings,
      appliancesEarnings,
      booksEarnings,
      fashionEarnings,
    }

    res.json(earnings)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

async function fetchProductCategory(category) {
  let earnings = 0
  let categoryOrder = await Order.find({
    'products.product.category': category,
  })

  for (let i = 0; i < categoryOrder.length; i++) {
    for (let j = 0; j < categoryOrder[i].products.length; j++) {
      earnings +=
        categoryOrder[i].products[j].quantity *
        categoryOrder[i].products[j].product.price
    }
  }
  return earnings
}

module.exports = adminRouter
