'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('detalles_compras', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      compra_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'compras', key: 'id' } },
      producto_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'productos', key: 'id' } },
      cantidad: { type: Sequelize.INTEGER, allowNull: false },
      precio_unitario: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      subtotal: { type: Sequelize.DECIMAL(12, 2), allowNull: false },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
    });
  },
  down: async (queryInterface) => { await queryInterface.dropTable('detalles_compras'); }
};
