# 🌿 Herbify — Project Breakdown & Learning Guide

Welcome to the **Herbify** deep dive. This document provides a comprehensive breakdown of the project architecture, technical stack, and core implementation details to help you master the codebase.

---

## 🏗️ High-Level Architecture

Herbify is a modern **MERN** (MongoDB, Express, React, Node.js) application designed with a decoupled frontend and backend.

- **Frontend**: A React single-page application (SPA) powered by **Vite**, using **Tailwind CSS** for a premium "Glassmorphism" look.
- **Backend**: A Node.js/Express server that serves a RESTful API and handles authentication, payments, and real-time notifications.
- **Database**: **MongoDB Atlas** for document-based storage (Mongoose ODM).
- **Communication**: 
  - **REST API** for most data transfers.
  - **Socket.io** for real-time stock updates and admin order notifications.
  - **Telegram Bot** for instant admin alerts (low stock & new orders).

---

## 🛠️ Technical Stack Deep-Dive

### **Frontend (client/)**
| Tech | Purpose |
| :--- | :--- |
| **React 18** | Core UI framework. |
| **Vite** | Lightning-fast build tool and dev server. |
| **Tailwind CSS** | Utility-first CSS for professional styling. |
| **Recharts** | Used in the Admin Dashboard for visual analytics. |
| **React Hot Toast** | Premium snackbar/toast notifications. |
| **Axios (custom lib)** | Centralized API communication (see `client/src/lib/api.js`). |

### **Backend (server/)**
| Tech | Purpose |
| :--- | :--- |
| **Express.js** | Web framework for routing and middleware. |
| **JWT (JSON Web Token)** | Secure authentication using HTTP-only cookies. |
| **Zod** | Runtime schema validation for API requests (strong typing for JS). |
| **Bcryptjs** | Industrial-standard password hashing. |
| **Cloudinary** | Cloud storage for herbal images. |
| **Razorpay** | Payment gateway for a seamless checkout experience. |
| **Helmet / Rate Limit** | Security headers and brute-force protection. |

---

## 📂 Core Folder Structure

### **1. Server Architecture**
- `models/`: Mongoose schemas (User, Herb, Product, Order, Review, etc.).
- `routes/`: Express routers organized by feature (auth, payments, admin).
- `middleware/`: Custom logic for authentication (`requireAuth`) and error handling.
- `utils/`: Reusable helpers for JWT, OTP generation, and SMS/Telegram services.
- `config/`: Database connection and environment variable management.

### **2. Client Architecture**
- `pages/`: Full-page components (HomePage, AdminDashboard, etc.).
- `components/`: Pure UI components (Navbar, CartCard, ProductGrid).
- `auth/`: Logic for login, registration, and OTP verification.
- `admin/`: All components and pages restricted to the admin role.
- `lib/`: Shared utilities and the centralized `api` handler.

---

## 🔑 Key Engineering Flows

### **1. Secure Authentication Flow**
- **Process**: Registration → OTP Sent to Email → OTP Verification → User Created.
- **Security**: Passwords are never stored in plain text (Bcrypt). Authenticated state is managed via **HTTP-only JWT cookies**, preventing XSS token theft.
- **Trusted Devices**: The system can "remember" browsers to skip OTP for returning users.

### **2. Payment & Inventory Flow**
- **Library**: `razorpay` Node SDK.
- **Verification**: 
  1. Frontend initiates order.
  2. Backend creates a Razorpay Order ID.
  3. User pays via Razorpay popup.
  4. Backend verifies the **HMAC-SHA256 signature** sent by Razorpay to prevent fraud.
  5. On success: Order is saved, stock is decremented, and the cart is cleared.

### **3. Admin Intelligence**
- **Dashboard**: Uses `Recharts` to show top-selling products and stock value.
- **Alert System**: If an item's stock falls below 5, a **Telegram Bot** sends an instant alert to the owner.
- **Real-time**: Admin dashboard receives live "New Order" alerts via **Socket.io** without page refreshes.

---

## 💡 Learning Recommendations

1. **Start with the Models**: Look at `server/src/models/` to understand how data relates (e.g., how an `Order` references a `User`).
2. **Trace a Request**: Pick an API endpoint (like `POST /api/payments/razorpay/verify`) and follow it from `client/` to `server/routes/` and finally into the DB operations.
3. **Experiment with the Admin Panel**: Change your user role to `admin` in the DB and explore the analytics.
4. **Read the Middleware**: Understand how `requireAuth` protects routes in `server/src/middleware/auth.js`.

---

> [!TIP]
> Use `npm run dev` in the root folder to start both the server and client simultaneously. Happy coding!
