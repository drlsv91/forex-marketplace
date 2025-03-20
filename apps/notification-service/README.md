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
   git clone https://ooluwaleye93@bitbucket.org/drlsv91/forex-marketplace.git
   ```
2. Navigate to the notification-service directory:
   ```bash
   cd apps/notification-service
   ```
3. Install dependencies:
   ```bash
   pnpm install
   ```

## Environment Variables

Create a .env file in the root of the notification-service directory:

```bash
RABBITMQ_URI=
GOOGLE_OAUTH_CLIENT_ID=
GOOGLE_OAUTH_CLIENT_SECRET=
GOOGLE_OAUTH_REFRESH_TOKEN=
SMTP_USER=
```

## Running the Service

1. Start the service:

```bash
  nx serve notification-service
```

## Docker

To run the service in a Docker container:

```bash
  docker-compose up notification-service
```

## License

This project is licensed under the MIT License.
