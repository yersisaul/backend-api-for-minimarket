const { Pedido, DetallePedido, Producto, Usuario, Inventario, sequelize } = require('../models');

exports.obtenerTodos = async (req, res) => {
  try {
    const { estado, cliente_id } = req.query;
    const where = {};
    if (estado) where.estado = estado;
    if (cliente_id) where.cliente_id = cliente_id;

    const pedidos = await Pedido.findAll({
      where,
      include: [
        { model: Usuario, as: 'cliente', attributes: ['id', 'nombre', 'apellido', 'email'] },
        { model: Usuario, as: 'vendedor', attributes: ['id', 'nombre', 'apellido'] }
      ],
      order: [['fecha_pedido', 'DESC']]
    });
    res.json({ data: pedidos });
  } catch (error) {
    res.status(500).json({ error: { message: error.message, status: 500 } });
  }
};

exports.obtenerPorId = async (req, res) => {
  try {
    const pedido = await Pedido.findByPk(req.params.id, {
      include: [
        {
          model: DetallePedido,
          include: [{ model: Producto, attributes: ['id', 'nombre', 'codigo', 'stock_actual'] }]
        },
        { model: Usuario, as: 'cliente', attributes: ['id', 'nombre', 'apellido'] },
        { model: Usuario, as: 'vendedor', attributes: ['id', 'nombre', 'apellido'] }
      ]
    });
    if (!pedido) return res.status(404).json({ error: { message: 'Order not found', status: 404 } });
    res.json({ data: pedido });
  } catch (error) {
    res.status(500).json({ error: { message: error.message, status: 500 } });
  }
};

exports.crear = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { cliente_id, vendedor_id, detalles, metodo_pago, direccion_entrega, observaciones } = req.body;

    let subtotal = 0;

    const pedido = await Pedido.create(
      {
        cliente_id,
        vendedor_id: req.usuario.id,
        metodo_pago,
        direccion_entrega,
        observaciones,
        estado: 'PENDIENTE'
      },
      { transaction }
    );

    for (const detalle of detalles) {
      const producto = await Producto.findByPk(detalle.producto_id, { transaction });
      if (!producto) throw new Error(`Producto ${detalle.producto_id} no encontrado`);
      if (producto.stock_actual < detalle.cantidad) {
        throw new Error(`Stock insuficiente para ${producto.nombre}`);
      }

      const lineSubtotal = producto.precio_venta * detalle.cantidad;
      subtotal += lineSubtotal;

      await DetallePedido.create(
        {
          pedido_id: pedido.id,
          producto_id: detalle.producto_id,
          cantidad: detalle.cantidad,
          precio_unitario: producto.precio_venta,
          subtotal: lineSubtotal
        },
        { transaction }
      );
    }

    const impuesto = subtotal * 0.18;
    const total = subtotal + impuesto;

    await pedido.update(
      { subtotal, impuesto, total },
      { transaction }
    );

    await transaction.commit();

    res.status(201).json({ data: pedido, message: 'Order created successfully' });
  } catch (error) {
    await transaction.rollback();
    res.status(400).json({ error: { message: error.message, status: 400 } });
  }
};

exports.actualizarEstado = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { estado } = req.body;
    const pedido = await Pedido.findByPk(req.params.id, { transaction });

    if (!pedido) return res.status(404).json({ error: { message: 'Order not found', status: 404 } });

    if (estado === 'ENTREGADO' && pedido.estado !== 'ENTREGADO') {
      const detalles = await DetallePedido.findAll({
        where: { pedido_id: pedido.id },
        transaction
      });

      for (const detalle of detalles) {
        const producto = await Producto.findByPk(detalle.producto_id, { transaction });
        const nuevoStock = producto.stock_actual - detalle.cantidad;

        await Producto.update(
          { stock_actual: nuevoStock },
          { where: { id: detalle.producto_id }, transaction }
        );

        await Inventario.create(
          {
            producto_id: detalle.producto_id,
            tipo_movimiento: 'SALIDA',
            cantidad: detalle.cantidad,
            referencia_id: pedido.id,
            referencia_tipo: 'PEDIDO',
            usuario_id: req.usuario.id,
            observaciones: `Pedido #${pedido.numero_pedido}`
          },
          { transaction }
        );
      }
    }

    if (estado === 'CANCELADO') {
      const detalles = await DetallePedido.findAll({
        where: { pedido_id: pedido.id },
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
            tipo_movimiento: 'DEVOLUCION',
            cantidad: detalle.cantidad,
            referencia_id: pedido.id,
            referencia_tipo: 'PEDIDO',
            usuario_id: req.usuario.id,
            observaciones: `Devolución por cancelación de pedido #${pedido.numero_pedido}`
          },
          { transaction }
        );
      }
    }

    await pedido.update({ estado, fecha_entrega: estado === 'ENTREGADO' ? new Date() : pedido.fecha_entrega }, { transaction });
    await transaction.commit();

    res.json({ data: pedido, message: 'Order status updated successfully' });
  } catch (error) {
    await transaction.rollback();
    res.status(400).json({ error: { message: error.message, status: 400 } });
  }
};

exports.obtenerPorCliente = async (req, res) => {
  try {
    const pedidos = await Pedido.findAll({
      where: { cliente_id: req.params.cliente_id },
      include: [
        {
          model: DetallePedido,
          include: [{ model: Producto, attributes: ['id', 'nombre'] }]
        }
      ],
      order: [['fecha_pedido', 'DESC']]
    });
    res.json({ data: pedidos });
  } catch (error) {
    res.status(500).json({ error: { message: error.message, status: 500 } });
  }
};
