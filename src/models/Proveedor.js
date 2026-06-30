const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Proveedor = sequelize.define('Proveedor', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    nombre: {type: DataTypes.STRING(150), allowNull: false},
    contacto: {type: DataTypes.STRING(100), allowNull: true},
    email: {type: DataTypes.STRING(100), allowNull: true, validate: {isEmail: true}},
    telefono: {type: DataTypes.STRING(20), allowNull: true},
    direccion: {type: DataTypes.TEXT, allowNull: true},
    ciudad: {type: DataTypes.STRING(100), allowNull: true},
    terminos_pago: {type: DataTypes.STRING(50), allowNull: true},
    calificacion: {type: DataTypes.DECIMAL(3, 2), defaultValue: 0},
    estado: {type: DataTypes.ENUM('ACTIVO', 'INACTIVO'), defaultValue: 'ACTIVO'}
  }, {
    tableName: 'proveedores',
    timestamps: true
  });

  return Proveedor;
};
