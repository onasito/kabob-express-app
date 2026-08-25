# Kabob Express

Kabob Express is a full-stack ordering system for a kabob restaurant: an Express/TypeScript/Prisma API (this repo, in `backend/`) paired with a React frontend that consumes it.

## Tech Stack

- **Runtime:** Node.js + TypeScript
- **Framework:** Express 5
- **Database:** PostgreSQL via Prisma ORM v7 (`@prisma/adapter-pg`)
- **Auth:** JWT (`jsonwebtoken`) + password hashing with `bcrypt`
- **Validation:** Zod

## Data Model

- **User** — customers, staff, and admins (`CUSTOMER`, `ADMIN`, `STAFF` roles)
- **MenuCategory** / **MenuItem** — the restaurant menu
- **Order** / **OrderItem** — customer orders and their line items, with status tracking (`PENDING` → `IN_PROGRESS` → `READY` → `COMPLETED` / `CANCELLED`)

## Getting Started

### Prerequisites

- Node.js
- A PostgreSQL database

### Setup

1. Install dependencies:
   ```bash
   cd backend
   npm install
   ```

2. Create a `.env` file in `backend/` with:
   ```
   DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<database>
   PORT=5000
   JWT_SECRET=<your-secret>
   JWT_EXPIRES_IN=1d
   ```

3. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```

4. Start the dev server:
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:5000` (or your configured `PORT`).

## Scripts

| Command       | Description                              |
| ------------- | ----------------------------------------- |
| `npm run dev` | Run the server in watch mode (`tsx`)      |
| `npm run build` | Compile TypeScript to `dist/`           |
| `npm start`   | Run the compiled server from `dist/`      |

## API Routes

### Auth (`/auth`)

| Method | Route             | Description         |
| ------ | ----------------- | -------------------- |
| POST   | `/auth/register`  | Create a new account |
| POST   | `/auth/login`     | Log in, returns a JWT |

### Users (`/users`) — admin only

All routes below require a valid JWT (`Authorization: Bearer <token>`) belonging to an `ADMIN` user.

| Method | Route         | Description        |
| ------ | ------------- | ------------------- |
| GET    | `/users`      | List all users      |
| GET    | `/users/:id`  | Get a user by ID    |
| POST   | `/users`      | Create a user        |
| PATCH  | `/users/:id`  | Update a user       |
| DELETE | `/users/:id`  | Delete a user        |

## Frontend

The customer- and staff-facing UI will be a separate React app that talks to this API over HTTP.

- Calls `/auth/login` and `/auth/register`, then stores the returned JWT client-side and sends it as `Authorization: Bearer <token>` on subsequent requests.
- Admin/staff views (user management, and eventually menu and order management) gate their UI on the logged-in user's `role`, matching the `authenticate` / `requireAdmin` checks already enforced server-side on `/users`.
- Once menu and order endpoints exist (see Roadmap), the React app will drive the customer ordering flow — browsing `MenuCategory`/`MenuItem` data and placing `Order`s — plus a staff view for updating order status.
- Not scaffolded yet; this section describes the intended shape so backend routes are designed with that client in mind.

## Roadmap

- Menu (`MenuCategory` / `MenuItem`) endpoints
- Order (`Order` / `OrderItem`) endpoints
- Scaffold the React frontend
