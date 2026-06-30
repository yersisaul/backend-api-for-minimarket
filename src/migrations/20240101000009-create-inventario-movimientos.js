'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('inventario_movimientos', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      producto_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'productos', key: 'id' } },
      tipo_movimiento: { type: Sequelize.ENUM('ENTRADA', 'SALIDA', 'AJUSTE', 'DEVOLUCION'), allowNull: false },
      cantidad: { type: Sequelize.INTEGER, allowNull: false },
      referencia_id: { type: Sequelize.INTEGER },
      referencia_tipo: { type: Sequelize.ENUM('COMPRA', 'PEDIDO', 'AJUSTE') },
      usuario_id: { type: Sequelize.INTEGER, references: { model: 'usuarios', key: 'id' } },
      observaciones: { type: Sequelize.TEXT },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
    });
  },
  down: async (queryInterface) => { await queryInterface.dropTable('inventario_movimientos'); }
};
