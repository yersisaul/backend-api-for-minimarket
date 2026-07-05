const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Pedido = sequelize.define('Pedido', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    cliente_id: { type: DataTypes.INTEGER, allowNull: false,
      references: {
        model: 'usuarios',
        key: 'id'
      }
    },
    vendedor_id: { type: DataTypes.INTEGER, allowNull: true,
      references: {
        model: 'usuarios',
        key: 'id'
      }
    },
    fecha_pedido: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    fecha_entrega: { type: DataTypes.DATE, allowNull: true },
    subtotal: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
    impuesto: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
    total: {  type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
    estado: {
      type: DataTypes.ENUM('PENDIENTE', 'CONFIRMADO', 'ENVIADO', 'ENTREGADO', 'CANCELADO'),
      defaultValue: 'PENDIENTE'
    },
    metodo_pago: {
      type: DataTypes.ENUM('EFECTIVO', 'TARJETA', 'TRANSFERENCIA', 'CHEQUE'),
      allowNull: true
    },
    direccion_entrega: { type: DataTypes.TEXT, allowNull: true },
    observaciones: { type: DataTypes.TEXT, allowNull: true }
  }, {
    tableName: 'pedidos',
    timestamps: true
  });

  return Pedido;
};
