const express = require('express')
const router = express.Router()
const emailController = require('../controllers/emailController')

router.get('/', emailController.renderHomePage)
router.post('/', emailController.sendEmails)
router.get('/sent', emailController.getAllEmails)
router.get('/sent/:recipientEmail', emailController.getEmailsByRecipient)
    
module.exports = router