# MetroPad Care

Mumbai Metro Sanitary Pad Machine Management System.

A full-stack application to manage sanitary pad vending machines across Mumbai Metro stations, including refill tracking, pad stock, maintenance, and monthly reporting.

## Tech Stack

| Layer     | Technology                         |
|-----------|------------------------------------|
| Frontend  | React 18 + Vite                    |
| Backend   | Node.js + Express                  |
| Database  | Supabase (PostgreSQL)              |

## Project Structure

```
MetroPad-Care/
├── frontend/          React + Vite application
│   ├── src/
│   │   ├── components/   Reusable UI components
│   │   ├── pages/        Page-level views
│   │   ├── layouts/      Layout wrappers
│   │   ├── services/     API calls to backend
│   │   ├── hooks/        Custom React hooks
│   │   ├── utils/        Helper functions
│   │   ├── assets/       Static assets
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── public/
│
└── backend/           Express API server
    ├── src/
    │   ├── config/       Configuration (env, supabase)
    │   ├── controllers/  Route handlers
    │   ├── routes/       API route definitions
    │   ├── services/     Business logic
    │   ├── middleware/   Auth, validation, errors
    │   ├── models/       Data models
    │   ├── utils/        Helpers
    │   └── app.js        Server entry point
    └── .env.example
```

## Getting Started

### Backend

```bash
cd backend
npm install
cp .env.example .env   # fill in Supabase credentials
npm run dev            # http://localhost:5000
```

Health check: `GET http://localhost:5000/api/health`

### Frontend

```bash
cd frontend
npm install
npm run dev            # http://localhost:5173
```

## Planned Modules

- Dashboard
- Metro Lines
- Stations
- Machines
- Machine Status
- Refill Management
- Pad Stock / Issues
- Missing Pads
- Maintenance
- Monthly Data
- Reports