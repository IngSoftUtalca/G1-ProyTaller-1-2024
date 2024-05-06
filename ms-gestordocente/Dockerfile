FROM node:10-alpine
WORKDIR /app/ms-gestordocente/
COPY  ./ms-gestordocente/* /app/ms-gestordocente/
RUN npm install
EXPOSE 3008
CMD node index.js