const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Compra = sequelize.define('Compra', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    proveedor_id: {type: DataTypes.INTEGER, allowNull: false, references: {model: 'proveedores', key: 'id'}},
    usuario_id: {type: DataTypes.INTEGER, allowNull: false, references: {model: 'usuarios', key: 'id'}},
    fecha_compra: {type: DataTypes.DATE, defaultValue: DataTypes.NOW},
    subtotal: {type: DataTypes.DECIMAL(12, 2), defaultValue: 0},
    impuesto: {type: DataTypes.DECIMAL(12, 2), defaultValue: 0},
    total: {type: DataTypes.DECIMAL(12, 2), defaultValue: 0},
    estado: {type: DataTypes.ENUM('PENDIENTE', 'RECIBIDA', 'CANCELADA', 'DEVUELTA'), defaultValue: 'PENDIENTE'},
    observaciones: {type: DataTypes.TEXT, allowNull: true}
  }, {
    tableName: 'compras',
    timestamps: true
  });

  return Compra;
};
