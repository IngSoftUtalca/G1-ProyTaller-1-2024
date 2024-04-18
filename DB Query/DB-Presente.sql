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
    `RUT` text NOT NULL,
    `Nombre` text NOT NULL,
    `Campus` text NOT NULL,
    `Facultad` text NOT NULL,
    `Horario` Integer NOT NULL,
    PRIMARY KEY (`RUT`)
);

CREATE TABLE `Administrador` (
    `RUT` text NOT NULL,
    `Nombre` text NOT NULL,
    `Campus` text NOT NULL,
    `Facultad` text NOT NULL,
    PRIMARY KEY (`RUT`)
);

CREATE TABLE `Cargo` (
    `WebMaster` text NOT NULL,
    `Administrador` text NOT NULL,
    `Docente` text NOT NULL,
    PRIMARY KEY (`WebMaster`, `Administrador`, `Docente`)
);

CREATE TABLE `WebMaster` (
    `RUT` text NOT NULL,
    `Nombre` text NOT NULL,
    `Facultad` text NOT NULL,
    PRIMARY KEY (`RUT`)
);

CREATE TABLE `Periodo` (
    `ID` text NOT NULL,
    `FechaInicio` date NOT NULL,
    `FechaTermino` date NOT NULL,
    `IDFeriados` INTEGER NOT NULL,
    PRIMARY KEY (`ID`)
);

CREATE TABLE `Dia_Libre` (
    `Dia` date NOT NULL,
    `ID_periodo` text NOT NULL,
    PRIMARY KEY (`Dia`)
);

CREATE TABLE `Ramo` (
    `Nombre` text NOT NULL,
    `Periodo` text NOT NULL,
    PRIMARY KEY (`Nombre`, `Periodo`)
);

CREATE TABLE `Bloque` (
    `ID` integer NOT NULL,
    `Inicio` text NOT NULL,
    `Termino` text NOT NULL,
    PRIMARY KEY (`ID`)
);

CREATE TABLE `Sala` (
    `ID` text NOT NULL,
    `Latitud` text NOT NULL,
    `Longitud` text NOT NULL,
    PRIMARY KEY (`ID`)
);

CREATE TABLE `Clase` (
    `Dia` date NOT NULL,
    `Hora_inicio` text NOT NULL,
    `Hora_termino` text NOT NULL,
    `IP` text NOT NULL,
    `Estado` text NOT NULL,
    `Fecha_Justificacion` date NOT NULL,
    `Hora_Justificacion` text NOT NULL,
    PRIMARY KEY (`Dia`, `Hora_inicio`, `Hora_termino`)
);

CREATE TABLE `Justificacion` (
    `Fecha` date NOT NULL,
    `Hora` text NOT NULL,
    `Detalle` text NOT NULL,
    PRIMARY KEY (`Fecha`, `Hora`)
);

CREATE TABLE `Error` (
    `ID` integer NOT NULL,
    `Razon` text NOT NULL,
    PRIMARY KEY (`ID`)
);

CREATE TABLE `Asignacion` (
    `RUT_Docente` text NOT NULL,
    `Nombre_Ramo` text NOT NULL,
    `Periodo_Ramo` text NOT NULL,
    PRIMARY KEY (`RUT_Docente`, `Nombre_Ramo`, `Periodo_Ramo`)
);

CREATE TABLE `Instancia` (
    `Sala` text NOT NULL,
    `Bloque` integer NOT NULL,
    `Dia_Semana` text NOT NULL,
    `Ramo` text NOT NULL,
    PRIMARY KEY (`Sala`, `Bloque`, `Dia_Semana`)
);

CREATE TABLE `Horario` (
    `ID` integer NOT NULL,
    `Estado` text NOT NULL,
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