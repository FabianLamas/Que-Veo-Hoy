CREATE TABLE IF NOT EXISTS pelicula (
    id INT AUTO_INCREMENT,
    titulo VARCHAR(100) NOT NULL,
    duracion int(5) NOT NULL,
    director VARCHAR(400) NOT NULL,
    anio INT(5) NOT NULL,
    fecha_lanzamiento DATE NOT NULL,
    puntuacion int(2) NOT NULL,
    poster VARCHAR(300) NOT NULL,
    trama VARCHAR(700) NOT NULL,
    PRIMARY KEY (id)
)  ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS genero (
        id INT AUTO_INCREMENT,
        nombre VARCHAR(30) NOT NULL,
        PRIMARY KEY (id)
    )  ENGINE=INNODB;

    ALTER TABLE pelicula
    ADD genero_id INT;

CREATE TABLE IF NOT EXISTS actor (
        id INT AUTO_INCREMENT,
        nombre VARCHAR(30) NOT NULL,
        PRIMARY KEY (id)
    )  ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS actor_pelicula (
    id INT AUTO_INCREMENT,
    actor_id INT NOT NULL,
    pelicula_id INT NOT NULL,
    PRIMARY KEY (id)
)  ENGINE=INNODB;