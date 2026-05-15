# Desk+ Frontend Build Plan

## What We're Building
Full frontend for Desk+ — a premium office furniture marketplace.  
Design is done (HTML prototypes in `C:\Users\hp\Downloads\desk+`).  
Backend is done (Laravel API in `backend/`).  
Goal: Build the React frontend to match the design and connect it to the API.

---

## Stack
| Layer | Tech |
|---|---|
| Framework | React 19 + TypeScript |
| Build | Vite 8 |
| Routing | React Router 7 |
| State | Zustand 5 |
| HTTP | Axios |
| Styling | Tailwind CSS v3 (needs install) + custom CSS classes |
| Charts | Recharts |
| Icons | Material Symbols (Google — loaded via `<link>` in index.html) |
| Font | Inter (Google Fonts) |
| Auth | Laravel Sanctum (token-based, stored in localStorage as `desk_token`) |

---

## Design Tokens (from `shared/styles.css` + `shared/tw.js`)
```
primary:                #ba0a0d
primary-container:      #de2d24
surface:                #fcf9f8
surface-container-low:  #f6f3f2
surface-container:      #f0eded
surface-container-high: #eae7e7
surface-container-lowest: #ffffff
on-surface:             #1c1b1b
on-surface-variant:     #5c403c
outline:                #916f6a
outline-variant:        #e5bdb8
```

