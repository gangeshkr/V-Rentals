const { Booking, Vehicle, VehicleType } = require('../models')
const { Op } = require('sequelize')
const asyncWrapper = require('../utils/asyncWrapper')
const { sendResponse } = require('../utils/responseHandler')

const bookingController = {
    createBooking: asyncWrapper(async (req, res) => {
        const { vehicleId, startDate, endDate, customerName, customerEmail } = req.body;

        if (!vehicleId || !startDate || !endDate || !customerName || !customerEmail) {
            return sendResponse(res, 400, false, 'All fields are required')
        }

        const vehicle = await Vehicle.findByPk(vehicleId);
        if (!vehicle) {
            return sendResponse(res, 404, false, 'Vehicle not found')
        }

        const existingBooking = await Booking.findOne({
            where: {
              VehicleId: vehicleId,
              status: {
                [Op.ne]: 'cancelled'
              },
              [Op.or]: [
                {
                  startDate: {
                    [Op.between]: [startDate, endDate]
                  }
                },
                {
                  endDate: {
                    [Op.between]: [startDate, endDate]
                  }
                }
              ]
            }
          });
          
          if (existingBooking) {
            return sendResponse(res, 400, false, 'Vehicle is not available for the selected dates.');
          }

        const booking = await Booking.create({
            VehicleId: vehicleId,
            startDate,
            endDate,
            customerName,
            customerEmail,
            status: 'confirmed'
        });

        return sendResponse(res, 201, true, 'Booking created successfully', booking);
    }),

    getAllBookings: asyncWrapper(async (req, res) => {
        const bookings = await Booking.findAll({
            include: [{
                model: Vehicle,
                include: [VehicleType]
            }]
        });
        return sendResponse(res, 200, true, 'Bookings fetched successfully', bookings);  // Changed status to 200
    })
}

module.exports = bookingController;