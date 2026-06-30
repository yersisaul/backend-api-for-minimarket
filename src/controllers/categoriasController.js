const { Categoria } = require('../models');

exports.obtenerTodas = async (req, res) => {
  try {
    const categorias = await Categoria.findAll({
      order: [['nombre', 'ASC']]
    });
    res.json({
      data: categorias,
      message: 'Categories retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({ error: { message: error.message, status: 500 } });
  }
};

exports.obtenerPorId = async (req, res) => {
  try {
    const categoria = await Categoria.findByPk(req.params.id);
    if (!categoria) {
      return res.status(404).json({ error: { message: 'Category not found', status: 404 } });
    }
    res.json({ data: categoria });
  } catch (error) {
    res.status(500).json({ error: { message: error.message, status: 500 } });
  }
};

exports.crear = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;
    const categoria = await Categoria.create({ nombre, descripcion });
    res.status(201).json({ data: categoria, message: 'Category created successfully' });
  } catch (error) {
    res.status(400).json({ error: { message: error.message, status: 400 } });
  }
};

exports.actualizar = async (req, res) => {
  try {
    const categoria = await Categoria.findByPk(req.params.id);
    if (!categoria) {
      return res.status(404).json({ error: { message: 'Category not found', status: 404 } });
    }
    await categoria.update(req.body);
    res.json({ data: categoria, message: 'Category updated successfully' });
  } catch (error) {
    res.status(400).json({ error: { message: error.message, status: 400 } });
  }
};

exports.eliminar = async (req, res) => {
  try {
    const categoria = await Categoria.findByPk(req.params.id);
    if (!categoria) {
      return res.status(404).json({ error: { message: 'Category not found', status: 404 } });
    }
    await categoria.destroy();
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: { message: error.message, status: 500 } });
  }
};
