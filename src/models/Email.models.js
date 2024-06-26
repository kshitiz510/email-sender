const mongoose = require('mongoose')

const emailSchema = new mongoose.Schema({
    email : {
        type: String,
        required: true,
    },
    subject : {
        type: String,
        required: true
    },
    content : {
        type : String,
        required : true
    },
    sender: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    }
}, {timestamps: true})

const Email = mongoose.model("Email", emailSchema)

module.exports = Email