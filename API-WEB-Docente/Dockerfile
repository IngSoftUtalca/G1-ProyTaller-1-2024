FROM php:7.1.23-apache
WORKDIR /app/API-WEB-Docente/
COPY  ./API-WEB-Docente/* /app/API-WEB-Docente/
COPY ENPOINTS.json ..
EXPOSE 3016
CMD ["php", "-S", "0.0.0.0:3016"]