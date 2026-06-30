const express = require('express');
const router = express.Router();
const inventarioController = require('../controllers/inventarioController');
const { verifyToken, verifyRole } = require('../middleware/auth');

/**
 * @swagger
 * /api/inventario:
 *   get:
 *     summary: Obtener todos los movimientos de inventario
 *     tags: [Inventario]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: producto_id
 *         description: ID del producto para filtrar movimientos
 *         schema: { type: integer }
 *       - in: query
 *         name: tipo_movimiento
 *         description: Tipo de movimiento (ej: "entrada", "salida")
 *         schema: { type: string }
 *       - in: query
 *         name: fecha_desde
 *         description: Fecha inicial del rango (YYYY-MM-DD)
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: fecha_hasta
 *         description: Fecha final del rango (YYYY-MM-DD)
 *         schema: { type: string, format: date }
 *     responses:
 *       200:
 *         description: Lista de movimientos devuelta correctamente
 *       400:
 *         description: Parámetros de consulta inválidos
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 *       500:
 *         description: Error del servidor
 */
router.get('/', verifyToken, verifyRole(['ADMIN', 'VENDEDOR']), inventarioController.obtenerTodos);

/**
 * @swagger
 * /api/inventario/producto/{producto_id}:
 *   get:
 *     summary: Obtener movimientos por producto
 *     tags: [Inventario]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: producto_id
 *         description: ID del producto
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Movimientos del producto devueltos correctamente
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error del servidor
 */
router.get('/producto/:producto_id', verifyToken, inventarioController.obtenerPorProducto);

/**
 * @swagger
 * /api/inventario/resumen:
 *   get:
 *     summary: Obtener resumen del inventario
 *     tags: [Inventario]
 *     security:
 *       - bearerAuth: []
 *     description: Devuelve estadísticas y resumen general del inventario, como total de entradas, salidas y stock actual.
 *     responses:
 *       200:
 *         description: Resumen del inventario devuelto correctamente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 *       500:
 *         description: Error del servidor
 */
router.get('/resumen/estadisticas', verifyToken, verifyRole(['ADMIN']), inventarioController.obtenerResumen);

/**
 * @swagger
 * /api/inventario:
 *   post:
 *     summary: Crear movimiento de inventario
 *     tags: [Inventario]
 *     security:
 *       - bearerAuth: []
 *     description: Crea un nuevo movimiento de inventario (entrada o salida). Se requiere información del producto, cantidad y tipo de movimiento.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               producto_id:
 *                 type: integer
 *                 description: ID del producto
 *               cantidad:
 *                 type: number
 *                 description: Cantidad del movimiento
 *               tipo_movimiento:
 *                 type: string
 *                 description: Tipo de movimiento ("entrada" o "salida")
 *               descripcion:
 *                 type: string
 *                 description: Descripción opcional del movimiento
 *             required: [producto_id, cantidad, tipo_movimiento]
 *     responses:
 *       201:
 *         description: Movimiento creado correctamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 *       500:
 *         description: Error del servidor
 */
router.post('/', verifyToken, verifyRole(['ADMIN', 'VENDEDOR']), inventarioController.crearMovimiento);

module.exports = router;
