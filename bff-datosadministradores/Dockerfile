FROM node:10-alpine
WORKDIR /app/bff-datosadministradores/
COPY  ./bff-datosadministradores/* /app/bff-datosadministradores/
COPY ENDPOINTS.json ..
COPY ENPOINTS.json ..
RUN npm install
EXPOSE 3001
CMD node index.js