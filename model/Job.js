const mongoose = require('mongoose')
const JobSchema = new mongoose.Schema({
    company: {
        type: String,
        required: [true, 'Please provide company nmae'],
        maxlength: [50, 'Company name can not be more than 50 characters']
    },
    title: {
        type: String,
        required: [true, 'Please add job title']
    },
    position: {
        type: String,
        required: [true, 'Please provide position'],
        maxlength: [50, 'Position can not be more than 50 characters']
    },
    description: {
        type: String,
        required: [true, 'Please add job description']
    },
    status: {
        type: String,
        enum: ['interview', 'declined', 'pending'],
        default: 'pending'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User is required']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Job', JobSchema)