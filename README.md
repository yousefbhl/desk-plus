# Desk+ — Premium Office Furniture E-Commerce Platform

Full-stack e-commerce platform built as an end-of-study project (PFE) for
module **M206 — Cloud Native Application**.

**Stack:** Laravel 11 REST API · React 19 + TypeScript + Vite · Supabase
PostgreSQL · Tailwind CSS · Zustand · TanStack Query · Laravel Sanctum

**Features:** product catalog, cart & checkout, orders, customer accounts,
Google OAuth sign-in, email password reset, role-based access (customer /
seller / admin), seller dashboard with live stats & product management, and a
full admin suite.

---

## Prerequisites

Make sure these are installed:

- **PHP** ≥ 8.2 (`php -v`)
- **Composer** (`composer -V`)
- **Node.js** ≥ 18 and npm (`node -v`)
- A **Supabase** account (free) — for the PostgreSQL database + image storage
- A **Google Cloud** account — only if testing Google sign-in
- A **Gmail** account with 2FA — only if testing password-reset emails

> No local MySQL/PostgreSQL install needed — the database is hosted on Supabase.

---

## Quick Start (TL;DR)

```bash
# 1. clone
git clone <repo-url>
cd desk-plus

# 2. backend
cd backend
composer install
cp .env.example .env          # then fill in .env (see below)
php artisan key:generate
php artisan config:clear
php artisan migrate            # creates the tables
php artisan db:seed            # optional: demo data
php artisan serve              # → http://localhost:8000

# 3. frontend (new terminal)
cd frontend
npm install
cp .env.example .env          # then fill in VITE_SUPABASE_* 
npm run dev                    # → http://localhost:5173
```

Then open **http://localhost:5173**.

---

## Detailed Setup

### 1. Backend dependencies
```bash
cd backend
composer install
```
This installs Laravel + all packages (including **Laravel Socialite** for
Google OAuth). `vendor/` is gitignored, so this step is required after every
fresh clone.

### 2. Backend environment
```bash
cp .env.example .env
php artisan key:generate
```
Now open `backend/.env` and fill in:

**Database (required)** — from Supabase → Project Settings → Database → Connection string:
```env
DB_CONNECTION=pgsql
DB_URL=postgresql://postgres.PROJECT_REF:PASSWORD@aws-1-REGION.pooler.supabase.com:5432/postgres
PGSSLMODE=require
```

**Google OAuth (optional — for "Sign in with Google")** — from Google Cloud Console → Credentials:
```env
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-secret
GOOGLE_REDIRECT_URI=http://localhost:8000/api/auth/google/callback
```
> In Google Cloud, the **Authorized redirect URI** must match `GOOGLE_REDIRECT_URI` exactly.
> While the OAuth app is in "testing" mode, add each tester's Gmail under **Audience → Test users**.

