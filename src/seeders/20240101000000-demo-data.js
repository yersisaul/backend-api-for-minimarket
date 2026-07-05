'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create usuarios
    const usuarios = await queryInterface.bulkInsert('usuarios', [
      {
        nombre: 'Administrador',
        apellido: 'Default',
        email: 'admin@bodega-robles.com',
        telefono: '997304509',
        password: await bcrypt.hash('admin123', 10),
        rol: 'ADMIN',
        ciudad: 'Lima',
        estado: 'ACTIVO',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nombre: 'Vendedor',
        apellido: 'Default',
        email: 'vendedor@bodega-robles.com',
        telefono: '997304510',
        password: await bcrypt.hash('ventas123', 10),
        rol: 'VENDEDOR',
        ciudad: 'Lima',
        estado: 'ACTIVO',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nombre: 'Cliente',
        apellido: 'Default',
        email: 'cliente@bodega-robles.com',
        telefono: '997304511',
        password: await bcrypt.hash('cliente123', 10),
        rol: 'CLIENTE',
        ciudad: 'Lima',
        estado: 'ACTIVO',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], { returning: true });

    // Create categorias
    await queryInterface.bulkInsert('categorias', [
      {
        nombre: 'Abarrotes',
        descripcion: 'Productos básicos de alimentación como arroz, azúcar, fideos, aceite, conservas y enlatados',
        estado: 'ACTIVO',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nombre: 'Bebidas y Licores',
        descripcion: 'Refrescos, jugos, aguas, cervezas, vinos y licores diversos',
        estado: 'ACTIVO',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nombre: 'Limpieza y Hogar',
        descripcion: 'Productos de limpieza, detergentes, desinfectantes, papel higiénico y artículos para el hogar',
        estado: 'ACTIVO',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nombre: 'Cuidado Personal',
        descripcion: 'Jabones, champús, cremas, pasta dental y productos de higiene personal',
        estado: 'ACTIVO',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nombre: 'Snacks y Golosinas',
        descripcion: 'Galletas, chocolates, caramelos, chips y productos para picar',
        estado: 'ACTIVO',
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);

    // Create proveedores
    await queryInterface.bulkInsert('proveedores', [
      {
        nombre: 'ALICORP',
        email: 'ventas@alicorp.com.pe',
        telefono: '(01) 613-2000',
        direccion: 'Av. Argentina 4793, Callao, Lima',
        ciudad: 'Lima',
        estado: 'ACTIVO',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nombre: 'Nestlé Perú',
        email: 'contacto@nestle.pe',
        telefono: '(01) 219-0000',
        direccion: 'Av. Nicolás Arriola 771, Santa Catalina, Lima',
        ciudad: 'Lima',
        estado: 'ACTIVO',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nombre: 'Backus',
        email: 'info@backus.com.pe',
        telefono: '(01) 311-3000',
        direccion: 'Av. Nicolás Ayllón 3986, Ate Vitarte, Lima',
        ciudad: 'Lima',
        estado: 'ACTIVO',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nombre: 'Gloria',
        email: 'atencion@gloria.com.pe',
        telefono: '(01) 311-8000',
        direccion: 'Av. Alfonso Ugarte 873, Lima',
        ciudad: 'Lima',
        estado: 'ACTIVO',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nombre: 'Roche',
        email: 'ventas@roche.com.pe',
        telefono: '(01) 211-9200',
        direccion: 'Av. República de Panamá 3055, San Isidro, Lima',
        ciudad: 'Lima',
        estado: 'ACTIVO',
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);

    // Create productos with image URLs
    const path = require('path');
    const fs = require('fs');

    const imagesDir = path.join(__dirname, '../../public/images/productos');
    let imageFiles = [];
    if (fs.existsSync(imagesDir)) {
      imageFiles = fs.readdirSync(imagesDir).filter(file => 
        ['.jpg', '.jpeg', '.png', '.webp'].includes(path.extname(file).toLowerCase())
      );
    }
    console.log('📸 Archivos de imagen encontrados:', imageFiles);

    // Función para encontrar la imagen por SKU
    const getImageUrl = (sku) => {
      const file = imageFiles.find(f => f.includes(sku));
      return file ? `/images/productos/${file}` : null;
    };
    
    // Create productos
    await queryInterface.bulkInsert('productos', [
      {
        sku: 'PRDR-0001',
        nombre: 'Gaseosa Coca-Cola 1.5L',
        descripcion: 'Gaseosa sabor cola, botella de plástico 1.5 litros',
        unidad_medida: 'Botella',
        categoria_id: 2,
        stock_minimo: 20,
        stock_maximo: 100,
        stock_actual: 50,
        estado: 'ACTIVO',
        precio_venta: 1.50,
        url_imagen: getImageUrl('PRDR-0001'),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        sku: 'PRDR-0002',
        nombre: 'Agua San Luis 625ml',
        descripcion: 'Agua mineral sin gas, botella 625ml',
        unidad_medida: 'Botella',
        categoria_id: 2,
        stock_minimo: 30,
        stock_maximo: 150,
        stock_actual: 80,
        estado: 'ACTIVO',
        precio_venta: 0.80,
        url_imagen: getImageUrl('PRDR-0002'),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        sku: 'PRDR-0003',
        nombre: 'Arroz Costeño 5Kg',
        descripcion: 'Arroz extra calidad, bolsa de 5 kilogramos',
        unidad_medida: 'Bolsa',
        categoria_id: 1,
        stock_minimo: 15,
        stock_maximo: 50,
        stock_actual: 35,
        estado: 'ACTIVO',
        precio_venta: 2.50,
        url_imagen: getImageUrl('PRDR-0003'),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        sku: 'PRDR-0004',
        nombre: 'Aceite Primor 900ml',
        descripcion: 'Aceite vegetal, botella de 900ml',
        unidad_medida: 'Botella',
        categoria_id: 1,
        stock_minimo: 10,
        stock_maximo: 40,
        stock_actual: 25,
        estado: 'ACTIVO',
        precio_venta: 3.00,
        url_imagen: getImageUrl('PRDR-0004'),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        sku: 'PRDR-0005',
        nombre: 'Galletas Margarita Clásica',
        descripcion: 'Galletas saladas, paquete familiar',
        unidad_medida: 'Unidad',
        categoria_id: 5,
        stock_minimo: 20,
        stock_maximo: 60,
        stock_actual: 40,
        estado: 'ACTIVO',
        precio_venta: 1.20,
        url_imagen: getImageUrl('PRDR-0005'),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        sku: 'PRDR-0006',
        nombre: 'Chocolate Sublime 42g',
        descripcion: 'Chocolate con maní, tableta individual',
        unidad_medida: 'Unidad',
        categoria_id: 5,
        stock_minimo: 30,
        stock_maximo: 100,
        stock_actual: 60,
        estado: 'ACTIVO',
        precio_venta: 0.80,
        url_imagen: getImageUrl('PRDR-0006'),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        sku: 'PRDR-0007',
        nombre: 'Jabón Protex 3 unidades',
        descripcion: 'Jabón antibacterial, pack de 3 unidades',
        unidad_medida: 'Unidad',
        categoria_id: 4,
        stock_minimo: 15,
        stock_maximo: 50,
        stock_actual: 30,
        estado: 'ACTIVO',
        precio_venta: 2.00,
        url_imagen: getImageUrl('PRDR-0007'),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        sku: 'PRDR-0008',
        nombre: 'Pasta Dental Colgate 75ml',
        descripcion: 'Pasta dental triple acción, tubo 75ml',
        unidad_medida: 'Unidad',
        categoria_id: 4,
        stock_minimo: 20,
        stock_maximo: 60,
        stock_actual: 40,
        estado: 'ACTIVO',
        precio_venta: 1.50,
        url_imagen: getImageUrl('PRDR-0008'),
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('productos', null, {});
    await queryInterface.bulkDelete('proveedores', null, {});
    await queryInterface.bulkDelete('categorias', null, {});
    await queryInterface.bulkDelete('usuarios', null, {});
  }
};
