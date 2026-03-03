# Multi-Vendor Marketplace System

## Overview
ShopHub now supports a complete multi-vendor marketplace where multiple dealers can register, add products, and manage their own orders independently.

## Features Implemented

### 1. Dealer Registration & Authentication
- **Dealer Registration Page** (`/dealer-registration`)
  - Dealers can register with business details
  - Auto-generated unique dealer codes (format: `DLR-{timestamp}-{random}`)
  - Approval system - dealers must be approved by admin before they can login
  
- **Dealer Login** (`/dealer-login`)
  - Login with email, password, and dealer code
  - Session persistence with localStorage
  - Separate from user login

### 2. Dealer Dashboard
- **Product Management**
  - Dealers can only see their own products
  - Products are filtered by `dealerCode`
  - Add, view, and delete own products
  
- **Order Management**
  - Dealers only see orders containing their products
  - Orders filtered by `dealerId` in items array
  - Can mark orders as delivered or cancel with reason
  
- **Customer Queries**
  - View and respond to customer support messages
  - Mark queries as Open/In Progress/Resolved

### 3. Admin Panel
- **Admin Login** (`/admin-login`)
  - Separate admin authentication
  - Secure admin-only access
  
- **Admin Dashboard**
  - **Overview**: Statistics for users, dealers, products, orders, revenue
  - **User Management**: View all users, delete users
  - **Dealer Management**: 
    - Approve/reject pending dealers
    - Activate/deactivate dealers
    - Delete dealers (removes their products too)
  - **Product Management**: View all products, delete any product
  - **Order Management**: View all orders across all dealers

### 4. Data Isolation
- Each dealer's products are tagged with `dealerId` and `dealerCode`
- Orders contain dealer info in each item
- Dealers can only access their own data
- Admin can access everything

## Database Schema Updates

### Product Model
```javascript
{
  name: String,
  price: String,
  rawPrice: Number,
  category: String,
  img: String,
  images: [String],        // Multiple product images
  description: String,     // Custom description
  dealerId: ObjectId,      // ✅ NEW: Reference to dealer
  dealerCode: String,      // ✅ NEW: For quick filtering
  // ... other fields
}
```

### Order Model
```javascript
{
  id: String,
  userName: String,
  items: [{
    productId: String,
    name: String,
    price: String,
    qty: Number,
    dealerId: ObjectId,    // ✅ NEW: Which dealer owns this item
    dealerCode: String,    // ✅ NEW: For filtering
  }],
  // ... other fields
}
```

### Dealer Model (NEW)
```javascript
{
  name: String,
  email: String,
  password: String (hashed),
  businessName: String,
  phone: String,
  address: String,
  dealerCode: String,      // Auto-generated unique code
  approved: Boolean,       // Admin approval status
  active: Boolean,         // Can be deactivated by admin
  createdAt: Date
}
```

### Admin Model (NEW)
```javascript
{
  name: String,
  email: String,
  password: String (hashed),
  createdAt: Date
}
```

## API Endpoints

### Dealer Routes (`/api/dealers`)
- `POST /register` - Register new dealer
- `POST /login` - Dealer login
- `GET /profile/:dealerId` - Get dealer profile
- `PATCH /profile/:dealerId` - Update dealer profile
- `GET /all` - Get all dealers (admin only)
- `PATCH /:dealerId/approval` - Approve/reject dealer (admin)
- `PATCH /:dealerId/status` - Activate/deactivate dealer (admin)

### Admin Routes (`/api/admin`)
- `POST /login` - Admin login
- `POST /create` - Create admin account
- `GET /stats` - Dashboard statistics
- `GET /users` - Get all users
- `GET /dealers` - Get all dealers
- `GET /products` - Get all products
- `GET /orders` - Get all orders
- `DELETE /users/:userId` - Delete user
- `DELETE /dealers/:dealerId` - Delete dealer
- `DELETE /products/:productId` - Delete product

