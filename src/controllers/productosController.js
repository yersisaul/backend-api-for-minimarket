const { Producto, Categoria, Proveedor } = require('../models');
const { Op } = require('sequelize');

exports.obtenerTodos = async (req, res) => {
  try {
    // Obtener todos los productos y en lugar categoria_id asignar el nombre de la categoria
    const productos = await Producto.findAll({
      include: [{ model: Categoria, attributes: ['id', 'nombre'] }]
    });
    res.json({ data: productos });
  } catch (error) {
    res.status(500).json({ error: { message: error.message, status: 500 } });
  }
};

exports.obtenerConParametros = async (req, res) => {
  try {
    const { categoria_id, estado, search } = req.query;
    const where = {};
    if (categoria_id) where.categoria_id = categoria_id;
    if (estado) where.estado = estado;
    if (search) where.nombre = { [Op.like]: `%${search}%` };

    const productos = await Producto.findAll({
      where,
      include: [
        { model: Categoria, attributes: ['id', 'nombre'] }
      ],
      order: [['nombre', 'ASC']]
    });
    res.json({ data: productos });
  } catch (error) {
    res.status(500).json({ error: { message: error.message, status: 500 } });
  }
};

exports.obtenerPorId = async (req, res) => {
  try {
    const producto = await Producto.findByPk(req.params.id, {
      include: [
        { model: Categoria, attributes: ['id', 'nombre'] }
      ]
    });
    if (!producto) return res.status(404).json({ error: { message: 'Product not found', status: 404 } });
    res.json({ data: producto });
  } catch (error) {
    res.status(500).json({ error: { message: error.message, status: 500 } });
  }
};

exports.crear = async (req, res) => {
  try {
    // Antes de guardar obtener el ID que tendra el nuevo producto para generar SKU ('PRDR-0001') en base al id:
    const productos_actuales = await Producto.findAll({
      order: [['id', 'DESC']],
      limit: 1
    });
    
    const ultimoProducto = productos_actuales[0];
    let nuevoCodigo = 'PRDR-0001';
    if (ultimoProducto) {
      const siguienteId = ultimoProducto.id + 1;
      nuevoCodigo = `PRDR-${siguienteId.toString().padStart(4, '0')}`;
    }
    
    const { nombre, descripcion, categoria_id, unidad_medida } = req.body;

    const producto = await Producto.create({ nombre, descripcion, categoria_id, sku: nuevoCodigo, unidad_medida });
    res.status(201).json({ data: producto, message: 'Product created successfully' });
  } catch (error) {
    res.status(400).json({ error: { message: error.message, status: 400 } });
  }
};

exports.actualizar = async (req, res) => {
  try {
    const producto = await Producto.findByPk(req.params.id);
    if (!producto) return res.status(404).json({ error: { message: 'Product not found', status: 404 } });
    await producto.update(req.body);
    res.json({ data: producto, message: 'Product updated successfully' });
  } catch (error) {
    res.status(400).json({ error: { message: error.message, status: 400 } });
  }
};

exports.eliminar = async (req, res) => {
  try {
    const producto = await Producto.findByPk(req.params.id);
    if (!producto) return res.status(404).json({ error: { message: 'Product not found', status: 404 } });
    await producto.destroy();
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: { message: error.message, status: 500 } });
  }
};

exports.obtenerBajoStock = async (req, res) => {
  try {
    const productos = await Producto.findAll({
      where: { stock_actual: { [Op.lte]: Producto.sequelize.col('stock_minimo') } },
      include: [{ model: Categoria, attributes: ['nombre'] }]
    });
    res.json({ data: productos });
  } catch (error) {
    res.status(500).json({ error: { message: error.message, status: 500 } });
  }
};
