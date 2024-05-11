FROM php:7.1.23-apache
WORKDIR /app/API-MAIN-Docente/
COPY  ./API-MAIN-Docente/* /app/API-MAIN-Docente/
COPY ENPOINTS.json ..
EXPOSE 3014
CMD ["php", "-S", "0.0.0.0:3014"]