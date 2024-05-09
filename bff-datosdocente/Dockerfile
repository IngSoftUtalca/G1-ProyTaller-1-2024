FROM node:10-alpine
WORKDIR /app/bff-datosdocente/
COPY  ./bff-datosdocente/* /app/bff-datosdocente/
COPY ENDPOINTS.json ..
COPY ENPOINTS.json ..
RUN npm install
EXPOSE 3003
CMD node index.js