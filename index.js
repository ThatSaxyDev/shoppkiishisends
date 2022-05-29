// IMPORTS FROM PACKAGES
const express = require('express') // like import statement in flutter
const mongoose = require('mongoose')

// IMPORTS FROM OTHER FILES
const authRouter = require('./routes/auth')
const adminRouter = require('./routes/admin')
const productRouter = require('./routes/products')
const userRouter = require('./routes/user')

// INITIALIZATIONS
const PORT = process.env.PORT || 3000
const app = express() // initialize express and save it to app variable
const DB =
  'mongodb+srv://kiishi:floSic1999@cluster0.vjcg9.mongodb.net/?retryWrites=true&w=majority'

// MIDDLEWARE
app.use(express.json())
app.use(authRouter)
app.use(adminRouter)
app.use(productRouter)
app.use(userRouter)

// CONNECTIONSs
mongoose
  .connect(DB)
  .then(() => {
    console.log('connection successful')
  })
  .catch((e) => {
    console.log(e)
  })

// LISTEN TO LOCALHOST
app.listen(PORT, '0.0.0.0', () => {
  console.log(`connected @ port ${PORT}`)
})
