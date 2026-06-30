const express = require('express');
const router = express.Router();
const productosController = require('../controllers/productosController');
const { verifyToken, verifyRole } = require('../middleware/auth');

/**
 * @swagger
 * /api/productos:
 *   get:
 *     summary: Obtener todos los productos
 *     description: Lista todos los productos
 *     tags: [Productos]
 *     responses:
 *       200:
 *         description: Lista de productos obtenida correctamente
 *       500:
 *         description: Error del servidor
 */
router.get('/', productosController.obtenerTodos);

/**
 * @swagger
 * /api/productos/obtener_con_parametros:
 *   get:
 *     summary: Obtener todos los productos
 *     description: Lista todos los productos con filtros opcionales por categoría, proveedor, estado o búsqueda.
 *     tags: [Productos]
 *     parameters:
 *       - in: query
 *         name: categoria_id
 *         description: Filtrar por ID de categoría
 *         schema:
 *           type: integer
 *       - in: query
 *         name: estado
 *         description: Filtrar por estado del producto
 *         schema:
 *           type: string
 *           enum: [ACTIVO, INACTIVO, DESCONTINUADO]
 *       - in: query
 *         name: search
 *         description: Buscar por nombre o descripción del producto
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de productos obtenida correctamente
 *       500:
 *         description: Error del servidor
 */
router.get('/obtener_con_parametros/', productosController.obtenerConParametros);

/**
 * @swagger
 * /api/productos/{id}:
 *   get:
 *     summary: Obtener producto por ID
 *     description: Devuelve un producto específico según su identificador.
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID del producto
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Producto encontrado
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error del servidor
 */
router.get('/:id', productosController.obtenerPorId);

/**
 * @swagger
 * /api/productos/bajo-stock/lista:
 *   get:
 *     summary: Obtener productos con bajo stock
 *     description: Devuelve una lista de productos cuyo stock se encuentra por debajo del umbral definido.
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de productos con bajo stock obtenida correctamente
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.get('/bajo-stock/lista', verifyToken, productosController.obtenerBajoStock);

/**
 * @swagger
 * /api/productos:
 *   post:
 *     summary: Crear producto
 *     description: Registra un nuevo producto en el sistema.
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               categoria_id:
 *                 type: integer
 *               unidad_medida:
 *                 type: string
 *                 enum: ['Unidad', 'Botella', 'Bolsa', 'Paquete']
 *             required: [nombre, categoria_id, unidad_medida]
 *     responses:
 *       201:
 *         description: Producto creado correctamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 *       500:
 *         description: Error del servidor
 */
router.post('/', verifyToken, verifyRole(['ADMIN']), productosController.crear);

/**
 * @swagger
 * /api/productos/{id}:
 *   put:
 *     summary: Actualizar producto
 *     description: Actualiza los datos de un producto existente.
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID del producto a actualizar
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
 *               descripcion:
 *                 type: string
 *               categoria_id:
 *                 type: integer
 *               unidad_medida:
 *                 type: string
 *                 enum: ['Unidad', 'Botella', 'Bolsa', 'Paquete']
 *               stock_actual:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Producto actualizado correctamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error del servidor
 */
router.put('/:id', verifyToken, verifyRole(['ADMIN']), productosController.actualizar);

/**
 * @swagger
 * /api/productos/{id}:
 *   delete:
 *     summary: Eliminar producto
 *     description: Elimina un producto existente según su ID.
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID del producto a eliminar
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Producto eliminado correctamente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error del servidor
 */
router.delete('/:id', verifyToken, verifyRole(['ADMIN']), productosController.eliminar);

module.exports = router;
