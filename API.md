# Bodega Robles Minimarket API

Complete REST API for Bodega Robles minimarket management system built with Express.js, Sequelize, and MySQL.

## Features

- **Authentication & Authorization**: JWT-based authentication with 3 role types (ADMIN, VENDEDOR, CLIENTE)
- **User Management**: Complete user lifecycle with role-based access control
- **Product Catalog**: Category-based product management with pricing and stock tracking
- **Purchase Management**: Purchase orders with automatic inventory updates
- **Sales Management**: Sales orders with payment methods and delivery tracking
- **Inventory Control**: Real-time stock management with movement tracking
- **Dashboard**: Comprehensive analytics and business metrics
- **API Documentation**: Auto-generated Swagger/OpenAPI documentation

## Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js 5.x
- **Database**: MySQL with Sequelize ORM
- **Authentication**: JWT with bcryptjs
- **Documentation**: Swagger/OpenAPI 3.0
- **Validation**: express-validator
- **Security**: Helmet, CORS

## Installation

### Prerequisites

- Node.js 16+
- pnpm or npm
- MySQL 5.7+ server

### Setup

1. **Install dependencies**:
```bash
pnpm install
```

2. **Configure environment variables** (`.env`):
```
PORT=3000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_NAME=bodega_robles
DB_USER=root
DB_PASSWORD=
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
API_BASE_URL=http://localhost:3000
```

3. **Create database**:
```sql
CREATE DATABASE bodega_robles CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

4. **Run migrations**:
```bash
pnpm run migrate
```

5. **Seed initial data**:
```bash
pnpm run seed
```

6. **Start the server**:
```bash
pnpm run dev
```

Server will be available at `http://localhost:3000`

## API Documentation

Swagger documentation is available at: `http://localhost:3000/api-docs`

### Base URL
```
http://localhost:3000/api
```

### Authentication

All protected endpoints require JWT token in `Authorization` header:
```
Authorization: Bearer <your_jwt_token>
```

### Default Users

| Email | Password | Role |
|-------|----------|------|
| admin@bodega_robles.com | admin123 | ADMIN |
| vendedor@bodega_robles.com | ventas123 | VENDEDOR |
| cliente@bodega_robles.com | cliente123 | CLIENTE |

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify` - Verify JWT token

### Users
- `GET /api/usuarios` - Get all users (ADMIN only)
- `GET /api/usuarios/:id` - Get user by ID
- `POST /api/usuarios` - Create user (ADMIN only)
- `PUT /api/usuarios/:id` - Update user (ADMIN only)
- `DELETE /api/usuarios/:id` - Delete user (ADMIN only)
- `GET /api/usuarios/vendedores/activos` - Get active sellers
- `GET /api/usuarios/clientes/activos` - Get active customers

### Categories
- `GET /api/categorias` - Get all categories
- `GET /api/categorias/:id` - Get category by ID
- `POST /api/categorias` - Create category (ADMIN only)
- `PUT /api/categorias/:id` - Update category (ADMIN only)
- `DELETE /api/categorias/:id` - Delete category (ADMIN only)

### Providers
- `GET /api/proveedores` - Get all providers
- `GET /api/proveedores/:id` - Get provider by ID
- `POST /api/proveedores` - Create provider (ADMIN only)
- `PUT /api/proveedores/:id` - Update provider (ADMIN only)
- `DELETE /api/proveedores/:id` - Delete provider (ADMIN only)

### Products
- `GET /api/productos` - Get all products (with filters)
- `GET /api/productos/:id` - Get product by ID
- `POST /api/productos` - Create product (ADMIN only)
- `PUT /api/productos/:id` - Update product (ADMIN only)
- `DELETE /api/productos/:id` - Delete product (ADMIN only)
- `GET /api/productos/bajo-stock/lista` - Get low stock products

### Purchases
- `GET /api/compras` - Get all purchases (ADMIN/VENDEDOR)
- `GET /api/compras/:id` - Get purchase by ID
- `POST /api/compras` - Create purchase
- `PUT /api/compras/:id/estado` - Update purchase status
- `GET /api/compras/estadisticas/resumen` - Get purchase statistics

### Orders
- `GET /api/pedidos` - Get all orders
- `GET /api/pedidos/:id` - Get order by ID
- `POST /api/pedidos` - Create order
- `PUT /api/pedidos/:id/estado` - Update order status
- `GET /api/pedidos/cliente/:cliente_id` - Get customer orders

### Inventory
- `GET /api/inventario` - Get inventory movements
- `GET /api/inventario/producto/:producto_id` - Get movements by product
- `POST /api/inventario` - Create inventory movement
- `GET /api/inventario/resumen/estadisticas` - Get inventory summary

### Dashboard
- `GET /api/dashboard` - Get main dashboard data
- `GET /api/dashboard/ventas-comparacion` - Get sales comparison
- `GET /api/dashboard/productos-populares` - Get popular products
- `GET /api/dashboard/estado-inventario` - Get inventory status

## Database Schema

### Tables
- **usuarios** - System users with roles
- **categorias** - Product categories
- **proveedores** - Suppliers/Providers
- **productos** - Product catalog
- **compras** - Purchase orders
- **detalles_compras** - Purchase order details
- **pedidos** - Sales orders
- **detalles_pedidos** - Sales order details
- **inventario_movimientos** - Inventory transactions

### Relationships
- Products belong to Categories and Providers
- Purchases/Orders have multiple Details
- All transactions are tracked in Inventory Movements

## Role-Based Access Control

### ADMIN
- Full system access
- User management
- Inventory management
- Dashboard access

### VENDEDOR
- Manage purchases and sales
- View products
- Create orders
- Track inventory

### CLIENTE
- View products
- Create orders
- Track own orders

## Error Handling

All errors are returned in standardized format:
```json
{
  "error": {
    "message": "Error description",
    "status": 400,
    "details": []
  }
}
```

## Response Format

Successful responses follow this format:
```json
{
  "data": {},
  "message": "Success message"
}
```

## Development

### Project Structure
```
src/
├── config/         - Database configuration
├── controllers/    - Business logic
├── middleware/     - Authentication, validation, error handling
├── models/         - Sequelize models
├── routes/         - API endpoints
├── validators/     - Input validation schemas
├── migrations/     - Database migrations
├── seeders/        - Database seeders
└── server.js       - Express app entry point
```

### Scripts
- `pnpm run dev` - Start development server
- `pnpm run migrate` - Run database migrations
- `pnpm run seed` - Seed database with demo data
- `pnpm run migrate:undo` - Rollback migrations

## Security Considerations

- Passwords are hashed using bcryptjs (10 salt rounds)
- JWT tokens expire after 7 days by default
- CORS is enabled and configured
- SQL injection protected via Sequelize parameterized queries
- Input validation on all endpoints
- Role-based access control enforced

## Future Enhancements

- Rate limiting
- Request logging
- Email notifications
- File uploads for product images
- Advanced reporting
- Multi-warehouse support
- Mobile app integration

## License

Proprietary - Bodega Robles

## Support

For support, contact: support@bodega_robles.com
