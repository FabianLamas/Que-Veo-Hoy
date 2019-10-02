var servidor = 'http://localhost:8080';
$(document).ready(function() {
    var controladorRecomendaciones = new ControladorRecomendaciones();
    controladorRecomendaciones.inicializarPreguntas();
});

function ControladorRecomendaciones() {
    this.genero = '';
    this.anio_inicio;
    this.anio_fin;
    this.resultados;
    this.puntuacion;
    this.pelicula_actual;

    this.inicializarPreguntas = function() {
        var self = this;
        $(".paso-1").show();

        $(".paso-1 .boton-estreno").click(function() {
            self.anio_inicio = 2005;
            self.anio_fin = 2020;
            self.cargarSegundaPregunta();
        });

        $(".paso-1 .boton-bien-puntuada").click(function() {
            self.puntuacion = 7;
            self.cargarSegundaPregunta();
        });

        $(".paso-1 .boton-clasico").click(function() {
            self.anio_inicio = 1900;
            self.anio_fin = 2005;
            self.cargarSegundaPregunta();
        });

        $(".paso-1 .boton-cualquiera").click(function() {
            self.cargarSegundaPregunta();
        });

        $(".paso-1 .btn-film").click(function() {
            $(".paso-1 .btn-film").removeClass('active');
            $(".paso-1 .btn-film").css('opacity', '.3');
            $(this).addClass('active');
        });

        $(".paso-2-links .pregunta").click(function() {
            self.genero = $(this).attr("genero");
            self.pedirRecomendacion();
        });

        $('.paso-2 select').change(function() {
            self.genero = $(this).attr("genero");
            self.pedirRecomendacion();
        });

        $(".botones-resultado .ver-mas").click(function() {
            var id = (self.pelicula_actual).id;
            window.location.href = "info.html?id=" + id;
            console.log(id);
        });

        $(".botones-resultado .otra-opcion").click(function() {
            self.seleccionarPelicula();
        });

        $(".botones-resultado .reiniciar, .datos-pelicula-info a.close").click(function() {
            self.reiniciarRecomendacion();
            $(".header-title h1").removeClass('small');
        });

        $(".alerta-recomendacion .alert-link").click(function() {
            self.reiniciarRecomendacion();
            $(".alerta-recomendacion").hide();
            $(".header-title h1").removeClass('small');
        });
    }

    this.cargarSegundaPregunta = function() {
        $(".paso-2").addClass('active');
        $(".paso-2-links").addClass('active');
    }

    this.pedirRecomendacion = function() {

        var self = this;

        var query_params = {};

        if (this.genero)
            query_params.genero = this.genero;

        if (this.anio_inicio)
            query_params.anio_inicio = this.anio_inicio;

        if (this.anio_fin)
            query_params.anio_fin = this.anio_fin;

        if (this.puntuacion)
            query_params.puntuacion = this.puntuacion;

        if (Object.keys(query_params).length !== 0) {
            var query = $.param(query_params);
            var ruta = "/peliculas/recomendacion?"
        } else {
            var ruta = "/peliculas/recomendacion";
            var query = "";
        }

        $.getJSON(servidor + ruta + query,
            function(data) {
                var peliculas_desordenadas = self.desordenarArray(data.peliculas);
                self.resultados = peliculas_desordenadas;
                self.seleccionarPelicula();
            });

    }

    this.seleccionarPelicula = function() {
        var cantidad = this.resultados.length;
        if (cantidad === 0) {
            this.noHayResultados("No se encontró ninguna película para recomendar");
        } else {
            var pelicula_mostrar = this.resultados[0];
            this.resultados.shift();
            this.pelicula_actual = pelicula_mostrar;
            this.mostrarPelicula(pelicula_mostrar);
        }
    }

    this.mostrarPelicula = function(data) {
        $(".pregunta").hide();
        $(".header-title h1").addClass('small');
        $(".datos-pelicula").show();
        $(".datos-pelicula .imagen").attr("src", data.poster);
        $(".datos-pelicula .trama").html(data.trama);
        $(".datos-pelicula .titulo").html(data.titulo);
        $(".datos-pelicula .genero").html(data.nombre);

    }

    this.noHayResultados = function(mensaje) {
        $(".datos-pelicula").hide();
        $(".alerta-recomendacion").show();

    }

    this.reiniciarRecomendacion = function(mensaje) {
            this.resultados = [];
            this.anio_fin = "";
            this.anio_inicio = "";
            this.genero = "";
            this.puntuacion = "";
            $(".datos-pelicula").hide();
            $(".paso-1, .pregunta").show();
        }
    this.desordenarArray = function(array) {

        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;

    }

}