FROM node:10-alpine
WORKDIR /app/ms-gestoradmin/
COPY  ./ms-gestoradmin/* /app/ms-gestoradmin/
COPY ENDPOINTS.json ..
COPY ENPOINTS.json ..
RUN npm install
EXPOSE 3006
CMD node index.js