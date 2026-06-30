const { Usuario, Producto, Compra, Pedido, Inventario, sequelize } = require('../models');
const { Op } = require('sequelize');

exports.obtenerDashboard = async (req, res) => {
  try {
    // Estadísticas generales
    const totalUsuarios = await Usuario.count();
    const totalProductos = await Producto.count();
    const productosActivos = await Producto.count({ where: { estado: 'ACTIVO' } });
    const productosInactivos = await Producto.count({ where: { estado: 'INACTIVO' } });

    // Inventario
    const inventarioTotal = await Producto.sum('stock_actual');
    const productosBajoStock = await Producto.count({
      where: sequelize.where(sequelize.col('stock_actual'), Op.lte, sequelize.col('stock_minimo'))
    });

    // Compras y Pedidos
    const totalCompras = await Compra.count();
    const totalPedidos = await Pedido.count();
    const comprasPendientes = await Compra.count({ where: { estado: 'PENDIENTE' } });
    const pedidosPendientes = await Pedido.count({ where: { estado: 'PENDIENTE' } });

    // Montos
    const montoCompras = await Compra.sum('total');
    const montoPedidos = await Pedido.sum('total');

    // Movimientos de inventario (últimos 7 días)
    const fecha7DiasAtras = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const movimientosRecientes = await Inventario.findAll({
      where: { createdAt: { [Op.gte]: fecha7DiasAtras } },
      attributes: [
        'tipo_movimiento',
        [sequelize.fn('COUNT', sequelize.col('id')), 'total']
      ],
      group: ['tipo_movimiento']
    });

    res.json({
      data: {
        usuarios: {
          total: totalUsuarios
        },
        productos: {
          total: totalProductos,
          activos: productosActivos,
          inactivos: productosInactivos,
          bajoStock: productosBajoStock
        },
        inventario: {
          stockTotal: inventarioTotal || 0
        },
        compras: {
          total: totalCompras,
          pendientes: comprasPendientes,
          montoTotal: montoCompras || 0
        },
        pedidos: {
          total: totalPedidos,
          pendientes: pedidosPendientes,
          montoTotal: montoPedidos || 0
        },
        movimientosRecientes
      }
    });
  } catch (error) {
    res.status(500).json({ error: { message: error.message, status: 500 } });
  }
};

exports.obtenerVentasComparación = async (req, res) => {
  try {
    const meses = 6;
    const datos = [];

    for (let i = meses - 1; i >= 0; i--) {
      const fecha = new Date();
      fecha.setMonth(fecha.getMonth() - i);
      const primerDia = new Date(fecha.getFullYear(), fecha.getMonth(), 1);
      const ultimoDia = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0);

      const venta = await Pedido.sum('total', {
        where: {
          fecha_pedido: { [Op.between]: [primerDia, ultimoDia] },
          estado: 'ENTREGADO'
        }
      });

      datos.push({
        mes: fecha.toLocaleString('es-ES', { month: 'long', year: 'numeric' }),
        venta: venta || 0
      });
    }

    res.json({ data: datos });
  } catch (error) {
    res.status(500).json({ error: { message: error.message, status: 500 } });
  }
};

exports.obtenerProductosPopulares = async (req, res) => {
  try {
    const populares = await sequelize.query(`
      SELECT p.id, p.nombre, COUNT(dp.id) as veces_vendido, SUM(dp.subtotal) as ingresos
      FROM productos p
      JOIN detalles_pedidos dp ON p.id = dp.producto_id
      JOIN pedidos pd ON dp.pedido_id = pd.id
      WHERE pd.estado = 'ENTREGADO'
      GROUP BY p.id, p.nombre
      ORDER BY veces_vendido DESC
      LIMIT 10
    `, { type: sequelize.QueryTypes.SELECT });

    res.json({ data: populares });
  } catch (error) {
    res.status(500).json({ error: { message: error.message, status: 500 } });
  }
};

exports.obtenerEstadoInventario = async (req, res) => {
  try {
    const estado = await sequelize.query(`
      SELECT
        SUM(CASE WHEN stock_actual <= stock_minimo THEN 1 ELSE 0 END) as critico,
        SUM(CASE WHEN stock_actual > stock_minimo AND stock_actual <= stock_maximo THEN 1 ELSE 0 END) as normal,
        SUM(CASE WHEN stock_actual > stock_maximo THEN 1 ELSE 0 END) as exceso
      FROM productos
      WHERE estado = 'ACTIVO'
    `, { type: sequelize.QueryTypes.SELECT });

    res.json({ data: estado[0] });
  } catch (error) {
    res.status(500).json({ error: { message: error.message, status: 500 } });
  }
};
