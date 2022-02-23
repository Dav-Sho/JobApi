const ErrorResponse = require('../utils/ErrorResponse')
const asyncHandler = require('../middleware/asyncHandler')
const User = require('../model/User')

const register = asyncHandler( async(req, res ,next) => {
    const {name, email, password} = req.body

    let user = await User.findOne({email})

    // Check if User already exist
    if(user) {
        return next(new ErrorResponse('User already exist', 400))
    }

    // Create User
    user = await User.create({
        name, 
        email,
        password
    })

    sendToken(user, 201, res)


    res.status(201).json({
        success: true,
        token
    })
})

const login = asyncHandler( async(req, res, next) => {
    const {email, password} = req.body

    // Email & Password validation
    if(!email || !password) {
        return next(new ErrorResponse('Please Enter email and password'))
    }

    const user = await User.findOne({email}).select('+password')

    if(!user) {
        return next(new ErrorResponse('Invalid Credentials', 401))
    }

    const isMatch = await user.matchPassword(password)

    if(!isMatch) {
        return next(new ErrorResponse('Invalid Credentials', 401))
    }

    sendToken(user, 201, res)

    res.status(201).json({
        success: true,
        token
    })
})

// Send token
const sendToken = (user, statusCode, res) => {
    const token = user.getJsonwebToken()
    const options = {
        expires: new Date(Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
        httpOnly : true

    }

    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        token
    })
}

module.exports = {
    register,
    login
}