'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    const vehicleTypes = await queryInterface.bulkInsert('VehicleTypes', [
      {
        name: 'Hatchback',
        category: 'car',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'SUV',
        category: 'car',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Sedan',
        category: 'car',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Cruiser',
        category: 'bike',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], { returning: true });

    return queryInterface.bulkInsert('Vehicles', [
      {
        name: 'Swift',
        model: 'Maruti',
        year: 2022,
        registrationNumber: 'MH01AB1234',
        VehicleTypeId: vehicleTypes[0].id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Creta',
        model: 'Hyundai',
        year: 2023,
        registrationNumber: 'MH01CD5678',
        VehicleTypeId: vehicleTypes[1].id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'City',
        model: 'Honda',
        year: 2022,
        registrationNumber: 'MH01EF9012',
        VehicleTypeId: vehicleTypes[2].id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Classic 350',
        model: 'Royal Enfield',
        year: 2023,
        registrationNumber: 'MH01GH3456',
        VehicleTypeId: vehicleTypes[3].id,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Vehicles', null, {});
    await queryInterface.bulkDelete('VehicleTypes', null, {});
  }
};
