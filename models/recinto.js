
const mongoose = require('mongoose');

// Definimos la estructura de los documentos de recintos.
const recintoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        minlength: 5
    },
    direccion: {
        type: String,
        required: true,
        minlength: 10
    },
    localidad: {
        type: String,
        required: true,
        minlength: 3
    },
    aforoMaximo: {
        type: Number
    }
});

// Creamos y exportamos el modelo Recinto.
module.exports = mongoose.model('Recinto', recintoSchema);