**Mail (optional — for password reset emails)** — Gmail SMTP:
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=youraddress@gmail.com
MAIL_PASSWORD=your_16_char_app_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=youraddress@gmail.com
MAIL_FROM_NAME="Desk+"
```
> `MAIL_PASSWORD` is a Google **App Password** (https://myaccount.google.com/apppasswords),
> NOT your normal Gmail password. Requires 2-Step Verification enabled. Remove the spaces.
> `MAIL_USERNAME` and `MAIL_FROM_ADDRESS` must be the **same** address.
> No Gmail? Set `MAIL_MAILER=log` and read codes from `storage/logs/laravel.log`.

**⚠️ After ANY change to `.env`, always run:**
```bash
php artisan config:clear
```
Laravel caches config — without this, your changes won't take effect. (This is
the single most common setup mistake.)

### 3. Database tables
```bash
php artisan migrate          # create the schema
php artisan db:seed          # optional: admin/seller/customer demo accounts + products
```
Verify the DB connected:
```bash
php artisan migrate:status   # lists migrations = connected OK
```

Seeded demo accounts (if you ran the seeder) use the `@deskplus.ma` domain with
password `password`.

### 4. Run the backend
```bash
php artisan serve            # http://localhost:8000
```

### 5. Frontend
```bash
cd frontend
npm install                  # installs React + all deps (incl. @supabase/supabase-js)
cp .env.example .env
```
Fill `frontend/.env`:
```env
VITE_SUPABASE_URL=https://PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_public_key
```
> The **anon/public** key is safe in the browser. Never put the service_role key here.

```bash
npm run dev                  # http://localhost:5173
```

### 6. Supabase Storage (for product images)
In the Supabase dashboard → Storage:
- Create a **public** bucket named `product-images` (if not already present).
- Allowed MIME types: leave blank (allow all) or include `image/jpeg`, `image/png`, `image/webp`.
- File size limit: ~5 MB.

---

## Project Structure

```
desk-plus/
├── backend/                 # Laravel 11 REST API
│   ├── app/
│   │   ├── Http/Controllers/Api/   # Auth, Product, Order, Seller, Admin, PasswordReset...
│   │   ├── Models/
│   │   └── Mail/                   # password reset mailable
│   ├── database/migrations/
│   ├── routes/api.php
│   └── .env.example
└── frontend/                # React 19 + TS + Vite
    ├── src/
    │   ├── api/             # axios client + endpoint wrappers
    │   ├── pages/           # customer + auth pages
    │   ├── admin/           # admin suite pages
    │   ├── seller/          # seller dashboard pages
    │   ├── components/      # layouts, guards, UI
    │   ├── store/           # Zustand stores (auth, cart, toast)
    │   └── lib/             # supabase upload, export helpers
    └── .env.example
```

---

## User Roles

| Role | Access | How to get it |
|---|---|---|
| **customer** | storefront, cart, orders, account | default on signup |
| **seller** | `/seller` — dashboard, products, orders, stats | chosen at signup or set by admin |
| **admin** | `/admin` — full management suite | seeded / set in DB |

New Google sign-ups choose customer or seller on a "Choose role" screen.

---

## Common Issues & Fixes

| Problem | Fix |
|---|---|
| `Class "Laravel\Socialite..." not found` | Run `composer install` (deps aren't in git). |
| `SQLSTATE[HY000] [2002] connection refused (mysql)` | `.env` still set to MySQL. Set `DB_CONNECTION=pgsql` + `DB_URL`, then `php artisan config:clear`. |
| `.env` changes not taking effect | `php artisan config:clear` (and `cache:clear`). Always. |
| Google login: `redirect_uri_mismatch` | The URI in Google Cloud must exactly equal `GOOGLE_REDIRECT_URI`. |
| Google login: `Access blocked / app not verified` | Add the tester's Gmail under Google Cloud → Audience → Test users. |
| Password reset email never arrives | Wrong Gmail App Password / spaces in it / 2FA off. Or use `MAIL_MAILER=log`. |
| `535 Username and Password not accepted` | Using normal Gmail password instead of an App Password. |
| Image upload `400 Bad Request` | Bucket `product-images` not public, or MIME type restricted. Allow `image/jpeg` etc. |
| Frontend can't reach API / CORS error | Confirm backend running on :8000 and `FRONTEND_URL=http://localhost:5173` in backend `.env`. |
| `npm run dev` missing modules | Run `npm install` in `frontend/`. |

---

## Available Scripts

**Backend**
```bash
php artisan serve            # run API
php artisan migrate          # run migrations
php artisan migrate:fresh --seed   # reset DB + seed
php artisan route:list       # list all routes
php artisan config:clear     # clear cached config (run after .env edits)
```

**Frontend**
```bash
npm run dev                  # dev server
npm run build                # production build
npm run preview              # preview the build
```

---

## Team — 404 Not Found

End-of-study project (PFE) · OFPPT · Module M206 — Cloud Native Application.

---

## Notes

- Never commit your real `.env` — only `.env.example` (with blank values) belongs in git.
- The hosted database is shared; coordinate before running `migrate:fresh` (it wipes data).
- For production you'd deploy the API (Railway/Render) and frontend (Vercel) and
  move all secrets into the host's environment variables.