// 1. Cargar las variables de entorno desde el archivo .env
require('dotenv').config();

// 2. Importar las librerías necesarias
const express = require('express');
const mongoose = require('mongoose');

// 3. Importar los routers
const routerEventos = require('./routes/eventos');
const routerRecintos = require('./routes/recintos');

// 4. Crear la aplicación Express
const app = express();

// 5. Middleware para recibir peticiones con cuerpo JSON
app.use(express.json());

// 6. Montar los routers en sus rutas base
app.use('/eventos', routerEventos);
app.use('/recintos', routerRecintos);

// Ruta raíz de bienvenida y estado del servicio
app.get('/', (req, res) => {
    res.status(200).json({
        ok: true,
        resultado: 'API REST de Eventos funcionando correctamente'
    });
});

// 7 y 8. Conectar a MongoDB y arrancar el servidor solo si la conexión es exitosa
const puerto = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Conexión a MongoDB establecida correctamente');
        app.listen(puerto, () => {
            console.log(`Servidor escuchando en el puerto ${puerto}`);
        });
    })
    .catch((error) => {
        console.error('Error al conectar con MongoDB:', error.message);
    });
