# Bodega Robles API - Quick Start Guide

## 1. Initial Setup (First Time)

### Prerequisites
- Node.js 16+ installed
- MySQL server running locally
- pnpm installed (`npm install -g pnpm`)

### Step 1: Create MySQL Database
```sql
CREATE DATABASE bodega_robles CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Step 2: Configure Environment
Edit `.env` file with your MySQL credentials:
```
DB_HOST=localhost
DB_PORT=3306
DB_NAME=bodega_robles
DB_USER=root
DB_PASSWORD=
JWT_SECRET=your_secret_key_here_change_in_production
```

### Step 3: Install Dependencies
```bash
pnpm install
```

### Step 4: Run Migrations
```bash
npx sequelize-cli db:migrate
```

### Step 5: Seed Database
```bash
npx sequelize-cli db:seed:all
```

### Step 6: Start Server
```bash
node src/server.js
```

✅ Server is now running at `http://localhost:3000`

## 2. Access the API

### API Documentation (Swagger)
Open in browser: `http://localhost:3000/api-docs`

### Test Health Endpoint
```bash
curl http://localhost:3000/health
```

## 3. Authentication

### Login with Default Credentials

#### Admin Account
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@bodega_robles.com",
    "password": "admin123"
  }'
```

Response:
```json
{
  "data": {
    "usuario": {
      "id": 1,
      "nombre": "Administrador",
      "apellido": "Default",
      "email": "admin@bodega_robles.com",
      "rol": "ADMIN"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Login successful"
}
```

### Use Token for Protected Endpoints
```bash
curl -X GET http://localhost:3000/api/usuarios \
  -H "Authorization: Bearer <your_token_here>"
```

## 4. Common Operations

### Get All Products
```bash
curl http://localhost:3000/api/productos
```

### Get Product by ID
```bash
curl http://localhost:3000/api/productos/1
```

### Create New Category (ADMIN only)
```bash
curl -X POST http://localhost:3000/api/categorias \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "nombre": "Frutas y Verduras",
    "descripcion": "Productos frescos del campo"
  }'
```

### Create Purchase
```bash
curl -X POST http://localhost:3000/api/compras \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "numero_compra": "COM-2024-001",
    "proveedor_id": 1,
    "detalles": [
      {
        "producto_id": 1,
        "cantidad": 10
      }
    ],
    "observaciones": "Primera compra de cola"
  }'
```

### Create Sales Order
```bash
curl -X POST http://localhost:3000/api/pedidos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "numero_pedido": "PED-2024-001",
    "cliente_id": 3,
    "vendedor_id": 2,
    "metodo_pago": "EFECTIVO",
    "detalles": [
      {
        "producto_id": 1,
        "cantidad": 2
      }
    ]
  }'
```

### Get Dashboard Data
```bash
curl http://localhost:3000/api/dashboard \
  -H "Authorization: Bearer <token>"
```

## 5. Default Users

| Email | Password | Role | Purpose |
|-------|----------|------|---------|
| admin@bodega_robles.com | admin123 | ADMIN | Full system access |
| vendedor@bodega_robles.com | ventas123 | VENDEDOR | Sales management |
| cliente@bodega_robles.com | cliente123 | CLIENTE | Customer access |

## 6. Database Management

### View Database
```sql
USE bodega_robles;
SHOW TABLES;
```

### Reset Database
```bash
# Undo all migrations
pnpm run migrate:undo

# Re-run migrations
pnpm run migrate

# Seed again
pnpm run seed
```

## 7. Project Structure

```
src/
├── config/
│   ├── database.js           - Database connection setup
│   └── sequelize.config.js   - Sequelize CLI configuration
├── models/
│   ├── Usuario.js            - User model
│   ├── Producto.js           - Product model
│   ├── Compra.js             - Purchase model
│   ├── Pedido.js             - Sales order model
│   └── ...                   - Other models
├── controllers/
│   ├── authController.js     - Authentication logic
│   ├── productosController.js - Product business logic
│   ├── comprasController.js  - Purchase logic
│   └── ...                   - Other controllers
├── routes/
│   ├── auth.js               - Auth endpoints
│   ├── productos.js          - Product endpoints
│   ├── compras.js            - Purchase endpoints
│   └── ...                   - Other routes
├── middleware/
│   └── auth.js               - JWT verification & role checking
├── validators/
│   └── authValidators.js     - Input validation schemas
├── migrations/
│   └── *.js                  - Database schema migrations
├── seeders/
│   └── *.js                  - Initial data seeders
└── server.js                 - Express app entry point
```

## 8. API Response Format

### Success Response
```json
{
  "data": { /* resource data */ },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "error": {
    "message": "Error description",
    "status": 400,
    "details": []
  }
}
```

## 9. Common Issues & Solutions

### Issue: "Cannot connect to database"
- Check MySQL is running: `mysql -u root`
- Verify .env credentials match your MySQL setup
- Ensure database exists: `CREATE DATABASE bodega_robles;`

### Issue: "Port 3000 already in use"
- Change PORT in .env file
- Or kill process: `lsof -ti:3000 | xargs kill -9`

### Issue: "Migrations failed"
- Check MySQL user has proper permissions
- Run: `pnpm run migrate:undo` then `pnpm run migrate`

### Issue: "JWT token expired"
- Login again to get a new token
- Tokens expire after 7 days by default

## 10. Next Steps

1. Review API documentation at `/api-docs`
2. Test all endpoints with provided sample data
3. Modify `.env` and security settings for production
4. Implement frontend application consuming this API
5. Set up monitoring and logging
6. Deploy to production server

## Support

For detailed API documentation, see `API.md`
For deployment guide, see `DEPLOYMENT.md` (if available)
