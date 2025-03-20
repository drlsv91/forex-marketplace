FROM node:18-slim AS builder

WORKDIR /workspace

# Install required system dependencies
RUN apt-get update && apt-get install -y openssl protobuf-compiler

# Install pnpm globally
RUN npm install -g pnpm

# Copy necessary files for building the app
COPY package.json pnpm-lock.yaml ./
COPY nx.json ./
COPY tsconfig*.json ./
COPY jest.config.ts ./
COPY jest.preset.js ./
COPY .eslintrc.json ./
COPY webpack.*.config.js ./

# Copy the user-auth-service and shared libraries
COPY apps/user-auth-service ./apps/user-auth-service
COPY libs ./libs
COPY types ./types
COPY proto ./proto

# Install dependencies using pnpm
RUN pnpm install --frozen-lockfile

# Build the app
RUN pnpm build user-auth-service

# Runner Stage
FROM node:18-slim AS runner

# Install required system dependencies
RUN apt-get update && apt-get install -y openssl

WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy necessary files
COPY --from=builder /workspace/package.json ./
COPY --from=builder /workspace/pnpm-lock.yaml ./
COPY --from=builder /workspace/apps/user-auth-service/package.json ./apps/user-auth-service/package.json
COPY --from=builder /workspace/libs/package.json ./libs/package.json
COPY --from=builder /workspace/types/package.json ./types/package.json
COPY --from=builder /workspace/proto/package.json ./proto/package.json

# Set production environment
ENV NODE_ENV=production

# Install production dependencies using pnpm
RUN pnpm install --prod --frozen-lockfile

# Copy build output and other files
COPY --from=builder /workspace/dist ./dist
COPY --from=builder /workspace/libs ./libs
COPY --from=builder /workspace/types ./types
COPY --from=builder /workspace/proto ./proto

# Expose the port the app runs on
EXPOSE 3000

# Run the application
CMD ["node", "dist/apps/user-auth-service/main"]
