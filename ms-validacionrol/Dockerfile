FROM node:10-alpine
WORKDIR /app/ms-validacionrol/
COPY  ./ms-validacionrol/* /app/ms-validacionrol/
COPY ENDPOINTS.json ..
COPY ENPOINTS.json ..
RUN npm install
EXPOSE 3011
CMD node index.js