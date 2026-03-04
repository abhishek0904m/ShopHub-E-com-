# Simple Google OAuth Setup (No Firebase!)

## Overview
We'll use `@react-oauth/google` - Google's official React library for OAuth.
Much simpler than Firebase!

## Step 1: Install Package

```bash
cd "E Com"
npm install @react-oauth/google
```

## Step 2: Get Google Client ID

1. Go to https://console.cloud.google.com
2. Create a new project or select existing one
3. Click "APIs & Services" → "Credentials"
4. Click "Create Credentials" → "OAuth client ID"
5. If prompted, configure OAuth consent screen:
   - User Type: External
   - App name: ShopHub
   - User support email: your email
   - Developer contact: your email
   - Click "Save and Continue"
   - Skip Scopes
   - Add test users (your email)
   - Click "Save and Continue"
6. Back to "Create OAuth client ID":
   - Application type: **Web application**
   - Name: **ShopHub Web**
   - Authorized JavaScript origins:
     - `http://localhost:5173`
     - `https://shophub-frontend-fzd6.onrender.com`
   - Authorized redirect URIs:
     - `http://localhost:5173`
     - `https://shophub-frontend-fzd6.onrender.com`
   - Click "Create"
7. **COPY the Client ID** (looks like: `123456789-abc123.apps.googleusercontent.com`)

## Step 3: Create Config File

Create `E Com/src/googleConfig.js`:

```javascript
export const GOOGLE_CLIENT_ID = "YOUR_CLIENT_ID_HERE.apps.googleusercontent.com";
```

## Step 4: Wrap App with GoogleOAuthProvider

I'll update `E Com/src/App.jsx` to wrap everything with the provider.

## Step 5: Update Components

I'll update Registration and Login to use the simple Google button.

## That's It!

Much simpler than Firebase:
- ✅ No Firebase project needed
- ✅ No Firebase config
- ✅ Just one Client ID
- ✅ Official Google library
- ✅ Works perfectly

Let me create the files now...
