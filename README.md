# Desk+ Monorepo

This repository contains:

- backend: Laravel 11 API with Sanctum and role scaffolding
- frontend: React + TypeScript + Vite client

## Quick start

1. Start MySQL (optional via Docker):
   - docker compose up -d
2. Backend:
   - cd backend
   - composer install
   - copy .env.example .env (already generated)
   - php artisan key:generate
   - php artisan migrate --seed
   - php artisan serve
3. Frontend:
   - cd frontend
   - npm install
   - npm run dev

## Defaults

- Backend URL: http://localhost:8000
- Frontend URL: http://localhost:5173
- Seeded admin: admin@deskplus.local / password123
- Seeded seller: seller@deskplus.local / password123
