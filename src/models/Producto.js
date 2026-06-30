const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Producto = sequelize.define('Producto', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    sku: {type: DataTypes.STRING(50), allowNull: false, unique: true},
    nombre: {type: DataTypes.STRING(200), allowNull: false},
    descripcion: {type: DataTypes.TEXT, allowNull: true},
    categoria_id: {type: DataTypes.INTEGER, allowNull: false, references: {model: 'categorias', key: 'id'}},
    unidad_medida: {type: DataTypes.ENUM('Unidad', 'Botella', 'Bolsa', 'Paquete'), allowNull: false},
    stock_minimo: {type: DataTypes.INTEGER, defaultValue: 10},
    stock_maximo: {type: DataTypes.INTEGER, defaultValue: 1000},
    stock_actual: {type: DataTypes.INTEGER, defaultValue: 0},
    estado: {type: DataTypes.ENUM('ACTIVO', 'INACTIVO', 'DESCONTINUADO'), defaultValue: 'ACTIVO'}
  }, {
    tableName: 'productos',
    timestamps: true,
    underscored: true     // usa snake_case: created_at, updated_at
  });

  return Producto;
};
