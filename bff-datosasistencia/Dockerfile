FROM node:10-alpine
WORKDIR /app/bff-datosasistencia/
COPY  ./bff-datosasistencia/* /app/bff-datosasistencia/
COPY ENDPOINTS.json ..
COPY ENPOINTS.json ..
RUN npm install
EXPOSE 3002
CMD node index.js