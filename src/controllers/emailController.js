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
            pass:    process.env.EMAIL_PASS
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
        await Email.create({email: recipient, subject, content, sender: req.session.userId})
    }

    for (const email of emailsArray) {
        await sendEmail(email)
    }

    res.redirect('/email')
}

const getAllEmails = async (req, res) => {
    try {
        const emails = await Email.find({ sender: req.session.userId });
        res.render('emails', { emails });
    } catch (error) {
        res.status(500).json({error: 'Failed to fetch emails'})
    }
    
    // const emails = await Email.find()
    // res.render('emails', {emails: emails})
}

const getEmailsByRecipient = async (req, res) => {
    try{
        const {recipientEmail} = req.params
    const emails = await Email.find({ email: recipientEmail, sender: req.session.userId })
    res.render('emails', {emails: emails})
    } catch(error) {
        res.stats(500).json({error: 'Failed to fetch emails'})
    }
}

module.exports = {
    renderHomePage,
    sendEmails,
    getAllEmails,
    getEmailsByRecipient
}
