# The Ready Brand API

Node.js / Express / TypeScript / MongoDB backend for **The Ready Brand** job listing + CV service marketplace.

## Setup

```bash
cp .env.example .env
# Edit MONGODB_URI, JWT_SECRET, ADMIN_*, and CLOUDINARY_* as needed

npm install
npm run seed   # optional — seed also runs on server start
npm run dev
```

### Cloudinary

Used for avatar/logo images and resume/document uploads. Set these in `.env`:

```
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

API: `http://localhost:4000`  
Health: `GET /api/health`

Default admin (from `.env`):
- Email: `admin@thereadybrand.com`
- Password: `Admin123!`

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start with tsx watch |
| `npm run build` | Compile to `dist/` |
| `npm start` | Run compiled `dist/index.js` |
| `npm run seed` | Seed admin + packages only |

## Auth

- `POST /api/auth/signup` — `{ email, password, name, role: "seeker"\|"hirer", companyName? }`
- `POST /api/auth/login`
- `GET /api/auth/me` — Bearer JWT

## Main routes

See plan / OpenAPI-style summary:

- Public: `GET /api/jobs`, `GET /api/jobs/:id`, `GET /api/packages`
- Seeker: applications, orders, profile
- Hirer: jobs CRUD, applicants, company
- Admin: stats, users, jobs, applications, orders, packages
- Uploads (Bearer auth, `multipart/form-data` field `file`):
  - `POST /api/uploads/image` — jpeg/png/webp/gif ≤ 5MB → `{ file: { url, publicId, ... } }`
  - `POST /api/uploads/document` — pdf/doc/docx ≤ 10MB
  - `POST /api/uploads/avatar` — image + sets `user.avatarUrl`
  - `POST /api/uploads/resume` — document + sets `seekerProfile.resumeUrl` (seeker)
  - `POST /api/uploads/logo` — image + sets `company.logo` (hirer)

## Frontend integration

The Vite app currently uses mock data. To wire later:

```env
VITE_API_URL=http://localhost:4000/api
```

Send `Authorization: Bearer <token>` on protected routes.
