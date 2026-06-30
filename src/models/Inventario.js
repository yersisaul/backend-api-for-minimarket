const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Inventario = sequelize.define('Inventario', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    producto_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'productos',
        key: 'id'
      }
    },
    tipo_movimiento: {
      type: DataTypes.ENUM('ENTRADA', 'SALIDA', 'AJUSTE', 'DEVOLUCION'),
      allowNull: false
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    referencia_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    referencia_tipo: {
      type: DataTypes.ENUM('COMPRA', 'PEDIDO', 'AJUSTE'),
      allowNull: true
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'usuarios',
        key: 'id'
      }
    },
    observaciones: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'inventario_movimientos',
    timestamps: true
  });

  return Inventario;
};
