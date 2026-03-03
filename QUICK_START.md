# 🚀 Quick Start Guide - ShopHub Multi-Vendor System

## 1️⃣ Install & Setup (5 minutes)

### Backend Setup
```bash
cd Backend-Ecom
npm install
node createAdmin.js
npm start
```

### Frontend Setup (in new terminal)
```bash
cd "E Com"
npm install
npm run dev
```

## 2️⃣ Access Points

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000

## 3️⃣ Default Credentials

### Admin
- Email: `admin@shophub.in`
- Password: `admin123`

## 4️⃣ Quick Test Flow

### Step 1: Login as Admin
1. Go to http://localhost:5173
2. Click "Login"
3. Click "Admin Panel" button
4. Login with admin credentials
5. Explore the admin dashboard

### Step 2: Register a Dealer
1. Logout from admin
2. Click "Login" → "Dealer Portal"
3. Click "Register as Dealer"
4. Fill in the form:
   - Name: Test Dealer
   - Email: dealer1@test.com
   - Password: dealer123
   - Business Name: Test Store
   - Phone: 1234567890
   - Address: Test Address
5. **SAVE THE DEALER CODE** shown on success screen
6. Click "Go to Dealer Login"

### Step 3: Approve the Dealer (as Admin)
1. Login as admin again
2. Go to "Dealers" section
3. Find "Test Dealer" with "Pending" status
4. Click "✅ Approve"

### Step 4: Login as Dealer
1. Logout from admin
2. Go to "Dealer Portal"
3. Login with:
   - Email: dealer1@test.com
   - Password: dealer123
   - Dealer Code: (the code you saved)
4. You're now in the dealer dashboard!

### Step 5: Add a Product (as Dealer)
1. Click "Add Product" in sidebar
2. Fill in product details:
   - Name: Test Product
   - Price: 999
   - Category: Electronics
   - Upload an image
   - Add description
3. Click "Add Product"
4. Product appears in "Products" section

### Step 6: Test as Customer
1. Logout from dealer
2. Register as a new user
3. Browse products (you'll see the dealer's product)
4. Add to cart and checkout
5. View order in "My Orders"

### Step 7: Verify Order (as Dealer)
1. Logout from user
2. Login as dealer again
3. Go to "All Orders"
4. You'll see the order from the customer
5. Mark it as "Delivered" or "Cancel" it

## 5️⃣ Create Multiple Dealers

Repeat steps 2-4 with different emails to create multiple dealers:
- dealer2@test.com
- dealer3@test.com

Each dealer will only see their own products and orders!

## 6️⃣ Admin Features

Login as admin to:
- View all statistics
- Manage all users
- Approve/reject dealers
- Activate/deactivate dealers
- View all products from all dealers
- View all orders
- Delete any content

## 🎯 Key Points

✅ Each dealer has a unique auto-generated code
✅ Dealers must be approved by admin before login
✅ Dealers only see their own products and orders
✅ Admin sees everything
✅ Customers see products from all dealers
✅ Orders are automatically linked to correct dealers

## 🔧 Troubleshooting

### Backend won't start
```bash
# Check if MongoDB is running
# On Windows: Check Services for MongoDB
# On Mac/Linux: sudo systemctl status mongod
```

### "Admin already exists" error
```bash
# Admin was already created, just use the credentials
# Email: admin@shophub.in
# Password: admin123
```

### Can't login as dealer
- Make sure dealer is approved by admin
- Check dealer code is correct (case-sensitive)
- Verify dealer account is active

### Products not showing
- Make sure you're logged in as the correct dealer
- Check if products were added successfully
- Refresh the page

## 📚 Full Documentation

For detailed information, see:
- `MULTI_VENDOR_SYSTEM.md` - Complete system documentation
- `SETUP_INSTRUCTIONS.md` - Detailed setup guide
- `IMPLEMENTATION_SUMMARY.md` - Technical implementation details

## 🎉 You're All Set!

The multi-vendor marketplace is now running. You can:
- Register multiple dealers
- Add products as each dealer
- Place orders as customers
- Manage everything as admin

Enjoy your ShopHub multi-vendor marketplace! 🛍️
