const express = require('express')
const {getJobs, getJob, addJob, updateCourse, deleteJob} = require('../controller/job')
const {protect} = require('../middleware/auth')

const router = express.Router()

router.route('/').get(getJobs).post(protect,addJob)
router.route('/:id').get(getJob).patch(protect,updateCourse).delete(protect,deleteJob)

module.exports = router