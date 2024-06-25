const User = require('../models/User.models')
const bcrypt = require('bcrypt')

async function getSignupPage(req, res) {
    res.render('signup')
}

async function getLoginPage(req, res) {
    res.render('login')
}

async function handleUserSignup(req, res) {
    const { name, email, password } = req.body

    try {
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = new User({ name: name, email: email, password: hashedPassword })
        await newUser.save()

        req.session.userId = newUser._id

        res.redirect('/email')
    } catch (err) {
        res.status(500).send('Error signing up')
    }
}

async function handleUserLogin(req, res) {
    const { email, password } = req.body

    try {
        const user = await User.findOne({ email })
        if (!user) {
          return res.status(400).send('Invalid email or password')
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
          return res.status(400).send('Invalid email or password')
        }
        req.session.userId = user._id
    
        res.redirect('/email')
      } catch (err) {
        res.status(500).send('Error logging in')
      }
}

module.exports = {
    handleUserSignup,
    handleUserLogin,
    getSignupPage,
    getLoginPage,
}