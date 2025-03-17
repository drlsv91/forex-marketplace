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
   git clone https://bitbucket.org/your-repo/forex-marketplace.git
   ```
2. Navigate to the wallet-service directory:
   ```bash
   cd apps/wallet-service
   ```
3. Install dependencies:
   ```bash
   pnpm install
   ```

## Environment Variables

Create a .env file in the root of the wallet-service directory:

```bash
   DATABASE_URL=postgres://user:password@localhost:5432/wallet_db
   JWT_SECRET=your_jwt_secret
   PORT=3000
```

## Running the Service

1. Start the service:

```bash
  nx serve wallet-service
```

2. The service will be available at http://localhost:3000.

## Testing

```bash
  nx test wallet-service
```

## Docker

To run the service in a Docker container:

```bash
  docker-compose up wallet-service
```

## License

This project is licensed under the MIT License.
