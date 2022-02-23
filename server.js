const express = require('express')
const colors = require('colors')
const dotenv = require('dotenv')
const morgan = require('morgan')
const connectDB = require('./database/db')
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const rateLimit = require('express-rate-limit')

const Job = require('./routes/job')
const Auth = require('./routes/auth')
const ErrorHandler = require('./middleware/error')

// Swaggr UI
const swaggerUI = require('swagger-ui-express')
const YMAL = require('yamljs')
const swaggerDocument = YMAL.load('./swagger.yaml')

// Load env
dotenv.config({path: './config/config.env'})

// Connect to DB
connectDB()

const app = express()


app.use(express.json())

// Security
app.set('trust proxy', 1)
app.use(rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 100
}))
app.use(helmet())
app.use(cors())
app.use(xss())

app.get('/', (req, res,) => {
    res.send('<h1>Job API</h1><a href="/api-doc">Documentation</a>')
})

app.use('/api-doc', swaggerUI.serve, swaggerUI.setup(swaggerDocument))

// Morgan middleware
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}



// Mount Routes
app.use('/api/v1/jobs', Job)
app.use('/api/v1/auth', Auth)
app.use(ErrorHandler)

const PORT = process.env.PORT || 3000

const server = app.listen(PORT, () => {
    console.log(`Server listening in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold)
})

// UhandleRejection
process.on('unhandledRejection', (err, promise) => {
    console.error(err.message.red)
    server.close(() => process.exit(1))
})