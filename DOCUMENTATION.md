# 🌿 Herbify — Visual Project Documentation

> A comprehensive, graphically-rich documentation of the **Herbify** platform — a full-stack MERN e-commerce application for herbal products and medicinal herbs.

---

## 📑 Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [High-Level Architecture](#3-high-level-architecture)
4. [Folder Structure](#4-folder-structure)
5. [Database Schema (Entity Relationship)](#5-database-schema-entity-relationship)
6. [Data Models Detail](#6-data-models-detail)
7. [API Routes Map](#7-api-routes-map)
8. [Frontend Route Tree](#8-frontend-route-tree)
9. [User Flows](#9-user-flows)
   - [9.1 Registration & Login Flow](#91-registration--login-flow)
   - [9.2 Shopping Flow (Browse → Cart → Checkout)](#92-shopping-flow-browse--cart--checkout)
   - [9.3 Order Lifecycle](#93-order-lifecycle)
   - [9.4 Payment Flow (Razorpay)](#94-payment-flow-razorpay)
   - [9.5 Admin Management Flow](#95-admin-management-flow)
10. [Authentication & Security Flow](#10-authentication--security-flow)
11. [Image Upload Pipeline (Cloudinary)](#11-image-upload-pipeline-cloudinary)
12. [Admin Dashboard Components](#12-admin-dashboard-components)
13. [Component Hierarchy](#13-component-hierarchy)
14. [State & Data Flow](#14-state--data-flow)
15. [Deployment Architecture](#15-deployment-architecture)
16. [Feature Matrix](#16-feature-matrix)

---

## 1. Project Overview

Herbify is a full-stack **MERN** (MongoDB, Express, React, Node.js) e-commerce platform specializing in herbal products and medicinal herbs. It features a dual-catalog system (Herbs + Products), a Razorpay payment gateway, Cloudinary image management, OTP-based email verification, and a rich admin dashboard with real-time analytics.

```
┌─────────────────────────────────────────────────────────────────┐
│                         HERBIFY PLATFORM                        │
│                                                                 │
│  🌿 Herbs Catalog    🛍️ Products Store    👤 User Accounts       │
│  📦 Order Tracking   💳 Razorpay Payments  🖼️ Admin Dashboard    │
│  ⭐ Review System    🔍 Search Engine      📧 OTP Verification   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Tech Stack

```mermaid
mindmap
  root((Herbify))
    Frontend
      React 18
      React Router v6
      Recharts
      React Hot Toast
      Vite
    Backend
      Node.js
      Express.js
      JWT Auth
      bcrypt
      Rate Limiting
      Helmet & Compression
    Database
      MongoDB Atlas
      Mongoose ODM
    Cloud Services
      Cloudinary (Images)
      Razorpay (Payments)
      Telegram Bot (Admin Alerts)
    Deployment
      Netlify (Frontend)
      Render (Backend)
```

---

## 3. High-Level Architecture

```mermaid
graph TB
    subgraph Client["🖥️ Client (Netlify)"]
        React["React SPA<br/>Vite + React Router"]
        CSS["Tailwind CSS<br/>Dark Mode / Glassmorphism"]
    end

    subgraph Server["⚙️ Server (Render)"]
        Express["Express.js API<br/>Rate Limited + Helmet"]
        Auth["JWT Auth<br/>Cookie-based"]
        Middleware["Middleware<br/>Error Handling / CORS"]
    end

    subgraph Storage["🗄️ Storage & Services"]
        MongoDB["MongoDB Atlas<br/>Document DB"]
        Cloudinary["☁️ Cloudinary<br/>Image CDN"]
        Razorpay["💳 Razorpay<br/>Payment Gateway"]
        Telegram["📨 Telegram Bot<br/>Admin Alerts"]
    end

    subgraph User["👤 Users"]
        Browser["Browser"]
        Admin["Admin Panel"]
    end

    Browser -->|HTTPS| React
    Admin -->|HTTPS| React
    React -->|REST API /api/*| Express
    Express -->|Mongoose| MongoDB
    Express -->|Signed Upload URL| Cloudinary
    React -->|Direct Upload| Cloudinary
    Express -->|Orders API| Razorpay
    React -->|Payment SDK| Razorpay
    Express -->|Notifications| Telegram

    style Client fill:#d1fae5,stroke:#059669
    style Server fill:#dbeafe,stroke:#2563eb
    style Storage fill:#fef3c7,stroke:#d97706
    style User fill:#f3e8ff,stroke:#7c3aed
```

---

## 4. Folder Structure

```mermaid
graph LR
    Root["📁 herbify/"]

    Root --> Client["📁 client/"]
    Root --> Server["📁 server/"]
    Root --> Docs["📄 Docs (.md files)"]

    Client --> ClientSrc["📁 src/"]
    ClientSrc --> Pages["📁 pages/"]
    ClientSrc --> Components["📁 components/"]
    ClientSrc --> Admin["📁 admin/"]
    ClientSrc --> Lib["📁 lib/"]
    ClientSrc --> Auth["📁 auth/"]
    ClientSrc --> Cart["📁 cart/"]

    Pages --> PublicPages["HomePage, HerbsListPage<br/>ProductsListPage, SearchPage<br/>CartPage, CheckoutPage<br/>OrdersPage, ProfilePage<br/>AboutPage, ContactPage"]
    Pages --> AdminPages["📁 admin/<br/>AdminHomePage<br/>AdminHerbsPage<br/>AdminProductsPage<br/>AdminOrdersPage<br/>AdminInventoryPage<br/>AdminUsersPage<br/>AdminCategoriesPage"]

    Server --> ServerSrc["📁 src/"]
    ServerSrc --> Models["📁 models/<br/>User, Herb, Product<br/>Order, Review, Category<br/>OTP, ContactMessage"]
    ServerSrc --> Routes["📁 routes/<br/>auth, herbs, products<br/>cart, orders, payments<br/>admin, reviews, users<br/>uploads, contact, categories"]
    ServerSrc --> Utils["📁 utils/<br/>jwt, cookies, slug<br/>otpService, smsService"]
    ServerSrc --> Config["📁 config/<br/>env, db, cloudinary"]
    ServerSrc --> Mw["📁 middleware/<br/>auth, error"]

    style Root fill:#1e293b,color:#f8fafc
    style Client fill:#dbeafe,stroke:#3b82f6
    style Server fill:#d1fae5,stroke:#059669
```

---

## 5. Database Schema (Entity Relationship)

```mermaid
erDiagram
    USER {
        ObjectId _id PK
        string name
        string email
        string passwordHash
        string role
        boolean isVerified
        CartItem[] cartItems
        Address[] addresses
        date createdAt
        date updatedAt
    }

    HERB {
        ObjectId _id PK
        string name
        string slug
        string shortDescription
        string description
        string[] uses
        string[] benefits
        number price
        number stock
        string[] images
        date createdAt
        date updatedAt
    }

    PRODUCT {
        ObjectId _id PK
        string name
        string slug
        string description
        string[] ingredients
        number price
        number stock
        string[] images
        ObjectId categoryId FK
        string[] tags
        date createdAt
        date updatedAt
    }

    CATEGORY {
        ObjectId _id PK
        string name
        string slug
        date createdAt
        date updatedAt
    }

    ORDER {
        ObjectId _id PK
        ObjectId userId FK
        OrderItem[] items
        Address shippingAddress
        number subtotal
        number shippingFee
        number total
        string paymentProvider
        string paymentStatus
        string orderStatus
        string razorpayOrderId
        string razorpayPaymentId
        string razorpaySignature
        date createdAt
        date updatedAt
    }

    REVIEW {
        ObjectId _id PK
        ObjectId userId FK
        string itemType
        ObjectId itemId FK
        number rating
        string comment
        date createdAt
        date updatedAt
    }

    OTP {
        ObjectId _id PK
        string email
        string otp
        date expiresAt
        date createdAt
    }

    CONTACTMESSAGE {
        ObjectId _id PK
        string name
        string email
        string message
        boolean read
        date createdAt
    }

    USER ||--o{ ORDER : "places"
    USER ||--o{ REVIEW : "writes"
    PRODUCT }o--|| CATEGORY : "belongs to"
    ORDER ||--|{ REVIEW : "can trigger"
```

---

## 6. Data Models Detail

### User Schema

```mermaid
classDiagram
    class User {
        +String name
        +String email [unique]
        +String passwordHash
        +String role [user|admin]
        +Boolean isVerified
        +CartItem[] cartItems
        +Address[] addresses
        +Date createdAt
        +Date updatedAt
    }

    class CartItem {
        +String itemType [herb|product]
        +ObjectId itemId
        +String slug
        +String name
        +Number price
        +String image
        +Number qty [1-99]
    }

    class Address {
        +String label [Home|Work]
        +String fullName
        +String phone
        +String addressLine1
        +String addressLine2
        +String city
        +String state
        +String pincode
    }

    User "1" --> "*" CartItem : has
    User "1" --> "*" Address : saved
```

### Order Schema

```mermaid
classDiagram
    class Order {
        +ObjectId userId
        +OrderItem[] items
        +Address shippingAddress
        +Number subtotal
        +Number shippingFee
        +Number total
        +String paymentProvider
        +String paymentStatus
        +String orderStatus
        +String razorpayOrderId
        +String razorpayPaymentId
    }

    class OrderItem {
        +String itemType [herb|product]
        +ObjectId itemId
        +String slug
        +String name
        +Number price
        +String image
        +Number qty
    }

    class PaymentStatus {
        <<enumeration>>
        created
        paid
        failed
        refunded
    }

    class OrderStatus {
        <<enumeration>>
        placed
        processing
        shipped
        delivered
        cancelled
    }

    Order "1" --> "*" OrderItem : contains
    Order --> PaymentStatus : has
    Order --> OrderStatus : has
```

---

## 7. API Routes Map

```mermaid
graph TD
    API["/api/*"]

    API --> Health["/api/health — GET<br/>✅ Health check"]
    API --> AuthRoute["/api/auth"]
    API --> UsersRoute["/api/users"]
    API --> HerbsRoute["/api/herbs"]
    API --> ProductsRoute["/api/products"]
    API --> CategoriesRoute["/api/categories"]
    API --> CartRoute["/api/cart"]
    API --> OrdersRoute["/api/orders"]
    API --> PaymentsRoute["/api/payments"]
    API --> ReviewsRoute["/api/reviews"]
    API --> AdminRoute["/api/admin"]
    API --> UploadsRoute["/api/uploads"]
    API --> ContactRoute["/api/contact"]

    AuthRoute --> A1["POST /register"]
    AuthRoute --> A2["POST /login"]
    AuthRoute --> A3["POST /logout"]
    AuthRoute --> A4["GET /me"]
    AuthRoute --> A5["POST /send-otp"]
    AuthRoute --> A6["POST /verify-otp"]

    HerbsRoute --> H1["GET / — List all herbs"]
    HerbsRoute --> H2["GET /:slug — Herb details"]

    ProductsRoute --> P1["GET / — List products"]
    ProductsRoute --> P2["GET /:slug — Product details"]

    CartRoute --> C1["GET / — Fetch cart"]
    CartRoute --> C2["POST /add — Add item"]
    CartRoute --> C3["POST /remove — Remove item"]
    CartRoute --> C4["DELETE /clear — Clear cart"]

    OrdersRoute --> O1["GET / — User orders"]
    OrdersRoute --> O2["GET /:id — Order detail"]
    OrdersRoute --> O3["POST / — Place order"]

    PaymentsRoute --> Pay1["POST /create-order — Initiate"]
    PaymentsRoute --> Pay2["POST /verify — Verify signature"]

    ReviewsRoute --> R1["GET /:itemType/:itemId"]
    ReviewsRoute --> R2["POST / — Create review"]

    AdminRoute --> Adm1["GET /products, herbs, categories, users, orders"]
    AdminRoute --> Adm2["POST/PUT/DELETE — CRUD operations"]
    AdminRoute --> Adm3["GET /bestsellers — Analytics"]
    AdminRoute --> Adm4["GET /inventory — Stock management"]

    UploadsRoute --> U1["GET /sign — Cloudinary signature"]

    style API fill:#1e293b,color:#f8fafc
    style AdminRoute fill:#7c3aed,color:#fff
    style PaymentsRoute fill:#dc2626,color:#fff
    style AuthRoute fill:#2563eb,color:#fff
```

---

## 8. Frontend Route Tree

```mermaid
graph TD
    Root["/ — App Root"]

    Root --> SiteLayout["SiteLayout (Navbar + Footer)"]

    SiteLayout --> Home["/ — HomePage"]
    SiteLayout --> About["/about — AboutPage"]
    SiteLayout --> Contact["/contact — ContactPage"]
    SiteLayout --> Search["/search — SearchPage"]

    SiteLayout --> Herbs["/herbs — HerbsListPage"]
    Herbs --> HerbDetail["/herbs/:slug — HerbDetailsPage"]

    SiteLayout --> Products["/products — ProductsListPage"]
    Products --> ProductDetail["/products/:slug — ProductDetailsPage"]

    SiteLayout --> Cart["/cart — CartPage"]
    SiteLayout --> Checkout["/checkout — CheckoutPage"]

    SiteLayout --> Login["/login — LoginPage"]
    SiteLayout --> Register["/register — RegisterPage"]

    SiteLayout --> Account["Account (Protected)"]
    Account --> Profile["/account/profile — ProfilePage"]
    Account --> Orders["/account/orders — OrdersPage"]
    Orders --> OrderDetail["/account/orders/:id — OrderDetailsPage"]

    SiteLayout --> AdminGuard["RequireAdmin (role=admin)"]
    AdminGuard --> AdminLayout["AdminLayout"]
    AdminLayout --> AdminHome["/admin — AdminHomePage (Analytics)"]
    AdminLayout --> AdminInventory["/admin/inventory — AdminInventoryPage"]
    AdminLayout --> AdminHerbs["/admin/herbs — AdminHerbsPage"]
    AdminLayout --> AdminProducts["/admin/products — AdminProductsPage"]
    AdminLayout --> AdminCategories["/admin/categories — AdminCategoriesPage"]
    AdminLayout --> AdminOrders["/admin/orders — AdminOrdersPage"]
    AdminLayout --> AdminUsers["/admin/users — AdminUsersPage"]
    AdminLayout --> AdminContacts["/admin/contacts — AdminContactsPage"]

    style AdminGuard fill:#7c3aed,color:#fff
    style AdminLayout fill:#6d28d9,color:#fff
    style Home fill:#059669,color:#fff
```

---

## 9. User Flows

### 9.1 Registration & Login Flow

```mermaid
sequenceDiagram
    actor U as User
    participant FE as React Frontend
    participant BE as Express Backend
    participant DB as MongoDB
    participant Mail as OTP Service

    U->>FE: Click Register
    FE->>BE: POST /api/auth/send-otp { email }
    BE->>DB: Check if email already exists
    BE->>Mail: Generate & send OTP email
    Mail-->>U: OTP code in email
    U->>FE: Enter OTP + fill form
    FE->>BE: POST /api/auth/register { name, email, password, otp }
    BE->>DB: Verify OTP, hash password, create User
    DB-->>BE: User created
    BE-->>FE: Set JWT cookie + return user object
    FE-->>U: Redirect to home (logged in ✅)

    Note over U,Mail: Login Flow
    U->>FE: Click Login
    FE->>BE: POST /api/auth/login { email, password }
    BE->>DB: Find user, verify bcrypt hash
    BE-->>FE: Set JWT cookie (httpOnly)
    FE-->>U: Redirect to intended page ✅
```

### 9.2 Shopping Flow (Browse → Cart → Checkout)

```mermaid
flowchart TD
    Start([🏠 Homepage]) --> Browse{Browse}
    Browse -->|Herbs| HerbsList[Herbs List Page]
    Browse -->|Products| ProductsList[Products List Page]
    Browse -->|Search| SearchPage[Search Page]

    HerbsList --> HerbDetail[Herb Detail Page]
    ProductsList --> ProductDetail[Product Detail Page]

    HerbDetail -->|Add to Cart| CartCheck{Logged In?}
    ProductDetail -->|Add to Cart| CartCheck

    CartCheck -->|No| Login[Login Page]
    Login --> CartCheck
    CartCheck -->|Yes| CartUpdate[Update Cart via API]
    CartUpdate --> CartPage[🛒 Cart Page]

    CartPage -->|Review items| Checkout[Checkout Page]
    Checkout --> AddressForm[Select/Add Address]
    AddressForm --> PaymentInit[Initiate Razorpay Order]
    PaymentInit --> RazorpaySDK[💳 Razorpay Payment Widget]
    RazorpaySDK -->|Success| Verify[Verify Signature on Backend]
    RazorpaySDK -->|Failure| CartPage
    Verify -->|Valid| CreateOrder[Create Order in DB]
    CreateOrder --> ClearCart[Clear Cart]
    ClearCart --> OrderConfirm[✅ Order Confirmation Page]
    OrderConfirm --> MyOrders[My Orders Page]

    style Start fill:#059669,color:#fff
    style OrderConfirm fill:#059669,color:#fff
    style Login fill:#f59e0b,color:#fff
    style RazorpaySDK fill:#3b82f6,color:#fff
```

### 9.3 Order Lifecycle

```mermaid
stateDiagram-v2
    [*] --> placed : Payment Verified

    placed --> processing : Admin confirms
    placed --> cancelled : Admin/User cancels

    processing --> shipped : Dispatched
    processing --> cancelled : Out-of-stock / issue

    shipped --> delivered : Delivery confirmed

    delivered --> [*]
    cancelled --> [*]

    note right of placed : 💳 Payment: paid\nAdmin notified via Telegram
    note right of shipped : 📦 Tracking available
    note right of delivered : ⭐ Review can be posted
```

### 9.4 Payment Flow (Razorpay)

```mermaid
sequenceDiagram
    actor U as User
    participant FE as React Frontend
    participant BE as Express Backend
    participant RP as Razorpay API
    participant DB as MongoDB

    U->>FE: Click "Place Order"
    FE->>BE: POST /api/payments/create-order { amount, currency }
    BE->>RP: Create Razorpay Order (server-side)
    RP-->>BE: { orderId, amount, currency }
    BE-->>FE: Razorpay Order details
    FE->>RP: Open Razorpay Checkout Widget
    Note over FE,RP: User completes payment in widget
    RP-->>FE: { razorpayPaymentId, razorpayOrderId, razorpaySignature }
    FE->>BE: POST /api/payments/verify { paymentId, orderId, signature, cartItems, address }
    BE->>BE: HMAC-SHA256 signature verification
    alt Signature Valid
        BE->>DB: Create Order record (paymentStatus: paid)
        BE->>DB: Clear user cart
        BE-->>FE: { success: true, orderId }
        FE-->>U: ✅ Order confirmed!
    else Invalid Signature
        BE-->>FE: 400 Payment verification failed
        FE-->>U: ❌ Payment failed
    end
```

### 9.5 Admin Management Flow

```mermaid
flowchart LR
    AdminLogin([Admin Login]) --> RequireAdmin{role === admin?}
    RequireAdmin -->|No| Redirect[Redirect to /]
    RequireAdmin -->|Yes| Dashboard[Admin Dashboard]

    Dashboard --> Analytics[📊 Analytics & KPIs]
    Dashboard --> ManageHerbs[🌿 Manage Herbs]
    Dashboard --> ManageProducts[🛍️ Manage Products]
    Dashboard --> ManageCategories[🗂️ Manage Categories]
    Dashboard --> ManageOrders[📦 Manage Orders]
    Dashboard --> ManageUsers[👤 Manage Users]
    Dashboard --> ManageInventory[📋 Inventory]
    Dashboard --> ManageContacts[📧 Contact Msgs]

    ManageHerbs --> HerbCRUD[Create / Edit / Delete Herbs\nUpload Images via Cloudinary]
    ManageProducts --> ProductCRUD[Create / Edit / Delete Products\nAssign Categories + Tags]
    ManageOrders --> OrderStatus[Update Order Status\nView Payment Details]
    ManageInventory --> StockAlert[Low Stock Alerts]

    Analytics --> KPIs[Total Products, Herbs\nUsers, Stock Value]
    Analytics --> BestsellerChart[📈 Bar Chart — Top Sellers]

    style Dashboard fill:#6d28d9,color:#fff
    style Analytics fill:#2563eb,color:#fff
    style RequireAdmin fill:#dc2626,color:#fff
```

---

## 10. Authentication & Security Flow

```mermaid
flowchart TD
    Request[Incoming API Request] --> Public{Public Route?}
    Public -->|Yes - GET herbs/products| Handler[Route Handler]
    Public -->|No| AuthMW[🔐 Auth Middleware]

    AuthMW --> ExtractJWT[Extract JWT from Cookie]
    ExtractJWT --> Valid{Valid & Not Expired?}

    Valid -->|No| Reject[401 Unauthorized]
    Valid -->|Yes| UserCheck[Attach req.user]

    UserCheck --> AdminRoute{Admin Route?}
    AdminRoute -->|Yes| RoleCheck{role === admin?}
    RoleCheck -->|No| Forbidden[403 Forbidden]
    RoleCheck -->|Yes| Handler
    AdminRoute -->|No| Handler

    Handler --> RateLimit{Rate Limited Route?}
    RateLimit -->|/api/auth OR /api/contact| Limiter[50 req / 15 min window]
    RateLimit -->|Other| Process[Process Request]
    Limiter --> TooMany{Limit exceeded?}
    TooMany -->|Yes| Error429[429 Too Many Requests]
    TooMany -->|No| Process

    Process --> Response[✅ JSON Response]

    style AuthMW fill:#1e293b,color:#f8fafc
    style Reject fill:#dc2626,color:#fff
    style Forbidden fill:#dc2626,color:#fff
    style Response fill:#059669,color:#fff
```

---

## 11. Image Upload Pipeline (Cloudinary)

```mermaid
sequenceDiagram
    participant Admin as Admin Panel
    participant BE as Express Backend
    participant Cloud as Cloudinary Config
    participant CDN as Cloudinary CDN

    Admin->>BE: GET /api/uploads/sign (with auth cookie)
    BE->>BE: Verify admin role
    BE->>Cloud: Generate signed upload params<br/>(timestamp, signature, folder)
    Cloud-->>BE: { signature, timestamp, cloudName, apiKey }
    BE-->>Admin: Signed upload credentials

    Admin->>CDN: POST directly to Cloudinary<br/>with signed credentials + image file
    CDN-->>Admin: { secure_url, public_id }

    Admin->>BE: Save secure_url to Herb/Product images[]
    BE->>BE: Update DB record with new image URL

    Note over Admin,CDN: Direct upload to Cloudinary<br/>bypasses backend — faster & cheaper
```

---

## 12. Admin Dashboard Components

```mermaid
graph TD
    AdminDashboard["🖥️ Admin Dashboard"]

    AdminDashboard --> KPICards["📊 KPI Cards"]
    AdminDashboard --> BestsellerSection["🏆 Bestsellers Section"]
    AdminDashboard --> QuickLinks["🔗 Quick Navigation Links"]

    KPICards --> C1["📦 Total Products\n(count)"]
    KPICards --> C2["🌿 Live Herbs\n(count, emerald)"]
    KPICards --> C3["👤 Platform Users\n(count, blue)"]
    KPICards --> C4["💰 Stock Value\n(₹ amount, dark green)"]

    BestsellerSection --> Filter["🔽 Category Filter Dropdown"]
    BestsellerSection --> RankedList["🏅 Ranked Item List\n(rank badge, image, name, sold, stock)"]
    BestsellerSection --> BarChart["📈 Recharts BarChart\n(name vs. totalSold)"]

    BarChart --> ChartDetails["CartesianGrid + XAxis + YAxis\n+ Tooltip + Legend + Cells\n(Emerald #059669 bars)"]
```

---

## 13. Component Hierarchy

```mermaid
graph TD
    AppRoot["App.jsx (Root)"]
    AppRoot --> TitleUpdater["TitleUpdater"]
    AppRoot --> Toaster["react-hot-toast Toaster"]
    AppRoot --> Routes["React Router Routes"]

    Routes --> SiteLayout["SiteLayout\n(Navbar + Outlet + Footer)"]
    Routes --> AdminLayout["AdminLayout\n(Sidebar + Outlet)"]

    SiteLayout --> PublicPages["Public Pages\n(Home, About, Contact,\nHerbs, Products, Search)"]
    SiteLayout --> AuthPages["Auth Pages\n(Login, Register)"]
    SiteLayout --> AccountPages["Account Pages\n(Profile, Orders, Order Detail)"]
    SiteLayout --> CartCheckout["Cart + Checkout Pages"]

    AdminLayout --> RequireAdmin["RequireAdmin HOC"]
    RequireAdmin --> AdminPages["Admin Pages\n(Dashboard, CRUD pages)"]

    SiteLayout --> Navbar["Navbar Component"]
    AdminLayout --> AdminSidebar["Admin Sidebar\n(Nav links to all admin pages)"]
```

---

## 14. State & Data Flow

```mermaid
flowchart LR
    subgraph FE ["React Frontend"]
        direction TB
        LocalState["Component local useState/useEffect"]
        LibAPI["lib/api.js\n(Axios-like fetch wrapper)"]
        HotToast["Toast Notifications\n(react-hot-toast)"]
    end

    subgraph BE ["Express Backend"]
        direction TB
        Router["Route Handlers"]
        AuthMw["Auth Middleware"]
        Models["Mongoose Models"]
    end

    subgraph DB ["MongoDB Atlas"]
        Collections["Collections:\nusers, herbs, products\norders, reviews, categories\notps, contactmessages"]
    end

    LocalState -->|API calls with credentials| LibAPI
    LibAPI -->|HTTP + JWT cookie| Router
    Router --> AuthMw
    AuthMw --> Models
    Models -->|Mongoose queries| Collections
    Collections -->|Documents| Models
    Models -->|JSON response| Router
    Router -->|JSON| LibAPI
    LibAPI -->|setState| LocalState
    LocalState -->|Error toasts| HotToast

    style FE fill:#dbeafe,stroke:#3b82f6
    style BE fill:#d1fae5,stroke:#059669
    style DB fill:#fef3c7,stroke:#d97706
```

---

## 15. Deployment Architecture

```mermaid
graph TB
    subgraph Internet["🌐 Internet"]
        User["👤 User Browser"]
    end

    subgraph Netlify["▲ Netlify (Frontend)"]
        CDNFront["Global CDN\ncausyash.netlify.app"]
        Static["Static Files\n(React SPA build)"]
        NetlifyToml["netlify.toml\n(SPA redirect rules)"]
    end

    subgraph Render["🎯 Render (Backend)"]
        APIServer["Node.js / Express\nherbify-api.onrender.com"]
        AutoScale["Auto-scale & Health checks"]
    end

    subgraph External["☁️ External Services"]
        MongoAtlas["🍃 MongoDB Atlas\n(Shared Cluster)"]
        CloudinaryCDN["🖼️ Cloudinary CDN\n(Image delivery)"]
        RazorpayGW["💳 Razorpay Gateway"]
        TelegramBot["📨 Telegram Bot\n(Admin alerts)"]
    end

    User -->|HTTPS| CDNFront
    CDNFront --> Static
    Static -->|/api/* requests| APIServer
    APIServer --> MongoAtlas
    APIServer --> CloudinaryCDN
    APIServer --> RazorpayGW
    APIServer --> TelegramBot
    User -->|Direct Cloudinary uploads| CloudinaryCDN

    style Netlify fill:#0e1e36,color:#a7f3d0
    style Render fill:#46e3b7,color:#0e1e36
    style External fill:#fef3c7,stroke:#d97706
```

---

## 16. Feature Matrix

| Feature | User | Admin | Notes |
|---|---|---|---|
| 🌿 Browse Herbs | ✅ | ✅ | Filterable, searchable |
| 🛍️ Browse Products | ✅ | ✅ | Category-based |
| 🔍 Search | ✅ | ✅ | Cross-catalog |
| 🛒 Cart Management | ✅ | — | Persisted in MongoDB |
| 💳 Razorpay Checkout | ✅ | — | HMAC signature verified |
| 📦 Order Tracking | ✅ | ✅ | Status pipeline |
| ⭐ Reviews | ✅ | — | Per herb/product |
| 👤 Profile & Addresses | ✅ | — | Multiple saved addresses |
| 📧 OTP Email Verification | ✅ | — | On registration |
| 📊 Analytics Dashboard | — | ✅ | KPIs + Recharts |
| 🏆 Bestsellers Report | — | ✅ | Category-filtered bar chart |
| 📋 Inventory Management | — | ✅ | Stock value, low-stock alerts |
| 🌿 Herb CRUD | — | ✅ | With Cloudinary image upload |
| 🛍️ Product CRUD | — | ✅ | Category + tag assignment |
| 🗂️ Category Management | — | ✅ | Slug-based |
| 👤 User Management | — | ✅ | Role assignment |
| 📦 Order Status Updates | — | ✅ | Full lifecycle control |
| 📧 Contact Inbox | — | ✅ | Read/unread messages |
| 📨 Telegram Notifications | — | ✅ | New order alerts |
| 🖼️ Cloudinary Image CDN | ✅ | ✅ | Signed direct uploads |
| 🔐 JWT Auth (httpOnly) | ✅ | ✅ | Cookie-based |
| 🛡️ Rate Limiting | ✅ | ✅ | Auth + contact routes |
| 🌐 Netlify Deployment | ✅ | ✅ | SPA redirect configured |
| ⚙️ Render Deployment | ✅ | ✅ | Node.js backend |

---

## Order Status Flow (Quick Reference)

```mermaid
graph LR
    placed["🟡 placed"] --> processing["🔵 processing"]
    processing --> shipped["🟠 shipped"]
    shipped --> delivered["🟢 delivered"]
    placed -->|cancelled| cancelled["🔴 cancelled"]
    processing -->|cancelled| cancelled

    style placed fill:#fef3c7,stroke:#d97706
    style processing fill:#dbeafe,stroke:#3b82f6
    style shipped fill:#fed7aa,stroke:#ea580c
    style delivered fill:#d1fae5,stroke:#059669
    style cancelled fill:#fee2e2,stroke:#dc2626
```

## Payment Status Flow (Quick Reference)

```mermaid
graph LR
    created["🟡 created"] --> paid["🟢 paid"]
    created --> failed["🔴 failed"]
    paid --> refunded["🟣 refunded"]

    style created fill:#fef3c7,stroke:#d97706
    style paid fill:#d1fae5,stroke:#059669
    style failed fill:#fee2e2,stroke:#dc2626
    style refunded fill:#f3e8ff,stroke:#7c3aed
```

---

*Documentation generated: March 2026 | Herbify v1.0 | MERN Stack*
