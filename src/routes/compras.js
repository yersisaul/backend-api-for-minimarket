const express = require('express');
const router = express.Router();
const comprasController = require('../controllers/comprasController');
const { verifyToken, verifyRole } = require('../middleware/auth');

/**
 * @swagger
 * /api/compras:
 *   get:
 *     summary: Obtener todas las compras
 *     description: Obtiene un listado de todas las compras con opción de filtrar por estado y proveedor
 *     tags: [Compras]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de compras obtenida exitosamente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 */
router.get('/', verifyToken, verifyRole(['ADMIN', 'VENDEDOR']), comprasController.obtenerTodas);

/**
 * @swagger
 * /api/compras/{id}:
 *   get:
 *     summary: Obtener compra por ID
 *     description: Obtiene los detalles de una compra específica por su identificador
 *     tags: [Compras]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: ID de la compra
 *     responses:
 *       200:
 *         description: Compra obtenida exitosamente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 *       404:
 *         description: Compra no encontrada
 */
router.get('/:id', verifyToken, verifyRole(['ADMIN', 'VENDEDOR']), comprasController.obtenerPorId);

/**
 * @swagger
 * /api/compras:
 *   post:
 *     summary: Crear nueva compra
 *     description: Crea un nuevo registro de compra con los datos proporcionados
 *     tags: [Compras]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               proveedor_id:
 *                 type: integer
 *               fecha:
 *                 type: string
 *                 format: date
 *               estado:
 *                 type: string
 *               detalles:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     producto_id:
 *                       type: integer
 *                     cantidad:
 *                       type: integer
 *                     precio_unitario:
 *                       type: number
 *     responses:
 *       201:
 *         description: Compra creada exitosamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 */
router.post('/', verifyToken, verifyRole(['ADMIN', 'VENDEDOR']), comprasController.crear);

/**
 * @swagger
 * /api/compras/{id}/estado:
 *   put:
 *     summary: Actualizar estado de la compra
 *     description: Actualiza el estado de una compra específica
 *     tags: [Compras]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: ID de la compra
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               estado:
 *                 type: string
 *     responses:
 *       200:
 *         description: Estado de compra actualizado exitosamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 *       404:
 *         description: Compra no encontrada
 */
router.put('/:id/estado', verifyToken, verifyRole(['ADMIN', 'VENDEDOR']), comprasController.actualizarEstado);

/**
 * @swagger
 * /api/compras/estadisticas/resumen:
 *   get:
 *     summary: Obtener estadísticas de compras
 *     description: Obtiene un resumen de estadísticas de todas las compras realizadas
 *     tags: [Compras]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas obtenidas exitosamente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 */
router.get('/estadisticas/resumen', verifyToken, verifyRole(['ADMIN']), comprasController.obtenerEstadisticas);

module.exports = router;
