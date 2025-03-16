# Stage 1: Build the application
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# # Install build dependencies (if needed)
# RUN apk add --no-cache python3 make g++

# Copy package.json and package-lock.json first for better caching
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the entire application source
COPY . .

# # Build the application (if necessary)
# RUN npm run build

# Stage 2: Production-ready image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install only production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy built application from the builder stage
COPY --from=builder /app ./
# COPY --from=builder /app/node_modules ./node_modules
# Expose the application port (change as needed)
EXPOSE 4000

# Set environment variable
ENV NODE_ENV=production

# Start the application
CMD ["node", "server.js"]
