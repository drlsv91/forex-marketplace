# User Auth Service

The **User Auth Service** handles user authentication and registration for the Forex Marketplace.

---

## Features

- **User Registration**: Register a new user with an email and password.
- **User Login**: Authenticate a user and return a JWT token.

---

## API Documentation

The API is documented using Swagger. After starting the service, you can access the Swagger UI at: http://localhost:3000/docs

---

## Setup

### Prerequisites

- Node.js (v18+)
- pnpm
- PostgreSQL
- Docker (optional, for local database)

### Installation

1. Clone the repository:
   ```bash
   git clone https://ooluwaleye93@bitbucket.org/drlsv91/forex-marketplace.git
   ```
2. Navigate to the user-auth-service directory:

```bash
   cd apps/user-auth-service
```

3. Install dependencies:

```bash
   pnpm install
```

## Environment Variables

Create a .env file in the apps/user-auth-service directory:

```bash
  DATABASE_URL=postgres://postgres:<password>@<host>:5432/<database_name>?schema=public
  JWT_SECRET=<jwt_secret>
  JWT_EXPIRATION_MS=3600
  PORT=3000
  RABBITMQ_URI=amqp://rabbitmq:5672
  REDIS_HOST=localhost
  REDIS_PORT=6379

```

## Running the Service

1. Start the dependencies using Docker:

```bash
   docker-compose up
```

2. Start the User Auth Service:

```bash
   pnpm nx serve user-auth-service
```

## Testing

Run unit tests for the User Auth Service:

```bash
   pnpm nx test user-auth-service
```
