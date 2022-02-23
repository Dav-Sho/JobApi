const jwt = require('jsonwebtoken')
const ErrorResponse = require('../utils/ErrorResponse')
const asyncHandler = require('./asyncHandler')
const User = require('../model/User')

// Protect Route. 
const protect = asyncHandler(async(req, res, next) => {
    let token 

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
    }

    // check token

    if(!token) {
        return next(new ErrorResponse('Not authorized to access this route', 401))
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRETE)

        req.user = await User.findById(decoded.id)

        next()
    } catch (err) {
        return next(new ErrorResponse('Not authorized to access this route', 401))
    }
})

module.exports = {
    protect
}