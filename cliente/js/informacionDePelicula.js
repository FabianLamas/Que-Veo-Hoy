(function() {
    var server = 'http://localhost:8080';
    var params = location.search
    var id = (params.split("="))[1];

    var controladorInformacionDePelicula = new ControladorInformacionDePelicula();
    
    controladorInformacionDePelicula.obtenerPelicula(id);

    function ControladorInformacionDePelicula() {
        this.cargarDetalle = function(data) {
                var pelicula, actores;
                
                pelicula = data.pelicula;
                actores = data.actores;
                genero = data.pelicula.nombre;

                $(".imagen").attr("src", pelicula.poster);
                $(".titulo, title").html(pelicula.titulo + " (" + pelicula.anio + ")");
                $(".trama").html(pelicula.trama);
                var fecha = new Date(pelicula.fecha_lanzamiento);
                $(".lanzamiento").html(fecha.getDate() + "/" + (fecha.getMonth() + 1) + "/" + fecha.getUTCFullYear());
                $(".genero").html(genero);
                $(".director").html(pelicula.director);
                $(".duracion").html(pelicula.duracion);
                $(".rank").html(pelicula.puntuacion + "/10");
                var actores_string = '';
                for (i = 0; i < actores.length; i++) {
                    actores_string += actores[i].nombre + ", "
                }
                $(".actores").html(actores_string.slice(0, -2));
            },
            this.obtenerPelicula = function(id) {
                var self = this;
                $.getJSON(server + "/peliculas/" + id,
                    function(data) {
                        self.cargarDetalle(data);
                    }).fail(function() {
                    window.location.href = "error.html";
                });
            }

    }
})();