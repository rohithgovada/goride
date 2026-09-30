# GoRide Deployment Guide 🚀

This document provides step-by-step instructions to deploy the **GoRide** multi-modal transit platform across cloud providers for both frontend and backend.

---

## 1. Quick Local Development

### Prerequisites:
- **Node.js**: v18+ (tested on Node v24)
- **npm**: v9+

### Running the Frontend:
```powershell
cd C:\Users\rohit\.gemini\antigravity\scratch\goride\frontend
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Running the Backend:
```powershell
cd C:\Users\rohit\.gemini\antigravity\scratch\goride\backend
npm start
```
Runs at [http://localhost:5000](http://localhost:5000).

---

## 2. Deploying the Frontend (React + Vite + Leaflet)

### Option A: Vercel (Recommended & Free)
1. Push your project or `frontend` directory to a GitHub repository.
2. Go to [Vercel](https://vercel.com/) and click **Add New Project**.
3. Import your GitHub repository.
4. Set **Root Directory** to `frontend`.
5. Framework Preset: **Vite**.
6. Build Command: `npm run build`
7. Output Directory: `dist`
8. Click **Deploy**. Vercel will provide an instant HTTPS URL (e.g., `https://goride.vercel.app`).

### Option B: Netlify
1. Log in to [Netlify](https://www.netlify.com/).
2. Choose **Add new site** > **Import an existing project**.
3. Select your repository.
4. Base directory: `frontend`
5. Build command: `npm run build`
6. Publish directory: `frontend/dist`
7. Click **Deploy Site**.

### Option C: Cloudflare Pages
1. Connect Cloudflare to your GitHub repo.
2. Select **Framework preset: Vite**.
3. Root folder: `frontend`.
4. Output directory: `dist`.

---

## 3. Deploying the Backend API (Node.js & Express)

### Option A: Render (Free Tier Available)
1. Sign up on [Render.com](https://render.com/).
2. Click **New +** > **Web Service**.
3. Connect your repository.
4. Set **Root Directory** to `backend`.
5. Environment: **Node**.
6. Build Command: `npm install`
7. Start Command: `npm start`
8. Add Environment Variables:
   - `PORT`: `5000`
   - `NODE_ENV`: `production`
9. Click **Create Web Service**. Render gives you a secure public URL like `https://goride-api.onrender.com`.

### Option B: Railway
1. Go to [Railway.app](https://railway.app/).
2. Click **New Project** > **Deploy from GitHub repo**.
3. Specify `backend` directory.
4. Railway will auto-detect Node.js and deploy automatically.

### Option C: Docker Container Deployment
Use the following Dockerfile in `backend/`:

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["node", "src/server.js"]
```

Build and run:
```bash
docker build -t goride-backend .
docker run -p 5000:5000 goride-backend
```

---

## 4. Connecting Frontend to Production Backend
In `frontend/src/` you can configure an `.env.production` file:
```env
VITE_API_BASE_URL=https://goride-api.onrender.com
```

---

## 5. Summary of Architecture & Capabilities
| Component | Technology | Features |
|---|---|---|
| **Frontend** | React 19, TypeScript, Tailwind CSS, Leaflet | Origin/Destination location mapping, multi-modal routing (Bike, Auto, Bus, Metro), live simulation HUD, digital QR passes, SOS safety |
| **Backend** | Node.js, Express, CORS, REST | Geospatial distance calculation, multi-modal fare matrix, station directories, dispatch simulation |
| **Map Engine**| Leaflet + OpenStreetMap | 100% Free, zero credit card requirement, customizable polylines and vehicle markers |
