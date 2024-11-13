const { Vehicle, VehicleType, Booking } = require('../models');
const { Op, Sequelize } = require('sequelize');
const asyncWrapper = require('../utils/asyncWrapper');
const { sendResponse } = require('../utils/responseHandler');

const vehicleController = {
    getAllVehicles: asyncWrapper(async (req, res) => {
        const vehicles = await Vehicle.findAll({
            include: [{
                model: VehicleType,
                attributes: ['name', 'category']
            }]
        });
        return sendResponse(res, 200, true, 'Data fetched Successfully.', vehicles);
    }),

    getAvailableVehicles: asyncWrapper(async (req, res) => {
        const { startDate, endDate } = req.query;
        console.log(startDate, "this is start Dtae and ", endDate)
        if (!startDate || !endDate) {
            return sendResponse(res, 400, false, 'Start date and end date are required.');
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return sendResponse(res, 400, false, 'Invalid date format. Please use YYYY-MM-DD format.');
        }

        try {
            //all vehicles with tupe
            const allVehicles = await Vehicle.findAll({
                include: [
                    {
                        model: VehicleType,
                        attributes: ['name', 'category']
                    }
                ]
            });

            // bookings overlapping with the given time period
            const bookedVehicleIds = await Booking.findAll({
                attributes: ['VehicleId'],
                where: {
                  status: {
                    [Op.ne]: 'cancelled'
                  },
                  [Op.and]: [
                    {
                      startDate: {
                        [Op.lt]: end
                      }
                    },
                    {
                      endDate: {
                        [Op.gt]: start
                      }
                    }
                  ]
                }
              }).then(bookings => bookings.map(booking => booking.VehicleId));

            const availableVehicles = allVehicles.filter(
                vehicle => !bookedVehicleIds.includes(vehicle.id)
            );

            return sendResponse(res, 200, true, "Available vehicles fetched successfully.", availableVehicles);
        } catch (error) {
            console.error('Error in getAvailableVehicles:', error);
            return sendResponse(res, 500, false, "Error fetching available vehicles.");
        }
    })
};

module.exports = vehicleController;