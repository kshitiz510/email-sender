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
});

router.get('/:emailid', async (req, res) => {
    const recipientEmail = req.params.emailid;
    try {
        const emails = await Email.find({email: recipientEmail})
        if (emails == null) {
            return res.status(404).json({ message: 'Email not found' })
        }
        res.json(emails)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
});

router.post('/', async (req, res) => {
    const { email, subject, content } = req.body

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: subject,
        text: content
    }

    try {
        await transporter.sendMail(mailOptions)
        const newEmail = new Email({ email, subject, content })
        const savedEmail = await newEmail.save()
        res.status(201).json(savedEmail)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

module.exports = router