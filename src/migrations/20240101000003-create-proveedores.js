'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('proveedores', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nombre: {
        type: Sequelize.STRING(150),
        allowNull: false
      },
      contacto: {
        type: Sequelize.STRING(100)
      },
      email: {
        type: Sequelize.STRING(100),
        validate: { isEmail: true }
      },
      telefono: {
        type: Sequelize.STRING(20)
      },
      direccion: {
        type: Sequelize.TEXT
      },
      ciudad: {
        type: Sequelize.STRING(100)
      },
      terminos_pago: {
        type: Sequelize.STRING(50)
      },
      calificacion: {
        type: Sequelize.DECIMAL(3, 2),
        defaultValue: 0
      },
      estado: {
        type: Sequelize.ENUM('ACTIVO', 'INACTIVO'),
        defaultValue: 'ACTIVO'
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('proveedores');
  }
};
