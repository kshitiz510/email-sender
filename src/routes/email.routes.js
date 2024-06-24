const express = require('express')
const router = express.Router()
const emailController = require('../controllers/emailController')

const dotenv = require('dotenv');
dotenv.config()

router.get('/', emailController.renderHomePage)
router.post('/', emailController.sendEmails)
router.get('/sent', emailController.getAllEmails)
router.get('/sent/:recipientEmail', emailController.getEmailsByRecipient)
    
module.exports = router