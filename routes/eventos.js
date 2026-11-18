
const express = require('express');
const router = express.Router();

const Evento = require('../models/evento');

// GET /eventos - Obtener todos los eventos
router.get('/', async (req, res) => {
    try {
        const eventos = await Evento.find().populate('recinto');

        if (eventos.length === 0) {
            return res.status(500).json({
                ok: false,
                error: 'No se han encontrado eventos'
            });
        }

        res.status(200).json({
            ok: true,
            resultado: eventos
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            error: 'No se han encontrado eventos'
        });
    }
});

// GET /eventos/localidad/:nombre - Buscar eventos futuros por localidad
router.get('/localidad/:nombre', async (req, res) => {
    try {
        const eventos = await Evento.find({
            fecha: { $gte: new Date() }
        }).populate({
            path: 'recinto',
            match: {
                localidad: new RegExp(`^${req.params.nombre}$`, 'i')
            }
        });

        const resultado = eventos.filter(evento => evento.recinto !== null);

        if (resultado.length === 0) {
            return res.status(404).json({
                ok: false,
                error: 'No se han encontrado eventos'
            });
        }

        res.status(200).json({
            ok: true,
            resultado
        });
    } catch (error) {
        res.status(404).json({
            ok: false,
            error: 'No se han encontrado eventos'
        });
    }
});

// GET /eventos/entradas/:idEvento/:tipoEntrada
// Consultar precio y disponibilidad de una entrada
router.get('/entradas/:idEvento/:tipoEntrada', async (req, res) => {
    try {
        const evento = await Evento.findById(req.params.idEvento);

        if (!evento) {
            return res.status(404).json({
                ok: false,
                error: `Error obteniendo datos de entrada para evento ${req.params.idEvento}`
            });
        }

        const entrada = evento.entradas.find(
            entrada => entrada.tipo.toLowerCase() === req.params.tipoEntrada.toLowerCase()
        );

        if (!entrada) {
            return res.status(404).json({
                ok: false,
                error: `Error obteniendo datos de entrada para evento ${req.params.idEvento}`
            });
        }

        res.status(200).json({
            ok: true,
            resultado: {
                precio: entrada.precio,
                disponibles: entrada.disponibles
            }
        });
    } catch (error) {
        res.status(404).json({
            ok: false,
            error: `Error obteniendo datos de entrada para evento ${req.params.idEvento}`
        });
    }
});

// GET /eventos/:id - Obtener un evento por su ID
router.get('/:id', async (req, res) => {
    try {
        const evento = await Evento.findById(req.params.id)
            .populate('recinto');

        if (!evento) {
            return res.status(404).json({
                ok: false,
                error: `Evento ${req.params.id} no encontrado`
            });
        }

        res.status(200).json({
            ok: true,
            resultado: evento
        });
    } catch (error) {
        res.status(404).json({
            ok: false,
            error: `Evento ${req.params.id} no encontrado`
        });
    }
});

// POST /eventos - Crear un evento
router.post('/', async (req, res) => {
    try {
        const evento = new Evento(req.body);
        const resultado = await evento.save();

        res.status(201).json({
            ok: true,
            resultado
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            error: 'Error añadiendo evento'
        });
    }
});

// PUT /eventos/entradas/:idEvento/:tipoEntrada/:cantidad
// Descontar entradas disponibles
router.put('/entradas/:idEvento/:tipoEntrada/:cantidad', async (req, res) => {
    try {
        const cantidad = Number(req.params.cantidad);

        const evento = await Evento.findById(req.params.idEvento);

        if (!evento) {
            return res.status(404).json({
                ok: false,
                error: `Error actualizando entradas del evento ${req.params.idEvento}`
            });
        }

        const entrada = evento.entradas.find(
            entrada => entrada.tipo.toLowerCase() === req.params.tipoEntrada.toLowerCase()
        );

        if (
            !entrada ||
            !Number.isInteger(cantidad) ||
            cantidad <= 0 ||
            entrada.disponibles < cantidad
        ) {
            return res.status(404).json({
                ok: false,
                error: `Error actualizando entradas del evento ${req.params.idEvento}`
            });
        }

        entrada.disponibles -= cantidad;

        await evento.save();

        res.status(200).json({
            ok: true,
            resultado: evento
        });
    } catch (error) {
        res.status(404).json({
            ok: false,
            error: `Error actualizando entradas del evento ${req.params.idEvento}`
        });
    }
});

// PUT /eventos/:id - Actualizar un evento
router.put('/:id', async (req, res) => {
    try {
        const evento = await Evento.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('recinto');

        if (!evento) {
            return res.status(404).json({
                ok: false,
                error: `Error actualizando evento ${req.params.id}`
            });
        }

        res.status(200).json({
            ok: true,
            resultado: evento
        });
    } catch (error) {
        res.status(404).json({
            ok: false,
            error: `Error actualizando evento ${req.params.id}`
        });
    }
});

// DELETE /eventos/:id - Eliminar un evento
router.delete('/:id', async (req, res) => {
    try {
        const evento = await Evento.findByIdAndDelete(req.params.id);

        if (!evento) {
            return res.status(404).json({
                ok: false,
                error: `Error eliminando evento ${req.params.id}`
            });
        }

        res.status(200).json({
            ok: true,
            resultado: evento
        });
    } catch (error) {
        res.status(404).json({
            ok: false,
            error: `Error eliminando evento ${req.params.id}`
        });
    }
});

module.exports = router;

