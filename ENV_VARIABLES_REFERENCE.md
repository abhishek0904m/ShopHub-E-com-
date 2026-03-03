# 🔐 Environment Variables Reference

Quick reference for all environment variables needed for deployment.

---

## 🖥️ Backend Environment Variables

Add these in Render → Backend Service → Environment:

```env
# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/shophub?retryWrites=true&w=majority

# Server
PORT=5000
NODE_ENV=production

# Frontend URL (update after deploying frontend)
FRONTEND_URL=https://your-frontend-name.onrender.com

# Payment Gateway (Razorpay)
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxx

# AI Chatbot (Groq)
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxx
```

---

## 🎨 Frontend Environment Variables

Add these in Render → Frontend Static Site → Environment:

```env
# Backend API URL (use your actual backend URL)
VITE_API_URL=https://your-backend-name.onrender.com
```

---

## 📝 How to Get These Values

### MongoDB URI
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create cluster → Create database user
3. Network Access → Allow 0.0.0.0/0
4. Connect → Connect your application → Copy connection string
5. Replace `<password>` with your actual password

### Razorpay Keys
1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com)
2. Settings → API Keys
3. Generate Test Keys (for testing)
4. Generate Live Keys (for production)

### Groq API Key
1. Go to [Groq Console](https://console.groq.com)
2. Create account
3. API Keys → Create new key
4. Copy the key

### Frontend/Backend URLs
- These are provided by Render after deployment
- Format: `https://your-service-name.onrender.com`
- Update `FRONTEND_URL` in backend after frontend is deployed

---

## ⚠️ Important Notes

1. **Never commit these to GitHub**
   - Add `.env` to `.gitignore`
   - Only set in Render dashboard

2. **Test vs Production Keys**
   - Use test keys for development
   - Use live keys for production
   - Razorpay test keys start with `rzp_test_`
   - Razorpay live keys start with `rzp_live_`

3. **Update After Deployment**
   - Deploy backend first
   - Deploy frontend second
   - Update `FRONTEND_URL` in backend
   - Redeploy backend

4. **Security**
   - Use strong MongoDB password
   - Keep API keys secret
   - Rotate keys periodically
   - Monitor usage in dashboards

---

## 🔄 Updating Environment Variables

### In Render:
1. Go to service dashboard
2. Click "Environment" in sidebar
3. Edit or add variables
4. Click "Save Changes"
5. Service will auto-redeploy

### Testing Locally:
Create `Backend-Ecom/.env` file:
```env
MONGO_URI=mongodb+srv://...
PORT=5000
FRONTEND_URL=http://localhost:5173
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
GROQ_API_KEY=gsk_...
```

Create `E Com/.env` file:
```env
VITE_API_URL=http://localhost:5000
```

---

## ✅ Verification Checklist

After setting environment variables:

- [ ] Backend connects to MongoDB (check logs)
- [ ] Frontend can reach backend API
- [ ] CORS allows frontend domain
- [ ] Razorpay keys work (test payment)
- [ ] Chatbot responds (test chat)
- [ ] No CORS errors in browser console
- [ ] All API calls succeed

---

## 🆘 Troubleshooting

**MongoDB connection fails:**
- Check IP whitelist (0.0.0.0/0)
- Verify password in connection string
- Check cluster is running

**CORS errors:**
- Verify `FRONTEND_URL` matches actual frontend URL
- Check no trailing slash in URL
- Redeploy backend after changing

**API calls fail:**
- Verify `VITE_API_URL` in frontend
- Check backend is running
- Test backend URL directly

**Payment fails:**
- Check Razorpay keys are correct
- Verify test mode vs live mode
- Check Razorpay dashboard for errors

---

**Keep this reference handy during deployment! 📌**
