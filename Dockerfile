# =========================
# Stage 1: Build
# =========================
FROM node:20-alpine AS builder

WORKDIR /app

# Install bun
RUN npm install -g bun

# Copy dependency files
COPY package.json bun.lockb* ./

# Install dependencies
RUN bun install

# Copy source code
COPY . .

# Build Next.js app
RUN bun run build


# =========================
# Stage 2: Production
# =========================
FROM node:20-alpine

WORKDIR /app
ENV NODE_ENV=production

# Install bun
RUN npm install -g bun

# Copy only required runtime files
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.* ./

EXPOSE 3000

# Start Next.js server
CMD ["bun", "run", "start"]
