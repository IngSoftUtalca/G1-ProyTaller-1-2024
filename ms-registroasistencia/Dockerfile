FROM node:10-alpine
WORKDIR /app/ms-registroasistencia/
COPY  ./ms-registroasistencia/* /app/ms-registroasistencia/
RUN npm install
EXPOSE 3009
CMD node index.js