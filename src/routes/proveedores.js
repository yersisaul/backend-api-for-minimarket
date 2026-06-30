const express = require('express');
const router = express.Router();
const proveedoresController = require('../controllers/proveedoresController');
const { verifyToken, verifyRole } = require('../middleware/auth');

/**
 * @swagger
 * /api/proveedores:
 *   get:
 *     summary: Obtener todos los proveedores
 *     tags:
 *       - Proveedores
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de proveedores obtenida correctamente
 */
router.get('/', proveedoresController.obtenerTodos);

/**
 * @swagger
 * /api/proveedores/{id}:
 *   get:
 *     summary: Obtener por ID
 *     tags:
 *       - Proveedores
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Proveedor obtenido correctamente
 *       404:
 *         description: Proveedor no encontrado
 */
router.get('/:id', proveedoresController.obtenerPorId);

/**
 * @swagger
 * /api/proveedores:
 *   post:
 *     summary: Crea proveedor
 *     tags:
 *       - Proveedores
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - email
 *               - telefono
 *               - direccion
 *               - ciudad
 *               - estado
 *             properties:
 *               nombre:
 *                 type: string
 *               email:
 *                 type: string
 *               telefono:
 *                 type: string
 *               direccion:
 *                 type: string
 *               ciudad:
 *                 type: string
 *     responses:
 *       201:
 *         description: Proveedor creado exitosamente
 *       400:
 *         description: Error de validación
 */
router.post('/', verifyToken, verifyRole(['ADMIN']), proveedoresController.crear);

/**
 * @swagger
 * /api/proveedores/{id}:
 *   put:
 *     summary: Actualizar proveedor
 *     tags:
 *       - Proveedores
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               email:
 *                 type: string
 *               telefono:
 *                 type: string
 *               direccion:
 *                 type: string
 *               ciudad:
 *                 type: string
 *               estado:
 *                 type: string
 *                 enum: [ACTIVO, INACTIVO]
 *     responses:
 *       200:
 *         description: Proveedor actualizado correctamente
 *       400:
 *         description: Error de validación
 *       404:
 *         description: Proveedor no encontrado
 */
router.put('/:id', verifyToken, verifyRole(['ADMIN']), proveedoresController.actualizar);

/**
 * @swagger
 * /api/proveedores/{id}:
 *   delete:
 *     summary: Eliminar proveedor
 *     tags:
 *       - Proveedores
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Proveedor eliminado correctamente
 *       404:
 *         description: Proveedor no encontrado
 */
router.delete('/:id', verifyToken, verifyRole(['ADMIN']), proveedoresController.eliminar);

module.exports = router;
