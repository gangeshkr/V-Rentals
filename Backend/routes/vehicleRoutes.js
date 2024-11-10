const express = require('express')
const router = express.Router()
const vehicleController = require('../controllers/vehicleController')

router.get('/allVehicles', vehicleController.getAllVehicles);
router.get('/availableVehicles', vehicleController.getAvailableVehicles);

module.exports = router