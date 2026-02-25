# Test Shopping Marketplace

A mobile-first, production-ready marketplace application built with React, Node.js, and MySQL.

## Features

- **Guest Checkout**: Customers can browse and buy without an account.
- **Mobile-First Design**: Optimized for smartphones with a modern shopping UI.
- **Cart Management**: Persistent shopping cart using `localStorage`.
- **Seller Dashboard**: Authenticated portal for sellers to manage products and orders.
- **Image Uploads**: Support for product images using Multer.
- **Secure Auth**: JWT-based authentication for sellers and admins.

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, Lucide Icons, React Router.
- **Backend**: Node.js, Express, TypeScript, MySQL (mysql2), JWT, Bcrypt, Multer.
- **Database**: MySQL.

## Project Structure

```
miniapp/
├── client/              # React Frontend
│   ├── src/
│   │   ├── components/  # Reusable UI elements
│   │   ├── context/     # Global state (Cart, Auth)
│   │   ├── pages/       # Route views
│   │   ├── services/    # API calls
│   │   └── assets/      # Static files
│   └── tailwind.config.js
├── server/              # Express Backend
│   ├── src/
│   │   ├── config/      # DB, Multer config
│   │   ├── controllers/ # Logic handlers
│   │   ├── middlewares/ # Auth & error handling
│   │   ├── models/      # (Schema/Types)
│   │   └── routes/      # API endpoints
│   ├── uploads/         # Uploaded images
│   └── .env             # Environment variables
└── database.sql         # MySQL Schema
```

## Setup Instructions

### 1. Database Setup
SQLite is used, so no separate database installation is required! The database file `database.sqlite` will be automatically created in the `server` directory when you start the backend.

### 2. Backend Setup
1. Navigate to the `server` directory: `cd server`
2. Install dependencies: `npm install`
3. Create a `.env` file based on `.env.example`.
4. Start the server in development mode: `npm run dev`
   - This will automatically initialize the database schema.

### 3. Frontend Setup
1. Navigate to the `client` directory: `cd client`
2. Install dependencies: `npm install`
3. Start the Vite dev server: `npm run dev`
4. Access the app at `http://localhost:5173`.

## Environment Variables (.env)

```env
PORT=5000
DB_HOST=localhost
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=test_shopping
JWT_SECRET=your_secret_key
```

## API Documentation (Summary)

- `GET /api/products`: Fetch all products (supports `category` and `search` query params).
- `POST /api/orders`: Place a guest order.
- `POST /api/auth/login`: Seller/Admin login.
- `GET /api/seller/stats`: Get dashboard statistics (Authenticated).
- `GET /api/orders/seller`: Get orders for seller (Authenticated).
```
