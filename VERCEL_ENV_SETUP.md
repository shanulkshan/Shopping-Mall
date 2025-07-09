# 🚨 URGENT: Set Environment Variables in Vercel

Your backend is running but failing on API calls because environment variables are missing.

## Required Environment Variables

You need to add these in your **Vercel Dashboard**:

### 1. Go to Vercel Dashboard
1. Visit: https://vercel.com/dashboard
2. Click on your `shopping-mall` project
3. Go to **Settings** → **Environment Variables**

### 2. Add These Variables:

#### **MONGO** (Required for Database)
- **Name**: `MONGO`
- **Value**: Your MongoDB connection string
- **Example**: `mongodb+srv://username:password@cluster.mongodb.net/shopping-mall?retryWrites=true&w=majority`

#### **JWT_SECRET** (Required for Authentication)
- **Name**: `JWT_SECRET`
- **Value**: A secure random string (32+ characters)
- **Example**: `your-super-secret-jwt-key-make-it-long-and-random-123456789`

#### **NODE_ENV** (Required)
- **Name**: `NODE_ENV`
- **Value**: `production`

#### **FRONTEND_URL** (Optional but recommended)
- **Name**: `FRONTEND_URL`
- **Value**: `https://shopping-mall-dun.vercel.app`

## How to Add Environment Variables:

1. **In Vercel Dashboard**:
   ```
   Project → Settings → Environment Variables → Add New
   ```

2. **For each variable**:
   - Enter the **Name** (e.g., `MONGO`)
   - Enter the **Value** (your actual MongoDB URI)
   - Select **All Environments** (Production, Preview, Development)
   - Click **Save**

3. **After adding all variables**:
   - Go to **Deployments** tab
   - Click **Redeploy** on the latest deployment
   - Or just push a new commit to trigger redeploy

## Where to Get MongoDB URI:

If you don't have a MongoDB database yet:

1. **MongoDB Atlas** (Free):
   - Go to https://mongodb.com/atlas
   - Create free account
   - Create cluster
   - Get connection string
   - Replace `<username>` and `<password>` with actual values

2. **Sample MongoDB URI**:
   ```
   mongodb+srv://myuser:mypassword@cluster0.mongodb.net/shopping-mall?retryWrites=true&w=majority
   ```

## Generate JWT Secret:

You can generate a secure JWT secret:
```bash
# Option 1: Use online generator
# Visit: https://generate-secret.vercel.app/32

# Option 2: Use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Option 3: Use any random string (make it long!)
```

## Current Status:
- ✅ Frontend: Loading correctly
- ✅ Backend: Server running 
- ✅ API URLs: Fixed (no more localhost)
- ✅ CORS: Fixed for your domain
- ❌ **Environment Variables: MISSING** ← **FIX THIS NOW**

## Test After Setting Variables:

1. Wait 1-2 minutes for redeployment
2. Try logging in at: https://shopping-mall-dun.vercel.app
3. Check browser console for API errors
4. If still failing, check Vercel function logs

---

**Next Step**: Add the environment variables in Vercel Dashboard, then test login/registration!
