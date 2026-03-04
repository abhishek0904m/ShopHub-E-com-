# OAuth Integration Guide - Google & Facebook Login

## Overview
This guide will help you integrate Google and Facebook login into your ShopHub application using Firebase Authentication.

## Why Firebase?
- Easy setup for Google & Facebook OAuth
- Free tier is generous
- Handles all OAuth complexity
- Works seamlessly with React
- Secure token management

## Step 1: Install Firebase

```bash
cd "E Com"
npm install firebase
```

## Step 2: Create Firebase Project

1. Go to https://console.firebase.google.com
2. Click "Add project"
3. Name it "ShopHub"
4. Disable Google Analytics (optional)
5. Click "Create project"

## Step 3: Enable Authentication

1. In Firebase Console, click "Authentication"
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Google"
   - Click "Google"
   - Toggle "Enable"
   - Add support email
   - Click "Save"
5. Enable "Facebook"
   - Click "Facebook"
   - Toggle "Enable"
   - You'll need Facebook App ID and Secret (see Step 4)

## Step 4: Setup Facebook App

1. Go to https://developers.facebook.com
2. Click "My Apps" → "Create App"
3. Choose "Consumer" → "Next"
4. App name: "ShopHub"
5. Click "Create app"
6. In left sidebar, click "Add Product"
7. Find "Facebook Login" → Click "Set Up"
8. Choose "Web"
9. Enter your site URL: `https://shophub-frontend-fzd6.onrender.com`
10. Go to Settings → Basic
11. Copy "App ID" and "App Secret"
12. Paste them in Firebase Facebook settings
13. Copy the OAuth redirect URI from Firebase
14. In Facebook App, go to Facebook Login → Settings
15. Paste the redirect URI in "Valid OAuth Redirect URIs"
16. Click "Save Changes"

## Step 5: Get Firebase Config

1. In Firebase Console, click the gear icon → "Project settings"
2. Scroll down to "Your apps"
3. Click the web icon (</>)
4. Register app name: "ShopHub Web"
5. Copy the firebaseConfig object

## Step 6: Create Firebase Config File

Create `E Com/src/firebase.js`:

```javascript
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();
```

## Step 7: Update Backend to Handle OAuth

Add this route to `Backend-Ecom/server.js`:

```javascript
// ── OAUTH LOGIN/REGISTER ──
app.post("/api/oauth-login", async (req, res) => {
  const { email, name, provider, providerId } = req.body;

  if (!email || !name) {
    return res.status(400).json({ message: "Email and name are required" });
  }

  try {
    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user with OAuth
      user = await User.create({
        name,
        email,
        password: "", // No password for OAuth users
        authProvider: provider, // 'google' or 'facebook'
        providerId: providerId,
      });
    }

    res.json({
      message: "Login successful",
      name: user.name,
      userId: user._id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
```

## Step 8: Update User Model

Add OAuth fields to `Backend-Ecom/models/User.js`:

```javascript
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String }, // Optional for OAuth users
  authProvider: { type: String, enum: ['local', 'google', 'facebook'], default: 'local' },
  providerId: { type: String }, // OAuth provider user ID
  // ... rest of fields
});
```

## Step 9: Files to Create/Update

I'll create these files for you:
1. `E Com/src/firebase.js` - Firebase configuration
2. `E Com/src/useOAuth.js` - Custom hook for OAuth
3. Update `E Com/src/Registration.jsx` - Add OAuth handlers
4. Update `E Com/src/Login.jsx` - Add OAuth handlers
5. Update `Backend-Ecom/models/User.js` - Add OAuth fields
6. Update `Backend-Ecom/server.js` - Add OAuth route

## Security Notes

- Never commit Firebase config with real keys to GitHub
- Use environment variables for production
- Add your production domain to Firebase authorized domains
- Keep Facebook App Secret secure

## Testing

1. Local: Add `http://localhost:5173` to Firebase authorized domains
2. Production: Add `https://shophub-frontend-fzd6.onrender.com`

## Next Steps

After I create the files, you'll need to:
1. Create Firebase project
2. Get Firebase config
3. Create Facebook app
4. Update firebase.js with your config
5. Test Google login
6. Test Facebook login

Ready to proceed? I'll create all the necessary files now!
