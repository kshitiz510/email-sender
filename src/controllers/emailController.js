const Email = require('../models/Email.models')
const nodemailer = require('nodemailer')

const renderHomePage = (req, res) => {
    res.render('index')
}

const sendEmails = async (req, res) => {
    const { emails, subject, content } = req.body
    const emailsArray = emails.split(',').map(email => email.trim())

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    })

    const sendEmail = async (recipient) => {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: recipient,
            subject: subject,
            text: content
        }

        await transporter.sendMail(mailOptions)
        await Email.create({email: recipient, subject, content})
    }

    for (const email of emailsArray) {
        await sendEmail(email)
    }

    res.redirect('/email')
}

const getAllEmails = async (req, res) => {
    const emails = await Email.find()
    res.render('emails', {emails: emails})
}

const getEmailsByRecipient = async (req, res) => {
    const {recipientEmail} = req.params
    const emails = await Email.find({ email: recipientEmail })
    res.render('emails', {emails: emails})
}

module.exports = {
    renderHomePage,
    sendEmails,
    getAllEmails,
    getEmailsByRecipient
}
