'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('pedidos', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      numero_pedido: { type: Sequelize.STRING(50), allowNull: false, unique: true },
      cliente_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'usuarios', key: 'id' } },
      vendedor_id: { type: Sequelize.INTEGER, references: { model: 'usuarios', key: 'id' } },
      fecha_pedido: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      fecha_entrega: { type: Sequelize.DATE },
      subtotal: { type: Sequelize.DECIMAL(12, 2), defaultValue: 0 },
      impuesto: { type: Sequelize.DECIMAL(12, 2), defaultValue: 0 },
      total: { type: Sequelize.DECIMAL(12, 2), defaultValue: 0 },
      estado: { type: Sequelize.ENUM('PENDIENTE', 'CONFIRMADO', 'ENVIADO', 'ENTREGADO', 'CANCELADO'), defaultValue: 'PENDIENTE' },
      metodo_pago: { type: Sequelize.ENUM('EFECTIVO', 'TARJETA', 'TRANSFERENCIA', 'CHEQUE') },
      direccion_entrega: { type: Sequelize.TEXT },
      observaciones: { type: Sequelize.TEXT },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
    });
  },
  down: async (queryInterface) => { await queryInterface.dropTable('pedidos'); }
};
