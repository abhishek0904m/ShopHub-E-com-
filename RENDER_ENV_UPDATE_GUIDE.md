# Update Render Backend Environment Variable

## ⚠️ IMPORTANT: You Must Do This Step!

The code fix has been pushed to GitHub, but you need to add the environment variable in Render for it to work.

## Step-by-Step Instructions

### 1. Go to Render Dashboard
- Open: https://dashboard.render.com
- Login with your account

### 2. Find Your Backend Service
- Look for your backend service (probably named "Backend-Ecom" or similar)
- Click on it to open

### 3. Go to Environment Tab
- In the left sidebar, click **"Environment"**
- You'll see a list of environment variables

### 4. Add New Environment Variable
Click **"Add Environment Variable"** button

**Key**: `FRONTEND_URL`
**Value**: `https://shophub-frontend-fzd6.onrender.com`

⚠️ **Important**: 
- No trailing slash at the end
- Use HTTPS (not HTTP)
- Copy the exact URL of your frontend

### 5. Save Changes
- Click **"Save Changes"** button
- Render will automatically redeploy your backend
- Wait 2-3 minutes for deployment to complete

### 6. Verify Deployment
- Watch the "Events" tab
- Wait for "Deploy succeeded" message
- Check logs for: `🔒 CORS allowed origins:`

## Alternative: Set via Render.yaml (Optional)

If you want to automate this, create `render.yaml` in your backend folder:

```yaml
services:
  - type: web
    name: backend-ecom
    env: node
    buildCommand: npm install
    startCommand: node server.js
    envVars:
      - key: MONGO_URI
        sync: false
      - key: PORT
        value: 5000
      - key: GROQ_API_KEY
        sync: false
      - key: FRONTEND_URL
        value: https://shophub-frontend-fzd6.onrender.com
```

## Testing After Update

### 1. Test Dealer Registration
1. Go to: `https://shophub-frontend-fzd6.onrender.com`
2. Click "Dealer Portal" or navigate to dealer registration
3. Fill in the form
4. Submit
5. ✅ Should work without CORS error

### 2. Test Dealer Login
1. Go to dealer login page
2. Enter credentials
3. Click login
4. ✅ Should redirect to dealer dashboard

### 3. Test Admin Login
1. Go to admin login page
2. Enter admin credentials
3. Click login
4. ✅ Should redirect to admin dashboard

### 4. Verify in Browser Console
1. Open DevTools (F12)
2. Go to Network tab
3. Try dealer registration
4. Click on the request
5. Check Response Headers
6. Should see: `Access-Control-Allow-Origin: https://shophub-frontend-fzd6.onrender.com`

## Common Issues

### Issue: Still Getting CORS Error
**Solution**:
1. Verify environment variable is saved in Render
2. Check backend redeployed successfully
3. Clear browser cache (Ctrl+Shift+R)
4. Try in incognito mode

### Issue: Backend Won't Deploy
**Solution**:
1. Check Render logs for errors
2. Verify FRONTEND_URL has no typos
3. Try manual deploy
4. Check all environment variables are set

### Issue: Variable Not Showing
**Solution**:
1. Make sure you clicked "Save Changes"
2. Refresh the Render page
3. Check you're in the correct service
4. Try adding it again

## Verification Checklist

- [ ] Logged into Render Dashboard
- [ ] Found backend service
- [ ] Clicked "Environment" tab
- [ ] Added `FRONTEND_URL` variable
- [ ] Value is `https://shophub-frontend-fzd6.onrender.com`
- [ ] Clicked "Save Changes"
- [ ] Backend redeployed successfully
- [ ] Tested dealer registration - works ✅
- [ ] Tested dealer login - works ✅
- [ ] Tested admin login - works ✅
- [ ] No CORS errors in console ✅

## Expected Result

After adding the environment variable and redeploying:

✅ **Dealer Registration**: Works perfectly
✅ **Dealer Login**: Works perfectly
✅ **Admin Login**: Works perfectly
✅ **User Login**: Still works (was already working)
✅ **No CORS Errors**: Console is clean

## Need Help?

If you're stuck:
1. Check Render logs for error messages
2. Verify the frontend URL is correct
3. Make sure there's no trailing slash
4. Try clearing browser cache
5. Test in incognito mode

---

**Status**: Waiting for you to add environment variable in Render
**Next**: Add variable → Wait for deploy → Test all logins
