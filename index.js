require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')
// const seedProduct = require('./seeds/seeds')

const app = express()

const port = process.env.PORT
const databaseURL = process.env.DATABASE_URL

app.use(express.static('public'))
app.use(express.json())
app.use(
  cors({
    origin: true,
    credentials: true,
  })
)
app.use(cookieParser())

const init = async (retryCount = 0) => {
  try {
    await mongoose.connect(databaseURL)
    console.log('Successfully connected to mongdb')
  } catch (error) {
    console.error(error)
    retryCount++
    if (retryCount <= 3) setTimeout(init, 5000)
    else clearTimeout(init)
  }
}

//mongoDB 연결
init()

// 초기 상품데이터 설정
// seedProduct()

app.use('/api/product', require('./routes/productRoutes'))
app.use('/api/mdpick', require('./routes/mdPickRoutes'))
app.use('/api/cart', require('./routes/cartRoutes'))
app.use('/api/user', require('./routes/userRoutes'))
app.use('/api/order', require('./routes/orderRoutes'))
app.use('/api/temporder', require('./routes/tempOrderRoutes'))
app.use('/api/passwordReset', require('./routes/passwordResetRoutes'))

app.listen(port, () => console.log(`Server listening on port ${port}`))
