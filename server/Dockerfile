FROM node:18-alpine
WORKDIR /app
RUN npm init -y && npm install express pg cors
COPY index.js .
EXPOSE 3000
CMD ["node", "index.js"]
