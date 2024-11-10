const express = require('express')
const router = express.Router()

const vehicleRoutes = require('./vehicleRoutes');
const bookingRoutes = require('./bookingRoutes')

router.use('/vehicle', vehicleRoutes);
router.use('/booking', bookingRoutes);

module.exports = router