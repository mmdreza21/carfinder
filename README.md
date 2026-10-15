# 🚗 CarFinder

A full-stack car search application — **NestJS + PostgreSQL + OpenSearch (Elasticsearch-compatible) + Next.js**.

Browse **1,798 cars** across **15 brands**, **74 models**, and **230 generations** with fast full-text search, faceted filters, and rich detail views.

![stack](https://img.shields.io/badge/NestJS-10-E0234E?logo=nestjs) ![stack](https://img.shields.io/badge/Next.js-16-000?logo=nextdotjs) ![stack](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql) ![stack](https://img.shields.io/badge/OpenSearch-2.11-005EB8?logo=opensearch) ![stack](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma)

---

## ✨ Features

- **Full-text search** across car name, brand, model, description, and fun facts (OpenSearch)
- **Faceted filters** — brand, body type, fuel type, year range, price range, min horsepower
- **Autocomplete suggestions** (`/api/search/suggest`)
- **Two search backends** — OpenSearch (fast, faceted) and PostgreSQL (source of truth), switchable in the UI
- **Rich detail dialog** — hero image, spec grid (performance / dimensions / market), fun-fact callout
- **Data model** — Brand → Model → Generation → Car (specs, price, mileage, condition, image)
- **Swagger API docs** at `/api/docs`
- **Docker Compose** — one command spins up everything

---

## 🏗 Architecture

```
                 ┌─────────────────┐
                 │  Next.js (16)   │   ← React 19 · TanStack Query · Radix UI
                 │    Frontend     │
                 └────────┬────────┘
                          │ HTTP
                          ▼
                 ┌─────────────────┐
                 │  NestJS (10)    │   ← class-validator · Swagger
                 │     Backend     │
                 └───────┬─┬───────┘
                         │ │
              ┌──────────┘ └──────────┐
              ▼                       ▼
      ┌───────────────┐       ┌───────────────┐
      │  PostgreSQL   │       │  OpenSearch   │
      │  (Prisma ORM) │       │  (full-text)  │
      │ source of     │       │  facets +     │
      │ truth         │       │  ranking      │
      └───────────────┘       └───────────────┘
```

PostgreSQL is the **source of truth**. OpenSearch holds a denormalized copy of each car for fast search and filtering. Reindex with `yarn search:reindex`.

---

## 🚀 Quick start (Docker)

```bash
git clone <repo-url>
cd car-finder

docker compose up --build
```

Then:

| Service | URL |
| --- | --- |
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8080/api |
| Swagger docs | http://localhost:8080/api/docs |
| OpenSearch | http://localhost:9200 |

The first startup runs migrations, seeds the database, and reindexes OpenSearch automatically (via the `database-init` service).

---

## 🛠 Local development

### Requirements
- Node.js 24 · Yarn · Docker

### 1. Start Postgres + OpenSearch only

```bash
docker compose up -d postgres opensearch
```

### 2. Backend

```bash
cd BackEnd
yarn install
yarn prisma generate
yarn prisma migrate dev
yarn db:seed
yarn search:reindex
yarn start:dev            # → http://localhost:8080
```

### 3. Frontend

```bash
cd FrontEnd
yarn install
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api yarn dev   # → http://localhost:3000
```

---

## 📚 API

### `GET /api/search` — OpenSearch-backed

| Param | Type | Example |
| --- | --- | --- |
| `keyword` | string | `ferrari roma` |
| `brand` | string | `BMW` |
| `model` | string | `M3` |
| `bodyType` | enum | `SUV` |
| `fuelType` | enum | `Electric` |
| `country` | string | `Italy` |
| `yearMin` / `yearMax` | int | `2010` / `2024` |
| `priceMin` / `priceMax` | int | `30000` / `200000` |
| `hpMin` | int | `500` |
| `sortBy` / `sortDir` | string | `priceUsd` / `asc` |
| `page` / `limit` | int | `1` / `20` |

```bash
curl "http://localhost:8080/api/search?brand=Ferrari&fuelType=Gasoline&limit=3"
```

### `GET /api/search/suggest?q=M3`
Fast autocomplete from OpenSearch.

### `GET /api/car` — PostgreSQL-backed
Same basic filters, direct Prisma query (no OpenSearch).

### `GET /api/car/stats`
Aggregate counts: total cars, brands, models, generations.

### `GET /api/car/:id`
Single car with brand/model/generation included.

Full interactive docs at **http://localhost:8080/api/docs**.

---

## 🗄 Data model

```prisma
Brand   (15)   ── name, country, foundedYear, headquarters, logoUrl
Model   (74)   ── name, bodyType, segment
Generation     ── code (e.g. "E30", "992"), yearFrom, yearTo, funFact
Car (1798)     ── year, trim, engine specs, performance, dimensions,
                  price USD/EUR, mileage, condition, color, imageUrl
```

Seed data lives in `BackEnd/prisma/seed-data/*.ts` — hand-curated brands, models, and generations; cars are generated deterministically per generation × sampled year × trim so re-runs are idempotent.

---

## 🧪 Tests

```bash
cd BackEnd
yarn test          # Jest unit tests
yarn test:cov      # coverage
yarn test:e2e      # e2e
```

---

## 🔧 Backend commands

```bash
yarn start:dev         # watch mode
yarn build             # prod build
yarn start:prod        # run built
yarn prisma generate
yarn prisma migrate dev
yarn db:seed           # wipe + reseed
yarn search:reindex    # rebuild OpenSearch index
yarn test              # jest
yarn lint              # eslint
yarn format            # prettier
```

---

## 📁 Project structure

```
.
├── BackEnd/
│   ├── src/
│   │   ├── car/            # CRUD + listing (Postgres)
│   │   ├── search/         # full-text (OpenSearch)
│   │   ├── prisma/         # PrismaService
│   │   ├── elasticsearch/  # ES/OpenSearch client
│   │   └── app.module.ts
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── seed.ts
│   │   ├── reindex.ts
│   │   └── seed-data/
│   └── Dockerfile
│
├── FrontEnd/
│   ├── src/
│   │   ├── app/            # Next.js App Router
│   │   │   ├── page.tsx             (ES search)
│   │   │   ├── simple-search/       (Postgres)
│   │   │   ├── CarTable.tsx
│   │   │   ├── CarDetailsDialog.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   └── hooks/
│   │   ├── services/       # axios clients
│   │   └── types/          # CarType
│   └── Dockerfile
│
├── docker-compose.yml
└── README.md
```

---

## 📝 License

UNLICENSED — personal/portfolio project.
