# Practical 11: Containerization with Docker and Docker Compose

## Course Objectives & Mapping
- **Practical:** 11
- **CO / PO:** CO5 / PO3, PO5
- **Objective:** Containerize the full-stack application using Docker and orchestrate services using Docker Compose.

---

## Architecture Flow

```
                      docker-compose.yml
 ┌──────────────────────────────────────────────────────────────┐
 │                      app-network (bridge)                    │
 │                                                              │
 │   ┌─────────────────┐       ┌─────────────────┐              │
 │   │ task-frontend   │       │ task-backend    │              │
 │   │ (React 19 Vite) │ ───►  │ (Node/Express)  │ ───► mongodb │
 │   │ Port: 5173      │       │ Port: 5000      │      Port:   │
 │   └─────────────────┘       └─────────────────┘      27017   │
 │            ▲                         ▲                 ▲     │
 └────────────┼─────────────────────────┼─────────────────┼─────┘
              │                         │                 │
              │ (Host Port: 5173)       │ (Host: 5000)    │ (Host: 27017)
              │                         │                 ▼
        Browser Client            API Tools /      mongo-data
        (http://localhost:5173)    Postman        (Named Volume)
```

- **Network:** Isolated internal bridge network (`app-network`) allowing DNS service name resolution (e.g., `mongodb://mongodb:27017/taskmanager`).
- **Persistence:** Named volume `mongo-data` mapped to `/data/db` ensures all task and user data survives container destruction and restarts.
- **Orchestration:** Entire stack starts with a single command: `docker-compose up --build`.

---

## Configuration Files

### 1. Root Orchestrator (`docker-compose.yml`)
```yaml
services:
  mongodb:
    image: mongo:latest
    container_name: mongodb
    restart: unless-stopped
    ports:
      - "27017:27017"
    environment:
      - MONGO_INITDB_DATABASE=taskmanager
    volumes:
      - mongo-data:/data/db
    networks:
      - app-network

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: task-backend
    restart: unless-stopped
    ports:
      - "5000:5000"
    environment:
      - PORT=5000
      - MONGO_URI=mongodb://mongodb:27017/taskmanager
      - JWT_SECRET=supersecretjwtsecretkey_practical7_2026
    depends_on:
      - mongodb
    networks:
      - app-network

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: task-frontend
    restart: unless-stopped
    ports:
      - "5173:5173"
    depends_on:
      - backend
    networks:
      - app-network

volumes:
  mongo-data:
    driver: local

networks:
  app-network:
    driver: bridge
```

### 2. Backend Containerfile (`backend/Dockerfile`)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["node", "server.js"]
```

### 3. Frontend Multi-Stage Containerfile (`frontend/Dockerfile`)
```dockerfile
# Stage 1: Build production React assets
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve using lean runtime
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY --from=build /app/dist ./dist
COPY vite.config.js ./
EXPOSE 5173
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "5173"]
```

### 4. Build Context Exclusions (`.dockerignore`)
Both `backend/.dockerignore` and `frontend/.dockerignore` prevent host files from contaminating container images:
```text
node_modules
dist
npm-debug.log
.env
.git
.gitignore
```

---

## Key Questions & Analysis

### Q1: Why does the backend container need to reference the MongoDB container by its service name (`mongodb`) rather than `localhost`?
**Answer:**
In Docker, each container operates in its own isolated network namespace with its own loopback interface (`localhost` / `127.0.0.1`). If the backend container attempts to connect to `localhost:27017`, it looks for MongoDB running *inside the backend container itself*, which does not exist and fails with a connection error.

When containers share a Docker user-defined bridge network (e.g., `app-network`), Docker provides an automatic **embedded DNS server** (127.0.0.11). It resolves service names specified in `docker-compose.yml` (like `mongodb`) to the actual internal IP address dynamically assigned to that container. Therefore, `mongodb://mongodb:27017/taskmanager` enables reliable inter-container communication.

---

### Q2: What is the difference between `EXPOSE` in a Dockerfile and the `ports` mapping in `docker-compose.yml`?
**Answer:**
| Feature | `EXPOSE` (Dockerfile) | `ports` Mapping (docker-compose.yml) |
|---|---|---|
| **Purpose** | Documentation & Metadata | Host-to-Container Network Port Forwarding |
| **Host Access** | Does **NOT** publish the port to the host machine. Ports are not accessible from the outside. | Actively maps `<Host_Port>:<Container_Port>` (e.g. `5000:5000`). |
| **Internal Access** | Informs other containers on the same network that the service listens on that port. | Allows external host traffic (browser, Postman) to enter the container. |
| **Analogy** | Like putting a sign on a door saying "Door opens to room 5000". | Like unlocking the front gate and building a pathway directly from the street into room 5000. |

---

### Q3: Why is it considered bad practice to copy `node_modules` into a Docker image instead of running `npm install` inside the container?
**Answer:**
1. **Platform Architecture Incompatibilities (Binary Native Addons):** Node packages that rely on native C/C++ bindings (such as `bcrypt`) compile binary shared objects during installation based on the host OS and architecture (e.g., Windows x64 `win32`). If host `node_modules` is copied into a Linux-based Alpine container (`linux-musl`), the binaries will fail to load at runtime with `invalid ELF header` errors.
2. **Massive Build Context Bloat:** `node_modules` contains thousands of nested files, which drastically slows down the `Sending build context to Docker daemon` transfer phase.
3. **Reproducibility & Stale Cache:** Running `npm install` (or `npm ci`) inside the container ensures clean, deterministic dependencies matching `package-lock.json` in the exact Linux runtime environment.

---

## Supplementary Problems Addressed

1. **`.dockerignore` Optimization:** Added `.dockerignore` files to both frontend and backend to omit `node_modules`, `dist/`, `.git/`, and sensitive `.env` secrets from the Docker image layers.
2. **Multi-Stage Build for React Frontend:** Separated build tooling (`@vitejs/plugin-react`, `vite`, `eslint`) in Stage 1 from the lightweight production runtime in Stage 2, significantly slashing the final image size and reducing attack surface.
3. **Named Volume Persistence:** Configured `mongo-data:/data/db` under Docker Compose volumes. Even when running `docker-compose down` and removing containers, task and user records are preserved in host storage and immediately restored on `docker-compose up`.

---

## Verification Commands

1. **Check Docker CLI:**
   ```bash
   docker --version
   docker compose version
   ```
2. **Build and Launch Stack:**
   ```bash
   docker-compose up --build
   ```
3. **Verify Running Containers:**
   ```bash
   docker ps
   ```
   *Expected output:* Three running containers (`task-frontend`, `task-backend`, `mongodb`) with healthy status and ports `5173`, `5000`, `27017` mapped.
4. **Access the App:**
   - Frontend UI: `http://localhost:5173`
   - Backend API Health: `http://localhost:5000/api/health`
