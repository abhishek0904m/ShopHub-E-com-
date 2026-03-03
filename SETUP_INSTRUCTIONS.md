# ShopHub Multi-Vendor Setup Instructions

## Prerequisites
- Node.js installed
- MongoDB running
- Backend and Frontend folders set up

## Step 1: Install Dependencies

### Backend
```bash
cd Backend-Ecom
npm install
```

### Frontend
```bash
cd "E Com"
npm install
```

## Step 2: Configure Environment

Create `.env` file in `Backend-Ecom` folder:
```env
MONGO_URI=mongodb://localhost:27017/shophub
PORT=5000
```

## Step 3: Create First Admin Account

```bash
cd Backend-Ecom
node createAdmin.js
```

This will create an admin account with:
- Email: `admin@shophub.in`
- Password: `admin123`

**⚠ IMPORTANT: Change this password after first login!**

## Step 4: Start the Backend Server

```bash
cd Backend-Ecom
npm start
```

Server should start on `http://localhost:5000`

## Step 5: Start the Frontend

```bash
cd "E Com"
npm run dev
```

Frontend should start on `http://localhost:5173`

## Step 6: Test the System

### Test Admin Login
1. Go to `http://localhost:5173`
2. Click "Login"
3. Click "Admin Panel" button
4. Login with:
   - Email: `admin@shophub.in`
   - Password: `admin123`

### Test Dealer Registration
1. Go to `http://localhost:5173`
2. Click "Login"
3. Click "Dealer Portal"
4. Click "Register as Dealer"
5. Fill in the form
6. Note the generated dealer code
7. Login as admin and approve the dealer
8. Login as dealer with the code

### Test User Flow
1. Register as a regular user
2. Browse products (from all dealers)
3. Add to cart and checkout
4. View orders in "My Orders"

## User Roles

### 1. Customer (Regular User)
- Register/Login at main page
- Browse all products
- Add to cart and checkout
- View own orders
- Contact support

### 2. Dealer
- Register at dealer registration page
- Wait for admin approval
- Login with email, password, and dealer code
- Add and manage own products
- View orders for own products only
- Handle customer queries

### 3. Admin
- Login at admin panel
- Approve/reject dealer registrations
- Manage all users and dealers
- View all products and orders
- Delete any content
- View platform statistics

## Navigation Guide

### From Main Login Page:
- "Dealer Portal" → Dealer Login
- "Admin Panel" → Admin Login

### From Dealer Login:
- "Register as Dealer" → Dealer Registration
- "Go to User Login" → Main Login

### From Admin Login:
- "Go to User Login" → Main Login

## Troubleshooting

### Backend won't start
- Check if MongoDB is running
- Verify `.env` file exists with correct MONGO_URI
- Check if port 5000 is available

### Frontend won't start
- Check if backend is running on port 5000
- Verify `vite.config.js` proxy settings
- Clear node_modules and reinstall

### Dealer can't login
- Verify dealer is approved by admin
- Check dealer code is correct
- Ensure dealer account is active

### Products not showing
- Check if products have dealerCode assigned
- Verify backend routes are working
- Check browser console for errors

## API Endpoints Reference

### User Routes
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `GET /api/profile/:email` - Get user profile
- `PATCH /api/profile/:email` - Update profile

### Dealer Routes
- `POST /api/dealers/register` - Dealer registration
- `POST /api/dealers/login` - Dealer login
- `GET /api/dealers/all` - Get all dealers (admin)
- `PATCH /api/dealers/:id/approval` - Approve dealer (admin)
- `PATCH /api/dealers/:id/status` - Toggle dealer status (admin)

### Admin Routes
- `POST /api/admin/login` - Admin login
- `POST /api/admin/create` - Create admin
- `GET /api/admin/stats` - Dashboard stats
- `GET /api/admin/users` - All users
- `GET /api/admin/dealers` - All dealers
- `GET /api/admin/products` - All products
- `GET /api/admin/orders` - All orders
- `DELETE /api/admin/users/:id` - Delete user
- `DELETE /api/admin/dealers/:id` - Delete dealer
- `DELETE /api/admin/products/:id` - Delete product

### Product Routes
- `GET /api/products` - All products
- `GET /api/products?dealerCode=XXX` - Dealer's products
- `POST /api/products` - Create product
- `DELETE /api/products/:id` - Delete product

### Order Routes
- `GET /api/orders/:userName` - User's orders
- `GET /api/orders/all` - All orders (admin)
- `GET /api/orders/all?dealerId=XXX` - Dealer's orders
- `POST /api/orders` - Create order
- `PATCH /api/orders/:id/status` - Update order status

## Security Notes

1. **Passwords**: All passwords are hashed with bcrypt
2. **Dealer Codes**: Auto-generated and unique
3. **Data Isolation**: Dealers can only access their own data
4. **Admin Access**: Separate authentication for admin
5. **Session Management**: Uses localStorage for persistence

## Production Deployment

Before deploying to production:

1. Change default admin password
2. Use environment variables for sensitive data
3. Enable HTTPS
4. Set up proper CORS policies
5. Add rate limiting
6. Implement proper error logging
7. Set up database backups
8. Add email notifications
9. Implement proper session management (JWT)
10. Add input validation and sanitization

## Support

For issues or questions:
1. Check the console for error messages
2. Verify all services are running
3. Check database connections
4. Review API responses in Network tab
5. Ensure all dependencies are installed

## Features Implemented

✅ Multi-vendor marketplace
✅ Dealer registration with approval
✅ Auto-generated dealer codes
✅ Data isolation per dealer
✅ Admin panel with full control
✅ Product management per dealer
✅ Order filtering by dealer
✅ Customer support queries
✅ Session persistence
✅ Responsive design
✅ Multiple product images
✅ Custom product descriptions
✅ Order cancellation with reasons
✅ Dealer activation/deactivation

## Next Steps (Optional)

- Email notifications
- Dealer analytics
- Commission system
- Ratings and reviews
- Bulk product upload
- Product approval workflow
- Payout management
- Advanced search and filters
- Inventory management
- Sales reports
