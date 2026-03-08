# Herbify (MERN) – Herbal Products & Medicinal Herbs

## Quick start (local)

### Prereqs
- Node.js + npm
- MongoDB Atlas connection string

### Setup
1. Install deps from repo root:

```bash
npm install
```

2. Create env files:
- Copy `server/.env.example` → `server/.env` and fill values
- (Optional) Copy `client/.env.example` → `client/.env`

3. Seed sample data (optional but recommended):

```bash
npm --prefix server run seed
```

4. Run both server + client:

```bash
npm run dev
```

- Client: `http://localhost:5173`
- API: `http://localhost:5000/api/health`

## Admin access
- Registration creates a normal `user`.
- To use the admin dashboard, set a user’s role to `admin` in MongoDB (e.g., via Atlas UI).
- Admin pages: `/admin`

## Payments (Razorpay)
Set in `server/.env`:
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`

The checkout uses Razorpay Orders API and signature verification.

## Images (Cloudinary)
Set in `server/.env`:
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

Admin pages request a server signature and upload directly to Cloudinary.

## Production notes
- Set `NODE_ENV=production`
- Build client: `npm --prefix client run build`
- Start server: `npm --prefix server run start`
- In production mode, the server serves `client/dist` (SPA fallback) and keeps API routes under `/api/*`.

