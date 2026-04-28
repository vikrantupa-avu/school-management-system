# Production-Ready MVP Multi-Tenant School Management System

## 1) High-level architecture diagram (text)

```text
                               +-----------------------------+
                               |  React Web Admin Portal     |
                               |  (Principal / Staff)        |
                               +-------------+---------------+
                                             |
                                             | HTTPS (JWT)
                                             |
+--------------------------+      +----------v-----------+      +--------------------------+
| React Native Mobile App  |----->|  API Gateway Layer   |<-----|  Socket.IO Realtime Hub  |
| (Teachers / Parents)     |      | (Express entrypoint) |      | (same Node process MVP)  |
+--------------------------+      +----------+-----------+      +------------+-------------+
                                              |                               |
                                              | middleware chain              |
                                              v                               |
                                   +----------+-----------+                   |
                                   | Auth + Tenant Guard  |-------------------+
                                   | - Verify JWT         |   tenant-scoped rooms
                                   | - Resolve schoolId   |   room: school:{id}
                                   | - RBAC checks        |
                                   +----------+-----------+
                                              |
                                              | Service/Controller layer
                                              v
                                   +----------+-----------+
                                   |  Domain Modules      |
                                   |  Students/Fees/etc   |
                                   +----------+-----------+
                                              |
                                              | schoolId enforced in every query
                                              v
                                   +----------+-----------+
                                   | MongoDB Atlas (M0)   |
                                   | Shared DB            |
                                   | Shared collections   |
                                   | Compound indexes     |
                                   +----------------------+
```

### Core MVP modules
- Authentication & users
- Student profile + guardian contacts
- Attendance
- Fees + basic receipts
- Timetable/classes
- Announcements + realtime alerts

---

## 2) Suggested folder structure (backend + frontend)

```text
school-management-system/
├─ src/
│  ├─ app.js
│  ├─ server.js
│  ├─ config/
│  │  ├─ env.js
│  │  ├─ database.js
│  │  └─ socket.js
│  ├─ middleware/
│  │  ├─ auth.js                 # verify JWT, attach req.user
│  │  ├─ tenantContext.js        # resolve req.tenant.schoolId
│  │  ├─ requireRole.js          # RBAC
│  │  ├─ validate.js
│  │  └─ errorHandler.js
│  ├─ models/
│  │  ├─ Tenant.js               # school metadata/subscription
│  │  ├─ User.js                 # includes schoolId
│  │  ├─ Student.js              # includes schoolId
│  │  ├─ Attendance.js           # includes schoolId
│  │  ├─ Fee.js                  # includes schoolId
│  │  └─ ...
│  ├─ repositories/
│  │  ├─ baseTenantRepo.js       # centralized schoolId query helpers
│  │  └─ studentRepo.js
│  ├─ services/
│  │  ├─ authService.js
│  │  ├─ studentService.js
│  │  └─ attendanceService.js
│  ├─ controllers/
│  │  ├─ authController.js
│  │  ├─ studentController.js
│  │  └─ ...
│  ├─ routes/
│  │  ├─ authRoutes.js
│  │  ├─ studentRoutes.js
│  │  ├─ attendanceRoutes.js
│  │  └─ index.js
│  ├─ socket/
│  │  ├─ handlers/
│  │  │  ├─ attendanceEvents.js
│  │  │  └─ announcementEvents.js
│  │  └─ socketAuth.js
│  ├─ utils/
│  │  ├─ asyncHandler.js
│  │  ├─ jwt.js
│  │  └─ logger.js
│  └─ tests/
│     ├─ auth.test.js
│     ├─ tenantIsolation.test.js
│     └─ attendance.test.js
├─ frontend/
│  ├─ web/
│  │  ├─ src/
│  │  │  ├─ app/
│  │  │  ├─ pages/
│  │  │  ├─ components/
│  │  │  ├─ hooks/
│  │  │  ├─ services/apiClient.ts
│  │  │  ├─ store/
│  │  │  └─ auth/
│  ├─ mobile/
│  │  ├─ src/
│  │  │  ├─ screens/
│  │  │  ├─ components/
│  │  │  ├─ hooks/
│  │  │  ├─ services/apiClient.ts
│  │  │  ├─ services/socket.ts
│  │  │  └─ auth/
│  ├─ shared/
│  │  ├─ constants/
│  │  ├─ types/
│  │  └─ validation/
├─ docs/
│  └─ mvp-multitenant-architecture.md
└─ README.md
```

---

## 3) Multi-tenant strategy (shared DB + schoolId)

