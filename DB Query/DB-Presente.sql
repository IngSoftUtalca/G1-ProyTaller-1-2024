SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `Docente`;
DROP TABLE IF EXISTS `Administrador`;
DROP TABLE IF EXISTS `Cargo`;
DROP TABLE IF EXISTS `WebMaster`;
DROP TABLE IF EXISTS `Periodo`;
DROP TABLE IF EXISTS `Dia_Libre`;
DROP TABLE IF EXISTS `Ramo`;
DROP TABLE IF EXISTS `Bloque`;
DROP TABLE IF EXISTS `Sala`;
DROP TABLE IF EXISTS `Clase`;
DROP TABLE IF EXISTS `Justificacion`;
DROP TABLE IF EXISTS `Error`;
DROP TABLE IF EXISTS `Asignacion`;
DROP TABLE IF EXISTS `Instancia`;
DROP TABLE IF EXISTS `Horario`;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE `Docente` (
    `RUT` VARCHAR(255) NOT NULL,
    `Nombre` VARCHAR(255) NOT NULL,
    `Campus` VARCHAR(255) NOT NULL,
    `Facultad` VARCHAR(255) NOT NULL,
    `Horario` INTEGER NOT NULL,
    PRIMARY KEY (`RUT`)
);

CREATE TABLE `Administrador` (
    `RUT` VARCHAR(255) NOT NULL,
    `Nombre` VARCHAR(255) NOT NULL,
    `Campus` VARCHAR(255) NOT NULL,
    `Facultad` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`RUT`)
);

CREATE TABLE `Cargo` (
    `WebMaster` VARCHAR(255) NOT NULL,
    `Administrador` VARCHAR(255) NOT NULL,
    `Docente` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`WebMaster`, `Administrador`, `Docente`)
);

CREATE TABLE `WebMaster` (
    `RUT` VARCHAR(255) NOT NULL,
    `Nombre` VARCHAR(255) NOT NULL,
    `Facultad` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`RUT`)
);

CREATE TABLE `Periodo` (
    `ID` INTEGER NOT NULL,
    `FechaInicio` date NOT NULL,
    `FechaTermino` date NOT NULL,
    `IDFeriados` INTEGER NOT NULL,
    PRIMARY KEY (`ID`)
);

CREATE TABLE `Dia_Libre` (
    `Dia` date NOT NULL,
    `ID_periodo` INTEGER NOT NULL,
    PRIMARY KEY (`Dia`)
);

CREATE TABLE `Ramo` (
    `Nombre` VARCHAR(255) NOT NULL,
    `Periodo` INTEGER NOT NULL,
    PRIMARY KEY (`Nombre`, `Periodo`)
);

CREATE TABLE `Bloque` (
    `ID` integer NOT NULL,
    `Inicio` VARCHAR(255) NOT NULL,
    `Termino` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`ID`)
);

CREATE TABLE `Sala` (
    `ID` VARCHAR(255) NOT NULL,
    `Latitud` VARCHAR(255) NOT NULL,
    `Longitud` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`ID`)
);

CREATE TABLE `Clase` (
    `Dia` date NOT NULL,
    `Hora_inicio` VARCHAR(255) NOT NULL,
    `Hora_termino` VARCHAR(255) NOT NULL,
    `IP` VARCHAR(255) NOT NULL,
    `Estado` VARCHAR(255) NOT NULL,
    `Fecha_Justificacion` date NOT NULL,
    `Hora_Justificacion` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`Dia`, `Hora_inicio`, `Hora_termino`)
);

CREATE TABLE `Justificacion` (
    `Fecha` date NOT NULL,
    `Hora` VARCHAR(255) NOT NULL,
    `Detalle` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`Fecha`, `Hora`)
);

CREATE TABLE `Error` (
    `ID` integer NOT NULL AUTO_INCREMENT,
    `Razon` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`ID`)
);

CREATE TABLE `Asignacion` (
    `RUT_Docente` VARCHAR(255) NOT NULL,
    `Nombre_Ramo` VARCHAR(255) NOT NULL,
    `Periodo_Ramo` INTEGER NOT NULL,
    PRIMARY KEY (`RUT_Docente`, `Nombre_Ramo`, `Periodo_Ramo`)
);

CREATE TABLE `Instancia` (
    `Sala` VARCHAR(255) NOT NULL,
    `Bloque` integer NOT NULL,
    `Dia_Semana` VARCHAR(255) NOT NULL,
    `Ramo` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`Sala`, `Bloque`, `Dia_Semana`)
);

CREATE TABLE `Horario` (
    `ID` integer NOT NULL AUTO_INCREMENT,
    `Estado` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`ID`)
);

ALTER TABLE `Docente` ADD FOREIGN KEY (`Horario`) REFERENCES `Horario`(`ID`);
ALTER TABLE `Cargo` ADD FOREIGN KEY (`Docente`) REFERENCES `Docente`(`RUT`);
ALTER TABLE `Cargo` ADD FOREIGN KEY (`Administrador`) REFERENCES `Administrador`(`RUT`);
ALTER TABLE `Cargo` ADD FOREIGN KEY (`WebMaster`) REFERENCES `WebMaster`(`RUT`);
ALTER TABLE `Dia_Libre` ADD FOREIGN KEY (`ID_periodo`) REFERENCES `Periodo`(`ID`);
ALTER TABLE `Ramo` ADD FOREIGN KEY (`Periodo`) REFERENCES `Periodo`(`ID`);
ALTER TABLE `Clase` ADD FOREIGN KEY (`Fecha_Justificacion`, `Hora_Justificacion`) REFERENCES `Justificacion`(`Fecha`,`Hora`);
ALTER TABLE `Asignacion` ADD FOREIGN KEY (`RUT_Docente`) REFERENCES `Docente`(`RUT`);
ALTER TABLE `Asignacion` ADD FOREIGN KEY (`Nombre_Ramo`) REFERENCES `Ramo`(`Nombre`);
ALTER TABLE `Asignacion` ADD FOREIGN KEY (`Periodo_Ramo`) REFERENCES `Ramo`(`Periodo`);
ALTER TABLE `Instancia` ADD FOREIGN KEY (`Sala`) REFERENCES `Sala`(`ID`);
ALTER TABLE `Instancia` ADD FOREIGN KEY (`Bloque`) REFERENCES `Bloque`(`ID`);
ALTER TABLE `Instancia` ADD FOREIGN KEY (`Ramo`) REFERENCES `Ramo`(`Nombre`);