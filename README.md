# 🛍️ ShopHub - Full-Stack E-Commerce Platform

A modern, feature-rich e-commerce platform built with React, Node.js, Express, and MongoDB. Supports multi-vendor system with separate dashboards for users, dealers, and admins.

![ShopHub](https://img.shields.io/badge/Status-Production%20Ready-success)
![React](https://img.shields.io/badge/React-19.2.0-blue)
![Node](https://img.shields.io/badge/Node-%3E%3D18.0.0-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen)

---

## ✨ Features

### 👤 User Features
- **User Authentication**: Secure registration and login
- **Product Browsing**: View products organized by categories
- **Search & Filter**: Real-time search across products
- **Shopping Cart**: Add/remove products, adjust quantities
- **Wishlist**: Save favorite products
- **Order Management**: Place orders, track status
- **Payment Integration**: Razorpay (COD & Online)
- **AI Chatbot**: 24/7 customer support powered by Groq
- **Responsive Design**: Mobile-friendly Myntra-style UI

### 🏪 Dealer Features
- **Dealer Registration**: Unique dealer code system
- **Product Management**: Add, edit, delete products
- **Order Tracking**: View and manage customer orders
- **Dashboard Analytics**: Sales and product statistics
- **Multi-image Upload**: Support for product galleries
- **Custom Descriptions**: Rich product details

### 👨‍💼 Admin Features
- **Dealer Management**: Approve/reject dealer registrations
- **Product Oversight**: View and manage all products
- **Order Monitoring**: Track all platform orders
- **User Management**: View registered users
- **Support Queries**: Manage customer support tickets
- **Analytics Dashboard**: Platform-wide statistics

---

## 🚀 Tech Stack

### Frontend
- **React 19.2.0** - UI library
- **Vite** - Build tool
- **CSS3** - Styling (no frameworks, custom design)
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin support

### External Services
- **MongoDB Atlas** - Cloud database
- **Razorpay** - Payment gateway
- **Groq AI** - Chatbot intelligence
- **Render** - Deployment platform

---

## 📁 Project Structure

```
shophub/
├── Backend-Ecom/           # Backend (Node.js + Express)
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API routes
│   ├── server.js          # Entry point
│   ├── .env.example       # Environment template
│   └── package.json
│
├── E Com/                 # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── api.js         # API calls
│   │   ├── config.js      # Configuration
│   │   └── App.jsx        # Main app
│   ├── public/            # Static assets
│   └── package.json
│
├── QUICK_DEPLOY.md        # 30-min deployment guide
├── DEPLOYMENT_CHECKLIST.md # Detailed deployment steps
└── README.md              # This file
```

---

## 🛠️ Local Setup

### Prerequisites
- Node.js >= 18.0.0
- MongoDB Atlas account (free tier)
- Git

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/shophub.git
cd shophub
```

### 2. Backend Setup
```bash
cd Backend-Ecom
npm install

# Create .env file
cp .env.example .env
# Edit .env with your credentials
```

### 3. Frontend Setup
```bash
cd "E Com"
npm install
```

### 4. Run Development Servers

**Backend** (Terminal 1):
```bash
cd Backend-Ecom
npm run dev
# Runs on http://localhost:5000
```

**Frontend** (Terminal 2):
```bash
cd "E Com"
npm run dev
# Runs on http://localhost:5173
```

### 5. Create Admin Account
```bash
cd Backend-Ecom
node createAdmin.js
```

---

## 🌐 Deployment

### Quick Deploy (30 minutes)
Follow the **QUICK_DEPLOY.md** guide for step-by-step instructions.

### Deployment Platforms
- **Backend**: Render Web Service
- **Frontend**: Render Static Site
- **Database**: MongoDB Atlas

### Environment Variables

**Backend** (Render):
```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-frontend.onrender.com
RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret
GROQ_API_KEY=your_groq_key
```

**Frontend** (Render):
```env
VITE_API_URL=https://your-backend.onrender.com
```

See **ENV_VARIABLES_REFERENCE.md** for detailed information.

---

## 📚 Documentation

- **[Quick Deploy Guide](QUICK_DEPLOY.md)** - Get live in 30 minutes
- **[Deployment Checklist](DEPLOYMENT_CHECKLIST.md)** - Detailed steps
- **[Environment Variables](ENV_VARIABLES_REFERENCE.md)** - Complete reference
- **[Render Deployment](RENDER_DEPLOYMENT_GUIDE.md)** - Full guide

---

## 🎯 Key Features Explained

### Myntra-Style Product Cards
- 80/20 image-to-content ratio
- Hover effects with white overlay
- Wishlist button appears on hover
- "Add to Bag" button overlays image
- Rating badge at bottom-left
- Clean, minimal design

### Multi-Vendor System
- Dealers register with unique codes
- Admin approval required
- Dealers manage their own products
- Orders routed to respective dealers

### Smart Cart & Wishlist
- Persistent cart (saved to database)
- Real-time updates
- Quantity management
- Wishlist toggle functionality

### Dynamic Deals Section
- Auto-generated from discounted products
- Grouped by category
- Shows average discount percentage
- Click to view deal products

### AI-Powered Chatbot
- 24/7 customer support
- Product recommendations
- Order tracking assistance
- Powered by Groq AI

---

## 🔐 Security Features

- Password hashing with bcryptjs
- Environment variable protection
- CORS configuration
- Input validation
- Secure payment integration
- MongoDB injection prevention

---

## 📱 Mobile Responsive

- Breakpoints: 480px, 768px, 1024px
- Touch-friendly interface
- Optimized for mobile browsers
- Flipkart/Amazon-style mobile experience

---

## 🧪 Testing

### Test Accounts

**User**:
- Register at `/register`

**Dealer**:
- Register at dealer registration
- Wait for admin approval

**Admin**:
- Created via `createAdmin.js`
- Default: admin@shophub.com

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

---

## 🙏 Acknowledgments

- React team for amazing framework
- MongoDB for cloud database
- Render for free hosting
- Razorpay for payment integration
- Groq for AI capabilities

---

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Check documentation files
- Review deployment guides

---

## 🎉 Live Demo

**Frontend**: [https://your-app.onrender.com](https://shophub-frontend-fzd6.onrender.com)
**Backend API**: [https://your-api.onrender.com](https://your-api.onrender.com)

---

**Made with ❤️ by [Your Name]**

⭐ Star this repo if you find it helpful!
