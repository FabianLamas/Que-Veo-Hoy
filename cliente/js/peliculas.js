var servidor = 'http://localhost:8080';

$(document).ready(function() {
    $.getJSON(servidor + "/generos",
        function(data) {
            for (i = 0; i < data.generos.length; i++) {
                var opcion = $(".genero-select option[value='0']").clone();
                opcion.attr("value", (data.generos)[i].id);
                opcion.html((data.generos)[i].nombre);
                $(".genero-select").append(opcion);
            }
        });

    var controladorPeliculas = new ControladorPeliculas();
    $('.buscar').click(function() {
        $(".alerta-resultados").hide();
        controladorPeliculas.buscarPeliculas();
    });
    controladorPeliculas.buscarPeliculas();
});

function ControladorPeliculas() {
  
    this.buscarPeliculas = function(pagina, cantidad) {
            var self = this;
            var titulo = $(".titulo-busqueda").val();
            var genero = $(".genero-select option:selected").attr("value");
            var orden = $(".orden-select option:selected").attr("value");
            var anio = $(".anio-busqueda").val();
            
            var pagina_solicitada = (pagina) ? pagina : 1;
            var query_params = {
                pagina: pagina_solicitada
            };
            if (titulo) {
                query_params.titulo = titulo;
            }
            if (genero != 0) {
                query_params.genero = genero;
            }
            if (anio) {
                query_params.anio = anio;
            }

            query_params.cantidad = (cantidad) ? cantidad : 52;

            var orden_array = orden.split("-");
            query_params.columna_orden = orden_array[0];
            query_params.tipo_orden = orden_array[1];

            var query = $.param(query_params);

            $.getJSON(servidor + "/peliculas?" + query,
                function(data) {
                    self.cargarListado(data.peliculas);
                    self.cargarBotones(data.total);
                });
        },

        this.cargarListado = function(peliculas) {
            $(".contenedor-peliculas").empty();
            var self = this;
            var cantidad = peliculas.length;
            if (cantidad == 0) {
                $(".alerta-resultados").show();
            } else {
                for (i = 0; i < cantidad; i++) {
                    var pelicula = $(".ejemplo-pelicula").clone();
                    pelicula.find(".imagen").attr("src", peliculas[i].poster);
                    pelicula.find(".trama").html(peliculas[i].trama);
                    pelicula.find(".titulo").html(peliculas[i].titulo);
                    pelicula.attr("id", peliculas[i].id);
                    pelicula.click(function() {
                        window.location.href = "info.html?id=" + this.id;
                    });
                    pelicula.appendTo($(".contenedor-peliculas"));
                    pelicula.removeClass("ejemplo-pelicula");
                    pelicula.show();
                }

            }
        },
        this.cargarBotones = function(total) {
            var cantidad_por_pagina = 52;
            var self = this;
            cantidad_paginas = Math.ceil(total / cantidad_por_pagina);
            $(".btn-group").empty();
            for (i = 0; i < cantidad_paginas; i++) {
                var boton = $(".ejemplo-boton").clone();
                boton.html(i + 1);
                boton.attr("numero-pagina", i + 1);
                boton.appendTo($(".btn-group"));
                boton.removeClass("ejemplo-boton");
                boton.show();
            }
            $(".boton-pagina").click(function() {
                self.buscarPeliculas($(this).attr("numero-pagina"));
                scroll(0, 0);
            });
        }

}