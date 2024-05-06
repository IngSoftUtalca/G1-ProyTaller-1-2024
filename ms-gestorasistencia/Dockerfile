FROM node:10-alpine
WORKDIR /app/ms-gestorasistencia/
COPY  ./ms-gestorasistencia/* /app/ms-gestorasistencia/
RUN npm install
EXPOSE 3007
CMD node index.js