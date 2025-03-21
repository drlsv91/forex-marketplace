# Notification Service

The Notification Service is responsible for sending notifications to users after successful transactions. It uses RabbitMQ as a message broker to handle notification jobs asynchronously.

## Features

- RabbitMQ Integration: Uses RabbitMQ to send notifications asynchronously.
- Scalable: Designed to handle high volumes of notifications.
- Decoupled: Works independently of other services, communicating via RabbitMQ.

## Setup

### Prerequisites

- Node.js (v18+)
- pnpm
- Docker
- RabbitMQ (can be run via Docker)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/drlsv91/forex-marketplace.git
   ```
2. Navigate to the notification-service directory:
   ```bash
   cd apps/notification-service
   ```
3. Install dependencies:
   ```bash
   pnpm install
   ```
4. Set up environment variables:
   Create a .env file in the root of the notification-service directory with the following content:

## For Docker Deployment:

```bash
RABBITMQ_URI=amqp://rabbitmq:5672
GOOGLE_OAUTH_CLIENT_ID=<google_oauth_client_id>
GOOGLE_OAUTH_CLIENT_SECRET=<google_oath_client_secret>
GOOGLE_OAUTH_REFRESH_TOKEN=<google_oauth_refresh_token>
SMTP_USER=<google@gmail.com>
```

## For Local Development:

```bash
RABBITMQ_URI=amqp://localhost:5672
GOOGLE_OAUTH_CLIENT_ID=<google_oauth_client_id>
GOOGLE_OAUTH_CLIENT_SECRET=<google_oath_client_secret>
GOOGLE_OAUTH_REFRESH_TOKEN=<google_oauth_refresh_token>
SMTP_USER=<google@gmail.com>
```

## Running the Service

Start the service:

## Locally:

```bash
  nx serve notification-service
```

## Using Docker

To run the service in a Docker container:

```bash
  docker-compose up notification-service
```

## License

This project is licensed under the MIT License.