### Reusable CSS Classes (already defined in design, must replicate in Tailwind or index.css)
- `.btn-grad` — red gradient button (linear-gradient 135deg #ba0a0d → #de2d24)
- `.field` — form input style (48px height, rounded-xl, bg surface-container-high, red bottom border on focus)
- `.nav-glass` — sticky navbar (rgba blur backdrop)
- `.h-display` — headings (font-weight 900, uppercase, tight letter-spacing)
- `.chip` — pill tag (inline-flex, small text, rounded-full)
- `.ck` — checkbox style
- `.shadow-ambient` — soft shadow (0 20px 40px rgba(28,27,27,.06))
- `.ph-*` — placeholder image gradients (walnut, mesh-chair, dark, warm, cream, etc.)
- `.pulse-ring` — animated glow ring
- `.red-underline` — active nav link underline

---

## Project Structure (frontend/src)
```
src/
├── api/
│   ├── api.ts          ✅ exists (axios instance + interceptors)
│   ├── auth.ts         ✅ exists (needs fix: wrong endpoint /api/user → /me)
│   ├── products.ts     ✅ exists (needs fix: double /api/api prefix)
│   ├── orders.ts       ✅ exists
│   ├── index.ts        ✅ exists
│   ├── cart.ts         ❌ missing — needs to be created
│   ├── catalog.ts      ❌ missing — needs to be created (categories, spaces, tastes)
│   └── admin.ts        ❌ missing — needs to be created
├── store/
│   ├── authStore.ts    ✅ exists
│   └── cartStore.ts    ✅ exists (needs to be checked/completed)
├── components/
│   ├── guards/
│   │   ├── AuthGuard.tsx   ✅ exists
│   │   └── AdminGuard.tsx  ✅ exists (needs import fixes)
│   ├── layouts/
│   │   ├── MainLayout.tsx  ✅ stub — needs rebuild
│   │   ├── AdminLayout.tsx ✅ stub — needs rebuild
│   │   └── SellerLayout.tsx ✅ stub — needs rebuild
│   └── ui/
│       ├── Navbar.tsx      ✅ stub — needs rebuild
│       ├── Footer.tsx      ❌ missing
│       ├── ProductCard.tsx ✅ stub — needs rebuild
│       ├── CartDrawer.tsx  ✅ stub — needs rebuild
│       ├── FilterSidebar.tsx ✅ stub — needs rebuild
│       └── StatCard.tsx    ✅ stub — needs rebuild
├── pages/
│   ├── Home.tsx            ✅ stub — needs rebuild
│   ├── Products.tsx        ✅ stub — needs rebuild
│   ├── ProductDetail.tsx   ✅ stub — needs rebuild
│   ├── Cart.tsx            ✅ stub — needs rebuild
│   ├── Checkout.tsx        ✅ stub — needs rebuild
│   ├── Spaces.tsx          ✅ stub — needs rebuild
│   ├── Login.tsx           ✅ stub — needs rebuild
│   ├── Register.tsx        ❌ missing — needs to be created
│   ├── ForgotPassword.tsx  ❌ missing — needs to be created
│   ├── Account.tsx         ❌ missing — needs to be created
│   └── OrderTracking.tsx   ❌ missing — needs to be created
├── admin/
│   ├── Dashboard.tsx       ✅ stub — needs rebuild
│   ├── AdminProducts.tsx   ✅ stub — needs rebuild
│   ├── AdminOrders.tsx     ✅ stub — needs rebuild
│   ├── AdminUsers.tsx      ✅ stub — needs rebuild
│   ├── AdminReports.tsx    ✅ stub — needs rebuild
│   ├── AdminDiscounts.tsx  ❌ missing — needs to be created
│   └── AdminSellers.tsx    ❌ missing — needs to be created
├── types/
│   └── index.ts    ✅ complete — all interfaces defined
├── hooks/
│   ├── useAuth.ts      ✅ exists
│   ├── useCart.ts      ✅ exists
│   └── useProducts.ts  ✅ exists
├── App.tsx             ✅ exists (needs missing routes added)
├── main.tsx            ✅ exists
└── index.css           ✅ exists (needs full Desk+ design system)
```

---

## Backend API Reference
Base URL: `http://localhost:8000/api` (proxied via Vite during dev)  
Auth: Bearer token in `Authorization` header (stored as `desk_token` in localStorage)

### Public Endpoints
```
POST /register
POST /login
GET  /categories
GET  /spaces
GET  /spaces/:slug
GET  /tastes
GET  /products               ?category_id, space_id, taste_id, min_price, max_price,
                              in_stock, is_featured, search, sort, page, per_page
GET  /products/featured
GET  /products/new-arrivals
GET  /products/:slug
GET  /products/:slug/reviews
POST /discounts/validate
```

### Authenticated Endpoints
```
GET    /me
POST   /logout
GET    /cart
POST   /cart/items           { product_id, variant_id?, quantity }
PATCH  /cart/items/:id       { quantity }
DELETE /cart/items/:id
DELETE /cart
POST   /cart/coupon          { code }
DELETE /cart/coupon
GET    /orders
GET    /orders/:id
POST   /orders               { shipping, payment_method, coupon_code?, notes? }
POST   /products/:slug/reviews
DELETE /reviews/:id
```

### Admin Endpoints (require role=admin)
```
GET    /admin/stats
GET    /admin/orders
PATCH  /admin/orders/:id/status   { status }
GET    /admin/users
PUT    /admin/users/:id/role       { role }
DELETE /admin/users/:id
POST   /admin/products
PUT    /admin/products/:id
DELETE /admin/products/:id
POST   /admin/categories
PUT    /admin/categories/:id
DELETE /admin/categories/:id
GET    /admin/discounts
POST   /admin/discounts
PUT    /admin/discounts/:id
DELETE /admin/discounts/:id
GET    /admin/reports/export
GET    /admin/reviews
PATCH  /admin/reviews/:id/approve
DELETE /admin/reviews/:id
```

---

## Pages to Build (16 total)

### Customer (storefront)
| Page | Route | Design file |
|---|---|---|
| Home | `/` | (no separate page — hero + sections) |
| Product Detail | `/products/:slug` | `pages/product-detail.html` |
| Search / Products | `/products` | `pages/search.html` |
| Cart | `/cart` | `pages/cart.html` |
| Checkout | `/checkout` | `pages/checkout.html` |
| Spaces | `/spaces` | `pages/spaces.html` |
| My Account | `/account` | `pages/account.html` |
| Order Tracking | `/orders/:id` | `pages/order-tracking.html` |

### Auth
| Page | Route | Design file |
|---|---|---|
| Login | `/login` | (split-screen like register) |
| Register | `/register` | `pages/register.html` |
| Forgot Password | `/forgot-password` | `pages/forgot-password.html` |

### Admin
| Page | Route | Design file |
|---|---|---|
| Dashboard | `/admin` | `admin/Dashboard.tsx` (KPIs + charts) |
| Products | `/admin/products` | `pages/admin-products.html` |
| Orders | `/admin/orders` | `pages/admin-orders.html` |
| Users | `/admin/users` | `pages/admin-users.html` |
| Reports | `/admin/reports` | `pages/admin-reports.html` |
| Discounts | `/admin/discounts` | `pages/admin-discounts.html` |
| Sellers | `/admin/sellers` | `pages/admin-sellers.html` |

---

## Task List

> Start from Task 1. Each task is self-contained. Mark `[x]` when done.

### Phase 0 — Foundation

- [x] **Task 1 — Install Tailwind CSS**
  - `npm install -D tailwindcss@3 postcss autoprefixer`
  - `npx tailwindcss init -p`
  - Configure `tailwind.config.js` with Desk+ design tokens (all colors above)
  - Add `@tailwind base/components/utilities` to `index.css`
  - Replace current `index.css` content with Desk+ base styles + all custom classes

- [x] **Task 2 — Update index.html + fix global setup**
  - Add Inter font link to `frontend/index.html`
  - Add Material Symbols Outlined link to `frontend/index.html`
  - Fix `api/auth.ts`: endpoint `/api/user` → `/me` and `authApi` export wrapper
  - Fix `api/products.ts`: remove double `/api` prefix (baseURL already includes `/api`)
  - Create `api/cart.ts` (all cart endpoints)
  - Create `api/catalog.ts` (categories, spaces, tastes)
  - Create `api/admin.ts` (all admin endpoints)
  - Update `api/index.ts` to export all modules
  - Fix `AdminGuard.tsx` missing imports (useAuthStore, useEffect, Navigate, Outlet)
  - Fix `AuthGuard.tsx` (check it has proper imports)

- [ ] **Task 3 — Add missing routes to App.tsx**
  - Add `/register` → `Register`
  - Add `/forgot-password` → `ForgotPassword`
  - Add `/account` → `Account` (inside AuthGuard)
  - Add `/orders/:id` → `OrderTracking` (inside AuthGuard)
  - Add `/admin/discounts` → `AdminDiscounts`
  - Add `/admin/sellers` → `AdminSellers`

---

### Phase 1 — Shared Components

- [ ] **Task 4 — Navbar**
  - File: `components/ui/Navbar.tsx`
  - Sticky glass navbar (nav-glass class)
  - Logo: D+ square + "DESK+" text
  - Nav links: Products, Spaces, Styles (Tastes), Search
  - Right side: account icon, cart icon with item count badge, "Explore Spaces" red button
  - Active link gets red underline
  - Shows user name + logout button when logged in
  - Cart count comes from `cartStore`

- [ ] **Task 5 — Footer**
  - File: `components/ui/Footer.tsx`
  - Create `Footer.tsx` (dark bg surface-container-low, DESK+ logo, copyright, links)
  - Add Footer to `MainLayout.tsx`

- [ ] **Task 6 — MainLayout rebuild**
  - File: `components/layouts/MainLayout.tsx`
  - Wrap with `<Navbar />` + `<Footer />`
  - Full height layout, outlet in between

- [ ] **Task 7 — AdminLayout rebuild**
  - File: `components/layouts/AdminLayout.tsx`
  - Left sidebar: logo, nav links (Dashboard, Products, Orders, Users, Reports, Discounts, Sellers)
  - Active route highlighted (red left border + bg)
  - Top bar: page title + user avatar + logout
  - Right: `<Outlet />`
  - Design reference: `pages/admin-nav.js` (shared/admin-nav.js)

- [ ] **Task 8 — ProductCard**
  - File: `components/ui/ProductCard.tsx`
  - Props: product (Product type)
  - Image with placeholder gradient fallback
  - Name, price (with compare_price strikethrough if set)
  - Star rating + review count
  - "Add to cart" button
  - Hover lift effect (translateY -3px)
  - Links to `/products/:slug`

---

### Phase 2 — Auth Pages

- [ ] **Task 9 — Login page**
  - File: `pages/Login.tsx`
  - Split-screen: left brand panel (red bg, D+ logo, tagline, decorative circles SVG)
  - Right: form (email field, password field, sign in button)
  - "Don't have an account? Register" link
  - Calls `authStore.login()`, redirects based on role (admin → /admin, else → /)
  - Loading state on button

- [ ] **Task 10 — Register page**
  - File: `pages/Register.tsx` (create new)
  - Split-screen same left panel as Login
  - Right: "Step 1 of 2" form — first name, last name, email, phone, password, confirm password
  - Customer / Seller radio toggle
  - Social buttons (Google, Apple — UI only, no oauth)
  - Calls `authStore.register()`, redirects to `/`
  - "Already have account? Sign in" link

- [ ] **Task 11 — Forgot Password page**
  - File: `pages/ForgotPassword.tsx` (create new)
  - 3-step flow: Step 1 — enter email, Step 2 — enter OTP code, Step 3 — new password
  - Step state managed locally (useState)
  - API calls: placeholder (backend may not have password reset yet — show success toast after step 3)
  - "Back to login" link

---

### Phase 3 — Customer Pages

- [ ] **Task 12 — Home page**
  - File: `pages/Home.tsx`
  - Hero section: large headline, subtext, two CTAs ("Shop Now" + "View Spaces"), animated badge, background dot-grid pattern
  - Featured products: 4-column grid, fetches `GET /products/featured`, uses `<ProductCard />`
  - New arrivals: horizontal scroll row, fetches `GET /products/new-arrivals`
  - Spaces section: 3-column grid of Space cards, fetches `GET /spaces`
  - Styles/Tastes section: 4 style cards (Kendo, Coco, Woody, Hacker), fetches `GET /tastes`
  - Loading skeletons while fetching

- [ ] **Task 13 — Products / Search page**
  - File: `pages/Products.tsx`
  - Left sidebar filters: Category, Space, Taste, Price range (slider), In stock toggle
  - Right: search input at top, sort dropdown, product grid (3 cols), pagination
  - Fetches `GET /products` with filters as query params
  - URL search params sync with filters (so shareable URLs)
  - Empty state when no results
  - Loading skeleton grid

- [ ] **Task 14 — Product Detail page**
  - File: `pages/ProductDetail.tsx`
  - Image gallery: main image + thumbnails carousel
  - Product name, price, compare price, rating stars + review count
  - Variant selector: color swatches + material buttons
  - Quantity selector
  - Add to cart button (calls `POST /cart/items`)
  - Tabs: Description, Specifications, Reviews
  - Reviews list with star ratings
  - Fetches `GET /products/:slug` and `GET /products/:slug/reviews`

- [ ] **Task 15 — Cart page**
  - File: `pages/Cart.tsx`
  - Left (8 cols): cart items list, each with image, name, variant info, qty stepper, price, remove button
  - Promo code input field + apply button (calls `POST /cart/coupon`)
  - "Frequently bought together" bundle section (static UI or skip if no API)
  - Right (4 cols): sticky order summary — subtotal, discount, shipping, total
  - "Proceed to checkout" button → `/checkout`
  - Empty cart state with "Browse Products" CTA
  - Fetches `GET /cart`, updates via PATCH/DELETE cart item endpoints

- [ ] **Task 16 — Checkout page**
  - File: `pages/Checkout.tsx`
  - 3-step stepper: Delivery → Payment → Confirm
  - Step 1: shipping address form (first/last name, email, phone, address, city, country)
  - Step 2: payment method selector (Card, Cash, Bank Transfer), card number preview UI
  - Step 3: order summary review + place order button (calls `POST /orders`)
  - On success: show order reference + redirect to `/orders/:id`

- [ ] **Task 17 — Spaces page**
  - File: `pages/Spaces.tsx`
  - Hero banner with tagline
  - Grid of Space cards: cover image, name, layout type badge, total price, "Explore" button
  - Space detail expand: list of products in the space with individual add-to-cart
  - Fetches `GET /spaces`

- [ ] **Task 18 — Account page**
  - File: `pages/Account.tsx` (create new)
  - Left sidebar: avatar, name, email, nav (Overview, My Orders, Wishlist, Settings)
  - Overview tab: stats (total orders, total spent, loyalty points), recent orders list
  - My Orders tab: table of orders with status chips, link to tracking
  - Fetches `GET /orders` and `GET /me`

- [ ] **Task 19 — Order Tracking page**
  - File: `pages/OrderTracking.tsx` (create new)
  - Order reference header + status chip
  - Timeline stepper: Pending → Preparing → Shipping → Delivered (with timestamps)
  - Order items list with thumbnails
  - Shipping address card
  - Price breakdown
  - Fetches `GET /orders/:id`

---

### Phase 4 — Admin Pages

- [ ] **Task 20 — Admin Dashboard**
  - File: `admin/Dashboard.tsx`
  - KPI cards: Total Revenue, Total Orders, Total Users, Avg Order Value
  - Area chart (Recharts): monthly revenue — fetches `GET /admin/stats`
  - Donut chart: orders by status
  - Top products table
  - Seller rankings podium

- [ ] **Task 21 — Admin Products**
  - File: `admin/AdminProducts.tsx`
  - Stats bar: Total SKUs, In stock, Low stock, Out of stock
  - Filter tabs: All / Active / Drafts / Low stock / Archived
  - Search + Category/Style/Space filter dropdowns
  - Product table with checkbox, image, name, SKU, category, price, stock, status chip, actions menu
  - "New product" button → slide-over panel form (or modal)
  - Pagination
  - Fetches `GET /products` with admin filters, POST/PUT/DELETE via admin endpoints

- [ ] **Task 22 — Admin Orders**
  - File: `admin/AdminOrders.tsx`
  - Status tabs: All / Pending / Preparing / Shipping / Delivered / Cancelled
  - Orders table: reference, customer, date, items count, total, status chip, actions
  - Click row → right detail panel (order items, shipping address, status update dropdown)
  - Fetches `GET /admin/orders`, updates via `PATCH /admin/orders/:id/status`

- [ ] **Task 23 — Admin Users**
  - File: `admin/AdminUsers.tsx`
  - Users table: avatar, name, email, role chip, join date, order count, actions
  - Role filter (Admin / Seller / Customer)
  - Search input
  - Role change dropdown per row (calls `PUT /admin/users/:id/role`)
  - Delete user (calls `DELETE /admin/users/:id`)
  - Fetches `GET /admin/users`

- [ ] **Task 24 — Admin Reports**
  - File: `admin/AdminReports.tsx`
  - Date range selector
  - KPI row: Revenue, Orders, New Users, Avg Order
  - Area chart: revenue over time (Recharts AreaChart)
  - Donut chart: revenue by category (Recharts PieChart)
  - Top products table
  - Export CSV button (calls `GET /admin/reports/export`)
  - Fetches `GET /admin/stats`

- [ ] **Task 25 — Admin Discounts**
  - File: `admin/AdminDiscounts.tsx` (create new)
  - Discounts table: code, type, value, min order, uses/max uses, expiry, status toggle, actions
  - "Create discount" button → modal form
  - Toggle active/inactive
  - Fetches `GET /admin/discounts`, POST/PUT/DELETE

- [ ] **Task 26 — Admin Sellers**
  - File: `admin/AdminSellers.tsx` (create new)
  - Top 3 sellers podium with avatars, revenue, product count
  - Full rankings table: rank, seller name, products, revenue, status
  - "Approve" / "Suspend" actions per seller
  - Fetches from `GET /admin/stats` (seller_rankings field)

---

### Phase 5 — Polish

- [ ] **Task 27 — Loading & error states**
  - Create `components/ui/Skeleton.tsx` — reusable loading placeholder
  - Add loading spinners to all pages that fetch data
  - Add error boundary or inline error messages for failed API calls
  - Empty states with illustrations/icons for: empty cart, no products found, no orders yet

- [ ] **Task 28 — Toast notifications**
  - Add a simple toast system (no library needed — just Zustand store + fixed positioned div)
  - Show success toasts: "Added to cart", "Order placed", "Discount applied", etc.
  - Show error toasts: API error messages

- [ ] **Task 29 — Cart sync**
  - `cartStore.ts`: implement `fetchCart()`, `addItem()`, `updateItem()`, `removeItem()`, `applyCoupon()`
  - On app load (in main.tsx or App.tsx): call `fetchCart()` if user is logged in
  - Navbar cart badge updates in real time

- [ ] **Task 30 — Final wiring + QA**
  - Test full flow: Register → Browse products → Add to cart → Checkout → Track order
  - Test admin flow: Login as admin → Dashboard → Manage products → Update order status
  - Fix any broken links, missing imports, or API mismatches
  - Ensure all routes work with page refresh (Vite config already handles this)

---

## How to Resume
1. Open this file
2. Find the first unchecked task `[ ]`
3. Read the task description + check the referenced design file in `C:\Users\hp\Downloads\desk+\pages\`
4. Build it
5. Mark `[x]` when done, move to next task

## File Paths Quick Reference
- **Design files:** `C:\Users\hp\Downloads\desk+\pages\`
- **Shared design styles:** `C:\Users\hp\Downloads\desk+\shared\styles.css`
- **Frontend src:** `C:\Users\hp\Desktop\project-404\desk-plus\frontend\src\`
- **Backend API routes:** `C:\Users\hp\Desktop\project-404\desk-plus\backend\routes\api.php`
- **Types:** `frontend/src/types/index.ts` (complete — don't modify)
- **API client:** `frontend/src/api/api.ts` (complete — don't modify)
