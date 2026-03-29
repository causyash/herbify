# Herbify Viva Preparation Guide (2-Day Sprint)

This guide is designed to help you master the **Herbify** project for your viva within 48 hours. It breaks down the technical stack, core logic, and key features.

---

## 📄 Key Resources to Read First
If you get stuck, refer to these local files:
- [README.md](file:///Users/yash/Desktop/Home/herbify/README.md) - Quick start and overview.
- [DOCUMENTATION.md](file:///Users/yash/Desktop/Home/herbify/DOCUMENTATION.md) - **CRITICAL.** Contains detailed flowcharts and schema diagrams (The "Brain" of your project).
- [DEPLOYMENT_GUIDE.md](file:///Users/yash/Desktop/Home/herbify/DEPLOYMENT_GUIDE.md) - Details on how the site is hosted on Netlify and Render.
- [SETUP.md](file:///Users/yash/Desktop/Home/herbify/SETUP.md) - Environment variables and local setup steps.

---

## 🛠 Project Tech Stack
*   **Frontend:** React (Vite), Tailwind CSS, Framer Motion (animations), Recharts (analytics).
*   **Backend:** Node.js, Express.js.
*   **Database:** MongoDB (Mongoose ODM).
*   **Authentication:** JWT (JSON Web Tokens) with Cookie-based storage.
*   **Payment Gateway:** Razorpay.
*   **Storage:** Cloudinary (for product/herb images).
*   **Communications:** Nodemailer (emails), Telegram Bot (admin notifications).

---

## 📅 Day 1: Architecture, Database & Backend Logic

### Step 1: High-Level Architecture (Morning)
*   **Structure:** This is a **MERN Stack** monorepo using **npm workspaces**.
*   **Flow:** The client (React) sends requests via **Axios** to the backend (Express). The backend talks to **MongoDB** and returns JSON.
*   **Deployment:** Frontend on **Netlify**, Backend on **Render**.

### Step 2: Database Models (Midday)
*   Review `server/src/models/`:
    *   **User.js:** Roles (User/Admin), bcrypt hashing for passwords.
    *   **Product.js:** Prices, stock, categories, and Cloudinary image URLs.
    *   **Herb.js:** Scientific names, medicinal uses, and descriptions.
    *   **Order.js:** Tracking transactions and payment status.
*   *Viva Tip:* Be ready to explain "Why MongoDB?" (Schema flexibility, fast iteration).

### Step 3: API & Auth (Evening)
*   **Auth Flow:** Register -> Hash password -> Store. Login -> Compare hash -> Generate JWT -> Set as HttpOnly Cookie.
*   **Middleware:** Check `server/src/middleware/auth.js`. Understand how `requireAdmin` works to protect routes.
*   **CRUD:** Review `server/src/routes/products.js`. How are products added, updated, and deleted?

---

## 📅 Day 2: Frontend, Integration & Polish

### Step 1: Frontend Routing & Layout (Morning)
*   **App.jsx:** Study the `react-router-dom` setup. Understand **Nested Routes** (`SiteLayout` vs `AdminLayout`).
*   **Protected Routes:** How does `<RequireAdmin>` prevent unauthorized access to the dashboard?

### Step 2: Core Features & Logic (Midday)
*   **Cart System:** How is the cart state managed (usually Context API or LocalStorage)?
*   **E-commerce Flow:** Product -> Cart -> Checkout -> Razorpay Payment -> Order Creation.
*   **Admin Dashboard:** Study `AdminInventoryPage.jsx`. How does it fetch and display analytics using **Recharts**?

### Step 3: Integrations & Specialized Features (Evening)
*   **Razorpay:** How the backend creates an "Order ID" and the frontend opens the checkout modal.
*   **Telegram Bot:** How the admin gets notified when a new order or contact message arrives (`server/src/utils/telegram.js`).
*   **Cloudinary:** Image upload logic (Base64 vs Form-data).

---

## 💡 Top 10 Viva Questions & Answers

1.  **Q: What is the purpose of `HttpOnly` cookies?**
    *   *A:* They prevent Cross-Site Scripting (XSS) by making the JWT inaccessible to client-side JavaScript.
2.  **Q: How do you handle file uploads?**
    *   *A:* Use `multer` to handle files in the backend and then upload them to **Cloudinary** for cloud storage.
3.  **Q: What is Middleware in Express?**
    *   *A:* Functions that have access to `req`, `res`, and `next`. Used for logging, authentication, and error handling.
4.  **Q: How do you ensure the admin routes are secure?**
    *   *A:* A custom middleware checks the `role` field in the JWT payload. If it's not 'admin', it returns a 403 Forbidden.
5.  **Q: Why use Vite instead of Create React App (CRA)?**
    *   *A:* Vite is significantly faster as it uses ES Modules during development and Rollup for production builds.
6.  **Q: How is the state managed across components?**
    *   *A:* (Check your code) Likely using **React Hooks (useState/useEffect)** and potentially **Context API** for global state like Auth and Cart.
7.  **Q: What is the benefit of using Zod for validation?**
    *   *A:* It provides TypeScript-first schema declaration and validation, ensuring data integrity before it hits the DB.
8.  **Q: How does the search functionality work?**
    *   *A:* It usually queries the MongoDB using Regex (e.g., `$regex: query, $options: 'i'`) or a dedicated Search Index.
9.  **Q: What happens if the database connection fails?**
    *   *A:* The `createApp` function in `app.js` handles connection states, and the health check endpoint `/api/health` indicates failure.
10. **Q: How are animations implemented?**
    *   *A:* Using **Framer Motion** for smooth transitions and **Tailwind CSS** for responsive styling.

---

## ✅ Final Learning Checklist
- [ ] **Day 1 Check:** Can I explain how a user logs in and where the token is stored?
- [ ] **Day 1 Check:** Can I list 5 main fields in the Product schema?
- [ ] **Day 2 Check:** Can I show where the Razorpay API key is stored (but hidden)?
- [ ] **Day 2 Check:** Can I explain what happens when an admin updates stock?
- [ ] **Confidence Check:** Can I walk through the code from `client/src/App.jsx` to a specific `server/src/routes` file?

Good luck with your viva! You built a solid, professional-grade project.
