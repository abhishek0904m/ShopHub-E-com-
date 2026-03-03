# 🚀 Deploy ShopHub to Render

Complete guide to deploy your full-stack e-commerce application to Render.

## 📋 Prerequisites

1. GitHub account
2. Render account (free tier available at render.com)
3. MongoDB Atlas account (for database)
4. Your code pushed to GitHub repository

---

## 🗂️ Project Structure

```
your-repo/
├── Backend-Ecom/          # Backend (Node.js + Express)
│   ├── server.js
│   ├── package.json
│   └── ...
└── E Com/                 # Frontend (React + Vite)
    ├── src/
    ├── package.json
    └── vite.config.js
```

---

## 📦 Step 1: Prepare Backend for Deployment

### 1.1 Update Backend package.json

Add these scripts to `Backend-Ecom/package.json`:

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### 1.2 Update server.js for Production

Make sure your `Backend-Ecom/server.js` has:

```javascript
const PORT = process.env.PORT || 5000;

// CORS configuration for production
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
};
app.use(cors(corsOptions));
```

### 1.3 Environment Variables

Your backend needs these environment variables:
- `MONGODB_URI` - MongoDB connection string
- `FRONTEND_URL` - Your frontend URL (will be provided by Render)
- `RAZORPAY_KEY_ID` - Your Razorpay key
- `RAZORPAY_KEY_SECRET` - Your Razorpay secret
- `GROQ_API_KEY` - Your Groq API key (for chatbot)

---

## 🎨 Step 2: Prepare Frontend for Deployment

### 2.1 Update API Base URL

Create `E Com/src/config.js`:

```javascript
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
```

### 2.2 Update all API calls

In `E Com/src/api.js`, update the base URL:

```javascript
import { API_BASE_URL } from './config';

const BASE = `${API_BASE_URL}/api`;
```

### 2.3 Add build script

Verify `E Com/package.json` has:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

---

## 🌐 Step 3: Setup MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist all IPs (0.0.0.0/0) for Render access
5. Get your connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/shophub?retryWrites=true&w=majority
   ```

---

## 🚀 Step 4: Deploy Backend to Render

### 4.1 Create Web Service

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `shophub-backend`
   - **Region**: Choose closest to you
   - **Branch**: `main` (or your branch)
   - **Root Directory**: `Backend-Ecom`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

### 4.2 Add Environment Variables

In the "Environment" section, add:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/shophub
FRONTEND_URL=https://your-frontend-url.onrender.com
PORT=5000
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
GROQ_API_KEY=your_groq_key
NODE_ENV=production
```

### 4.3 Deploy

Click "Create Web Service" and wait for deployment (5-10 minutes)

Your backend URL will be: `https://shophub-backend.onrender.com`

---

## 🎨 Step 5: Deploy Frontend to Render

### 5.1 Create Static Site

1. Go to Render Dashboard
2. Click "New +" → "Static Site"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `shophub-frontend`
   - **Branch**: `main`
   - **Root Directory**: `E Com`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

### 5.2 Add Environment Variable

```
VITE_API_URL=https://shophub-backend.onrender.com
```

### 5.3 Deploy

Click "Create Static Site" and wait for deployment

Your frontend URL will be: `https://shophub-frontend.onrender.com`

---

## 🔄 Step 6: Update Backend with Frontend URL

1. Go to your backend service on Render
2. Update the `FRONTEND_URL` environment variable:
   ```
   FRONTEND_URL=https://shophub-frontend.onrender.com
   ```
3. Save changes (backend will auto-redeploy)

---

## ✅ Step 7: Verify Deployment

### Test these features:

1. **Registration**: Create a new user account
2. **Login**: Login with credentials
3. **Products**: View products on home page
4. **Search**: Test search functionality
5. **Cart**: Add products to cart
6. **Wishlist**: Add products to wishlist
7. **Orders**: Place a test order
8. **Dealer**: Register as dealer and add products
9. **Admin**: Login as admin and manage system

---

## 🐛 Troubleshooting

### Backend Issues

**Problem**: Backend not connecting to MongoDB
- **Solution**: Check MongoDB Atlas IP whitelist (should be 0.0.0.0/0)
- Verify `MONGODB_URI` in environment variables

**Problem**: CORS errors
- **Solution**: Ensure `FRONTEND_URL` is set correctly in backend env vars

### Frontend Issues

**Problem**: API calls failing
- **Solution**: Check `VITE_API_URL` environment variable
- Verify backend is running: visit `https://your-backend.onrender.com/api/products`

**Problem**: Build fails
- **Solution**: Check build logs for missing dependencies
- Run `npm install` locally to verify package.json

---

## 📊 Free Tier Limitations

Render free tier includes:
- ✅ 750 hours/month (enough for 1 service 24/7)
- ✅ Auto-sleep after 15 minutes of inactivity
- ✅ First request after sleep takes 30-60 seconds
- ✅ 100GB bandwidth/month
- ⚠️ Services spin down after inactivity

**Tip**: For production, upgrade to paid tier ($7/month) for:
- No auto-sleep
- Faster performance
- More bandwidth

---

## 🔐 Security Checklist

Before going live:

- [ ] Change all default passwords
- [ ] Use strong MongoDB password
- [ ] Keep API keys in environment variables (never in code)
- [ ] Enable HTTPS (automatic on Render)
- [ ] Set up proper CORS origins
- [ ] Review and test all payment flows
- [ ] Add rate limiting for API endpoints
- [ ] Set up monitoring and alerts

---

## 🎉 Your App is Live!

**Frontend**: `https://shophub-frontend.onrender.com`
**Backend**: `https://shophub-backend.onrender.com`

Share your live app with users! 🚀

---

## 📝 Post-Deployment

### Custom Domain (Optional)

1. Buy a domain (e.g., from Namecheap, GoDaddy)
2. In Render, go to your static site
3. Click "Settings" → "Custom Domain"
4. Add your domain and follow DNS instructions

### Monitoring

- Check Render dashboard for logs
- Monitor MongoDB Atlas for database usage
- Set up error tracking (e.g., Sentry)

### Updates

To deploy updates:
1. Push code to GitHub
2. Render auto-deploys on push
3. Or manually trigger deploy from Render dashboard

---

## 🆘 Need Help?

- Render Docs: https://render.com/docs
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com/
- Community Support: Render Community Forum

---

**Congratulations! Your ShopHub e-commerce platform is now live! 🎊**
