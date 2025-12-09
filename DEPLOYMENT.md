# Deployment Guide

## Overview

This application has two components:
- **Frontend**: React app (deploy to Vercel)
- **Backend**: Python FastAPI app (deploy to Railway/Render/Heroku)

## Step 1: Deploy Backend

### Option A: Railway (Recommended)

1. Go to [railway.app](https://railway.app) and sign in with GitHub
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway will auto-detect Python. If not:
   - Add a start command: `cd backend && python app.py`
   - Set root directory to `backend/`
5. Railway will provide a URL like: `https://your-app.railway.app`
6. Copy this URL - you'll need it for the frontend

### Option B: Render

1. Go to [render.com](https://render.com) and sign in
2. Click "New" → "Web Service"
3. Connect your GitHub repo
4. Settings:
   - Build Command: `cd backend && pip install -r requirements.txt`
   - Start Command: `cd backend && python app.py`
   - Environment: Python 3
5. Render will provide a URL

## Step 2: Update Frontend API URL

1. In your GitHub repo, go to Settings → Secrets → Actions
2. Or create a `.env.production` file in `frontend/`:
   ```
   REACT_APP_API_URL=https://your-backend-url.railway.app
   ```
3. Update `frontend/src/services/api.js` if needed

## Step 3: Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "New Project" → Import your GitHub repository
3. Vercel settings:
   - Framework Preset: Create React App
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `build`
4. Add Environment Variable:
   - Key: `REACT_APP_API_URL`
   - Value: Your backend URL (from Step 1)
5. Click "Deploy"

## Step 4: Update CORS in Backend

In `backend/app.py`, update the CORS origins to include your Vercel URL:
```python
allow_origins=[
    "http://localhost:3000",
    "https://your-vercel-app.vercel.app"
]
```

## Verification

- Frontend: Visit your Vercel URL
- Backend API: Visit `https://your-backend-url/api/guidelines/metadata`
- Test the full flow: Toggle modifiers and verify pathway updates

