const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

const app = express()
const port = 3000

const dotenv = require('dotenv')
dotenv.config({path: '../.env'})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.set('view engine', 'ejs')

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected'))
.catch((err) => console.log(err))

const emailRoute = require('./routes/email.routes')
// const userRoute = require('./routes/user.routes')
app.use('/email', emailRoute)
// app.use('/user', userRoute)


app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})