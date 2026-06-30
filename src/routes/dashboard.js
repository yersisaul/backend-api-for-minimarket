const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { verifyToken, verifyRole } = require('../middleware/auth');

/**
 * @swagger
 * /api/dashboard:
 *   get:
 *     summary: Obtener datos del dashboard
 *     description: Devuelve información general del tablero, incluyendo métricas clave del negocio.
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Datos del dashboard obtenidos correctamente.
 *       401:
 *         description: No autorizado, token inválido o expirado.
 */
router.get('/', verifyToken, verifyRole(['ADMIN', 'VENDEDOR']), dashboardController.obtenerDashboard);

/**
 * @swagger
 * /api/dashboard/ventas-comparacion:
 *   get:
 *     summary: Obtener comparación de ventas
 *     description: Retorna la comparación de ventas entre periodos para analizar el rendimiento comercial.
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Comparación de ventas obtenida correctamente.
 *       401:
 *         description: No autorizado, token inválido o expirado.
 */
router.get('/ventas-comparacion', verifyToken, verifyRole(['ADMIN']), dashboardController.obtenerVentasComparación);

/**
 * @swagger
 * /api/dashboard/productos-populares:
 *   get:
 *     summary: Obtener productos populares
 *     description: Devuelve la lista de los productos más vendidos y con mayor demanda.
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Productos populares obtenidos correctamente.
 *       401:
 *         description: No autorizado, token inválido o expirado.
 */
router.get('/productos-populares', verifyToken, verifyRole(['ADMIN']), dashboardController.obtenerProductosPopulares);

/**
 * @swagger
 * /api/dashboard/estado-inventario:
 *   get:
 *     summary: Obtener estado del inventario
 *     description: Proporciona el estado actual del inventario y alertas de stock.
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estado del inventario obtenido correctamente.
 *       401:
 *         description: No autorizado, token inválido o expirado.
 */
router.get('/estado-inventario', verifyToken, verifyRole(['ADMIN']), dashboardController.obtenerEstadoInventario);

module.exports = router;
