const { Inventario, Producto, Usuario, sequelize } = require('../models');
const { Op } = require('sequelize');

exports.obtenerTodos = async (req, res) => {
  try {
    const { producto_id, tipo_movimiento, fecha_desde, fecha_hasta } = req.query;
    const where = {};
    if (producto_id) where.producto_id = producto_id;
    if (tipo_movimiento) where.tipo_movimiento = tipo_movimiento;
    if (fecha_desde || fecha_hasta) {
      where.createdAt = {};
      if (fecha_desde) where.createdAt[Op.gte] = new Date(fecha_desde);
      if (fecha_hasta) where.createdAt[Op.lte] = new Date(fecha_hasta);
    }

    const movimientos = await Inventario.findAll({
      where,
      include: [
        { model: Producto, attributes: ['id', 'nombre', 'codigo'] },
        { model: Usuario, attributes: ['id', 'nombre', 'apellido'] }
      ],
      order: [['createdAt', 'DESC']],
      limit: 100
    });
    res.json({ data: movimientos });
  } catch (error) {
    res.status(500).json({ error: { message: error.message, status: 500 } });
  }
};

exports.obtenerPorProducto = async (req, res) => {
  try {
    const movimientos = await Inventario.findAll({
      where: { producto_id: req.params.producto_id },
      include: [{ model: Usuario, attributes: ['id', 'nombre', 'apellido'] }],
      order: [['createdAt', 'DESC']]
    });
    res.json({ data: movimientos });
  } catch (error) {
    res.status(500).json({ error: { message: error.message, status: 500 } });
  }
};

exports.crearMovimiento = async (req, res) => {
  try {
    const { producto_id, tipo_movimiento, cantidad, observaciones } = req.body;

    const producto = await Producto.findByPk(producto_id);
    if (!producto) return res.status(404).json({ error: { message: 'Product not found', status: 404 } });

    if (tipo_movimiento === 'SALIDA' || tipo_movimiento === 'AJUSTE') {
      if (producto.stock_actual < cantidad) {
        return res.status(400).json({ error: { message: 'Insufficient stock', status: 400 } });
      }
    }

    const movimiento = await Inventario.create({
      producto_id,
      tipo_movimiento,
      cantidad,
      usuario_id: req.usuario.id,
      observaciones
    });

    let nuevoStock = producto.stock_actual;
    if (tipo_movimiento === 'ENTRADA' || tipo_movimiento === 'DEVOLUCION') {
      nuevoStock += cantidad;
    } else {
      nuevoStock -= cantidad;
    }

    await Producto.update(
      { stock_actual: nuevoStock },
      { where: { id: producto_id } }
    );

    res.status(201).json({ data: movimiento, message: 'Inventory movement created successfully' });
  } catch (error) {
    res.status(400).json({ error: { message: error.message, status: 400 } });
  }
};

exports.obtenerResumen = async (req, res) => {
  try {
    const { fecha_desde, fecha_hasta } = req.query;
    const where = {};
    if (fecha_desde || fecha_hasta) {
      where.createdAt = {};
      if (fecha_desde) where.createdAt[Op.gte] = new Date(fecha_desde);
      if (fecha_hasta) where.createdAt[Op.lte] = new Date(fecha_hasta);
    }

    const resumen = await Inventario.findAll({
      where,
      attributes: [
        'tipo_movimiento',
        [sequelize.fn('COUNT', sequelize.col('id')), 'total_movimientos'],
        [sequelize.fn('SUM', sequelize.col('cantidad')), 'cantidad_total']
      ],
      group: ['tipo_movimiento']
    });

    res.json({ data: resumen });
  } catch (error) {
    res.status(500).json({ error: { message: error.message, status: 500 } });
  }
};
