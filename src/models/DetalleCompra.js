const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const DetalleCompra = sequelize.define('DetalleCompra', {
    id: {type: DataTypes.INTEGER, primaryKey: true,autoIncrement: true},
    compra_id: {type: DataTypes.INTEGER, allowNull: false, references: {model: 'compras', key: 'id'}},
    producto_id: {type: DataTypes.INTEGER, allowNull: false, references: {model: 'productos', key: 'id'}},
    cantidad: {type: DataTypes.INTEGER, allowNull: false},
    precio_unitario: {type: DataTypes.DECIMAL(10, 2), allowNull: false},
    subtotal: {type: DataTypes.DECIMAL(12, 2), allowNull: false}
  }, {
    tableName: 'detalles_compras',
    timestamps: true
  });

  return DetalleCompra;
};
