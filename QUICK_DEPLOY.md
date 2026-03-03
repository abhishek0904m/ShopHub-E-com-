# ⚡ Quick Deploy Guide - 30 Minutes

Get your ShopHub live in 30 minutes! Follow these steps in order.

---

## 🎯 Overview

```
Step 1: MongoDB Atlas (10 min)
   ↓
Step 2: Deploy Backend (10 min)
   ↓
Step 3: Deploy Frontend (5 min)
   ↓
Step 4: Connect & Test (5 min)
   ↓
🎉 LIVE!
```

---

## ⏱️ Step 1: MongoDB Atlas (10 minutes)

### Quick Setup:
1. **Go to**: https://cloud.mongodb.com
2. **Sign up** with Google/GitHub
3. **Create FREE cluster**:
   - Cloud: AWS
   - Region: Closest to you
   - Cluster Name: `ShopHub`
4. **Create user**:
   - Username: `shophub_admin`
   - Password: (auto-generate & save!)
5. **Network Access**:
   - Add IP: `0.0.0.0/0` (Allow all)
6. **Get connection string**:
   - Click "Connect" → "Drivers"
   - Copy: `mongodb+srv://shophub_admin:PASSWORD@...`
   - Save this! You'll need it next.

✅ **Done!** MongoDB is ready.

---

## ⏱️ Step 2: Deploy Backend (10 minutes)

### Quick Setup:
1. **Go to**: https://render.com
2. **Sign up** with GitHub
3. **New Web Service**:
   - Connect GitHub repo
   - Select your repository
4. **Configure**:
   ```
   Name: shophub-backend
   Root Directory: Backend-Ecom
   Environment: Node
   Build: npm install
   Start: npm start
   Plan: Free
   ```
5. **Environment Variables** (click Advanced):
   ```
   MONGO_URI = (paste your MongoDB connection string)
   PORT = 5000
   NODE_ENV = production
   FRONTEND_URL = https://TEMP.com (we'll update this)
   RAZORPAY_KEY_ID = (your key or leave empty for now)
   RAZORPAY_KEY_SECRET = (your secret or leave empty)
   GROQ_API_KEY = (your key or leave empty)
   ```
6. **Create Service** → Wait 5-10 minutes
7. **Copy your backend URL**: `https://shophub-backend-xxxx.onrender.com`

✅ **Test**: Visit `https://your-backend-url.onrender.com/api/products`
Should see `[]` or products list.

---

## ⏱️ Step 3: Deploy Frontend (5 minutes)

### Quick Setup:
1. **In Render Dashboard**: New → Static Site
2. **Connect** same GitHub repo
3. **Configure**:
   ```
   Name: shophub-frontend
   Root Directory: E Com
   Build: npm install && npm run build
   Publish: dist
   ```
4. **Environment Variable** (click Advanced):
   ```
   VITE_API_URL = https://your-backend-url.onrender.com
   ```
   (Use YOUR actual backend URL from Step 2!)
5. **Create Static Site** → Wait 5 minutes
6. **Copy your frontend URL**: `https://shophub-frontend-xxxx.onrender.com`

✅ **Done!** Frontend is live.

---

## ⏱️ Step 4: Connect & Test (5 minutes)

### Update Backend:
1. Go to **Backend service** on Render
2. Click **Environment**
3. Edit `FRONTEND_URL`:
   ```
   FRONTEND_URL = https://your-frontend-url.onrender.com
   ```
4. **Save** → Backend redeploys (2 min)

### Test Your App:
1. **Visit**: `https://your-frontend-url.onrender.com`
2. **Register** a new account
3. **Login** with your account
4. **View** products (if any)
5. **Test** cart and wishlist

✅ **Success!** Your app is live! 🎉

---

## 🎯 Your Live URLs

**Frontend (Share this)**: `https://shophub-frontend-xxxx.onrender.com`
**Backend (API)**: `https://shophub-backend-xxxx.onrender.com`

---

## 🚀 Next Steps

### Add Admin Account:
1. Go to MongoDB Atlas
2. Browse Collections → `admins`
3. Insert Document:
   ```json
   {
     "email": "admin@shophub.com",
     "password": "$2a$10$YourHashedPasswordHere",
     "name": "Admin"
   }
   ```
   Or run `node createAdmin.js` in Render Shell

### Add Test Products:
1. Register as dealer
2. Login as dealer
3. Add products
4. Products appear in user dashboard

### Share Your App:
- Send frontend URL to friends
- Test all features
- Monitor in Render dashboard

---

## ⚠️ Important Notes

### Free Tier Behavior:
- Services sleep after 15 min inactivity
- First request takes 30-60 seconds to wake
- This is normal for free tier

### If Something Breaks:
1. Check Render logs (Logs tab)
2. Check browser console (F12)
3. Verify environment variables
4. Test backend URL directly

### Common Issues:
- **CORS error**: Update `FRONTEND_URL` in backend
- **API fails**: Check `VITE_API_URL` in frontend
- **MongoDB error**: Check IP whitelist (0.0.0.0/0)

---

## 📊 Deployment Summary

```
✅ MongoDB Atlas: Database ready
✅ Backend: API running on Render
✅ Frontend: Website live on Render
✅ Connected: Frontend ↔ Backend ↔ Database
```

**Total Time**: ~30 minutes
**Cost**: $0 (Free tier)
**Status**: LIVE! 🎉

---

## 🎓 What You Just Did

1. Created cloud database (MongoDB Atlas)
2. Deployed Node.js backend (Render)
3. Deployed React frontend (Render)
4. Connected everything together
5. Made your app accessible worldwide!

**Congratulations! You're now a full-stack developer with a live app! 🚀**

---

## 📚 More Resources

- **Full Guide**: See `RENDER_DEPLOYMENT_GUIDE.md`
- **Checklist**: See `DEPLOYMENT_CHECKLIST.md`
- **Env Vars**: See `ENV_VARIABLES_REFERENCE.md`
- **Render Docs**: https://render.com/docs
- **MongoDB Docs**: https://docs.atlas.mongodb.com/

---

**Need help? Check the troubleshooting section in DEPLOYMENT_CHECKLIST.md**
