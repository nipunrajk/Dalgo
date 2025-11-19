# Customizable Dashboard Builder — Assessment Project

A full-stack web app with **Next.js 16**, **Express (Node 24)**, **JWT cookie auth**, **Zustand**, **React Query**, and **file-based persistence**. Users can register, log in, and build a personalized dashboard using widgets (Clock, Notes, Todo). Dashboard layout & widgets persist per user.

---

## Tech Stack

### Frontend (Next.js 16)

* Next.js (App Router)
* React 18 / TypeScript
* Zustand
* React Query
* Tailwind CSS
* Axios
* Drag & Drop (`@hello-pangea/dnd`)
* Toasts + Spinners

### Backend (Node 24 + Express)

* Express (ESM)
* Native `.env` loader
* JWT auth with httpOnly cookies
* bcrypt password hashing
* File-based persistence (`users.json`, `dashboards.json`)
* CORS with credentials

---

## Features

### Authentication

* Register new user
* Login (JWT httpOnly cookie)
* Logout
* Session persistence across refresh
* Protected routes via `AuthGuard`

### Dashboard

* Add widgets: **Clock**, **Notes**, **Todo**
* Edit Notes, add/check/delete Todo items
* Drag & drop to reorder
* Save dashboard to backend
* Auto-hydrate on login/refresh
* Position stored explicitly for stable ordering

---

## Environment Variables

### Backend (`backend/.env`)

```
PORT=4000
JWT_SECRET=super_secret_string
JWT_EXPIRES_IN=7d
FRONTEND_ORIGIN=http://localhost:3000
NODE_ENV=development
```

### Frontend (`frontend/.env.local`)

```
NEXT_PUBLIC_API_URL=http://localhost:4000
```

---

## Running the Project Locally

### 1. Backend

```
cd backend
npm install
node --env-file=.env --watch server.js
```

Backend runs on **[http://localhost:4000](http://localhost:4000)**

### 2. Frontend

```
cd frontend
npm install
npm run dev
```

Frontend runs on **[http://localhost:3000](http://localhost:3000)**

---

## How to Use

1. Open **[http://localhost:3000](http://localhost:3000)**
2. Register a new user
3. Login → redirect to dashboard
4. Add widgets (Clock, Notes, Todo)
5. Drag to reorder
6. Click **Save Dashboard**
7. Refresh → widgets restore from server

---

## Example Persisted Dashboard

```
{
  "USER_ID": {
    "widgets": [
      { "id": "w1", "type": "clock", "position": 0 },
      { "id": "w2", "type": "notes", "position": 1, "data": { "text": "Meeting at 2 PM" } }
    ]
  }
}
```

---

## Known Limitations

* File-based persistence (not for production)
* No refresh tokens
* No server-side route protection (client-side guard only)
* No automated tests
* No resizable widgets

---

### Authentication Method

* **Cookie-based authentication** using **httpOnly JWT cookies**.
* The token is stored in a secure, httpOnly cookie so it is not readable by JavaScript.
* The frontend verifies session state by calling `/auth/me`.
* This approach avoids exposing JWTs to XSS attacks.

### Architecture Decisions & Trade-offs

* **File-based persistence** chosen intentionally for simplicity and ease of evaluation.

  * Pros: zero setup, extremely simple to inspect, fast to develop.
  * Cons: not suitable for parallel writes or production scale.
* **Zustand + React Query architecture**:

  * Zustand holds UI state (widgets, auth) for snappy UX.
  * React Query handles server persistence and fetching.
* **Client-side AuthGuard** instead of SSR protection:

  * Faster to implement for an assessment.
  * In production, you'd use middleware or server components.
* **Widget system kept simple**:

  * Widgets are JSON objects with `type`, `data`, and `position`.
  * Easy to extend with new widget types.
* **Drag & drop via @hello-pangea/dnd** for stable ordering.

  * Using `position` field ensures predictable rehydration.

### Known Limitations

* File-based persistence is not production-ready.
* No refresh token or token rotation mechanism.
* No server-side route protection (client-only).
* No automated tests (unit or e2e).
* Not using a real database (SQLite/Postgres).
* Widgets are not resizable; layout is static aside from ordering.

## Notes

File-based JSON storage is **intentional** for this assessment to keep setup simple and allow direct inspection of saved data. A production version should use a real database.
