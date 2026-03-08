# Herbify – Environment & Setup Guide

This guide explains **all environment variables** and **steps to run Herbify** smoothly in development and production.

---

## 1. Environment files created for you

Already present in the repo:

- `server/.env` – backend configuration
- `client/.env` – frontend configuration
- `server/.env.example` and `client/.env.example` – reference templates

You only need to **fill in the placeholder values in `server/.env`** with your real credentials.

---

## 2. `server/.env` – backend variables

File: `server/.env`

| Variable | Required | Example | What it does |
|---------|----------|---------|--------------|
| `NODE_ENV` | no (recommended) | `development` / `production` | Controls Express behavior and security defaults. Use `production` on a real server. |
| `PORT` | no | `5000` | Port for the Express API. Frontend assumes `5000` in dev. |
| `CLIENT_ORIGIN` | no | `http://localhost:5173` | URL of the React app. Used for CORS + cookies. Change to your deployed frontend URL in prod. |
| `MONGODB_URI` | **yes** | `mongodb+srv://user:pass@cluster/db?retryWrites=true&w=majority` | MongoDB Atlas connection string. |
| `JWT_ACCESS_SECRET` | **yes** | long random string (32+ chars) | Secret for signing access JWTs (httpOnly cookie). Keep this private. |
| `JWT_ACCESS_EXPIRES_IN` | no | `7d` | How long access tokens are valid. Any JWT duration format (e.g. `1d`, `12h`). |
| `CLOUDINARY_CLOUD_NAME` | optional (required for image upload) | `my-cloud` | Cloud name from Cloudinary dashboard. |
| `CLOUDINARY_API_KEY` | optional | `1234567890` | API key from Cloudinary. |
| `CLOUDINARY_API_SECRET` | optional | `abc123...` | API secret from Cloudinary (keep private). |
| `RAZORPAY_KEY_ID` | optional (required for live checkout) | `rzp_test_...` | Razorpay key ID (use test keys in dev). |
| `RAZORPAY_KEY_SECRET` | optional | `xxxxxx` | Razorpay key secret (keep private). |

### 2.1 Getting values

**MongoDB Atlas (`MONGODB_URI`)**

1. Create a free cluster in MongoDB Atlas.
2. Add a database user and password.
3. In Atlas, click **Connect → Drivers**, copy the **connection string**, and paste into `MONGODB_URI`.
4. Replace `<password>` and `<db-name>` appropriately.

**Cloudinary**

1. Create an account at Cloudinary.
2. Go to **Dashboard** → copy:
   - `Cloud name` → `CLOUDINARY_CLOUD_NAME`
   - `API Key` → `CLOUDINARY_API_KEY`
   - `API Secret` → `CLOUDINARY_API_SECRET`

**Razorpay**

1. Create an account at Razorpay and switch to **Test Mode**.
2. Go to **Developers → API Keys**.
3. Generate test keys and copy:
   - `Key Id` → `RAZORPAY_KEY_ID`
   - `Key Secret` → `RAZORPAY_KEY_SECRET`

---

## 3. `client/.env` – frontend variables

File: `client/.env`

```env
VITE_API_URL=http://localhost:5000
```

- **`VITE_API_URL`**: Base URL for the API used by Axios.
  - In development: `http://localhost:5000`
  - In production: set to your deployed backend URL (e.g. `https://api.yourdomain.com`)

---

## 4. Running the project (development)

From the project root:

1. **Install dependencies**

```bash
npm install
```

2. **Configure envs**

- Edit `server/.env` with your MongoDB / Cloudinary / Razorpay values.
- Leave `client/.env` as-is unless your API runs on a different host/port.

3. **Seed sample data (optional but recommended)**

This creates example categories, herbs, and products:

```bash
npm --prefix server run seed
```

4. **Start both backend + frontend**

```bash
npm run dev
```

- React app: `http://localhost:5173`
- API health check: `http://localhost:5000/api/health`

---

## 5. Admin access

1. Register a normal account via the UI (`/register`).
2. In MongoDB Atlas, open the `users` collection.
3. Find your user document and set:
   - `role: "admin"`
4. Now you can access:
   - Admin dashboard: `/admin`
   - Admin sections: `/admin/categories`, `/admin/herbs`, `/admin/products`, `/admin/contacts`

Cloudinary and Razorpay must be configured in `server/.env` for:
- Image uploads from admin forms.
- Live Razorpay checkout flow.

---

## 6. Production deployment (overview)

1. Set `NODE_ENV=production` in `server/.env`.
2. Build the frontend:

```bash
npm --prefix client run build
```

3. Ensure `MONGODB_URI`, `JWT_ACCESS_SECRET`, Cloudinary, and Razorpay variables are set correctly on your server.
4. Start the backend:

```bash
npm --prefix server run start
```

In production mode:
- Express serves the built React app from `client/dist`.
- All API endpoints stay under `/api/*`.

