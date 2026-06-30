const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
  const Usuario = sequelize.define('Usuario', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    nombre: {type: DataTypes.STRING(100), allowNull: false},
    apellido: {type: DataTypes.STRING(100), allowNull: false},
    email: {type: DataTypes.STRING(100), allowNull: false, unique: true, validate: {isEmail: true}},
    telefono: {type: DataTypes.STRING(20), allowNull: true},
    password: {type: DataTypes.STRING(255), allowNull: false},
    rol: {type: DataTypes.ENUM('ADMIN', 'VENDEDOR', 'CLIENTE'), defaultValue: 'CLIENTE', allowNull: false},
    direccion: {type: DataTypes.TEXT, allowNull: true},
    ciudad: {type: DataTypes.STRING(100), allowNull: true},
    estado: {type: DataTypes.ENUM('ACTIVO', 'INACTIVO'), defaultValue: 'ACTIVO', allowNull: false}
  }, {
    tableName: 'usuarios',
    timestamps: true,
    underscored: true,     // usa snake_case: created_at, updated_at
    hooks: {
      beforeCreate: async (usuario) => {
        const salt = await bcrypt.genSalt(10);
        usuario.password = await bcrypt.hash(usuario.password, salt);
      },
      beforeUpdate: async (usuario) => {
        if (usuario.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          usuario.password = await bcrypt.hash(usuario.password, salt);
        }
      }
    }
  });

  Usuario.prototype.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
  };

  return Usuario;
};
