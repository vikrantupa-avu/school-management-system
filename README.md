# IRAGyan (Full JavaScript Stack)

A production-ready starter for **IRAGyan** using JavaScript across the stack:
- Backend: Node.js + Express + MongoDB
- Frontend: Existing Express-served HTML/CSS/Vanilla JS app
- Extended Frontend Layer: React-style `/frontend` UI module scaffold with reusable layout/components
- Authentication: JWT + role-based access control

## Existing architecture (current repository)

### Backend structure
- `src/server.js` boots the app and DB connection
- `src/app.js` wires middleware + static assets + API router
- `src/routes/` contains auth, CRUD, lookups, and route registration
- `src/controllers/` contains auth, generic CRUD, dashboard handlers
- `src/models/` stores Mongoose schemas
- `src/middleware/` includes auth + error handlers

### Frontend structure
- `public/` serves the working UI (auth, dashboard, module screens, marketing pages)
- `public/js/api.js` centralizes session, API request helpers, and role-aware module config
- `public/js/module-page.js` renders typed create/list/delete forms + lookup autocomplete

### Auth and permissions
- JWT auth in `src/controllers/authController.js`
- `authenticate` + `authorize` middleware in `src/middleware/auth.js`
- Role-based module visibility handled in `public/js/api.js`

## Core modules included
- authentication
- students
- teachers
- classes
- subjects
- attendance
- grades
- fees
- announcements

## Multi-school API support (backward compatible)

Existing endpoints continue to work:
- `/api/students`, `/api/teachers`, etc.

Scoped endpoints are also supported:
- `/api/{schoolId}/students`
- `/api/{schoolId}/teachers`
- `/api/{schoolId}/classes`
- `/api/{schoolId}/subjects`
- `/api/{schoolId}/attendance`
- `/api/{schoolId}/fees`
- `/api/{schoolId}/announcements`
- `/api/{schoolId}/lookups/{entity}`

## New React-style frontend extension (`/frontend`)

Added reusable layout + UI system and pages:
- `frontend/components/layout`: `DashboardLayout`, `Sidebar`, `Topbar`
- `frontend/components/ui`: `Button`, `Card`, `StatCard`, `DataTable`, `Modal`, `Tabs`, `FormInput`, `Select`, `Avatar`
- `frontend/pages/dashboard.jsx`
- `frontend/pages/students/{index,create,[id]}.jsx`
- `frontend/pages/teacher/dashboard.jsx`
- `frontend/pages/attendance/mark.jsx`
- `frontend/pages/fees/{structure,collection,reports}.jsx`
- `frontend/pages/announcements/index.jsx`

Design notes:
- Tailwind-style utility classes
- Sidebar + topbar layout with mobile bottom navigation
- Data table includes sorting + pagination
- Query helper (`react-query`) and API helper scaffolding provided

## Local setup

```bash
npm install
cp .env.example .env
npm run dev
```

## Testing

```bash
npm test
```
