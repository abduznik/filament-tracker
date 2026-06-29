# Build stage
FROM node:20-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ARG VITE_USE_SQLITE=true
ENV VITE_USE_SQLITE=$VITE_USE_SQLITE
RUN npm run build

# Production stage
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
# Install only production dependencies
RUN npm install --omit=dev
# Copy pre-compiled better-sqlite3 from build stage (avoids native build tools in prod)
COPY --from=build-stage /app/node_modules/better-sqlite3 ./node_modules/better-sqlite3

COPY --from=build-stage /app/dist ./dist
COPY server.js ./

# Create data directory for volume
RUN mkdir data

# Set default port to 8082 to avoid conflicts (8080 is taken by qbittorrent)
ENV PORT=8082
EXPOSE 8082

CMD ["node", "server.js"]