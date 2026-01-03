
# Chat & Subscription Service

A TypeScript-based REST API application with **AI Chat** functionality and **Subscription Bundle Management**, built using **Clean Architecture** and **Domain-Driven Design** principles.

---

## 🏗 Architecture Overview

- **Controller Layer (Express)**: Handles HTTP requests and responses.
- **Use Cases / Services**: Business logic orchestration (ChatService, SubscriptionService, BillingService).
- **Domain / Entities**: Core business objects (SubscriptionBundle, ChatMessage, FreeQuota, PricingPolicy).
- **Repositories / Data Layer**: Interfaces and concrete implementations for PostgreSQL access.
- **Database**: PostgreSQL tables:
  - `users`
  - `chat_messages`
  - `subscription_bundles`
  - `free_quotas`
- **Configuration**: Centralized via `shared/config` with `.env` support.
- **Swagger**: API documentation available at `/api-docs`.

---

## ⚡ Features

### Chat Module
- Accepts user questions and returns mocked AI responses.
- Tracks monthly usage per user.
- Supports free quota (3 messages per month) and subscription bundles:
  - **BASIC**: 10 responses
  - **PRO**: 100 responses
  - **ENTERPRISE**: unlimited
- Deducts usage from the latest subscription bundle with remaining quota.
- Throws structured errors on quota exceed.
- Simulates OpenAI response time delay.

### Subscription Module
- Create subscription bundles with billing cycle (monthly/yearly) and auto-renew.
- Auto-renews subscriptions if enabled.
- Randomly simulates payment failure.
- Supports cancellation, preserving usage history.

---

## 🛠 Tech Stack

- **TypeScript**
- **Node.js / Express**
- **PostgreSQL**
- **Swagger / OpenAPI**
- **Docker & Docker Compose**

---

## 📦 Installation

1. Clone the repository:

```bash
git clone <repo-url>
cd <project-folder>
````

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root of the project:

```env
PORT=3000
NODE_ENV=development

# PostgreSQL configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=DB_USER
DB_PASSWORD=DB_PASSWORD
DB_NAME=DB_NAME
```

> ⚠️ Note: If using Docker, `DB_HOST` should match the service name in `docker-compose.yml`, usually `postgres`.

---

## 🐳 Docker Setup

We provide a **docker-compose setup** to run PostgreSQL and optionally the backend.

### Start Docker containers

```bash
make docker-up
```

* Spins up **PostgreSQL** and optionally the backend container.
* The PostgreSQL database will persist data using Docker volumes.

### Stop Docker containers

```bash
make docker-down
```

### View Logs

```bash
make logs
```

---

## 🚀 Running the Application

### Locally (without container)

```bash
npm run dev
```

* API available at: `http://localhost:3000`
* Swagger docs available at: `http://localhost:3000/api-docs`

### Using Docker (full containerized setup)

```bash
make docker-up
```

Then access:

* Backend API: `http://localhost:3000`
* Swagger docs: `http://localhost:3000/api-docs`

---


## 🔧 Makefile Commands

| Target        | Description                                  |
| ------------- | -------------------------------------------- |
| `dev`         | Run backend locally (`npm run dev`)          |
| `build`       | Compile TypeScript (`npm run build`)         |
| `docker-up`   | Start Docker containers (Postgres + backend) |
| `docker-down` | Stop Docker containers                       |
| `logs`        | Tail logs from all containers                |

> All phony targets are defined in `Makefile` for safety, so Make always runs the commands.

---

## 📝 Project Architecture
<img width="1001" height="672" alt="image" src="https://github.com/user-attachments/assets/34ef4001-41c1-48c9-be0d-b2e72f049a5c" />

---

## 💡 Notes

* **Clean Architecture**: Controllers → Services → Domain → Repositories → Database.
* **Free quota** auto-resets monthly.
* **BillingService** handles subscription renewal and payment simulation.
* **Swagger** annotations are added only at controller layer.
* **Makefile** simplifies Docker and dev workflows.

---


