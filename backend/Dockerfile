# Bước 1: Build stage
FROM node:18-alpine as builder

WORKDIR /app

# Cài OpenSSL untuk Prisma
RUN apk add --no-cache openssl

# Copy package files
COPY package.json ./

# Cài dependencies
RUN npm install

# Copy source code
COPY . .

# Generate Prisma client
RUN npm run prisma:generate

# ============================================

# Bước 2: Runtime stage (optimized image)
FROM node:18-alpine

WORKDIR /app

# Cài OpenSSL cho Prisma
RUN apk add --no-cache openssl

# Copy package files từ builder
COPY package.json ./
COPY --from=builder /app/node_modules ./node_modules

# Copy source code
COPY . .

# Expose port
EXPOSE 8000

# Start server
CMD ["npm", "start"]
