# Vercel Environment Variables Configuration

## 🔧 Required Environment Variables

To fix the 500 errors, please ensure these environment variables are set in your Vercel project:

### **1. MongoDB Connection**
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/shopping-mall
```
OR
```
MONGO=mongodb+srv://username:password@cluster.mongodb.net/shopping-mall
```

### **2. JWT Secret**
```
JWT_SECRET=your-super-secret-jwt-key-here
```

### **3. Node Environment**
```
NODE_ENV=production
```

### **4. Frontend URL (Optional)**
```
FRONTEND_URL=https://your-vercel-domain.vercel.app
```

## 📝 How to Set Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Select your project
3. Go to **Settings** tab
4. Click on **Environment Variables**
5. Add each variable with:
   - **Name**: Variable name (e.g., `MONGODB_URI`)
   - **Value**: Variable value
   - **Environment**: Select "Production" (and optionally Preview/Development)

## 🔍 Debugging the Current Issues

The errors you're seeing suggest:

1. **CORS Issues**: Fixed with updated CORS configuration
2. **Database Connection**: Likely missing `MONGODB_URI` environment variable
3. **Authentication**: JWT_SECRET might be missing

## ✅ Verification Steps

After setting the environment variables:

1. **Check Health Endpoint**:
   ```bash
   curl https://your-domain.vercel.app/api/health
   ```

2. **Check Shops Endpoint**:
   ```bash
   curl https://your-domain.vercel.app/api/shops/public
   ```

3. **Check Auth Endpoint**:
   ```bash
   curl https://your-domain.vercel.app/api/test-auth
   ```

## 🔧 Expected Response Format

### Health Check (api/health):
```json
{
  "status": "OK",
  "timestamp": "2024-12-XX...",
  "environment": "production",
  "message": "Server is running successfully",
  "debug": {
    "hasMongoUri": true,
    "hasJwtSecret": true,
    "nodeEnv": "production",
    "mongoConnected": true
  }
}
```

### If MongoDB is not connected:
```json
{
  "debug": {
    "hasMongoUri": false,
    "mongoConnected": false,
    "mongoConnectionString": "No MongoDB env found"
  }
}
```

## 🚨 Common Issues & Solutions

### Issue: `mongoConnected: false`
**Solution**: Check your MONGODB_URI/MONGO environment variable

### Issue: `hasJwtSecret: false`
**Solution**: Add JWT_SECRET environment variable

### Issue: CORS errors
**Solution**: Already fixed in latest deployment

### Issue: 500 Internal Server Error
**Solution**: Check Vercel function logs for detailed error messages

## 📋 MongoDB Atlas Setup Checklist

1. ✅ Database user created with read/write permissions
2. ✅ IP address `0.0.0.0/0` added to whitelist (for Vercel)
3. ✅ Connection string copied correctly
4. ✅ Database name included in connection string

## 🔄 Next Steps

1. Set the required environment variables in Vercel
2. Redeploy the application (or wait for auto-deployment)
3. Test the endpoints using the verification steps above
4. Check browser console for any remaining errors

## 📞 If Issues Persist

If you continue to see 500 errors after setting environment variables:

1. Check Vercel function logs in the dashboard
2. Ensure MongoDB Atlas is accessible
3. Verify connection string format
4. Test MongoDB connection from external tool (e.g., Compass)

The CORS configuration has been updated to handle all Vercel domains automatically.