## Tenant model
- **One MongoDB database**, shared collections for MVP.
- Every tenant-aware document has:
  - `_id`
  - `schoolId` (**required, indexed, immutable in app logic**)
  - audit fields (`createdBy`, `updatedBy`, timestamps)

## Enforced data isolation rules
1. `schoolId` is **never taken from request body** for normal users.
2. `schoolId` is derived from JWT claim: `token.schoolId`.
3. All reads/writes use a tenant filter:
   - Read: `{ schoolId: req.user.schoolId, ... }`
   - Update/Delete: `{ _id, schoolId: req.user.schoolId }`
4. Controllers must reject requests if token has no `schoolId`.
5. Super-admin endpoints are isolated under separate routes and role checks.

## Mongoose guardrails (important)
- Add a tenant plugin or base repository to auto-append schoolId filters.
- For create operations, set `doc.schoolId = req.user.schoolId` server-side.
- Use schema-level compound indexes like:
  - `Student: { schoolId: 1, admissionNo: 1 }` unique
  - `User: { schoolId: 1, email: 1 }` unique
  - `Attendance: { schoolId: 1, studentId: 1, date: 1 }`

## JWT payload recommendation
```json
{
  "sub": "userId",
  "schoolId": "school_123",
  "role": "teacher",
  "iat": 1710000000,
  "exp": 1710003600
}
```

## Socket.IO isolation
- Authenticate socket handshake with JWT.
- Join room: `school:{schoolId}`.
- Broadcast school-scoped events only to that room.
- Never emit global school data in shared channels.

---

## 4) Request lifecycle (login → API → DB)

## A) Login flow
1. User enters mobile/email + password + school code (or school-specific subdomain).
2. Backend validates school and user credentials.
3. Backend returns JWT containing `schoolId`, `role`, and `sub`.
4. Frontend stores access token securely:
   - Web: httpOnly cookie preferred (MVP can start with memory/localStorage with short TTL)
   - Mobile: secure storage

## B) Authenticated API request flow
1. Client sends `Authorization: Bearer <JWT>`.
2. `auth` middleware verifies JWT signature and expiry.
3. `tenantContext` middleware sets `req.tenant.schoolId = req.user.schoolId`.
4. `requireRole` middleware checks permissions.
5. Controller/service performs query with mandatory `schoolId` filter.
6. DB returns only matching tenant records.
7. Response returned with minimal payload (good for low bandwidth).

## C) Example safe query
```js
// GET /students/:id
const schoolId = req.user.schoolId;
const student = await Student.findOne({ _id: req.params.id, schoolId });
if (!student) return res.status(404).json({ message: 'Not found' });
```

## D) Anti-patterns to avoid
- `Student.findById(req.params.id)` without schoolId.
- Trusting `req.body.schoolId` from frontend.
- Using socket events without tenant room checks.

---

## 5) Scaling strategy (cheap infra first)

## Phase 1: MVP (0–20 schools)
- **Single Node.js instance** (e.g., Render/Railway/Fly/cheap VM)
- **MongoDB Atlas M0** free tier
- **Single process Socket.IO**
- Daily backups via `mongodump` script to object storage (if budget allows)
- Basic monitoring: uptime ping + log drains

## Phase 2: Early growth (20–100 schools)
- Upgrade Atlas tier for storage/performance
- Add Redis for cache + Socket.IO adapter (if multiple app instances)
- Split worker jobs (fee reminders, report generation)
- Add CDN for static assets and app updates

## Phase 3: Stable SMB scale (100+ schools)
- Horizontal app scaling behind load balancer
- Dedicated job queue (BullMQ)
- Read-heavy optimization: indexes, selective denormalization
- Optional tenant tiering:
  - shared cluster for small schools
  - dedicated DB for premium schools

## Low-cost optimization for Indian small schools
- Default lightweight payloads; paginate everything.
- Cache lookup data (classes, subjects) in app.
- Offer offline-first attendance on mobile with sync queue.
- Compress responses (gzip/brotli).
- Use WhatsApp/SMS integrations sparingly with template batching.
- Keep reports asynchronous (download later) instead of blocking UI.

---

## Practical MVP checklist
- [ ] `schoolId` required in all tenant collections
- [ ] Isolation test suite proving cross-school access is blocked
- [ ] JWT includes `schoolId`, `role`, `sub`
- [ ] Controllers reject missing tenant context
- [ ] Socket rooms scoped by school
- [ ] Compound indexes added for each core module
- [ ] Basic audit logs for sensitive actions (fee changes, user role updates)

This design keeps infra and engineering effort small while preserving strict multi-tenant isolation from day one.
