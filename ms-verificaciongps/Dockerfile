FROM node:10-alpine
WORKDIR /app/ms-verificaciongps/
COPY  ./ms-verificaciongps/* /app/ms-verificaciongps/
RUN npm install
EXPOSE 3012
CMD node index.js