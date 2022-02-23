const mongoose = require('mongoose')
const { login } = require('../controller/auth')
const connectDB = async() => {
    const con = await mongoose.connect(process.env.MONGO_URI)
    console.log(`MongoDB Connected... ${con.connection.host}`.cyan.underline.bold);
}

module.exports = connectDB