const { sequelize } = require('../config/database');

const Usuario = require('./Usuario')(sequelize);
const Categoria = require('./Categoria')(sequelize);
const Proveedor = require('./Proveedor')(sequelize);
const Producto = require('./Producto')(sequelize);
const Compra = require('./Compra')(sequelize);
const DetalleCompra = require('./DetalleCompra')(sequelize);
const Pedido = require('./Pedido')(sequelize);
const DetallePedido = require('./DetallePedido')(sequelize);
const Inventario = require('./Inventario')(sequelize);

// Define relationships
Producto.belongsTo(Categoria, { foreignKey: 'categoria_id' });
Categoria.hasMany(Producto, { foreignKey: 'categoria_id' });

Compra.belongsTo(Proveedor, { foreignKey: 'proveedor_id' });
Proveedor.hasMany(Compra, { foreignKey: 'proveedor_id' });

Compra.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'comprador' });
Usuario.hasMany(Compra, { foreignKey: 'usuario_id' });

Compra.hasMany(DetalleCompra, { foreignKey: 'compra_id', onDelete: 'CASCADE' });
DetalleCompra.belongsTo(Compra, { foreignKey: 'compra_id' });

DetalleCompra.belongsTo(Producto, { foreignKey: 'producto_id' });
Producto.hasMany(DetalleCompra, { foreignKey: 'producto_id' });

Pedido.belongsTo(Usuario, { foreignKey: 'cliente_id', as: 'cliente' });
Usuario.hasMany(Pedido, { foreignKey: 'cliente_id' });

Pedido.belongsTo(Usuario, { foreignKey: 'vendedor_id', as: 'vendedor' });

Pedido.hasMany(DetallePedido, { foreignKey: 'pedido_id', onDelete: 'CASCADE' });
DetallePedido.belongsTo(Pedido, { foreignKey: 'pedido_id' });

DetallePedido.belongsTo(Producto, { foreignKey: 'producto_id' });
Producto.hasMany(DetallePedido, { foreignKey: 'producto_id' });

Inventario.belongsTo(Producto, { foreignKey: 'producto_id' });
Producto.hasMany(Inventario, { foreignKey: 'producto_id' });

Inventario.belongsTo(Usuario, { foreignKey: 'usuario_id' });

module.exports = {
  sequelize,
  Usuario,
  Categoria,
  Proveedor,
  Producto,
  Compra,
  DetalleCompra,
  Pedido,
  DetallePedido,
  Inventario
};
