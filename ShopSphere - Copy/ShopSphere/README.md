# ShopSphere

Full-stack e-commerce starter built with React, Vite, Express, MongoDB and JWT.

## Requirements
- Node.js 20+
- MongoDB Atlas connection string (or local MongoDB)
- npm

## Setup
1. Open two terminals.
2. Backend:
   ```bash
   cd backend
   cp .env.example .env
   npm install
   npm run dev
   ```
3. Frontend:
   ```bash
   cd frontend
   cp .env.example .env
   npm install
   npm run dev
   ```
4. Open http://localhost:5173

Create the first admin by registering normally, then promote that user in MongoDB:
`db.users.updateOne({email: "your@email.com"}, {$set: {role: "admin"}})`

## Implemented
- Registration, login, current-user session and logout
- Product listing, details, search, category filtering and sorting
- Admin product/category CRUD
- Cart and wishlist (database-backed for signed-in users)
- Checkout and order creation (cash on delivery)
- Order history and admin order status management
- Product reviews
- Responsive React interface

## Configuration
See `backend/.env.example`. Never commit `.env` files or share database credentials.
Razorpay and Cloudinary are intentionally not activated in this baseline; they require account credentials and should be added after the core store is verified.
