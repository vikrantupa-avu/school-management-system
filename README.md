# School Management System (Full JavaScript Stack)

A production-ready starter for a school management system using **JavaScript across the entire stack**:
- Backend: Node.js + Express + MongoDB (free local Community edition or free Atlas tier)
- Frontend: HTML/CSS/Vanilla JS client served by Express
- Authentication: JWT + role-based access control

## Key feature modules included

- User authentication and roles (admin, staff, teacher, student, parent, finance)
- Student information management
- Teacher management
- Class and timetable setup
- Attendance tracking
- Grades and exam records
- Fee management and payment status tracking
- Announcements and school notices
- Dashboard API with key counts and finance aggregates

## Feature checklist to think of "everything"

### Academic operations
- Admission workflow and student profiles
- Class/section management
- Subject planning and timetables
- Attendance (daily / period-level)
- Continuous assessment and exam records
- Report card generation (next step)

### Communication
- Announcements by audience segment
- Parent-teacher meeting scheduling (next step)
- Notifications (email/SMS/push) integration points (next step)

### Finance
- Fee structures by term/year
- Payment status: paid/partial/unpaid
- Outstanding balances summary in dashboard
- Online payments integration (next step)

### Admin and governance
- Role-based permissions
- Audit logs (next step)
- Data export (CSV/PDF) (next step)
- Multi-school tenancy support (next step)

### Student support and operations
- Transport allocation fields
- Emergency contact records
- Health/discipline/counseling modules (next step)

## API overview

All endpoints are under `/api`.

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/dashboard`
- CRUD modules:
  - `/api/students`
  - `/api/teachers`
  - `/api/classes`
  - `/api/attendance`
  - `/api/grades`
  - `/api/fees`
  - `/api/announcements`

## Local setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy environment template:
   ```bash
   cp .env.example .env
   ```
3. Ensure MongoDB is running locally or use free Atlas URI.
4. Start the app:
   ```bash
   npm run dev
   ```
5. Open `http://localhost:4000`.

## Testing

```bash
npm test
```

## Recommended next implementation steps

1. Add full validation (Joi/Zod).
2. Add audit logs and soft deletes.
3. Add exam result publishing + transcript exports.
4. Add parent and student self-service portal views.
5. Add background jobs for reminders (attendance/fees).
6. Add containerization (Docker + Mongo service).
7. Add CI pipeline with linting and integration tests.