### Updated Product Routes
- `GET /products?dealerCode=XXX` - Filter products by dealer
- `POST /products` - Now accepts `dealerId` and `dealerCode`

### Updated Order Routes
- `GET /orders/all?dealerId=XXX` - Filter orders by dealer

## User Flow

### For Dealers:
1. Register at `/dealer-registration`
2. Receive unique dealer code
3. Wait for admin approval
4. Login at `/dealer-login` with email, password, and dealer code
5. Access dealer dashboard to:
   - Add products (automatically tagged with dealer info)
   - View only their products
   - Manage orders for their products
   - Handle customer queries

### For Admin:
1. Login at `/admin-login`
2. Access admin dashboard to:
   - View statistics
   - Approve/reject dealer registrations
   - Manage all users and dealers
   - Monitor all products and orders
   - Delete any content

### For Customers:
1. Browse all products from all dealers
2. Add to cart and checkout
3. Orders are automatically linked to respective dealers
4. View order status in "My Orders"

## Navigation

### From User Login:
- "Dealer Portal" button → Dealer Login
- "Admin Panel" button → Admin Login

### From Dealer Login:
- "Register as Dealer" link → Dealer Registration
- "Go to User Login" link → User Login

### From Admin Login:
- "Go to User Login" link → User Login

## Security Features
- Passwords hashed with bcrypt
- Dealer codes are unique and auto-generated
- Approval system prevents unauthorized dealer access
- Data isolation ensures dealers only see their own data
- Admin has full oversight but separate authentication

## Testing the System

### Create First Admin:
```bash
# Use API endpoint or MongoDB directly
POST http://localhost:5000/api/admin/create
{
  "name": "Admin",
  "email": "admin@shophub.in",
  "password": "admin123"
}
```

### Register as Dealer:
1. Go to dealer registration
2. Fill in business details
3. Note the generated dealer code
4. Wait for admin approval

### Approve Dealer (as Admin):
1. Login to admin panel
2. Go to "Dealers" section
3. Click "Approve" on pending dealer

### Test Dealer Flow:
1. Login as dealer with code
2. Add products
3. View only your products
4. Check orders (only yours)

## Files Modified/Created

### Backend:
- ✅ `Backend-Ecom/models/Dealer.js` (NEW)
- ✅ `Backend-Ecom/models/Admin.js` (NEW)
- ✅ `Backend-Ecom/models/Product.js` (updated with dealer fields)
- ✅ `Backend-Ecom/models/Order.js` (updated with dealer fields)
- ✅ `Backend-Ecom/routes/dealerRoutes.js` (NEW)
- ✅ `Backend-Ecom/routes/adminRoutes.js` (NEW)
- ✅ `Backend-Ecom/routes/productRoutes.js` (updated with filtering)
- ✅ `Backend-Ecom/routes/orderRoutes.js` (updated with filtering)
- ✅ `Backend-Ecom/server.js` (added new routes)

### Frontend:
- ✅ `E Com/src/DealerRegistration.jsx` (NEW)
- ✅ `E Com/src/AdminLogin.jsx` (NEW)
- ✅ `E Com/src/AdminDashboard.jsx` (NEW)
- ✅ `E Com/src/DealerLogin.jsx` (updated with new API)
- ✅ `E Com/src/DealerDashboard.jsx` (updated with filtering)
- ✅ `E Com/src/AddProduct.jsx` (updated to include dealer info)
- ✅ `E Com/src/Dashboard.jsx` (updated order creation)
- ✅ `E Com/src/App.jsx` (added new routes)
- ✅ `E Com/src/api.js` (added dealer/admin functions)
- ✅ `E Com/src/Login.jsx` (added admin link)

## Next Steps (Optional Enhancements)
- Email notifications for dealer approval
- Dealer analytics and sales reports
- Commission system for admin
- Dealer ratings and reviews
- Bulk product upload
- Product approval workflow
- Dealer payout management
