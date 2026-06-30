const { Usuario } = require('../models');

exports.obtenerTodos = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({attributes: { exclude: ['password'] }, order: [['id', 'DESC']]});
    res.json({
      data: usuarios,
      message: 'Users retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({error: {message: error.message, status: 500}});
  }
};

exports.obtenerPorId = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });
    if (!usuario) {
      return res.status(404).json({
        error: {
          message: 'User not found',
          status: 404
        }
      });
    }
    res.json({
      data: usuario,
      message: 'User retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      error: {
        message: error.message,
        status: 500
      }
    });
  }
};

exports.crear = async (req, res) => {
  try {
    const { nombre, apellido, email, password, telefono, rol, ciudad } = req.body;

    const usuarioExistente = await Usuario.findOne({ where: { email } });
    if (usuarioExistente) {
      return res.status(400).json({
        error: {
          message: 'User already exists with this email',
          status: 400
        }
      });
    }

    const usuario = await Usuario.create({
      nombre,
      apellido,
      email,
      password,
      telefono,
      rol,
      ciudad
    });

    res.status(201).json({
      data: {
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        rol: usuario.rol
      },
      message: 'User created successfully'
    });
  } catch (error) {
    res.status(500).json({
      error: {
        message: error.message,
        status: 500
      }
    });
  }
};

exports.actualizar = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) {
      return res.status(404).json({
        error: {
          message: 'User not found',
          status: 404
        }
      });
    }

    const { nombre, apellido, telefono, ciudad, estado, rol } = req.body;
    
    await usuario.update({
      nombre: nombre || usuario.nombre,
      apellido: apellido || usuario.apellido,
      telefono: telefono || usuario.telefono,
      ciudad: ciudad || usuario.ciudad,
      estado: estado || usuario.estado,
      rol: rol || usuario.rol
    });

    res.json({
      data: {
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        rol: usuario.rol
      },
      message: 'User updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      error: {
        message: error.message,
        status: 500
      }
    });
  }
};

exports.eliminar = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) {
      return res.status(404).json({
        error: {
          message: 'User not found',
          status: 404
        }
      });
    }

    await usuario.destroy();

    res.json({
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      error: {
        message: error.message,
        status: 500
      }
    });
  }
};

exports.obtenerVendedores = async (req, res) => {
  try {
    const vendedores = await Usuario.findAll({
      where: { rol: 'VENDEDOR', estado: 'ACTIVO' },
      attributes: { exclude: ['password'] }
    });
    res.json({
      data: vendedores,
      message: 'Sellers retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      error: {
        message: error.message,
        status: 500
      }
    });
  }
};

exports.obtenerClientes = async (req, res) => {
  try {
    const clientes = await Usuario.findAll({
      where: { rol: 'CLIENTE', estado: 'ACTIVO' },
      attributes: { exclude: ['password'] }
    });
    res.json({
      data: clientes,
      message: 'Customers retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      error: {
        message: error.message,
        status: 500
      }
    });
  }
};
