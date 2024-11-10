'use strict';
const { Model } = require('sequelize');
// const { sequelize } = require('./index');
module.exports = (sequelize, DataTypes) => {
  class VehicleType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      VehicleType.hasMany(models.Vehicle);
    }
  }
  VehicleType.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    category: {
      type: DataTypes.ENUM('car', 'bike'),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'VehicleType'
  });
  return VehicleType;
};