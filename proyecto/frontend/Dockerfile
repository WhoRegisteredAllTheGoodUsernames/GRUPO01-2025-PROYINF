FROM node:18-alpine

WORKDIR /app/frontend

COPY package*.json ./
RUN npm install

COPY . .

# Instalar wait-port globalmente
RUN npm install -g wait-port

# Comando modificado para esperar a PostgreSQL
CMD ["sh", "-c", "wait-port backend:3000 & npm start"]
