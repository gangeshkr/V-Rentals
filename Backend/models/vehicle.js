'use strict';
const { Model } = require('sequelize');
// const { sequelize } = require('./index');
const VehicleType = require('./vehicleType');

module.exports = (sequelize, DataTypes) => {
  class Vehicle extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Vehicle.belongsTo(models.VehicleType);
      Vehicle.hasMany(models.Booking);
    }
  }
  Vehicle.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    model: {
      type: DataTypes.STRING,
      allowNull: false
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    registrationNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  }, {
    sequelize,
    modelName: 'Vehicle'
  });
  
  // Vehicle.belongsTo(VehicleType);
  // VehicleType.hasMany(Vehicle);
  return Vehicle;
};