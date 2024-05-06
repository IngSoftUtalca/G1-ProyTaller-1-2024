FROM node:10-alpine
WORKDIR /app/bff-datosasistencia/
COPY  ./bff-datosasistencia/* /app/bff-datosasistencia/
RUN npm install
EXPOSE 3002
CMD node index.js