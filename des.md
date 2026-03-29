# 📊 Mermaid Diagram Descriptions for Herbify

This document provides detailed descriptions for each Mermaid diagram found in the `DOCUMENTATION.md` file, explaining the architecture, flows, and data structures of the Herbify platform.

---

### 1. Tech Stack (Mindmap)
A hierarchical breakdown of the technologies used in Herbify, categorized into:
- **Frontend:** React 18, React Router v6, Recharts, Vite.
- **Backend:** Node.js, Express.js, JWT, bcrypt.
- **Database:** MongoDB Atlas with Mongoose ODM.
- **Cloud Services:** Cloudinary (Images), Razorpay (Payments), Telegram Bot (Admin Alerts).
- **Deployment:** Vercel (Frontend) and Render (Backend).

### 2. High-Level Architecture (Graph)
Illustrates the interaction between four main layers:
- **Client (Vercel):** The React SPA and Tailwind CSS styling.
- **Server (Render):** The Express.js API with security middleware.
- **Storage & Services:** MongoDB for data, Cloudinary for images, and Razorpay for payments.
- **Users:** Browser-based interactions for both regular users and admins.

### 3. Folder Structure (Graph)
A visual map of the project's directory hierarchy:
- Shows the separation between the `client/` (Frontend) and `server/` (Backend) codebases.
- Highlights key directories like `pages/`, `components/`, `models/`, `routes/`, and `config/`.

### 4. Database Schema (Entity Relationship Diagram)
Defines the structure of the MongoDB database, including:
- **Entities:** User, Herb, Product, Category, Order, Review, OTP, and ContactMessage.
- **Relationships:** Users place orders, products belong to categories, and orders trigger reviews.

### 5. User Schema (Class Diagram)
Provides a detailed look at the User data model:
- Includes attributes like `name`, `email`, `role`, and `isVerified`.
- Shows nested structures for `CartItem` and `Address` management.

### 6. Order Schema (Class Diagram)
Details the Order data model:
- Covers payment information (Razorpay IDs), amounts (subtotal, shipping), and status tracking.
- Shows the relationship with `OrderItem` and the enumerations for payment/order statuses.

### 7. API Routes Map (Graph)
A comprehensive tree diagram of the backend API endpoints:
- Maps routes for Authentication, Users, Herbs, Products, Cart, Orders, Payments, and Admin operations.
- Specific examples include `POST /register`, `GET /herbs/:slug`, and `POST /payments/verify`.

### 8. Frontend Route Tree (Graph)
Outlines the React application's routing structure:
- Shows the hierarchy from the App Root down to Site and Admin layouts.
- Lists public routes (Home, Herbs, Products) and protected routes (Profile, Admin Dashboard).

### 9. Registration & Login Flow (Sequence Diagram)
A step-by-step sequence of the authentication process:
- Covers OTP-based registration: requesting OTP -> receiving email -> submitting form -> creating user.
- Covers the login flow: credential verification -> JWT cookie set.

### 10. Shopping Flow (Flowchart)
Traces the user journey through the e-commerce experience:
- From browsing the catalog to searching for items.
- Adding to cart (with authentication checks) and navigating through checkout.
- Integration with the Razorpay payment widget and final order confirmation.

### 11. Order Lifecycle (State Diagram)
Represents the state machine for order processing:
- Transitions from `placed` to `processing`, `shipped`, and `delivered`.
- Includes branching logic for `cancelled` states at various stages.

### 12. Payment Flow (Razorpay) (Sequence Diagram)
Describes the secure payment verification pipeline:
- Backend order creation via Razorpay API.
- Frontend payment widget interaction.
- Backend HMAC-SHA256 signature verification before finalizing the transaction.

### 13. Admin Management Flow (Flowchart)
Visualizes the admin user experience:
- Role-based redirection to the Admin Dashboard.
- Access to CRUD operations for Herbs, Products, and Categories.
- Real-time KPI analytics and stock value tracking.

### 14. Authentication & Security Flow (Flowchart)
Details the internal logic of the Backend security middleware:
- Logic for distinguishing between public and private routes.
- JWT extraction and validation.
- Role-based access control (RBAC) and rate-limiting for sensitive routes (Auth/Contact).

### 15. Image Upload Pipeline (Cloudinary) (Sequence Diagram)
Explains the optimized image upload process:
- Admin requests a signed upload URL from the backend.
- Image is uploaded directly to Cloudinary from the browser (bypassing backend processing).
- URL is saved back to the database.

### 16. Admin Dashboard Components (Graph)
Breaks down the UI elements of the admin interface:
- KPI cards for various metrics.
- Interactive bestseller charts using Recharts.
- Quick navigation links for efficient management.

### 17. Component Hierarchy (Graph)
A high-level view of the React component tree:
- Shows how layouts (Site/Admin) wrap different page types.
- Highlights global components like the Navbar, Sidebar, and Toast notifications.

### 18. State & Data Flow (Flowchart)
Illustrates the end-to-end data lifecycle:
- From local React state through API wrappers (Axios) to Express routes.
- Processing via Mongoose models and MongoDB collections before returning a JSON response.

### 19. Deployment Architecture (Graph)
A technical overview of the production environment:
- Vercel hosting the static React build with global CDN.
- Render hosting the Node.js API with auto-scaling.
- Connection to external services like MongoDB Atlas, Cloudinary, and Razorpay.

### 20. Order Status Flow (Quick Reference) (Graph)
A color-coded visual guide to the linear progression of order statuses from `placed` to `delivered` or `cancelled`.

### 21. Payment Status Flow (Quick Reference) (Graph)
A concise diagram showing transitions between payment states: `created`, `paid`, `failed`, and `refunded`.
