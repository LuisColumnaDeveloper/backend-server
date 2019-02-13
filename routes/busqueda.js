//Requires
var express = require('express');
//inicializar variables
var app = express();


var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');

// ================================
// Busqueda por coleccion
// ==============
app.get('/:coleccion/:tabla/:busqueda', (req, res) => {

    var tabla = req.params.tabla;
    var busqueda = req.params.busqueda;
    var regexBusqueda = new RegExp(busqueda, 'i');

    var promesa;

    switch (tabla) {
        case 'medicos':
            promesa = buscarMedicos(regexBusqueda);

            break;
        case 'hospitales':
            promesa = buscarHospitales(regexBusqueda);

            break;
        case 'usuarios':

            promesa = buscarUsuario(regexBusqueda);

            break;

        default:
            res.status(400).json({
                ok: false,
                mensaje: 'Los tipos de busqueda sólo con: usuarios, medicos y hospitales',
                error: { message: 'Tipo de tabla/coleccion no válido' }
            })
            break;
    }

    promesa.then(data => {

        res.status(200).json({
            ok: true,
            [tabla]: data
        })

    })


})

// ================================
// Busqueda General
// ================================

app.get('/todo/:busqueda', (req, res, next) => {


    var busqueda = req.params.busqueda;

    var regex = new RegExp(busqueda, 'i');

    Promise.all([
            buscarHospitales(regex),
            buscarMedicos(regex),
            buscarUsuario(regex)
        ])
        .then(respuestas => {

            res.status(200).json({
                ok: true,
                hospitales: respuestas[0],
                medicos: respuestas[1],
                usuarios: respuestas[2]
            })

        })

});


function buscarHospitales(regex) {

    return new Promise((resolve, reject) => {

        Hospital.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .exec((err, hospitales) => {

                if (err) {
                    reject('Error al cargar hospitales', err);
                } else {
                    resolve(hospitales);
                }
            })
    })

}

function buscarMedicos(regex) {

    return new Promise((resolve, reject) => {

        Medico.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .populate('hospital')
            .exec((err, medicos) => {

                if (err) {
                    reject('Error al cargar medicos', err);
                } else {
                    resolve(medicos);
                }
            })
    })

}

function buscarUsuario(regex) {

    return new Promise((resolve, reject) => {

        Usuario.find({}, 'nombre email role')
            .or([{ 'nombre': regex }, { 'email': regex }])
            .exec((err, usuarios) => {
                if (err) {
                    reject('Error al cargar usuarios');
                } else {
                    resolve(usuarios);
                }
            })
    })

}
module.exports = app;