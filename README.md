# Presente (Aplicación para la gestión de asistencias docente)

## Descripción
Presente es una aplicación web que permite llevar un registro de asistencias de docentes en una institución educativa. La aplicación permite a los docentes registrar sus asistencias, visualizar su historial de asistencias y visualizar un reporte de asistencias. Además, permite a los administradores gestionar los docentes, gestionar las asistencias y visualizar un reporte de asistencias.

## Tecnologías
- Frontend: Vue 3
- Backend: Node.js
- Base de datos: MySQL

## Instalación
1. Clonar el repositorio
```bash
git clone https://github.com/IngSoftUtalca/G1-ProyTaller-1-2024.git
```
2. Instalar las dependencias del frontend
```bash
cd mainpage
npm install
cd ../webdocente
npm install
```
3. Instalar las dependencias del backend
El script `npmi.sh` permite instalar las dependencias del backend en un entorno Linux. Para ejecutarlo, se debe dar permisos de ejecución al script y luego ejecutarlo.
```bash
npmi.sh
```
4. Crear la base de datos (Opcional)
En la carpeta `DB Query` se encuentran los scripts para crear la base de datos y las tablas. Para ejecutarlos, se debe abrir un cliente de MySQL y ejecutar los scripts. De todas maneras ya existe una base de datos creada que se puede utilizar. En el archivo `Diagramas` se encuentra el diagrama de la base de datos y la logica de la aplicación. De crear una base de datos debe cambiar las credenciales en el archivo `ENPOINTS.JS`

5. correr el backend
El script `run.sh` permite correr el backend en un entorno Linux. Para ejecutarlo, se debe dar permisos de ejecución al script y luego ejecutarlo.
```bash
run.sh
```
6. construir el frontend
```bash
cd mainpage
npm run build --prod
cd ../webdocente
npm run build --prod
```
7. correr el frontend (desarrollo)
```bash
cd mainpage
npm run serve
cd ../webdocente
npm run serve
```
8. correr el frontend (producción)
para esto se necesita un servicio de hosting como apache o nginx y copiar los archivos de la carpeta dist a la carpeta de despliegue del servidor.

Si desea cerrar todos los servicios el archivo `kill.sh` permite detener el backend en un entorno Linux. Para ejecutarlo, se debe dar permisos de ejecución al script y luego ejecutarlo.
```bash
kill.sh
```

Esta es la configuración básica para correr la aplicación. Si desea la usada durante el semestre, necesita utilizar herramientas como cloud run la cual tiene un costo asociado, mediante el docker-compose se puede construir los micro servicios para cloud run, de igual manera esta es una alternativa apra correrla en un entorno local, pero se necesita tener instalado docker y docker-compose, nosotros usamos un host en firebase para el frontend y un host en cloud run para el backend. para mas información contactar al stuff del proyecto.

## Equipo de desarrollo
- [Luis Silvestre](mailto:lsilvestre@utalca.cl) (Product Owner)
- [Nicolás Lopez](mailto:nilopez19@alumnos.utalca.cl) (Scrum Master / QA)
- [Diego Fernández](mailto:dfernandez19@alumnos.utalca.cl) (Technical Leader / architect)
- [Claudio Henriquez](mailto:chenriquez17@alumnos.utalca.cl) (DebOps / cloud manager)
- [Maximiliano Maure](mailto:mmaure19@allumnos.utalca.cl) (Developer Full Stack)
- [Rafael Gonzalez](mailto:rgonzalez19@alumnos.utalca.cl) (Developer Full Stack)
- [Victor Cornejo](mailto:vcornejo19@alumnos.utalca.cl) (Developer Full Stack)