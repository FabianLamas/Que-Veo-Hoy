
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var controller = require('./controladores/controlador');

var app = express();

app.use(cors());

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.get("/peliculas", controller.cargarPeliculas);

app.get('/peliculas/recomendacion', controller.cargarRecomendacion);

app.get('/peliculas/:id', controller.cargarPeliculaID);

app.get('/generos', controller.cargarGeneros);


var puerto = '8080';

app.listen(puerto, function () {
  console.log( "Escuchando en el puerto " + puerto );
});

