FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies (no lockfile is committed; legacy peer deps resolves the vite/tailwind peer range)
COPY package*.json ./
RUN npm install --no-audit --no-fund --legacy-peer-deps

# Copy source code and build
COPY . .
RUN npm run build

# Production stage: nginx serves the static build and proxies /api to the backend
FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
