# API Connection Test Guide

After fixing all hardcoded `localhost:3000` URLs, here's how to test if your backend API is working properly on Vercel:

## 1. Test Backend Health Endpoint
Visit: https://shopping-mall-dun.vercel.app/api/health

**Expected Response:**
```json
{
  "status": "ok",
  "message": "Server is running",
  "timestamp": "2025-01-09T..."
}
```

## 2. Test Frontend API Calls
1. Open your deployed app: https://shopping-mall-dun.vercel.app
2. Open browser Developer Tools (F12)
3. Go to the Network tab
4. Try these actions and check if API calls succeed:

### Authentication Tests:
- **Register a new user**: Should call `/api/auth/register`
- **Login**: Should call `/api/auth/login`
- **Check auth status**: Should call `/api/auth/me`

### Public API Tests:
- **View Shops page**: Should call `/api/shops/public`
- **View Promotions**: Should call `/api/promotion`
- **View Shop details**: Should call `/api/shops/{id}`

## 3. Check API Call URLs in Network Tab
In the Network tab, verify that all API calls are using:
- ✅ Relative URLs like `/api/shops/public`
- ✅ Full URLs like `https://shopping-mall-dun.vercel.app/api/...`
- ❌ NOT `http://localhost:3000/api/...`

## 4. Common Issues & Solutions

### If API calls fail with 404:
1. Check Vercel function logs in Vercel dashboard
2. Verify `vercel.json` rewrites are correct
3. Ensure server folder is properly deployed

### If getting CORS errors:
1. Check server CORS configuration
2. Verify environment variables are set in Vercel

### If seeing "Network Error":
1. Check if backend functions are running
2. Verify API endpoints exist and are accessible

## 5. Environment Variables to Set in Vercel
Make sure these are configured in your Vercel dashboard:

**For the Frontend:**
- `VITE_API_URL` (if needed for custom API base URL)

**For the Backend:**
- `MONGODB_URI`
- `JWT_SECRET`
- `NODE_ENV=production`
- Any other environment variables your server needs

## 6. Quick Debug Commands

Test backend directly:
```bash
curl https://shopping-mall-dun.vercel.app/api/health
```

Test with authentication:
```bash
curl -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"testpass"}' \
     https://shopping-mall-dun.vercel.app/api/auth/login
```

---

**Status:** ✅ Frontend loading, API URLs fixed, deployment triggered
**Next:** Test the API endpoints above to verify backend connectivity
