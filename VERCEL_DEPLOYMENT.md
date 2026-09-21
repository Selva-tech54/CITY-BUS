# Hosting TransitNow on Vercel

This guide explains how to deploy the **TRANSITNOW** platform on Vercel.

---

## ⚠️ Important Real-Time WebSocket Notice

- **Vercel is a Serverless Platform**: It is designed for frontend static assets and short-lived serverless functions (REST APIs).
- **Persistent WebSockets (`/ws/transit`)**: Standard Vercel Serverless Functions have execution timeouts (10s to 60s) and cannot hold permanent, stateful WebSocket connections for continuous GPS streaming.
- Therefore, there are **two ways** to host TransitNow with Vercel:

---

## Option A (Recommended): Frontend on Vercel + Backend on Render / Railway / Fly.io

This is the industry standard for real-time GIS and transit applications:
- **Vercel**: Hosts the 3 decoupled frontends (`passenger-app`, `driver-app`, `operations-app`) on Vercel's global Edge CDN.
- **Render / Railway / Fly.io**: Hosts the FastAPI backend container with 24/7 continuous WebSockets, Kalman filtering, and PostgreSQL/PostGIS.

### Step 1: Deploy Backend to Render (Free)
1. Push this project to GitHub.
2. Go to [render.com](https://render.com) and click **New + Web Service**.
3. Connect your GitHub repository.
4. Select **Docker** environment (Render will automatically detect `Dockerfile`).
5. Set Environment Variables:
   - `DATABASE_URL`: Your PostgreSQL connection string (or use Render's free PostgreSQL).
   - `SECRET_KEY`: `your-random-production-secret`
6. Click **Deploy**. Your backend will be live at `https://transitnow-backend.onrender.com`.

### Step 2: Deploy Frontend to Vercel
1. Go to [vercel.com](https://vercel.com) and click **Add New Project**.
2. Select your GitHub repository.
3. In `vercel.json`, update the rewrite rules to point to your Render backend:
```json
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "https://transitnow-backend.onrender.com/api/$1" },
    { "source": "/ws/(.*)", "destination": "wss://transitnow-backend.onrender.com/ws/$1" }
  ]
}
```
4. Click **Deploy**!
5. Your platform is live at `https://your-project.vercel.app/passenger`, `/driver-app`, and `/operations` with full real-time WebSocket connectivity.

---

## Option B: Direct Serverless Deployment on Vercel (Frontends + Python API)

We have already configured `vercel.json` and `api/index.py` for direct deployment:

### Step 1: Install Vercel CLI (Optional) or Use GitHub
```bash
npm install -g vercel
```

### Step 2: Set Cloud Database
Because Vercel serverless functions have a read-only filesystem, SQLite cannot persist data across serverless instances. You need an external PostgreSQL database (such as [Neon.tech](https://neon.tech) or [Supabase.com](https://supabase.com), both offer free tiers).

In your Vercel Project Settings ➔ **Environment Variables**:
- `DATABASE_URL`: `postgresql://user:password@ep-xyz.neon.tech/transitnow?sslmode=require`
- `SECRET_KEY`: `transitnow-super-secret-key-2026`

### Step 3: Deploy
Run from the project root:
```bash
vercel --prod
```
Or push to GitHub and click **Deploy** on Vercel.

### Vercel Route Mappings:
- **Passenger App**: `https://your-app.vercel.app/passenger`
- **Driver Cockpit**: `https://your-app.vercel.app/driver-app`
- **Operations Control**: `https://your-app.vercel.app/operations`
- **REST APIs**: `https://your-app.vercel.app/api/...`
