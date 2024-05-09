FROM node:10-alpine
WORKDIR /app/ms-verificaciongps/
COPY  ./ms-verificaciongps/* /app/ms-verificaciongps/
COPY ENDPOINTS.json ..
COPY ENPOINTS.json ..
RUN npm install
EXPOSE 3012
CMD node index.js