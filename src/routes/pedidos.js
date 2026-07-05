const express = require('express');
const router = express.Router();
const pedidosController = require('../controllers/pedidosController');
const { verifyToken, verifyRole } = require('../middleware/auth');

/**
 * @swagger
 * /api/pedidos:
 *   get:
 *     summary: Obtener todos los pedidos
 *     description: Lista todos los pedidos. Permite filtrar por estado o por cliente.
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: estado
 *         description: Estado del pedido para filtrar (por ejemplo, PENDIENTE, ENVIADO, ENTREGADO)
 *         schema:
 *           type: string
 *       - in: query
 *         name: cliente_id
 *         description: Identificador del cliente para filtrar sus pedidos
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de pedidos recuperada correctamente
 *       401:
 *         description: Token de autenticación inválido o no proporcionado
 *       500:
 *         description: Error interno del servidor
 */
router.get('/', verifyToken, pedidosController.obtenerTodos);

/**
 * @swagger
 * /api/pedidos/{id}:
 *   get:
 *     summary: Obtener pedido por ID
 *     description: Recupera la información de un pedido específico por su identificador.
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identificador único del pedido
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pedido recuperado correctamente
 *       401:
 *         description: Token de autenticación inválido o no proporcionado
 *       404:
 *         description: Pedido no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.get('/:id', verifyToken, pedidosController.obtenerPorId);

/**
 * @swagger
 * /api/pedidos/cliente/{cliente_id}:
 *   get:
 *     summary: Obtener pedidos por cliente
 *     description: Recupera todos los pedidos asociados a un cliente específico.
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cliente_id
 *         required: true
 *         description: Identificador único del cliente
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pedidos del cliente recuperados correctamente
 *       401:
 *         description: Token de autenticación inválido o no proporcionado
 *       404:
 *         description: Cliente o pedidos no encontrados
 *       500:
 *         description: Error interno del servidor
 */
router.get('/cliente/:cliente_id', verifyToken, pedidosController.obtenerPorCliente);

/**
 * @swagger
 * /api/pedidos:
 *   post:
 *     summary: Crear un pedido
 *     description: Registra un nuevo pedido en el sistema.
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Datos del pedido a crear
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cliente_id:
 *                 type: integer
 *                 description: Identificador del cliente que realiza el pedido
 *               detalles:
 *                 type: array
 *                 description: Lista de productos incluidos en el pedido
 *                 items:
 *                   type: object
 *                   properties:
 *                     producto_id:
 *                       type: integer
 *                     cantidad:
 *                       type: integer
 *               total:
 *                 type: number
 *                 format: float
 *                 description: Total del pedido
 *               estado:
 *                 type: string
 *                 description: Estado inicial del pedido
 *             required:
 *               - cliente_id
 *               - productos
 *               - total
 *     responses:
 *       201:
 *         description: Pedido creado correctamente
 *       400:
 *         description: Datos inválidos en la solicitud
 *       401:
 *         description: Token de autenticación inválido o no proporcionado
 *       403:
 *         description: El usuario no tiene permisos para crear pedidos
 *       500:
 *         description: Error interno del servidor
 */
router.post('/', verifyToken, verifyRole(['ADMIN', 'VENDEDOR', 'CLIENTE']), pedidosController.crear);

/**
 * @swagger
 * /api/pedidos/{id}/estado:
 *   put:
 *     summary: Actualizar estado del pedido
 *     description: Cambia el estado de un pedido existente.
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identificador único del pedido
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: Nuevo estado del pedido
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               estado:
 *                 type: string
 *                 description: Estado actualizado del pedido
 *             required:
 *               - estado
 *     responses:
 *       200:
 *         description: Estado del pedido actualizado correctamente
 *       400:
 *         description: Datos inválidos en la solicitud
 *       401:
 *         description: Token de autenticación inválido o no proporcionado
 *       403:
 *         description: El usuario no tiene permisos para actualizar el estado del pedido
 *       404:
 *         description: Pedido no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.put('/:id/estado', verifyToken, verifyRole(['ADMIN', 'VENDEDOR']), pedidosController.actualizarEstado);

module.exports = router;
