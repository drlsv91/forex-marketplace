# Order Service

The Order Service handles the creation and management of forex transactions and orders. It allows users to place buy/sell orders and view their transaction history.

## Features

- Place buy/sell orders for forex transactions.
- View transaction history for a user.

## Setup

### Prerequisites

- Node.js (v18+)
- PostgreSQL
- pnpm
- Docker
- RabbitMQ
- Redis

### Installation

1. Clone the repository:
   ```bash
   git clone https://ooluwaleye93@bitbucket.org/drlsv91/forex-marketplace.git
   ```
2. Navigate to the order-service directory:
   ```bash
   cd apps/order-service
   ```
3. Install dependencies:

   ```bash
   pnpm install
   ```

4. Set up environment variables:
   Create a .env file in the root of the order-service directory with the following content:

## For Docker Deployment:

```bash
DATABASE_URL=postgres://postgres:forex_password@postgres:5432/forex_marketplace?schema=public
  PORT=3005
  RABBITMQ_URI=amqp://rabbitmq:5672
  REDIS_HOST=redis
  REDIS_PORT=6379
  AUTH_GRPC_URL=user-auth-service:50051
  WALLET_GRPC_URL=wallet-service:50052
  RATE_GRPC_URL=rate-service:50055
```

## For Local Development:

```bash
DATABASE_URL=postgres://postgres:forex_password@localhost:5432/forex_marketplace?schema=public
  PORT=3005
  RABBITMQ_URI=amqp://localhost:5672
  REDIS_HOST=localhost
  REDIS_PORT=6379
  AUTH_GRPC_URL=localhost:50051
  WALLET_GRPC_URL=localhost:50052
  RATE_GRPC_URL=localhost:50055
```

## Running the Service

1. Start the service:

## Locally

```bash
  nx serve order-service
```

## Using Docker

To run the service in a Docker container:

```bash
  docker-compose up notification-service
```

2. The service will be available at http://localhost:3005.

## Testing

```bash
  nx test order-service
```

## Swagger Documentation:

Once the service is running, you can access the Swagger documentation at:

```bash
  http://localhost:3005/docs
```
