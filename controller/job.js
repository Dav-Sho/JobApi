const ErrorResponse = require('../utils/ErrorResponse')
const asyncHandler = require('../middleware/asyncHandler')
const Job = require('../model/Job')

// Routes   Get/api/v1/jobs
// Desc     Get all jobs
// access   Public
const getJobs = asyncHandler( async(req, res, next) => {
    let query

    const reqQuery = {...req.query}

    let queryStr = JSON.stringify(reqQuery)

    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)

    const removeFeilds = ['search', 'sort', 'page', 'limit']

    removeFeilds.forEach(param => delete reqQuery[param])

    query = Job.find(JSON.parse(queryStr))

    if(req.query.search) {
        const field = req.query.search.split(',').join(' ')
        
        query = query.select(field)
    }

    if(req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ')
        query = query.sort(sortBy)
    }else{
        query = query.sort('-createdAt')
    }

    const page = parseInt(req.query.page, 10) || 1
    const limit = parseInt(req.query.limit, 10) || 1
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    const total = await Job.countDocuments()
    const skip = query.skip(startIndex).limit(limit)

    const pagination = {}

    if(endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        }
    }

    if(startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        }
    }

    const jobs = await query

    res.status(200).json({
        success: true,
        count: jobs.length,
        pagination,
        data: jobs
    })
})

// Routes   Get/api/v1/jobs
// Desc     Get single job
// access   Public
const getJob = asyncHandler( async(req, res, next) => {
    const job = await Job.findById(req.params.id)

    if(!job) {
        return next(new ErrorResponse(`Job not found with the id ${req.params.id}`, 404))
    }

    res.status(200).json({
        success: true,
        data: job
    })
})


// Routes   Post/api/v1/jobs
// Desc     Create job
// access   Private
const addJob = asyncHandler( async(req, res, next) => {
    req.body.user = req.user.id

    const job = await Job.create(req.body)

    res.status(201).json({
        success: true,
        data: job
    })
})

// Routes   Patch/api/v1/jobs
// Desc     Update job
// access   Private
const updateCourse = asyncHandler( async(req, res, next) => {
    let job = await Job.findById(req.params.id)

    // Check for job
    if(!job) {
        return next(new ErrorResponse(`Job not found with the id of ${req.params.id}`, 404))
    }

    // check if user owns this job
    if(job.user.toString() !== req.user.id) {
        return next(new ErrorResponse('User not authorized to update this route', 401))
    }

    // Update job
    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })
    res.status(201).json({
        success: true,
        data: job
    })
})


// Routes   Delete/api/v1/jobs
// Desc     Delete job
// access   Private
const deleteJob = asyncHandler( async(req, res, next) => {
    let job = await Job.findById(req.params.id)

    // Check for job
    if(!job) {
        return next(new ErrorResponse(`Job not found with the id of ${req.params.id}`, 404))
    }

    // check if user owns this job
    if(job.user.toString() !== req.user.id) {
        return next(new ErrorResponse('User not authorized to update this route', 401))
    }

    // Delete job
    job = await Job.findByIdAndDelete(req.params.id)

    res.status(200).json({
        success: true,
        data: 'Job deleted'
    })
})

module.exports = {
    getJobs,
    getJob,
    addJob,
    updateCourse,
    deleteJob
}