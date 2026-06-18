<div align="center">

<img src="https://img.shields.io/badge/API--Deck-v1.0.0-6366f1?style=for-the-badge&logoColor=white" alt="API-Deck" />

# API-Deck

**Lightweight Mock API Generation Platform for Modern Frontend Development**

[![MIT License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.x-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://mongodb.com)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.x-010101?style=flat-square&logo=socket.io)](https://socket.io)

[Live Demo](#) · [Report a Bug](https://github.com/mishrasourav-prog/api-desk/issues) · [Request a Feature](https://github.com/mishrasourav-prog/api-desk/issues)

</div>

---

## Table of Contents

- [Overview](#overview)
- [The Problem It Solves](#the-problem-it-solves)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the App](#running-the-app)
- [Architecture Deep Dive](#architecture-deep-dive)
  - [Authentication Flow](#authentication-flow)
  - [Mock Engine](#mock-engine)
  - [Real-time Log Streaming via SSE](#real-time-log-streaming-via-sse)
  - [Validation Pipeline](#validation-pipeline)
- [API Reference](#api-reference)
- [Screenshots](#screenshots)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

**API-Deck** is a production-ready, full-stack sandbox environment that lets developers instantly design, manage, and serve custom mock REST API endpoints — without writing a single line of backend code.

Instead of hardcoding dummy data into your frontend components or waiting on a backend team, you define your endpoint shape, choose an HTTP verb, supply a mock response body, and API-Deck immediately serves it at a live, unique URL your client can call directly.

```
Your React App  →  https://api-deck.dev/mock/:deckId/:path  →  Your mock JSON
```

Think of it as your personal, authenticated Postman Mock Server — but self-hostable, open source, and tightly integrated into your development workflow.

---

## The Problem It Solves

Frontend engineers are constantly blocked by incomplete backends. Common workarounds are painful:

| Workaround | Problem |
|---|---|
| Hardcoded dummy arrays in components | Tightly coupled, pollutes production code |
| json-server | No auth, no per-user isolation, manual setup every project |
| Postman Mock Server | Paid tier for team usage, external dependency |
| Wiremock / MSW | Requires configuration files, adds complexity |

API-Deck gives you a **live, authenticated, per-user mock API** accessible over the network from any environment — browser, Postman, curl, mobile — with zero setup beyond a one-time account registration.

---

## Key Features

### 🛡️ Production-Grade Security
- **JWT + HTTP-only Cookies** — Access tokens are never exposed to JavaScript. All private routes require a valid, unexpired token delivered via strict HTTP-only cookies.
- **Google OAuth 2.0** — One-click social login via Passport.js with session bridging into the JWT pipeline.
- **Password Reset with OTP** — Secure, time-limited one-time passwords via Nodemailer/Resend for account recovery.
- **Bcrypt Password Hashing** — All credentials stored with bcryptjs salted hashes; raw passwords never touch the database.

### ⚙️ Dynamic Route Engine
- **Full HTTP Verb Matrix** — Mock endpoints support `GET`, `POST`, `PUT`, `PATCH`, and `DELETE`.
- **Automatic Path Sanitization** — Built-in middleware heals malformed paths (e.g., strips double slashes, ensures leading `/`).
- **Execution Sandboxing** — Mock response bodies are parsed and validated before being committed to storage, preventing malformed JSON from reaching disk.
- **Per-user Deck Isolation** — Each user's endpoints are scoped under their own Deck. No data leakage between accounts.

### 📡 Real-time Observability via SSE
- **Server-Sent Events Log Stream** — Every hit to a mock endpoint pushes a real-time event to the browser over a persistent SSE connection. Watch incoming requests appear in the log panel the moment they fire — method, path, timestamp, and status — with no polling and no WebSocket overhead.
- **Persistent Request History** — All request logs are stored in MongoDB and retrievable per deck for audit and debugging.

### 🧪 Runtime Schema Validation
- **Zod v4 Validation Gateway** — All incoming API payloads are validated against strict Zod schemas before controller execution. Malformed requests are rejected with structured error messages before touching the database.
- **Centralized Error Pipeline** — Every thrown error, validation failure, or unhandled exception flows through a single error middleware that returns a uniform JSON error shape.

### 🎨 Modern Frontend
- **React 19 + TypeScript** — Fully typed frontend with React Router v7 for SPA navigation.
- **Tailwind CSS v4** — Utility-first styling with a clean, minimal design system.
- **react-hot-toast** — Non-intrusive toast notifications for all async operations.
- **Axios with Interceptors** — Centralized HTTP client with request/response interceptors for auth header injection and global error handling.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS v4, React Router v7 |
| **Backend** | Node.js 20, Express 4, TypeScript |
| **Database** | MongoDB via Mongoose 9 |
| **Auth** | JWT, HTTP-only Cookies, Passport.js, Google OAuth 2.0, bcryptjs |
| **Validation** | Zod v4 |
| **Real-time** | Server-Sent Events (SSE) |
| **Email** | Nodemailer |
| **HTTP Client** | Axios |

---

## Project Structure

```
api-desk/
├── frontend/                    # React + Vite SPA
│   └── src/
│       ├── components/
│       │   ├── auth/            # Auth forms: inputs, brand, OAuth buttons
│       │   ├── dashboard/       # Deck cards, empty states
│       │   ├── designer/        # Endpoint builder, live log stream
│       │   ├── settings/        # Account, appearance, privacy sections
│       │   └── shared/          # Navbar, code editor, method/status badges
│       ├── context/             # AuthContext, EndpointContext
│       ├── hooks/               # useAuth, useEndpoints, useSettings
│       ├── pages/               # Dashboard, DeckDesigner, Settings, auth pages
│       ├── routes/              # AppRoutes, ProtectedRoutes
│       ├── services/            # userService (API calls)
│       ├── types/               # Shared TypeScript interfaces
│       └── utils/               # apiError, apiHandler, storage helpers
│
└── server/                      # Express API
    └── src/
        ├── config/              # DB connection
        ├── controllers/         # auth, deck, mockEngine, user controllers
        ├── middlewares/         # auth guard, error handler, Zod validator
        ├── models/              # User, Deck, RequestLog, PendingUser, PasswordReset
        ├── routes/              # auth, deck, mock, log, user route groups
        ├── schema/              # Zod schemas for deck payloads
        ├── types/               # AuthRequest interface, Express augmentation
        └── utils/               # apiError, apiResponse, logEmitter, sendEmail
```

---

## Getting Started

### Prerequisites

- **Node.js** `>= 20.x`
- **MongoDB** (local instance or [MongoDB Atlas](https://cloud.mongodb.com) free tier)
- **npm** or **yarn**
- A Google Cloud project with OAuth 2.0 credentials (optional, for social login)


### Installation

Clone the repository and install dependencies for both workspaces:

```bash
git clone https://github.com/mishrasourav-prog/api-desk.git
cd api-desk

# Install server dependencies
cd server && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### Environment Variables

**`server/.env`**

```env
# Server
PORT = 
URI = 
ACCESS_TOKEN_SECRET=
REFRESH_TOKEN_SECRET=
ACCESS_TOKEN_EXPIRY=
REFRESH_TOKEN_EXPIRY=
EMAIL_USER=
EMAIL_PASS=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=

FRONTEND_ORIGIN=
FRONTEND_DASHBOARD_URL=
```

**`frontend/.env`**

```env
VITE_API_BASE_URL=
VITE_GOOGLE_AUTH_URL=
```

### Running the App

**Development mode (with hot reload):**

```bash
# Terminal 1 — Start the backend
cd server
npm run dev

# Terminal 2 — Start the frontend
cd frontend
npm run dev
```

**Production build:**

```bash
# Build frontend
cd frontend && npm run build

# Build & start server
cd server && npm run build && npm start
```

The app will be available at `http://localhost:5173` with the API running on `http://localhost:5000`.

---

## Architecture Deep Dive

### Authentication Flow

```
Registration
  └─► POST /api/auth/register
        └─► Zod validation
        └─► Hash password (bcryptjs)
        └─► Save User to database
        └─► Issue JWT → set HTTP-only cookie

Login
  └─► POST /api/auth/login
        └─► Validate credentials
        └─► Sign JWT → set HTTP-only cookie (httpOnly, sameSite: strict)

Protected Routes
  └─► auth.middleware.ts extracts + verifies JWT from cookie
  └─► Attaches req.user to request
  └─► Controller executes
```

Google OAuth follows Passport.js's standard OAuth 2.0 callback flow, ultimately issuing the same JWT cookie on successful authentication.

Password recovery uses a time-limited OTP sent to the user's registered email address via Nodemailer/Resend.

### Mock Engine

Each user creates one or more **Decks**. A Deck is a named collection of endpoints. When an endpoint is called:

```
Incoming request
  └─► GET /mock/:deckId/users/profile
        └─► Look up Deck by ID
        └─► Match path + method against stored endpoints
        └─► Push log event via SSE (logEmitter.ts)
        └─► Persist RequestLog to MongoDB
        └─► Return stored mock response body
```

Paths are sanitized on write — the middleware ensures structural correctness (forward slash prefix, no trailing slashes, no double slashes) before the endpoint is stored.

### Real-time Log Streaming via SSE

API-Deck uses **Server-Sent Events** for push-based log delivery — a lightweight, native HTTP alternative to WebSockets that requires no additional protocol or library.

```
Client curl → Mock route → logEmitter.ts → SSE stream → LogStream component → React UI
```

When the `LogStream` component mounts, it opens a persistent `EventSource` connection to the backend scoped to the active deck ID. Each time a request hits the mock engine, the server pushes a log event down the open stream. The frontend panel updates instantly — no polling, no reconnect logic, no WebSocket handshake.

**Why SSE over WebSockets here?**

| | SSE | WebSockets |
|---|---|---|
| Direction | Server → Client only | Bidirectional |
| Protocol | Plain HTTP | Upgraded connection |
| Reconnect | Automatic (browser handles it) | Manual |
| Fit for log streaming | ✅ Perfect | Overkill |

### Validation Pipeline

Every mutating API route runs through the Zod validator middleware before reaching the controller:

```typescript
// validate.middleware.ts
router.post('/endpoints', validate(createEndpointSchema), endpointController.create);

// Returns on failure:
// { success: false, errors: [{ field: "path", message: "Invalid path format" }] }
```

Controllers never receive malformed input. The centralized `errorHandler.middleware.ts` catches any thrown `ApiError` or unexpected exception and formats the response uniformly.

---

## API Reference

All routes are prefixed with `/api`.

### Auth Routes `/api/auth`

| Method | Path | Description | Auth |
|---|---|---|---|
| `POST` | `/register` | Register a new account | — |
| `POST` | `/login` | Login with email + password | — |
| `POST` | `/logout` | Clear auth cookie | ✅ |
| `POST` | `/forgot-password` | Send password reset OTP | — |
| `POST` | `/verify-otp` | Verify reset OTP | — |
| `POST` | `/reset-password` | Set new password | — |
| `GET` | `/google` | Initiate Google OAuth | — |
| `GET` | `/google/callback` | Google OAuth callback | — |
| `POST` | `/refresh` | Refresh Access Token | — |
| `PUT` | `/change-password` | Change password | ✅ |


### User Routes `/api/user`

| Method | Path | Description | Auth |
|---|---|---|---|
| `GET` | `/me` | Get current user profile | ✅ |
| `PUT` | `/edit` | Update User profile | ✅ |
| `DELETE` | `/delete` | Delete User | ✅ |


### Deck Routes `/api/deck`

| Method | Path | Description | Auth |
|---|---|---|---|
| `GET` | `/list` | List all decks | ✅ |
| `POST` | `/create` | Create a new deck | ✅ |
| `GET` | `/:id` | Get a deck by ID | ✅ |
| `DELETE` | `/:id` | Delete a deck | ✅ |
| `PUT` | `/:id` | Update a deck | ✅ |

### Mock Engine `/mock`

| Method | Path | Description | Auth |
|---|---|---|---|
| `ALL` | `/` | Match and serve mock response | — |

### Log Routes `/api/log`

| Method | Path | Description | Auth |
|---|---|---|---|
| `GET` | `/recent/:username/:deckId` | Fetch request logs for a deck | ✅ |
| `GET` | `/stream/:deckId` | Open SSE stream for live logs | ✅ |

---

## Screenshots

<div align="center">

### Login
<img src="./assets/login.png" alt="Login Page" width="700" />

### Register
<img src="./assets/register.png" alt="Register Page" width="700" />

### Forgot Password
<img src="./assets/forgot-password.png" alt="Forgot Password Page" width="700" />

### Dashboard
<img src="./assets/dashboard.png" alt="Dashboard" width="700" />

### Clean Dashboard
<img src="./assets/clean_dashboard.png" alt="Clean Dashboard" width="700" />

### Deck Designer
<img src="./assets/deck_designer.png" alt="Deck Designer" width="700" />

</div>

---

## Roadmap

- [ ] **Shareable Decks** — Generate a public read-only link for a deck to share mock endpoints with teammates
- [ ] **Response Delay Simulation** — Configure artificial latency per endpoint to test loading states
- [ ] **Dynamic Template Responses** — Support Faker.js-style template variables in response bodies (e.g., `{{name}}`, `{{uuid}}`)
- [ ] **Import from OpenAPI / Swagger** — Seed a deck automatically from an existing API spec
- [ ] **Webhook Support** — Trigger outbound HTTP calls on incoming mock hits
- [ ] **CLI Tool** — `api-deck push` to sync a local JSON config to a remote deck
- [ ] **Rate Limit Simulation** — Return 429 responses on configurable thresholds
- [ ] **Request Assertion** — Define expected request shape and flag mismatches in the log stream

---

## Contributing

Contributions are welcome and appreciated. Here's how to get involved:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/your-feature-name`
3. **Commit** your changes with a clear message: `git commit -m "feat: add response delay simulation"`
4. **Push** to your fork: `git push origin feature/your-feature-name`
5. **Open a Pull Request** against the `main` branch

Please follow these guidelines:

- Run `npm run lint` before pushing
- Keep PRs focused — one feature or fix per PR
- Add a clear description of what changed and why
- For significant changes, open an issue first to discuss the approach

### Bug Reports

Use the [GitHub Issues](https://github.com/mishrasourav-prog/api-desk/issues) tab. Include your Node.js version, OS, and steps to reproduce.

---

## License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for full terms.

---

<div align="center">

Built by: [Sourav Mishra](https://github.com/mishrasourav-prog)


</div>
