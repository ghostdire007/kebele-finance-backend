# Render.com Deployment Instructions

## Step-by-Step Guide

### 1. Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `kebele-finance-backend`
3. Description: "Backend API for Kebele Finance System"
4. Choose "Public" (easier for Render to access)
5. Click "Create repository"

### 2. Push Code to GitHub

\`\`\`bash
cd core/backend
git init
git add .
git commit -m "Initial backend setup"
git remote add origin https://github.com/YOUR_USERNAME/kebele-finance-backend.git
git branch -M main
git push -u origin main
\`\`\`

### 3. Deploy to Render.com

1. Go to https://render.com
2. Sign in with GitHub
3. Click "New +" button
4. Select "Web Service"
5. Select your `kebele-finance-backend` repository
6. Fill in the form:
   - **Name:** kebele-finance-backend
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Plan:** Free

### 4. Add Environment Variables

1. Click "Advanced"
2. Add environment variable:
   - **Key:** MONGODB_ATLAS_URI
   - **Value:** (Copy from your server.js file)
     \`\`\`
     mongodb+srv://esrael202324_db_user:dL3OX5FeftPpBiOB@kfs-cluster.mnixxot.mongodb.net/kfs_db?retryWrites=true&w=majority&appName=kfs-cluster
     \`\`\`

3. Click "Create Web Service"

### 5. Wait for Deployment

- Render will build and deploy your app
- Takes 2-3 minutes
- You'll see a URL like: `https://kebele-finance-backend.onrender.com`

### 6. Test Your Backend

Open in browser:
\`\`\`
https://kebele-finance-backend.onrender.com/api/health
\`\`\`

Should return:
\`\`\`json
{
  "status": "ok",
  "message": "Server is running",
  "database": "connected"
}
\`\`\`

### 7. Update Flutter App

Copy your Render URL and update `core/config/app_config.dart`:
\`\`\`dart
static const String apiBaseUrl = 'https://kebele-finance-backend.onrender.com/api';
\`\`\`

---

## MongoDB Atlas IP Whitelist

If you get "database": "disconnected", add Render's IP to MongoDB:

1. Go to https://cloud.mongodb.com
2. Click "Network Access"
3. Click "Add IP Address"
4. Enter: `0.0.0.0/0` (allows all IPs - for development)
5. Click "Confirm"

Wait a few minutes for changes to take effect.

---

## Monitoring Your Backend

1. Go to https://dashboard.render.com
2. Click your service
3. View logs in real-time
4. Monitor performance

---

## Common Issues

### Build fails
- Check if package.json is in the root
- Verify all dependencies are listed
- Check Node version compatibility

### Database connection fails
- Verify MongoDB connection string
- Check IP whitelist in MongoDB Atlas
- Ensure cluster is not paused

### App can't reach backend
- Verify Render URL is correct in Flutter app
- Check if backend is running (green status on Render)
- Test health endpoint in browser
