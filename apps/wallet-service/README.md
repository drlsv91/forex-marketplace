# Wallet Service

The Wallet Service manages user wallets, balances, and transactions.

## Features

- Check wallet balance.
- Perform wallet transactions (credit/debit).

## Setup

### Prerequisites

- Node.js (v18+)
- PostgreSQL
- pnpm
- Docker

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/drlsv91/forex-marketplace.git
   ```
2. Navigate to the wallet-service directory:
   ```bash
   cd apps/wallet-service
   ```
3. Install dependencies:

   ```bash
   pnpm install
   ```

4. Set up environment variables:
   Create a .env file in the root of the wallet-service directory with the following content:

## For Docker Deployment:

```bash
DATABASE_URL=postgres://postgres:forex_password@postgres:5432/forex_marketplace?schema=public
  PORT=3001
  RABBITMQ_URI=amqp://rabbitmq:5672
  REDIS_HOST=redis
  REDIS_PORT=6379
  AUTH_GRPC_URL=user-auth-service:50051
  WALLET_GRPC_URL=wallet-service:50052
```

## For Local Development:

```bash
DATABASE_URL=postgres://postgres:forex_password@localhost:5432/forex_marketplace?schema=public
  PORT=3001
  RABBITMQ_URI=amqp://localhost:5672
  REDIS_HOST=localhost
  REDIS_PORT=6379
  AUTH_GRPC_URL=localhost:50051
  WALLET_GRPC_URL=localhost:50052
```

## Running the Service

1. Start the service:

```bash
  nx serve wallet-service
```

2. The service will be available at http://localhost:3001.

## Testing

```bash
  nx test wallet-service
```

## Docker

To run the service in a Docker container:

```bash
  docker-compose up wallet-service
```

## Swagger Documentation:

Once the service is running, you can access the Swagger documentation at:

```bash
  http://localhost:3001/docs
```
