# n8n clone

A workflow automation tool inspired by [n8n](https://n8n.io), built from scratch in **TypeScript**.

You connect **nodes** (boxes) with **edges** (arrows) on a canvas. A **trigger** starts the workflow, and each node does one job and passes its output to the next one.

```
⏰ Every 9:00 AM  ──►  🌐 Get weather  ──►  📨 Send to Telegram
```

> 🚧 **Work in progress.** I'm building this as a learning project. See the [roadmap](#-roadmap) for what's done.
>
> Not affiliated with n8n GmbH.

---

## ✨ Planned features

- 🧩 **Visual editor:** drag nodes and connect them on a canvas (React Flow)
- ⚡ **Triggers:** manual run, webhook URL, cron schedule
- 🌐 **Nodes:** HTTP Request, Set, If, Telegram, Email, and more
- 🔁 **Background runs:** a queue and workers (BullMQ + Redis)
- 📜 **Execution history:** status, per-node output and errors for every run
- 🔐 **Credentials:** API keys stored encrypted
- 👤 **Auth:** email/password login (better-auth)
- 📘 **API docs:** Swagger / OpenAPI page

---

## 🛠 Tech stack

| Layer | Tech |
|---|---|
| Runtime | [Bun](https://bun.com) |
| Language | TypeScript |
| API | [Elysia](https://elysiajs.com) |
| Database | PostgreSQL ([Neon](https://neon.tech)) |
| ORM / migrations | [Drizzle ORM](https://orm.drizzle.team) + drizzle-kit |
| Validation | [ArkType](https://arktype.io) |
| Queue | [BullMQ](https://bullmq.io) + Redis |
| Auth | [better-auth](https://www.better-auth.com) |
| Frontend (planned) | React + [React Flow](https://reactflow.dev) |
| Deployment (planned) | Docker Compose on AWS EC2, Caddy, GitHub Actions |

---

## 🗄 Database schema

```mermaid
erDiagram
    users ||--o{ workflows : owns
    users ||--o{ credentials : owns
    workflows ||--o{ executions : "runs as"

    users {
        text id PK
        text name
        text email UK
        boolean email_verified
        text image
        timestamp created_at
        timestamp updated_at
    }
    workflows {
        uuid id PK
        text user_id FK
        text name
        boolean active
        jsonb nodes
        jsonb edges
        timestamp created_at
        timestamp updated_at
    }
    credentials {
        uuid id PK
        text user_id FK
        text name
        text type
        text data "encrypted"
        timestamp created_at
        timestamp updated_at
    }
    executions {
        uuid id PK
        uuid workflow_id FK
        execution_status status
        trigger_mode mode
        jsonb data "output per node"
        text error
        timestamp created_at
        timestamp finished_at
    }
```

| Table | What it stores |
|---|---|
| `users` | people who log in (shape compatible with better-auth) |
| `workflows` | one automation: name, on/off switch, and the canvas (`nodes` + `edges` as JSON) |
| `credentials` | saved API keys for nodes, encrypted |
| `executions` | one row per run: what started it, its status, each node's output, and any error |

**Enums**
- `execution_status`: `pending` → `running` → `completed` / `failed`
- `trigger_mode`: `manual` | `webhook` | `cron`

Deleting a user cascades to their workflows and credentials, and deleting a workflow cascades to its executions.

### What a workflow looks like in JSON

```json
{
  "nodes": [
    { "id": "1", "type": "manualTrigger", "name": "Start",
      "position": { "x": 100, "y": 200 }, "params": {} },
    { "id": "2", "type": "httpRequest", "name": "Get weather",
      "position": { "x": 350, "y": 200 },
      "params": { "url": "https://api.example.com/weather", "method": "GET" } }
  ],
  "edges": [
    { "id": "e1", "source": "1", "target": "2" }
  ]
}
```

The shapes of `nodes` and `edges` are defined once with ArkType in [`src/types/workflow.ts`](src/types/workflow.ts). That one definition provides both runtime validation and the TypeScript types.

---

## 📁 Project structure

```
n8n/
├── src/
│   ├── db/
│   │   ├── index.ts          # Drizzle connection (Bun SQL → Postgres)
│   │   └── schema/           # one file per table
│   │       ├── user.ts
│   │       ├── workflow.ts
│   │       ├── credential.ts
│   │       ├── execution.ts
│   │       └── index.ts      # re-exports all tables
│   ├── types/
│   │   └── workflow.ts       # ArkType: WorkflowNode, WorkflowEdge
│   ├── nodes/
│   │   ├── types.ts          # NodeContext + NodeDefinition (the shape every node follows)
│   │   ├── manualTrigger.ts  # starts a workflow
│   │   ├── httpRequest.ts    # calls a URL and returns the JSON response
│   │   ├── set.ts            # adds or replaces one field in the data
│   │   └── index.ts          # node registry: type name → node code
│   ├── engine/
│   │   └── runWorkFlow.ts    # runs a workflow: trigger → follow edges → pass data along
│   └── index.ts              # sample workflow for testing the engine
├── drizzle/                  # generated SQL migrations
├── drizzle.config.ts
└── docker-compose.yml        # Redis
```

Planned: `src/routes/`, `src/queue/`, `src/auth/`, `src/lib/` and `src/web/`.

---

## 🚀 Getting started

### Prerequisites
- [Bun](https://bun.com) v1.3+
- A PostgreSQL database (for example a free [Neon](https://neon.tech) project)
- [Docker](https://www.docker.com) (for Redis, needed from the queue step onward)

### 1. Clone and install
```bash
git clone https://github.com/samchinmaya/n8n.git
cd n8n
bun install
```

### 2. Environment variables
Create a `.env` file in the project root:
```env
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
```
Bun loads `.env` automatically.

### 3. Create the database tables
```bash
bun run db:migrate
```

### 4. Browse the database (optional)
```bash
bun run db:studio
```
Then open https://local.drizzle.studio. Safari and Brave block it by default, so use Chrome/Firefox or turn off Brave Shields for that site.

### 5. Start Redis (needed from Day 4)
```bash
docker compose up -d
```

---

## 📜 Scripts

| Command | What it does |
|---|---|
| `bun run db:generate` | create a SQL migration from schema changes |
| `bun run db:migrate` | apply migrations to the database |
| `bun run db:studio` | open Drizzle Studio to browse tables |
| `bun run src/index.ts` | run the sample workflow through the engine and print each node's output |

---

## 🗺 Roadmap

- [x] **Day 1: Database.** Schema, ArkType types, first migration
- [x] **Day 2: Nodes + engine.** Node interface, first nodes (Manual Trigger, HTTP Request, Set), node registry, the workflow runner
- [ ] **Day 3: API.** Elysia routes for workflows and executions, Swagger docs, consistent API responses and errors
- [ ] **Day 4: Queue + triggers.** BullMQ worker, webhook and cron triggers
- [ ] **Day 5: Auth + credentials.** better-auth, encrypted API keys, per-user data
- [ ] **Day 6: Frontend part 1.** React Flow editor, workflow list, save and load
- [ ] **Day 7: Frontend part 2.** Node settings, run button, executions page, If node
- [ ] **Day 8: Deploy.** Docker, AWS EC2, Caddy (HTTPS), GitHub Actions CI/CD

---

## 🙏 Inspiration

- [n8n](https://github.com/n8n-io/n8n): the original open-source workflow automation tool
