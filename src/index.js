const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const session = require('express-session')
const MongoStore = require('connect-mongo')

const app = express()
const port = 3000

const dotenv = require('dotenv')
dotenv.config({ path: '../.env' })

app.set('view engine', 'ejs')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log(err))

app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        collectionName: 'sessions'
    }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
}))

const {isAuthenticated} = require('./middlewares/auth')

const emailRoute = require('./routes/email.routes')
const userRoute = require('./routes/user.routes')
app.use('/email', isAuthenticated, emailRoute)
app.use('/user', userRoute)

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})