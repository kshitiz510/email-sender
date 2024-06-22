const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const emailRoute = require('./routes/email.js')
const app = express()
const port = 3000

const dotenv = require('dotenv');
dotenv.config()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected'))
.catch((err) => console.log(err));

app.use('/email', emailRoute);


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});