const { Producto, Categoria, Proveedor } = require('../models');
const { Op } = require('sequelize');

const fs = require('fs'); // Importar el módulo fs para manejar archivos
const path = require('path'); // Importar el módulo path para manejar rutas de archivos

exports.obtenerTodos = async (req, res) => {
  try {
    // Obtener todos los productos y en lugar categoria_id asignar el nombre de la categoria
    const productos = await Producto.findAll({
      include: [{ model: Categoria, as: 'Categoria' , attributes: ['id', 'nombre'] }]
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
        { model: Categoria, as: 'Categoria', attributes: ['id', 'nombre'] }
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
        { model: Categoria, as: 'Categoria', attributes: ['id', 'nombre'] }
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
    // Generar SKU
    const productos_actuales = await Producto.findAll({ order: [['id', 'DESC']], limit: 1 });
    const ultimoProducto = productos_actuales[0];
    let nuevoCodigo = 'PRDR-0001';
    if (ultimoProducto) {
      const siguienteId = ultimoProducto.id + 1;
      nuevoCodigo = `PRDR-${siguienteId.toString().padStart(4, '0')}`;
    }

    const { nombre, descripcion, categoria_id, unidad_medida, precio_venta, stock_minimo, stock_maximo, stock_actual, estado } = req.body;

    // Crear producto sin imagen aún
    const productoData = {
      nombre,
      descripcion,
      categoria_id,
      sku: nuevoCodigo,
      unidad_medida: unidad_medida || 'Unidad',
      precio_venta: precio_venta || 0,
      stock_minimo: stock_minimo || 0,
      stock_maximo: stock_maximo || 100,
      stock_actual: stock_actual || 0,
      estado: estado || 'ACTIVO',
      url_imagen: null // temporal
    };

    const producto = await Producto.create(productoData);

    // Manejar imagen si se subió
    if (req.file) {
      const oldPath = req.file.path;
      const ext = path.extname(req.file.originalname);
      const newFilename = nuevoCodigo + ext;
      const newPath = path.join(path.dirname(oldPath), newFilename);

      // Renombrar archivo
      fs.renameSync(oldPath, newPath);

      // Actualizar producto con la URL de la imagen
      producto.url_imagen = `/images/productos/${newFilename}`;
      await producto.save();
    }

    // Cargar categoría para la respuesta
    await producto.reload({
      include: [{ model: Categoria, as: 'Categoria', attributes: ['id', 'nombre'] }]
    });

    res.status(201).json({ data: producto, message: 'Product created successfully' });
  } catch (error) {
    // Si hubo error y se subió archivo temporal, limpiar
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(400).json({ error: { message: error.message, status: 400 } });
  }
};

exports.actualizar = async (req, res) => {
  try {
    const producto = await Producto.findByPk(req.params.id);
    if (!producto) return res.status(404).json({ error: { message: 'Product not found', status: 404 } });

    // Si se sube nueva imagen, eliminar la anterior si existe y guardar la nueva
    if (req.file) {
      // Eliminar imagen anterior si existe
      if (producto.url_imagen) {
        const oldImagePath = path.join(__dirname, '../public', producto.url_imagen);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      // Renombrar archivo temporal con el SKU del producto
      const oldPath = req.file.path;
      const ext = path.extname(req.file.originalname);
      const newFilename = producto.sku + ext;
      const newPath = path.join(path.dirname(oldPath), newFilename);
      fs.renameSync(oldPath, newPath);

      // Actualizar url_imagen en el objeto producto
      req.body.url_imagen = `/images/productos/${newFilename}`;
    }

    // Actualizar demás campos
    await producto.update(req.body);

    // Recargar con categoría
    await producto.reload({
      include: [{ model: Categoria, as: 'Categoria', attributes: ['id', 'nombre'] }]
    });

    res.json({ data: producto, message: 'Product updated successfully' });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
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
      include: [{ model: Categoria, as: 'Categoria', attributes: ['nombre'] }]
    });
    res.json({ data: productos });
  } catch (error) {
    res.status(500).json({ error: { message: error.message, status: 500 } });
  }
};
