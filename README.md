# Document Management Service

A production-ready NestJS backend service with MongoDB that demonstrates:
- Document organization by folders and tags
- Scoped actions on documents (generate derived files)
- OCR ingestion webhook with content classification
- Role-Based Access Control (RBAC)
- Comprehensive auditing and metrics

## Features

### 1. Document & Tagging System
- Upload documents with primary and secondary tags
- Organize documents into folders (via primary tags)
- Full-text search across documents
- Scope-based filtering (folder or specific files)

### 2. Scoped Actions (Agent Simulation)
- Run AI-like actions on document scopes
- Generate CSV reports and summary documents
- Credit-based usage tracking (5 credits per action)
- Mock processor with deterministic results

### 3. OCR Webhook Processing
- Classify content as official/ad/general
- Auto-extract unsubscribe information from ads
- Create follow-up tasks for promotional content
- Rate limiting (max 3 tasks per sender per day)

### 4. RBAC & Security
- Four roles: admin, support, moderator, user
- JWT-based authentication
- Tenant isolation (users can only access their own data)
- Role-based endpoint protection

### 5. Auditing & Metrics
- Complete audit trail of all actions
- System-wide and user-specific metrics
- Monthly usage reports
- Real-time statistics

## Quick Start

### Prerequisites
- Node.js 20+
- Docker & Docker Compose
- MongoDB (via Docker or local installation)

### Installation

1. **Clone and install dependencies:**
```bash
yarn install
```

2. **Configure environment:**
```bash
cp .env.example .env
# Edit .env with your settings
```

3. **Start services with Docker:**
```bash
docker-compose up -d
```

4. **Seed the database:**
```bash
yarn run seed
```

### Running Locally (without Docker)

```bash
# Ensure MongoDB is running locally
mongod

# Development mode with hot reload
yarn start:dev

# Production build
yarn run build
yarn run start:prod
```