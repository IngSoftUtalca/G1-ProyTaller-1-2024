FROM node:10-alpine
WORKDIR /app/bff-horarios/
COPY  ./bff-horarios/* /app/bff-horarios/
COPY ENDPOINTS.json ..
COPY ENPOINTS.json ..
RUN npm install
EXPOSE 3004
CMD node index.js