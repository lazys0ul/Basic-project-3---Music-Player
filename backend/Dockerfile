# Backend Dockerfile
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Create uploads directory
RUN mkdir -p uploads

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S resona -u 1001

# Change ownership
RUN chown -R resona:nodejs /app
USER resona

EXPOSE 5000

CMD ["node", "server.js"]
