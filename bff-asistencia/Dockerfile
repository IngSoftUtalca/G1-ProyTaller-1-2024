FROM node:10-alpine
WORKDIR /app/bff-asistencia/
COPY  ./bff-asistencia/* /app/bff-asistencia/
RUN npm install
EXPOSE 3000
CMD node index.js