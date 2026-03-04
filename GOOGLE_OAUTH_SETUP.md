# Google OAuth Setup Guide - ShopHub

## ✅ What's Already Done

I've implemented all the code for Google OAuth login:

1. ✅ Created `E Com/src/firebase.js` - Firebase configuration
2. ✅ Created `E Com/src/useGoogleAuth.js` - Google OAuth hook
3. ✅ Updated `E Com/src/Registration.jsx` - Added Google sign-in button
4. ✅ Updated `E Com/src/Login.jsx` - Added Google sign-in button
5. ✅ Updated `Backend-Ecom/models/User.js` - Added OAuth fields
6. ✅ Updated `Backend-Ecom/server.js` - Added OAuth login route

## 🚀 What You Need to Do

### Step 1: Install Firebase Package

```bash
cd "E Com"
npm install firebase
```

### Step 2: Create Firebase Project

1. Go to https://console.firebase.google.com
2. Click "Add project"
3. Name it: **ShopHub**
4. Disable Google Analytics (optional)
5. Click "Create project"

### Step 3: Enable Google Authentication

1. In Firebase Console, click **"Authentication"** in left sidebar
2. Click **"Get started"**
3. Go to **"Sign-in method"** tab
4. Find **"Google"** in the list
5. Click on it
6. Toggle **"Enable"**
7. Add your support email (your email)
8. Click **"Save"**

### Step 4: Register Your Web App

1. In Firebase Console, click the gear icon ⚙️ → **"Project settings"**
2. Scroll down to **"Your apps"** section
3. Click the web icon **</>** (looks like `</>`)
4. Register app:
   - App nickname: **ShopHub Web**
   - Don't check "Firebase Hosting"
   - Click **"Register app"**
5. You'll see a `firebaseConfig` object - **COPY IT**

### Step 5: Update Firebase Config

Open `E Com/src/firebase.js` and replace the config:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

### Step 6: Add Authorized Domains

1. In Firebase Console → Authentication → Settings tab
2. Scroll to **"Authorized domains"**
3. Add these domains:
   - `localhost` (already there)
   - `shophub-frontend-fzd6.onrender.com` (your production domain)
4. Click **"Add domain"**

### Step 7: Test Locally

1. Start your backend:
   ```bash
   cd Backend-Ecom
   npm start
   ```

2. Start your frontend:
   ```bash
   cd "E Com"
   npm run dev
   ```

3. Open http://localhost:5173
4. Click **"Continue with Google"**
5. Select your Google account
6. Should redirect to dashboard ✅

### Step 8: Deploy to Production

1. **Commit and push changes:**
   ```bash
   git add .
   git commit -m "feat: Add Google OAuth login integration"
   git push origin main
   ```

2. **Wait for Render to deploy** (3-5 minutes)

3. **Test on production:**
   - Go to https://shophub-frontend-fzd6.onrender.com
   - Click "Continue with Google"
   - Should work! ✅

## 🔒 Security Notes

### For Development
- Firebase config in `firebase.js` is safe to commit
- API keys are restricted by domain in Firebase Console

### For Production (Optional - More Secure)
If you want extra security, use environment variables:

1. Create `E Com/.env`:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   ```

2. Update `firebase.js`:
   ```javascript
   const firebaseConfig = {
     apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
     authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
     projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
     // ...
   };
   ```

3. Add to Render environment variables

## 🧪 Testing Checklist

### Registration Page
- [ ] Click "Continue with Google"
- [ ] Google popup opens
- [ ] Select account
- [ ] Redirects to dashboard
- [ ] User name shows in dashboard
- [ ] Can browse products
- [ ] Can add to cart

### Login Page
- [ ] Click "Continue with Google"
- [ ] Google popup opens
- [ ] Select account
- [ ] Redirects to dashboard
- [ ] Shows "Welcome back" message

### Backend
- [ ] Check MongoDB - new user created with:
  - `authProvider: "google"`
  - `providerId: "google_user_id"`
  - `photoURL: "google_photo_url"`
  - `password: ""` (empty)

## 🐛 Troubleshooting

### Error: "Popup blocked"
**Solution**: Allow popups for your site in browser settings

### Error: "auth/unauthorized-domain"
**Solution**: Add your domain to Firebase authorized domains

### Error: "Cannot connect to server"
**Solution**: Make sure backend is running and CORS is configured

### Error: "Firebase not initialized"
**Solution**: Run `npm install firebase` in E Com folder

### Google button doesn't work
**Solution**: 
1. Check browser console for errors
2. Verify Firebase config is correct
3. Make sure firebase package is installed

## 📱 How It Works

1. User clicks "Continue with Google"
2. Firebase opens Google sign-in popup
3. User selects Google account
4. Firebase returns user data (email, name, photo)
5. Frontend sends data to backend `/api/oauth-login`
6. Backend creates/updates user in MongoDB
7. User is logged in and redirected to dashboard

## 🎉 Benefits

- ✅ **Faster signup** - No password needed
- ✅ **More secure** - Google handles authentication
- ✅ **Better UX** - One-click login
- ✅ **Profile photo** - Automatically from Google
- ✅ **Email verified** - Google accounts are verified

## 📝 Next Steps

After Google OAuth works:
1. Test thoroughly on both local and production
2. Monitor Firebase Authentication dashboard for users
3. Consider adding "Sign in with Apple" (similar process)
4. Add profile photo display in dashboard

---

**Need Help?** Check Firebase Console logs or browser console for errors.
