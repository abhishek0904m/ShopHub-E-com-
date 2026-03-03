# 🚀 ShopHub Deployment Checklist

## ✅ Pre-Deployment Preparation (COMPLETED)

- [x] Backend CORS configured for production
- [x] Frontend API config file created
- [x] Backend package.json has start script and Node version
- [x] Frontend package.json has build script
- [x] Environment variable structure defined

---

## 📋 Step-by-Step Deployment Guide

### 1️⃣ Setup MongoDB Atlas (15 minutes)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create FREE cluster
3. Create database user:
   - Username: `shophub_user`
   - Password: (generate strong password - save it!)
4. Network Access:
   - Click "Add IP Address"
   - Select "Allow Access from Anywhere" (0.0.0.0/0)
5. Get connection string:
   - Click "Connect" → "Connect your application"
   - Copy connection string
   - Replace `<password>` with your password
   - Example: `mongodb+srv://shophub_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/shophub?retryWrites=true&w=majority`

---

### 2️⃣ Deploy Backend to Render (10 minutes)

1. **Push code to GitHub** (if not already done)
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

3. **Create Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select your repository

4. **Configure Service**
   - **Name**: `shophub-backend` (or your choice)
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: `Backend-Ecom`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

5. **Add Environment Variables**
   Click "Advanced" → "Add Environment Variable":
   
   ```
   MONGO_URI=mongodb+srv://shophub_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/shophub
   PORT=5000
   NODE_ENV=production
   FRONTEND_URL=https://your-frontend-name.onrender.com
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_secret
   GROQ_API_KEY=your_groq_api_key
   ```
   
   **Note**: You'll update `FRONTEND_URL` after deploying frontend

6. **Deploy**
   - Click "Create Web Service"
   - Wait 5-10 minutes for deployment
   - Your backend URL: `https://shophub-backend.onrender.com`

7. **Test Backend**
   - Visit: `https://shophub-backend.onrender.com/api/products`
   - Should see `[]` or list of products

---

### 3️⃣ Deploy Frontend to Render (10 minutes)

1. **Create Static Site**
   - In Render Dashboard, click "New +" → "Static Site"
   - Connect your GitHub repository
   - Select your repository

2. **Configure Static Site**
   - **Name**: `shophub-frontend` (or your choice)
   - **Branch**: `main`
   - **Root Directory**: `E Com`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

3. **Add Environment Variable**
   Click "Advanced" → "Add Environment Variable":
   
   ```
   VITE_API_URL=https://shophub-backend.onrender.com
   ```
   
   **Important**: Use YOUR actual backend URL from step 2

4. **Deploy**
   - Click "Create Static Site"
   - Wait 5-10 minutes for deployment
   - Your frontend URL: `https://shophub-frontend.onrender.com`

---

### 4️⃣ Update Backend with Frontend URL (2 minutes)

1. Go to your backend service on Render
2. Click "Environment" in left sidebar
3. Find `FRONTEND_URL` variable
4. Update value to: `https://shophub-frontend.onrender.com`
5. Click "Save Changes"
6. Backend will auto-redeploy (2-3 minutes)

---

### 5️⃣ Create Admin Account (5 minutes)

1. **SSH into Backend** (or use Render Shell)
   - In Render backend service, click "Shell" tab
   
2. **Run admin creation script**
   ```bash
   node createAdmin.js
   ```
   
   Or manually create admin in MongoDB Atlas:
   - Go to MongoDB Atlas → Browse Collections
   - Database: `shophub` → Collection: `admins`
   - Insert Document:
   ```json
   {
     "email": "admin@shophub.com",
     "password": "$2a$10$hashed_password_here",
     "name": "Admin"
   }
   ```

---

## ✅ Testing Your Deployment

### Test Checklist:

1. **Frontend Loads**
   - [ ] Visit your frontend URL
   - [ ] Homepage loads without errors
   - [ ] Products display (if any exist)

2. **User Registration**
   - [ ] Click "Register"
   - [ ] Create new account
   - [ ] Should redirect to login

