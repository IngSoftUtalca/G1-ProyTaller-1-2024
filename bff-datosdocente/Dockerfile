FROM node:10-alpine
WORKDIR /app/bff-datosdocente/
COPY  ./bff-datosdocente/* /app/bff-datosdocente/
RUN npm install
EXPOSE 3003
CMD node index.js