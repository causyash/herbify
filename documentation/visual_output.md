# Visual Agent Output

## 1. Image Assets (Live Screenshots)
Live screenshots of `https://herbify-client.vercel.app` have been extracted using `pageres-cli` in a strict 1240x1754 constraint (optimized for sharp A4 margins and zero blurriness). They are directly hooked into the `index.html` pipeline mapped by page number.

**Exact UI Visual Mappings:**
- **Page 44**: `assets/login.png` (Authentication & Registration Portal)
- **Page 46**: `assets/homepage.png` (Home Page & Hero Section)
- **Page 48**: `assets/products.png` (Product Specifics Page)
- **Page 50**: `assets/cart.png` (Checkout and Payment Gateway)
- **Page 54**: `assets/dashboard.png` (Admin Product Management)
- **Page 57**: `assets/dashboard.png` (Admin Sales Chart)

*Screenshots are rendered with `<img style="max-width: 100%; max-height: 450px; object-fit: contain;">` ensuring they do not bleed off A4 pages horizontally or vertically.*

## 2. Diagram Code (Mermaid) - Labeled
Mermaid diagrams have been engineered vertically (`graph TD`) to prevent horizontal overflow on A4 pages. They have been dynamically injected into `generate.js` at their exact mapped page numbers.

### Architecture (Mapped to Page 10 & 27)
```mermaid
graph TD
    User([User Request]) --> Vercel[Vercel Global CDN]
    Vercel --> React[React Client SPA]
    React --> API[Express.js API Router]
    
    API --> Controller[Business Logic Controllers]
    Controller --> Services[External Services]
    Controller --> DB[(MongoDB Atlas)]
    
    Services --> Razorpay[Razorpay Gateway]
    Services --> Cloudinary[Cloudinary CDN]
    Services --> OTP[OTP SMS Service]
```

### DFD - Data Flow Diagram (Mapped to General Schema / DFD Sections)
```mermaid
graph TD
    A[Client] -->|Request| B(Process)
    B -->|Data| C[(Database)]
    C -->|Response| B
    B -->|Result| A
```

### ER Diagram (Mapped to Page 32 & 37)
```mermaid
erDiagram
    USER ||--o{ ORDER : places
    USER { string _id PK string email string role }
    ORDER ||--|{ ORDER_ITEM : contains
    ORDER { string _id PK string status float total }
    PRODUCT ||--o{ ORDER_ITEM : included_in
    PRODUCT { string _id PK string title float price }
    CATEGORY ||--o{ PRODUCT : categorizes
    CATEGORY { string _id PK string name }
```

### Site Navigation Flow (Mapped to Page 39)
```mermaid
graph TD
    Home[Homepage /] --> Auth[Login/Register]
    Home --> Shop[Shop Catalog]
    Shop --> Product[Product Detail View]
    Product --> Cart[Shopping Cart]
    Cart --> Checkout[Checkout Process]
    Checkout --> Success[Order Success]
    Auth --> Profile[User Dashboard]
    Auth --> Admin[Admin Dashboard]
    Admin --> Inventory[Manage Inventory]
    Admin --> Orders[Manage Orders]
```

## 3. QR Code (Mapped to Cover - Page 1)
![QR Code](https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://herbify-client.vercel.app)
Target: `https://herbify-client.vercel.app`

## 4. Constraint Fixes
- **A4 Optimization**: Replaced all `graph LR` formats with `graph TD` to ensure diagrams grow vertically, eliminating horizontal clipping out of bounds on standard A4 print margins.
- **Image Sharpness & Size**: Removed `blur` and used exact `1240x1754` resolution downloads for maximum detail retention while preserving fit. Wrapped them in tight containment HTML blocks.
- **Overflow Prevention**: Added `page-break-inside: avoid; overflow-x: auto;` to all diagram and image containers, ensuring no graphic fractures across explicit pagination rules.
