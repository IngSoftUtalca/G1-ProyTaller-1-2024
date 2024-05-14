FROM node:10-alpine
WORKDIR /app/ms-gestordocente/
COPY  ./ms-gestordocente/* /app/ms-gestordocente/
COPY ENDPOINTS.json ..
COPY ENPOINTS.json ..
RUN npm install
EXPOSE 3008
CMD node index.js