# ============================================================
# Practical 11: Frontend Multi-Stage Dockerfile
# Stage 1: Build the React application with Vite
# Stage 2: Serve using Vite preview with full dependency tree
# ============================================================

# ── Stage 1: Build Environment ──────────────────────────────
FROM node:20-alpine AS build

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install all dependencies (including Vite)
RUN npm install

# Copy application source code
COPY . .

# Build production bundle into /app/dist
RUN npm run build

# ── Stage 2: Production Runtime ─────────────────────────────
FROM node:20-alpine

WORKDIR /app

# Copy package manifests and dependencies from build stage
COPY package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY vite.config.js ./

# Expose Vite preview port
EXPOSE 5173

# Serve production assets on all interfaces (0.0.0.0) on port 5173
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "5173"]
