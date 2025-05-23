FROM node:20-slim AS builder

WORKDIR /workspace


# Install pnpm globally
RUN npm install -g pnpm

# Install required system dependencies
RUN apt-get update && apt-get install -y openssl protobuf-compiler

# Copy necessary files for building the app
COPY package.json pnpm-lock.yaml ./
COPY nx.json ./
COPY tsconfig*.json ./
COPY jest.config.ts ./
COPY jest.preset.js ./
COPY eslint.config.mjs ./
COPY webpack.*.config.js ./
COPY pnpm-workspace.yaml ./

# Copy the notification-service and shared libraries
COPY apps/notification-service ./apps/notification-service
COPY libs/common ./libs/common
COPY libs/grpc ./libs/grpc
COPY libs/nestjs ./libs/nestjs

# Install dependencies using pnpm
RUN pnpm install

# Build the app
RUN pnpm nx build notification-service

# Runner Stage
FROM node:20-slim AS runner

# Install required system dependencies
RUN apt-get update && apt-get install -y openssl

WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy necessary files
COPY --from=builder /workspace/package.json ./
COPY --from=builder /workspace/pnpm-lock.yaml ./
COPY --from=builder /workspace/pnpm-workspace.yaml ./
COPY --from=builder /workspace/apps/notification-service/package.json ./apps/notification-service/package.json
COPY --from=builder /workspace/libs/grpc/package.json ./libs/grpc/package.json

ENV NODE_ENV=production
# Install production dependencies using pnpm
RUN pnpm install --frozen-lockfile

COPY --from=builder /workspace/dist ./dist


# Run the application
CMD ["node", "dist/apps/notification-service/main"]
