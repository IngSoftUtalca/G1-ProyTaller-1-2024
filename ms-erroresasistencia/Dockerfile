FROM node:10-alpine
WORKDIR /app/ms-erroresasistencia/
COPY  ./ms-erroresasistencia/* /app/ms-erroresasistencia/
COPY ENDPOINTS.json ..
COPY ENPOINTS.json ..
RUN npm install
EXPOSE 3005
CMD node index.js