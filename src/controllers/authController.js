const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');

const generarToken = (usuario) => {
  return jwt.sign(
    {
      id: usuario.id,
      email: usuario.email,
      rol: usuario.rol
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

exports.register = async (req, res) => {
  try {
    const { nombre, apellido, email, password, telefono, rol } = req.body;

    // Check if user already exists
    const usuarioExistente = await Usuario.findOne({ where: { email } });
    if (usuarioExistente) {
      return res.status(400).json({
        error: {
          message: 'User already exists with this email',
          status: 400
        }
      });
    }

    // Create new user
    const usuario = await Usuario.create({
      nombre,
      apellido,
      email,
      password,
      telefono,
      rol: rol || 'CLIENTE'
    });

    const token = generarToken(usuario);

    res.status(201).json({
      data: {
        usuario: {
          id: usuario.id,
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          email: usuario.email,
          rol: usuario.rol
        },
        token
      },
      message: 'User registered successfully'
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      error: {
        message: error.message || 'Internal server error',
        status: 500
      }
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(401).json({
        error: {message: 'Invalid credentials', status: 401}
      });
    }

    const passwordMatch = await usuario.comparePassword(password);
    if (!passwordMatch) {
      return res.status(401).json({
        error: {
          message: 'Invalid credentials',
          status: 401
        }
      });
    }

    if (usuario.estado !== 'ACTIVO') {
      return res.status(403).json({
        error: {
          message: 'User account is inactive',
          status: 403
        }
      });
    }

    const token = generarToken(usuario);

    res.json({
      data: {
        usuario: {
          id: usuario.id,
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          email: usuario.email,
          rol: usuario.rol
        },
        token
      },
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: {
        message: error.message || 'Internal server error',
        status: 500
      }
    });
  }
};

exports.verifyToken = (req, res) => {
  res.json({
    data: {
      usuario: req.usuario,
      valid: true
    },
    message: 'Token is valid'
  });
};
