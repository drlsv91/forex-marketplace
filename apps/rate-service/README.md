# Rate Service

The Rate Service is responsible for fetching current forex rates from an external API (ExchangeRate-API) and exposing them to other services via gRPC.

## Features

- Fetch real-time forex rates from an external API.
- Expose forex rates to other services via gRPC.

## Setup

### Prerequisites

- Node.js (v18+)
- Redis
- pnpm
- Docker

### Installation

1. Clone the repository:
   ```bash
   git clone https://ooluwaleye93@bitbucket.org/drlsv91/forex-marketplace.git
   ```
2. Navigate to the rate-service directory:
   ```bash
   cd apps/rate-service
   ```
3. Install dependencies:
   ```bash
   pnpm install
   ```

## Environment Variables

Create a .env file in the root of the wallet-service directory:

```bash
EXCHANGE_RATE_API_KEY=<your_exchange_rate_api_key>
EXCHANGE_RATE_BASE_URL=https://v6.exchangerate-api.com/v6
PORT=3003
RATE_GRPC_URL=localhost:50055
REDIS_HOST=localhost
REDIS_PORT=6379

```

## Running the Service

1. Start the service:

```bash
  nx serve rate-service
```

2. The service will be available at http://localhost:3003.

## Testing

```bash
  nx test rate-service
```

## Docker

To run the service in a Docker container:

```bash
  docker-compose up rate-service
```

## License

This project is licensed under the MIT License.

## Swagger Documentation:

Once the service is running, you can access the Swagger documentation at:

```bash
  http://localhost:3003/docs
```
