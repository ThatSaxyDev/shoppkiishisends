const mongoose = require('mongoose')
const { productSchema } = require('./product')

const userSchema = mongoose.Schema({
  name: {
    required: true,
    type: String,
    trim: true,
  },
  email: {
    required: true,
    type: String,
    validate: {
      validator: (value) => {
        const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
        return value.match(re)
      },
      message: 'Please enter a valid email address',
    },
  },
  password: {
    required: true,
    type: String,
    validate: {
      validator: (value) => {
        // const re = /^(?!.*\s)(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]).{10,16}$/
        // return value.match(re);

        return value.length > 6
      },
      message:
        'Your password must have a minimum of eight characters, at least one uppercase letter, one lowercase letter, one number and one special character',
    },
  },
  address: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'user',
  },
  cart: [
    {
      product: productSchema,
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
})

const User = mongoose.model('User', userSchema)

module.exports = User
