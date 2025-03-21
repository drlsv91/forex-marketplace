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

## Environment Variables

Create a .env file in the root of the wallet-service directory:

```bash
  DATABASE_URL=postgres://postgres:<password>@<host>:5432/<database_name>?schema=public
  PORT=3005
  RABBITMQ_URI=amqp://rabbitmq:5672
  REDIS_HOST=localhost
  REDIS_PORT=6379
  AUTH_GRPC_URL=localhost:50051
  WALLET_GRPC_URL=localhost:50052
  RATE_GRPC_URL=localhost:50055
```

## Running the Service

1. Start the service:

```bash
  nx serve order-service
```

2. The service will be available at http://localhost:3005.

## Testing

```bash
  nx test order-service
```

## Docker

To run the service in a Docker container:

```bash
  docker-compose up order-service
```

## License

This project is licensed under the MIT License.

## Swagger Documentation:

Once the service is running, you can access the Swagger documentation at:

```bash
  http://localhost:3005/docs
```
