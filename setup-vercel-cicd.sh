#!/bin/bash

# Setup script for Vercel deployment with GitHub Actions
echo "🚀 Setting up Vercel CI/CD with GitHub Actions"

echo "
📋 **SETUP CHECKLIST**

1. **Push your code to GitHub:**
   git add .
   git commit -m \"Setup Vercel CI/CD\"
   git push origin main

2. **Install Vercel CLI:**
   npm install -g vercel

3. **Login to Vercel:**
   vercel login

4. **Link your project:**
   vercel link

5. **Get your Vercel credentials:**
   - Run: vercel env ls
   - Go to: https://vercel.com/account/tokens
   - Create a new token

6. **Add GitHub Secrets:**
   Go to your GitHub repository → Settings → Secrets and variables → Actions
   
   Add these secrets:
   - VERCEL_TOKEN: (from step 5)
   - VERCEL_ORG_ID: (from vercel link command)
   - VERCEL_PROJECT_ID: (from vercel link command)

7. **Add Environment Variables in Vercel Dashboard:**
   - MONGO: Your MongoDB connection string
   - JWT_SECRET: Your JWT secret key
   - NODE_ENV: production
   - FRONTEND_URL: https://your-app-name.vercel.app

8. **Test the deployment:**
   Push any change to trigger the GitHub Action

✅ **Your CI/CD pipeline is now ready!**

🔄 **How it works:**
- Push to main/master → Automatic production deployment
- Open Pull Request → Automatic preview deployment
- Comments on PR with preview URLs

📝 **Deployment URLs:**
- Production: https://your-app-name.vercel.app
- API: https://your-app-name.vercel.app/api
"
