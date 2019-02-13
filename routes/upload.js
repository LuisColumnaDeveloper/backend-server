//Requires
var express = require('express');
var fileUpload = require('express-fileupload');
//inicializar variables
var app = express();

// default options
app.use(fileUpload());


app.put('/:tipo/:id', (req, res, next) => {



    var tipo = req.params.tipo;
    var id = req.params.id;

    //Tipos de colección

    var tipoValidos = ['hospitales', 'medicos', 'usuarios'];

    if (tipoValidos.indexOf(tipo) < 0) {

        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de colección no valida',
            errors: { message: 'Tipo de colección no es valida' }
        })

    }

    if (!req.files.imagen) {

        return res.status(400).json({
            ok: false,
            mensaje: 'Error no selecciono nada',
            errors: { message: 'Debe de seleccionar una imagen' }
        })
    }

    //Obtener nombre del archivo

    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];


    //Solo estas extensiones aceptamos

    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg']


    if (extensionesValidas.indexOf(extensionArchivo) < 0) {

        return res.status(400).json({
            ok: false,
            mensaje: 'Estensión no valida',
            errors: { message: 'Las extensiones validas son ' + extensionesValidas.join(', ') }
        })

    }

    //Nombre de archivo personalizado

    var nombreArchivo = `${ id }-${ new Date().getMilliseconds()}.${extensionArchivo}`;


    var path = `./uploads/${ tipo }/${nombreArchivo}`;

    archivo.mv(path, err => {

        if (err) {

            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                errors: err
            })
        }

        res.status(200).json({
            ok: true,
            mensaje: 'Archivo movido',
            extensionArchivo: extensionArchivo
        })




    })





});
module.exports = app;