# ============================================================
# Practical 11: Backend Dockerfile
# ============================================================
FROM node:20-alpine

# Set working directory inside container
WORKDIR /app

# Copy dependency definitions
COPY package*.json ./

# Install dependencies inside the container environment
RUN npm install

# Copy application source code
COPY . .

# Expose backend port
EXPOSE 5000

# Start Express server
CMD ["node", "server.js"]
