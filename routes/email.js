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

router.get('/sent', async (req, res) => {
    try {
        const emails = await Email.find()
        res.render('emails', { emails })
    } catch (err) {
        console.error(err)
        res.status(500).send('Internal Server Error')
    }
})

router.get('/sent/:recipientEmail', async (req, res) => {
    const { recipientEmail } = req.params
    try {
        const email = await Email.find({ email: recipientEmail })
        if (email.length) {
            res.render('emails', { emails: email })
        } else {
            res.status(404).send('Email not found')
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error')
    }
})

router.post('/', async (req, res) => {
    const { emails, subject, content } = req.body
    const emailsArray = emails.split(',').map(email => email.trim())

    if (!Array.isArray(emailsArray) || emailsArray.length === 0) {
        return res.status(400).send('Emails should be a non-empty array')
    }

    try {
        for (const email of emailsArray){
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