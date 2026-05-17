# 📝 Production Notes App

![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-API-000000?logo=express&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-Fullstack-3178C6?logo=typescript&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?logo=mongodb&logoColor=white)
![React](https://img.shields.io/badge/React-Frontend-61DAFB?logo=react&logoColor=111111)
![Vite](https://img.shields.io/badge/Vite-Build-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?logo=tailwindcss&logoColor=white)

A full-stack, production-style Notes application built with a TypeScript Express API, MongoDB persistence, JWT authentication, and a responsive React dashboard. The project demonstrates practical backend architecture, protected multi-user workflows, API documentation, and a scalable frontend structure suitable for portfolio review, engineering assignments, and recruiter evaluation.

## 🔗 Live Demo Links

The backend is deployed on Render. The frontend can point to the deployed API by setting `VITE_API_BASE_URL` to the Render `/api/v1` URL.

| Resource | URL |
| --- | --- |
| Live Backend Root | https://notes-app-1-peig.onrender.com/ |
| Live Backend API | https://notes-app-1-peig.onrender.com/api/v1 |
| Live OpenAPI JSON | https://notes-app-1-peig.onrender.com/api/v1/docs/openapi.json |
| Live Docs Index | https://notes-app-1-peig.onrender.com/api/v1/docs |
| Local Frontend App | `http://localhost:5173` |
| Local Backend API | `http://localhost:5000/api/v1` |

## 🖼️ Screenshots

Screenshots are not committed in the repository. After starting the app locally, capture these views for a portfolio README:

| Screen | What to Capture |
| --- | --- |
| Login | Authentication screen with email/password form |
| Dashboard | Notes grid, sidebar navigation, search, filters, and create button |
| Note Editor | Create/edit modal with tags, favorite, and pinned controls |
| Version History | History modal showing previous note versions |
| Trash | Soft-deleted notes with restore action |

## ✨ Features

- 🔐 User registration and login
- 🛡️ JWT-based protected API routes
- 🗒️ Create, read, update, and soft-delete notes
- ♻️ Restore deleted notes from trash
- 📌 Pin important notes
- ⭐ Mark notes as favorites
- 🤝 Share notes with registered users
- 🕘 Track note version history when title/content changes
- 🔎 Full-text search across title, content, and tags
- 🏷️ Tags support with tag filtering
- 📄 Pagination with metadata
- 📚 Swagger/OpenAPI JSON documentation
- 📱 Responsive SaaS-style frontend dashboard
- ⚡ React Query-powered server state and cache invalidation
- ✅ Request validation, centralized error handling, and rate limiting

## 🧰 Tech Stack

### Backend

| Technology | Purpose |
| --- | --- |
| Node.js | JavaScript runtime |
| Express.js | REST API framework |
| TypeScript | Type-safe backend development |
| MongoDB | Document database |
| Mongoose | ODM, schemas, indexes, and model hooks |
| JWT | Stateless authentication |
| bcryptjs | Password hashing |
| express-validator | Request validation |
| Helmet | Security headers |
| CORS | Cross-origin frontend access |

### Frontend

| Technology | Purpose |
| --- | --- |
| React | Component-based UI |
| Vite | Fast local development and production build |
| TypeScript | Type-safe frontend architecture |
| Tailwind CSS | Utility-first styling |
| React Router DOM | Public/protected routing |
| TanStack Query | Server state, caching, invalidation |
| Axios | HTTP client with JWT interceptor |
| React Hook Form + Zod | Form handling and validation |
| Framer Motion | Modal and card animations |
| Lucide React | Icon system |
| React Hot Toast | Toast notifications |

## 🏗️ System Architecture

```txt
Client Browser
   |
   | React + Vite Dashboard
   | - Protected routes
   | - Auth context
   | - React Query cache
   | - Axios API client
   v
Express API /api/v1
   |
   | Middleware
   | - Helmet
   | - CORS
   | - Rate limit
   | - JWT authentication
   | - Request validation
   | - Centralized error handling
   v
Controllers
   |
   v
Services
   |
   | Business rules
   | - Ownership checks
   | - Sharing access
   | - Version snapshots
   | - Soft delete/restore
   v
Mongoose Models
   |
   v
MongoDB
```

### Engineering Decisions

- **Layered backend architecture:** routes, controllers, services, models, middleware, and utilities are separated to keep business logic testable and maintainable.
- **Service-level authorization:** note ownership and shared-note access are enforced in the service layer, not only at the route level.
- **Soft delete over hard delete:** deleted notes remain recoverable and can be restored from the frontend trash view.
- **Version history snapshots:** previous title/content values are stored before content-changing updates, enabling audit-style history.
- **React Query for server state:** note lists and mutations stay synchronized through targeted cache invalidation.
- **Axios service layer:** frontend API calls are type-safe, centralized, and isolated from UI components.

## 📁 Folder Structure

```txt
Notes-app/
├── backend/
│   ├── src/
│   │   ├── config/          # Environment and database connection
│   │   ├── constants/       # HTTP status constants
│   │   ├── controllers/     # Request handlers
│   │   ├── docs/            # OpenAPI and Postman docs
│   │   ├── errors/          # AppError abstraction
│   │   ├── middleware/      # Auth, validation, rate limit, errors
│   │   ├── models/          # User, Note, NoteVersion schemas
│   │   ├── routes/          # API route modules
│   │   ├── services/        # Business logic and data operations
│   │   ├── types/           # Express request typing
│   │   ├── utils/           # JWT, pagination, responses, async handler
│   │   ├── app.ts           # Express app setup
│   │   └── server.ts        # Database connection and server start
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── api/             # Axios client and React Query client
│   │   ├── components/      # Reusable UI primitives
│   │   ├── context/         # Auth context and persistence
│   │   ├── features/        # Notes feature modules
│   │   ├── hooks/           # Reusable hooks and note mutations
│   │   ├── layouts/         # Auth and dashboard layouts
│   │   ├── pages/           # Route pages
│   │   ├── routes/          # Router and route guards
│   │   ├── services/        # API service functions
│   │   ├── styles/          # Global Tailwind styles
│   │   ├── types/           # API, auth, and note types
│   │   └── utils/           # Date, className, storage helpers
│   ├── package.json
│   ├── tailwind.config.ts
│   └── vite.config.ts
│
└── README.md
```

## ⚙️ Installation Instructions

### Prerequisites

- Node.js 20+
- npm
- MongoDB local instance or MongoDB Atlas connection string

After cloning the repository, move into the project root:

```bash
cd Notes-app
```

If Git reports a safe-directory warning on Windows, run:

```bash
git config --global --add safe.directory "C:/Users/NITESHWAR KUMAR/OneDrive/Desktop/Assignment/Notes-app"
```

## 🔐 Environment Variables

### Backend `.env`

Create `backend/.env`:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/notes-app
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d
```

### Frontend `.env`

Create `frontend/.env`:

```env
VITE_API_BASE_URL=https://notes-app-1-peig.onrender.com/api/v1
```

For fully local development with the backend running on your machine, use:

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

## 🖥️ Backend Setup

```bash
cd backend
npm install
npm run dev
```

The backend runs at:

```txt
http://localhost:5000
```

API base URL:

```txt
http://localhost:5000/api/v1
```

Build backend:

```bash
npm run build
npm start
```

## 🎨 Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at:

```txt
http://localhost:5173
```

Build frontend:

```bash
npm run build
npm run preview
```

## 📚 API Documentation

The backend exposes an OpenAPI 3.0 document:

```txt
GET /api/v1/docs/openapi.json
```

A lightweight docs index is available at:

```txt
GET /api/v1/docs
```

The repository also includes:

```txt
backend/src/docs/postman-collection.json
backend/src/docs/testing-checklist.md
backend/src/docs/openapi.ts
```

## 🔑 Authentication Flow

1. User registers or logs in with email and password.
2. Backend validates the payload using `express-validator`.
3. Passwords are hashed with bcrypt before storage.
4. On successful auth, the backend returns:

```json
{
  "success": true,
  "message": "User logged in successfully",
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com"
    },
    "token": "jwt_token"
  }
}
```

5. Frontend stores the token in localStorage through `AuthContext`.
6. Axios attaches the token to protected requests:

```http
Authorization: Bearer <jwt_token>
```

7. Protected routes redirect unauthenticated users to `/login`.
8. Backend `authenticate` middleware verifies the JWT and loads the current user.

## 📜 Available Scripts

### Backend

| Command | Description |
| --- | --- |
| `npm run dev` | Start backend in watch mode with TypeScript loader |
| `npm run build` | Compile TypeScript to `dist` |
| `npm start` | Run compiled production server |

### Frontend

| Command | Description |
| --- | --- |
| `npm run dev` | Start Vite development server |
| `npm run build` | Type-check and create production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

## 🧭 API Endpoints Summary

Base URL:

```txt
/api/v1
```

### System

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `GET` | `/health` | No | API health check |
| `GET` | `/about` | No | API metadata and feature list |
| `GET` | `/docs` | No | Documentation index |
| `GET` | `/docs/openapi.json` | No | OpenAPI JSON document |

### Auth

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `POST` | `/auth/register` | No | Register a new user |
| `POST` | `/auth/login` | No | Login and receive JWT |

### Notes

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `GET` | `/notes` | Yes | List accessible notes with filters and pagination |
| `POST` | `/notes` | Yes | Create a note |
| `GET` | `/notes/:noteId` | Yes | Get note by ID |
| `PATCH` | `/notes/:noteId` | Yes | Update owned note |
| `DELETE` | `/notes/:noteId` | Yes | Soft-delete owned note |
| `PATCH` | `/notes/:noteId/restore` | Yes | Restore soft-deleted owned note |
| `POST` | `/notes/:noteId/share` | Yes | Share owned note with another user |
| `PATCH` | `/notes/:noteId/favorite` | Yes | Toggle favorite status |
| `PATCH` | `/notes/:noteId/pin` | Yes | Toggle pinned status |
| `GET` | `/notes/:noteId/versions` | Yes | Get version history for owned note |

### Notes Query Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `page` | number | Positive page number |
| `limit` | number | Page size, max `100` |
| `search` | string | Full-text search across title, content, and tags |
| `tag` | string | Filter by normalized tag |
| `isFavorite` | boolean | Return favorite notes only |
| `isPinned` | boolean | Return pinned notes only |
| `includeDeleted` | boolean | Include soft-deleted notes |

## 📮 API Examples

### Register

```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"password123"}'
```

### Create Note

```bash
curl -X POST http://localhost:5000/api/v1/notes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt_token>" \
  -d '{
    "title": "Project Plan",
    "content": "Finalize API integration and frontend dashboard.",
    "tags": ["work", "planning"],
    "isPinned": true
  }'
