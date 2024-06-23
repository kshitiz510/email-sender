const express = require('express')
const nodemailer = require('nodemailer')
const Email = require('../models/User')
const router = express.Router()

const dotenv = require('dotenv');
dotenv.config()

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

router.get('/', async (req, res) => {
    try {
        const emails = await Email.find()
        res.json(emails)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.get('/:emailid', async (req, res) => {
    const recipientEmail = req.params.emailid
    try {
        const emails = await Email.find({email: recipientEmail})
        if (emails == null) {
            return res.status(404).json({ message: 'Email not found' })
        }
        res.json(emails)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.post('/', async (req, res) => {
    const { emails, subject, content } = req.body

    if (!Array.isArray(emails) || emails.length === 0) {
        return res.status(400).send('Emails should be a non-empty array')
    }

    try {
        for (const email of emails){
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: subject,
                text: content
            }
            await transporter.sendMail(mailOptions)
            const newEmail = new Email({ email, subject, content })
            await newEmail.save()
        }
        res.status(200).send('Emails sent and saved successfully')
    } catch (err) { 
        res.status(500).json({ message: err.message })
    }
})
    
module.exports = router