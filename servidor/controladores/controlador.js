var con = require('../lib/conexionbd');

function cargarPeliculas(req, res) {
    var sql = 'SELECT * FROM pelicula '
    
    var query = 'where 1 = 1';

    if(req.query.anio){
        query += ' and anio in('+req.query.anio+')';
    }
    if(req.query.titulo){
        query += ' and titulo like "%'+req.query.titulo+'%"';
    }
    if(req.query.genero){
        query += ' and genero_id in ('+req.query.genero+')';
    }

    switch(req.query.columna_orden){
        case 'titulo':
            query +=  ' ORDER BY titulo ASC ';
            break;
        case 'anio':
            query +=  ' ORDER BY anio DESC ';
            break;
        default:
            query +=  ' ORDER BY puntuacion DESC ';
    }

    query += 'limit 0,'+req.query.cantidad;

    con.query(sql + query, function (error, resultado, fields) {
        if(error){
            console.log("hubo un error en la consulta", error.message);
            return res.status(404).send("Hubo un error en la consulta");
        }
        con.query('SELECT COUNT(*) AS cantidad FROM pelicula ' + query, function (error, resCount, fields) {
            if(error){
                console.log("hubo un error en la consulta", error.message);
                return res.status(404).send("Hubo un error en la consulta");
            }

            var response = {
                peliculas: resultado,
                total: resCount[0].cantidad
            }
            
            res.send(JSON.stringify(response));
        }); 
    });
}

function cargarGeneros(req, res) {
    var sql = "SELECT * FROM genero";
    con.query(sql, function (error, resultado, fields) {
       
        if(error){
            console.log("hubo un error en la consulta", error.message);
            return res.status(404).send("Hubo un error en la consulta");
        }

        var response = {
            generos: resultado
        }
        
        res.send(JSON.stringify(response));
    });
}

function cargarPeliculaID(req, res) {
    var sql = "SELECT pelicula.titulo, pelicula.duracion, pelicula.director, pelicula.anio, pelicula.fecha_lanzamiento, pelicula.puntuacion, pelicula.poster, pelicula.trama, genero.nombre, actor.nombre as nombre FROM actor INNER JOIN actor_pelicula ON actor.id = actor_pelicula.actor_id INNER JOIN pelicula ON actor_pelicula.pelicula_id = pelicula.id INNER join genero ON genero.id = pelicula.genero_id WHERE pelicula.id = ";

    con.query(sql + req.params.id, function (error, resultado, fields) {
        if(error){
            console.log("hubo un error en la consulta", error.message);
            return res.status(404).send("Hubo un error en la consulta");
        }

        var pelicula = {
            titulo : resultado[0].titulo,
            duracion : resultado[0].duracion,
            director : resultado[0].director,
            anio : resultado[0].anio,
            fecha_lanzamiento : resultado[0].fecha_lanzamiento,
            puntuacion : resultado[0].puntuacion,
            poster : resultado[0].poster,
            trama : resultado[0].trama,
            nombre: resultado[0].genero
        } 

        var actores = [];

        for(var i=0; i< resultado.length; i++){
            actores.push({nombre: resultado[i].nombre});
        }

        var genero = resultado[0].genero;

        var response = {
            pelicula : pelicula,
            actores: actores,
            genero: genero
        }
        res.send(JSON.stringify(response));
    });
}

function cargarRecomendacion(req, res){
    var sql = "SELECT pelicula.poster, pelicula.trama, pelicula.titulo, genero.nombre FROM pelicula INNER JOIN genero ON pelicula.genero_id = genero.id ";
    
    var q = "where 1 = 1";
    
    if(req.query.anio_inicio && req.query.anio_fin){
        q += ' and pelicula.anio between '+req.query.anio_inicio+' AND ' + req.query.anio_fin+ '';
    }

    if(req.query.genero){
        q += ' and pelicula.genero_id = (SELECT id FROM genero WHERE nombre = "'+req.query.genero+'")';
    }

    if(req.query.puntuacion){
        q += ' and pelicula.puntuacion = '+req.query.puntuacion;
    }
    
    con.query(sql + q, function (error, resultado, fields) {
        if(error){
            console.log("hubo un error en la consulta", error.message);
            return res.status(404).send("Hubo un error en la consulta");
        }

        var response = {
            peliculas: resultado
        }
        
        res.send(JSON.stringify(response));
    });
}

module.exports = {
    cargarPeliculas: cargarPeliculas,
    cargarGeneros: cargarGeneros,
    cargarPeliculaID: cargarPeliculaID,
    cargarRecomendacion: cargarRecomendacion
};