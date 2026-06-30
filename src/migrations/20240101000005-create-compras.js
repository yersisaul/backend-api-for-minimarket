'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('compras', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      proveedor_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'proveedores', key: 'id' } },
      usuario_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'usuarios', key: 'id' } },
      fecha_compra: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      subtotal: { type: Sequelize.DECIMAL(12, 2), defaultValue: 0 },
      impuesto: { type: Sequelize.DECIMAL(12, 2), defaultValue: 0 },
      total: { type: Sequelize.DECIMAL(12, 2), defaultValue: 0 },
      estado: { type: Sequelize.ENUM('PENDIENTE', 'RECIBIDA', 'CANCELADA', 'DEVUELTA'), defaultValue: 'PENDIENTE' },
      observaciones: { type: Sequelize.TEXT },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
    });
  },
  down: async (queryInterface) => { await queryInterface.dropTable('compras'); }
};
