#!/bin/bash

# Kebele Finance System - Render.com Deployment Script
# This script helps you deploy the backend to Render.com

echo "=========================================="
echo "Kebele Finance Backend Deployment Script"
echo "=========================================="
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "Error: Git is not installed. Please install Git first."
    exit 1
fi

# Step 1: Initialize git repository
echo "Step 1: Initializing Git repository..."
if [ ! -d ".git" ]; then
    git init
    echo "✓ Git repository initialized"
else
    echo "✓ Git repository already exists"
fi

# Step 2: Add files
echo ""
echo "Step 2: Adding files to Git..."
git add .
echo "✓ Files added"

# Step 3: Create initial commit
echo ""
echo "Step 3: Creating initial commit..."
git commit -m "Initial backend setup for Render deployment" || echo "✓ Commit created (or already exists)"

# Step 4: Instructions for GitHub
echo ""
echo "=========================================="
echo "Next Steps:"
echo "=========================================="
echo ""
echo "1. Create a new repository on GitHub:"
echo "   - Go to https://github.com/new"
echo "   - Name it: kebele-finance-backend"
echo "   - Click 'Create repository'"
echo ""
echo "2. Add GitHub remote and push:"
echo "   git remote add origin https://github.com/YOUR_USERNAME/kebele-finance-backend.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "3. Deploy to Render.com:"
echo "   - Go to https://render.com"
echo "   - Click 'New +' > 'Web Service'"
echo "   - Select your GitHub repository"
echo "   - Configure:"
echo "     * Name: kebele-finance-backend"
echo "     * Environment: Node"
echo "     * Build Command: npm install"
echo "     * Start Command: node server.js"
echo "   - Add Environment Variable:"
echo "     * MONGODB_ATLAS_URI: [Your MongoDB connection string]"
echo "   - Click 'Create Web Service'"
echo ""
echo "4. Wait for deployment (2-3 minutes)"
echo "5. Copy your Render URL and update Flutter app config"
echo ""
echo "=========================================="
