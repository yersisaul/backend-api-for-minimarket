const { Proveedor } = require('../models');

exports.obtenerTodos = async (req, res) => {
  try {
    const proveedores = await Proveedor.findAll({ order: [['nombre', 'ASC']] });
    res.json({ data: proveedores, message: 'Providers retrieved successfully' });
  } catch (error) {
    res.status(500).json({ error: { message: error.message, status: 500 } });
  }
};

exports.obtenerPorId = async (req, res) => {
  try {
    const proveedor = await Proveedor.findByPk(req.params.id);
    if (!proveedor) return res.status(404).json({ error: { message: 'Provider not found', status: 404 } });
    res.json({ data: proveedor, message: 'Provider retrieved successfully' });
  } catch (error) {
    res.status(500).json({ error: { message: error.message, status: 500 } });
  }
};

exports.crear = async (req, res) => {
  try {
    const proveedor = await Proveedor.create(req.body);
    res.status(201).json({ data: proveedor, message: 'Provider created successfully' });
  } catch (error) {
    res.status(400).json({ error: { message: error.message, status: 400 } });
  }
};

exports.actualizar = async (req, res) => {
  try {
    const proveedor = await Proveedor.findByPk(req.params.id);
    if (!proveedor) return res.status(404).json({ error: { message: 'Provider not found', status: 404 } });
    await proveedor.update(req.body);
    res.json({ data: proveedor, message: 'Provider updated successfully' });
  } catch (error) {
    res.status(400).json({ error: { message: error.message, status: 400 } });
  }
};

exports.eliminar = async (req, res) => {
  try {
    const proveedor = await Proveedor.findByPk(req.params.id);
    if (!proveedor) return res.status(404).json({ error: { message: 'Provider not found', status: 404 } });
    await proveedor.destroy();
    res.json({ message: 'Provider deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: { message: error.message, status: 500 } });
  }
};
