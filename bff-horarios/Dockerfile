FROM node:10-alpine
WORKDIR /app/bff-horarios/
COPY  ./bff-horarios/* /app/bff-horarios/
RUN npm install
EXPOSE 3004
CMD node index.js