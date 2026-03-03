# Gemini AI Chatbot Setup Guide

## 🤖 Overview
The ShopHub platform now includes an AI-powered chatbot using Google's Gemini API. The chatbot provides contextual help to both customers and dealers.

## 📋 Prerequisites
- Google Cloud account (free tier available)
- Gemini API key

## 🔑 Getting Your Gemini API Key

### Step 1: Go to Google AI Studio
1. Visit: https://makersuite.google.com/app/apikey
2. Sign in with your Google account

### Step 2: Create API Key
1. Click "Create API Key"
2. Select a Google Cloud project (or create new one)
3. Copy the generated API key

### Step 3: Add to Environment Variables
1. Open `Backend-Ecom/.env` file
2. Add this line:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```
3. Replace `your_api_key_here` with your actual API key

## 📝 Example .env File

```env
MONGO_URI=mongodb://localhost:27017/shophub
PORT=5000
GEMINI_API_KEY=AIzaSyC-xxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## ✅ Testing the Chatbot

### Step 1: Restart Backend
After adding the API key, restart your backend server:
```bash
cd Backend-Ecom
npm start
```

### Step 2: Test as User
1. Login as a regular user
2. Look for the chatbot button (💬) in bottom-right corner
3. Click to open chatbot
4. Try asking:
   - "How do I track my order?"
   - "What products do you have?"
   - "How can I return an item?"

### Step 3: Test as Dealer
1. Login as a dealer
2. Click the chatbot button
3. Try asking:
   - "How do I add a new product?"
   - "How can I manage my orders?"
   - "What should I do if a customer wants to cancel?"

## 🎯 Chatbot Features

### For Customers:
- Product recommendations
- Order tracking help
- Shopping assistance
- Return/refund information
- General customer support

### For Dealers:
- Product management guidance
- Order handling tips
- Business growth advice
- Customer service best practices
- Platform feature explanations

## 🔧 Customization

### Modify Chatbot Behavior
Edit `Backend-Ecom/routes/chatbotRoutes.js`:

```javascript
const systemContext = userType === "dealer"
  ? "Your custom dealer assistant prompt here"
  : "Your custom customer assistant prompt here";
```

### Adjust Conversation History
Change the number of previous messages sent for context:
```javascript
.slice(-6)  // Change 6 to any number
```

### Modify UI
Edit `E Com/src/Chatbot.jsx` to customize:
- Colors and styling
- Button position
- Window size
- Messages appearance

## 💰 Pricing

### Gemini API Free Tier:
- 60 requests per minute
- 1,500 requests per day
- Free for development and testing

### Paid Tier:
- Higher rate limits
- Production use
- See: https://ai.google.dev/pricing

## 🚨 Troubleshooting

### "Chatbot not configured" Error
- Check if `GEMINI_API_KEY` is in `.env` file
- Restart backend server after adding key
- Verify API key is valid

### "API error" Messages
- Check API key is correct
- Verify you haven't exceeded rate limits
- Check internet connection
- View backend console for detailed errors

### Chatbot Button Not Showing
- Clear browser cache
- Check browser console for errors
- Verify Chatbot component is imported
- Restart frontend: `npm run dev`

## 🔒 Security Best Practices

1. **Never commit API keys to Git**
   - Add `.env` to `.gitignore`
   - Use environment variables only

2. **Rotate keys regularly**
   - Generate new keys periodically
   - Revoke old keys in Google Cloud Console

3. **Monitor usage**
   - Check Google Cloud Console for usage
   - Set up billing alerts
   - Monitor for unusual activity

4. **Rate limiting**
   - Implement rate limiting on backend
   - Prevent abuse from single users
   - Cache common responses

## 📊 Monitoring

### Check API Usage:
1. Go to Google Cloud Console
2. Navigate to APIs & Services
3. View Gemini API usage statistics

### Backend Logs:
Monitor backend console for:
- Chatbot requests
- API errors
- Response times

## 🎨 UI Customization Examples

### Change Chatbot Colors:
```css
.chatbot-button {
  background: linear-gradient(135deg, #your-color-1, #your-color-2);
}
```

### Change Position:
```css
.chatbot-container {
  bottom: 24px;  /* Distance from bottom */
  right: 24px;   /* Distance from right */
}
```

### Change Window Size:
```css
.chatbot-window {
  width: 380px;   /* Window width */
  height: 550px;  /* Window height */
}
```

## 🚀 Advanced Features (Optional)

### Add Voice Input:
- Integrate Web Speech API
- Convert speech to text
- Send to chatbot

### Add Typing Indicators:
- Already implemented!
- Shows when AI is thinking

### Save Chat History:
- Store conversations in MongoDB
- Load previous chats on login
- Analyze common questions

### Multi-language Support:
- Detect user language
- Translate prompts
- Gemini supports multiple languages

## 📚 Resources

- Gemini API Docs: https://ai.google.dev/docs
- Google AI Studio: https://makersuite.google.com
- Pricing: https://ai.google.dev/pricing
- Rate Limits: https://ai.google.dev/docs/rate_limits

## ✨ Tips for Better Responses

1. **Be specific in prompts**
   - Clear system context
   - Detailed user type descriptions

2. **Provide conversation history**
   - Helps maintain context
   - Better follow-up responses

3. **Set response guidelines**
   - Length limits
   - Tone and style
   - Formatting preferences

4. **Handle errors gracefully**
   - Fallback messages
   - Retry logic
   - User-friendly error messages

---

**Your AI chatbot is now ready!** 🎉

Users and dealers can get instant help 24/7 with the Gemini-powered assistant.
