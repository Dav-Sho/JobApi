const ErrorResponse = require('../utils/ErrorResponse')
const ErrorHandler = (err, req, res, next) => {
    let error = {...err}
     error.message = err.message
     console.log(err);

     if(err.name === 'CastError') {
         const message = `Resources not found with the id ${err.value}`
         error = new ErrorResponse(message, 400)
     }

    if(err.code === 11000) {
        const message = 'Duplicat field value entered'
        error = new ErrorResponse(message, 400)
    }

    if(err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message)
        error = new ErrorResponse(message, 400)
    }

    res.status(error.statusCode|| 500).json({
        success: true,
        error: error.message || 'Server Error'
    })
}

module.exports = ErrorHandler