```

### Search Notes

```bash
curl "http://localhost:5000/api/v1/notes?search=project&page=1&limit=10" \
  -H "Authorization: Bearer <jwt_token>"
```

### Share Note

```bash
curl -X POST http://localhost:5000/api/v1/notes/<note_id>/share \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt_token>" \
  -d '{"email":"teammate@example.com"}'
```

## 🚀 Advanced Features Explanation

### Note Sharing

Notes can be shared with registered users. The service layer checks that the requester owns the note, prevents sharing with self, prevents duplicate shares, and allows shared users to read accessible notes.

### Version History

When an owner updates a note title or content, the previous title/content is stored in `NoteVersion`. This creates an audit trail without bloating the main note document.

### Soft Delete and Restore

Delete operations mark notes as deleted instead of removing them permanently. The frontend trash view uses `includeDeleted=true` and restore actions call `/notes/:noteId/restore`.

### Search and Tags

MongoDB text indexes are configured for title, content, and tags. Tags are normalized to lowercase and de-duplicated before storage, improving filter consistency.

### Pagination

The backend returns pagination metadata with note list responses:

```json
{
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 42,
    "totalPages": 5
  }
}
```

### Frontend Dashboard

The dashboard uses a modular feature architecture:

- API services keep HTTP logic outside components.
- React Query manages loading, error, cache, and invalidation states.
- Auth context persists JWT sessions.
- Protected route guards handle access control.
- Reusable UI components keep modals, forms, buttons, empty states, and pagination consistent.

## 🛡️ Security Features

- Password hashing with bcrypt and salt rounds
- JWT authentication for protected routes
- Bearer token verification middleware
- User existence check during token authentication
- Owner-only mutations for update, delete, restore, share, and history
- Request validation with `express-validator`
- Centralized error responses
- Helmet security headers
- CORS enabled for frontend communication
- Basic IP-based rate limiting
- Password field excluded from default database selection
- Environment-based secret configuration

## 🌱 Future Improvements

- Add automated backend tests with Jest or Vitest
- Add frontend component and integration tests
- Add refresh token rotation
- Add role-based access controls for team workspaces
- Add hard-delete endpoint for permanent trash cleanup
- Add rich-text editor support
- Add note color labels and folder organization
- Add optimistic UI updates for faster perceived performance
- Add Docker Compose for local MongoDB, backend, and frontend
- Add CI pipeline for linting, type-checking, and builds

## ☁️ Deployment

### Backend Deployment

Recommended platforms:

- Render
- Railway
- Fly.io
- AWS Elastic Beanstalk
- Docker-based VPS deployment

Production checklist:

- Set `NODE_ENV=production`
- Use MongoDB Atlas or managed MongoDB
- Set a strong `JWT_SECRET`
- Configure allowed frontend origin in CORS if tightening policy
- Run `npm run build`
- Start with `npm start`

### Frontend Deployment

Recommended platforms:

- Vercel
- Netlify
- Cloudflare Pages
- Static hosting from generated `dist`

Production checklist:

- Set `VITE_API_BASE_URL=https://notes-app-1-peig.onrender.com/api/v1`
- Run `npm run build`
- Deploy `frontend/dist`

## 👤 Author Information

Author metadata is not currently encoded in the repository. Before publishing this as a public portfolio project, add the maintainer details to the root README and package metadata so recruiters can identify ownership and contact information.

## 📄 License

The backend `package.json` currently declares `ISC`. If this repository is published publicly, include a root `LICENSE` file matching the intended license.
