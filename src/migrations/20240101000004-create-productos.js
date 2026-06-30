'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('productos', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      sku: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
      },
      nombre: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      descripcion: {
        type: Sequelize.TEXT
      },
      categoria_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'categorias',
          key: 'id'
        }
      },
      unidad_medida: {
        type: Sequelize.ENUM('Unidad', 'Botella', 'Bolsa', 'Paquete'),
        allowNull: false
      },
      stock_minimo: {
        type: Sequelize.INTEGER,
        defaultValue: 10
      },
      stock_maximo: {
        type: Sequelize.INTEGER,
        defaultValue: 1000
      },
      stock_actual: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      estado: {
        type: Sequelize.ENUM('ACTIVO', 'INACTIVO', 'DESCONTINUADO'),
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
    await queryInterface.dropTable('productos');
  }
};
