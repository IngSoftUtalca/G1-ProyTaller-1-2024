FROM node:10-alpine
WORKDIR /app/ms-registrohorarios/
COPY  ./ms-registrohorarios/* /app/ms-registrohorarios/
COPY ENDPOINTS.json ..
COPY ENPOINTS.json ..
RUN npm install
EXPOSE 3010
CMD node index.js