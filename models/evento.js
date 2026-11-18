
const mongoose = require('mongoose');

// Definimos la estructura de cada entrada.
const entradaSchema = new mongoose.Schema({
    tipo: {
        type: String,
        required: true,
        minlength: 3
    },
    precio: {
        type: Number,
        required: true,
        min: 0
    },
    disponibles: {
        type: Number,
        required: true,
        min: 0,
        validate: {
            validator: Number.isInteger,
            message: 'Las entradas disponibles deben ser un número entero'
        }
    }
});


// Definimos la estructura de los documentos de eventos.
const eventoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        minlength: 5
    },
    fecha: {
        type: Date,
        required: true
    },
    entradas: [entradaSchema],
    recinto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recinto',
        required: true
    }
});

// Creamos y exportamos el modelo Evento.
module.exports = mongoose.model('Evento', eventoSchema);

