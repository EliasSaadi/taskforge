# Étape 1 : Node build
FROM node:20-slim AS builder

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .

# Étape 2 : Dev server
FROM node:20-slim
WORKDIR /app
COPY --from=builder /app ./

EXPOSE 3000
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