3. **User Login**
   - [ ] Login with registered account
   - [ ] Should see dashboard

4. **Products**
   - [ ] View products on home page
   - [ ] Search works
   - [ ] Categories display correctly

5. **Cart & Wishlist**
   - [ ] Add product to cart
   - [ ] Add product to wishlist
   - [ ] Cart persists after refresh

6. **Dealer Registration**
   - [ ] Register as dealer
   - [ ] Login as dealer
   - [ ] Add a product
   - [ ] Product appears in user dashboard

7. **Admin Login**
   - [ ] Login as admin
   - [ ] View all dealers
   - [ ] View all products
   - [ ] Approve/reject dealers

8. **Orders**
   - [ ] Place test order (COD)
   - [ ] Order appears in "My Orders"
   - [ ] Dealer can see order

---

## 🐛 Common Issues & Solutions

### Issue: "Backend not reachable"
**Solution**: 
- Check backend is running on Render
- Verify `VITE_API_URL` in frontend environment variables
- Check browser console for CORS errors

### Issue: "CORS error"
**Solution**:
- Verify `FRONTEND_URL` in backend environment variables
- Make sure it matches your actual frontend URL
- Redeploy backend after changing

### Issue: "MongoDB connection failed"
**Solution**:
- Check MongoDB Atlas IP whitelist (should be 0.0.0.0/0)
- Verify `MONGO_URI` in backend environment variables
- Check MongoDB Atlas cluster is running

### Issue: "Service unavailable after inactivity"
**Solution**:
- Free tier services sleep after 15 minutes
- First request takes 30-60 seconds to wake up
- This is normal for free tier

### Issue: "Build failed"
**Solution**:
- Check build logs in Render
- Verify all dependencies in package.json
- Try building locally: `npm run build`

---

## 🎉 Your App is Live!

**Frontend**: `https://shophub-frontend.onrender.com`
**Backend**: `https://shophub-backend.onrender.com`

### Share with Users:
- Registration page: `https://shophub-frontend.onrender.com`
- Dealer registration: `https://shophub-frontend.onrender.com` (click "Dealer Login")
- Admin login: `https://shophub-frontend.onrender.com` (click "Admin")

---

## 📊 Free Tier Limitations

**Render Free Tier:**
- ✅ 750 hours/month per service
- ✅ Auto-sleep after 15 minutes inactivity
- ✅ 100GB bandwidth/month
- ⚠️ First request after sleep: 30-60 seconds

**MongoDB Atlas Free Tier:**
- ✅ 512MB storage
- ✅ Shared cluster
- ✅ Enough for development/testing

**Upgrade to Paid ($7/month per service):**
- No auto-sleep
- Faster performance
- More bandwidth
- Better for production

---

## 🔐 Security Reminders

- [ ] Never commit `.env` files to GitHub
- [ ] Use strong passwords for MongoDB
- [ ] Keep API keys in environment variables
- [ ] Review CORS settings
- [ ] Test payment flows thoroughly
- [ ] Monitor logs regularly

---

## 📝 Post-Deployment

### Auto-Deploy on Push
- Render auto-deploys when you push to GitHub
- Push to `main` branch triggers deployment
- Check deployment status in Render dashboard

### Manual Deploy
- Go to Render dashboard
- Click "Manual Deploy" → "Deploy latest commit"

### View Logs
- Click "Logs" tab in Render service
- Real-time logs for debugging

### Custom Domain (Optional)
1. Buy domain (Namecheap, GoDaddy, etc.)
2. In Render: Settings → Custom Domain
3. Add domain and follow DNS instructions

---

## 🆘 Need Help?

- **Render Docs**: https://render.com/docs
- **MongoDB Docs**: https://docs.atlas.mongodb.com/
- **Render Community**: https://community.render.com/

---

**Congratulations! Your ShopHub is now live! 🎊**

Next steps:
1. Share the link with friends
2. Add more products
3. Test all features
4. Consider upgrading for production use
