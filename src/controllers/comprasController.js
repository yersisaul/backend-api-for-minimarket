const { Compra, DetalleCompra, Producto, Proveedor, Usuario, Inventario, sequelize } = require('../models');

exports.obtenerTodas = async (req, res) => {
  try {
    const compras = await Compra.findAll({
      include: [
        { model: Proveedor, attributes: ['id', 'nombre'] },
        { model: Usuario, as: 'comprador', attributes: ['id', 'nombre', 'apellido'] },
        { model: DetalleCompra, include: [{ model: Producto, attributes: ['id', 'nombre'] }] }
      ],
      order: [['fecha_compra', 'DESC']]
    });
    res.json({ data: compras });
  } catch (error) {
    res.status(500).json({ error: { message: error.message, status: 500 } });
  }
};

exports.obtenerPorId = async (req, res) => {
  try {
    const compra = await Compra.findByPk(req.params.id, {
      include: [
        {
          model: DetalleCompra,
          include: [{ model: Producto, attributes: ['id', 'nombre'] }]
        },
        { model: Proveedor, attributes: ['id', 'nombre'] },
        { model: Usuario, as: 'comprador', attributes: ['id', 'nombre', 'apellido'] }
      ]
    });
    if (!compra) return res.status(404).json({ error: { message: 'Purchase not found', status: 404 } });
    res.json({ data: compra });
  } catch (error) {
    res.status(500).json({ error: { message: error.message, status: 500 } });
  }
};

exports.crear = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { proveedor_id, detalles, observaciones, estado } = req.body;

    let subtotal = 0;
    let impuesto = 0;

    const compra = await Compra.create(
      {
        proveedor_id,
        usuario_id: req.usuario.id,
        observaciones,
        estado: estado || 'PENDIENTE'
      },
      { transaction }
    );

    for (const detalle of detalles) {
      const producto = await Producto.findByPk(detalle.producto_id, { transaction });
      if (!producto) throw new Error(`Producto ${detalle.producto_id} no encontrado`);

      const lineSubtotal = detalle.precio_unitario * detalle.cantidad;
      subtotal += lineSubtotal;

      await DetalleCompra.create(
        {
          compra_id: compra.id,
          producto_id: detalle.producto_id,
          cantidad: detalle.cantidad,
          precio_unitario: detalle.precio_unitario,
          subtotal: lineSubtotal
        },
        { transaction }
      );
      // Si se registra estado como "RECIBIDA", actualizar inventario
      if (estado == 'RECIBIDA'){
        const nuevoStock = producto.stock_actual + detalle.cantidad;

        await Producto.update(
          { stock_actual: nuevoStock },
          { where: { id: detalle.producto_id }, transaction }
        );        
      }
    }

    impuesto = subtotal * 0.18;
    const total = subtotal + impuesto;

    await compra.update(
      { subtotal, impuesto, total },
      { transaction }
    );

    await transaction.commit();

    res.status(201).json({ data: compra, message: 'Purchase created successfully' });
  } catch (error) {
    await transaction.rollback();
    res.status(400).json({ error: { message: error.message, status: 400 } });
  }
};

exports.actualizarEstado = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { estado } = req.body;
    const compra = await Compra.findByPk(req.params.id, { transaction });

    if (!compra) return res.status(404).json({ error: { message: 'Purchase not found', status: 404 } });

    if (estado === 'RECIBIDA' && compra.estado === 'PENDIENTE') {
      const detalles = await DetalleCompra.findAll({
        where: { compra_id: compra.id },
        transaction
      });

      for (const detalle of detalles) {
        const producto = await Producto.findByPk(detalle.producto_id, { transaction });
        const nuevoStock = producto.stock_actual + detalle.cantidad;

        await Producto.update(
          { stock_actual: nuevoStock },
          { where: { id: detalle.producto_id }, transaction }
        );

        await Inventario.create(
          {
            producto_id: detalle.producto_id,
            tipo_movimiento: 'ENTRADA',
            cantidad: detalle.cantidad,
            referencia_id: compra.id,
            referencia_tipo: 'COMPRA',
            usuario_id: req.usuario.id,
            observaciones: `Compra #${compra.id}`
          },
          { transaction }
        );
      }
    }

    await compra.update({ estado }, { transaction });
    await transaction.commit();

    res.json({ data: compra, message: 'Purchase status updated successfully' });
  } catch (error) {
    await transaction.rollback();
    res.status(400).json({ error: { message: error.message, status: 400 } });
  }
};

exports.obtenerEstadisticas = async (req, res) => {
  try {
    const estadisticas = await Compra.findAll({
      attributes: [
        'estado',
        [sequelize.fn('COUNT', sequelize.col('id')), 'total'],
        [sequelize.fn('SUM', sequelize.col('total')), 'monto_total']
      ],
      group: ['estado']
    });
    res.json({ data: estadisticas });
  } catch (error) {
    res.status(500).json({ error: { message: error.message, status: 500 } });
  }
};
