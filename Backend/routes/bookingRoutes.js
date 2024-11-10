const express = require('express')
const router = express.Router()
const bookingController = require('../controllers/bookingController')

router.get('/getAllBookings', bookingController.getAllBookings)
router.post('/createBooking', bookingController.createBooking)

module.exports = router