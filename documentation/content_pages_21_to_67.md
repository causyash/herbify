# Herbify - Academic Content (Chapters 4, 5, 6)

## Page 21: Functional Requirements (User Auth)
The authentication module of the Herbify application serves as the primary security gateway, ensuring the integrity and confidentiality of user data. Built on the robust foundations of the MERN stack—specifically utilizing Express.js middleware and MongoDB for persistency—the system employs JSON Web Tokens (JWT) facilitated via HTTP-only cookies to mitigate Cross-Site Scripting (XSS) vulnerabilities. 

Functionally, the system mandates a two-tier authentication paradigm. Upon registration, users are required to verify their communication channels through an algorithmic One-Time Password (OTP) validation mechanism, which defends against synthetic account generation. Subsequent authentications utilize bcrypt-hashed credential verification. The role-based access control (RBAC) architecture differentiates standard consumer interactions from elevated administrative privileges, dynamically restricting API endpoint availability based on the decoded JWT payload.

## Page 22: Functional Requirements (Product & Cart)
The e-commerce core of Herbify pivots around its dynamic product discovery and cart management subsystem. Functionally, the application must provide high-availability endpoints for querying the botanical and product catalogs, leveraging MongoDB's aggregation pipelines to execute complex filtering against taxonomical categories, therapeutic uses, and real-time inventory levels.

The cart mechanism is formulated to be a mathematically consistent state machine, persisting the user's ephemeral intent into the non-volatile database schema. This architectural decision prevents cart abandonment inconsistencies across disparate client sessions. Key functional requirements dictate that the system meticulously validates product availability asynchronously during the addition phase, calculates sub-totals incorporating dynamic taxation and shipping overheads, and structurally prepares the payload for the final checkout handover. 

## Page 23: Functional Requirements (Admin & AI Module)
Administrative oversight and intelligent recommendation engines form the operational backbone of Herbify. The administrative functional requirements dictate a comprehensive CRUD (Create, Read, Update, Delete) capability over the entire catalog, integrated seamlessly with a Cloudinary image delivery network via secure, signed upload payloads. Furthermore, the dashboard must aggregate transactional metadata into visual Key Performance Indicators (KPIs) referencing volumetric sales and stock deprecation.

Simultaneously, the AI module is required to function as a heuristic personalization agent. By interpreting the consumer's pre-defined health goals, historical search intent, and declared botanical allergies, the recommendation algorithm dynamically reorders product visibility. This requires the backend to structure an intelligent weighting function that scores abstract botanical metrics against the user's empirical vector profile, directly rendering highly contextualized suggestions to the React-based frontend.

## Page 24: Non-Functional Requirements (Performance & Security)
Beyond deterministic features, Herbify is strictly bounded by Non-Functional Requirements (NFRs) dedicated to performance latency and impenetrable security. From a performance standpoint, the API layer (deployed on Render) must sustain concurrent requests scaling elastically, with an acceptable response latency threshold of sub-200 milliseconds for cached catalog queries. This is achieved through optimizing MongoDB indexing strategies across heavily queried fields like product slugs and category identifiers.

Security invariants are paramount. The architecture mandates Transport Layer Security (TLS 1.3) for all in-transit data cryptography. The integration of Helmet.js secures Express against fundamental HTTP header vulnerabilities, while rigid rate-limiting logic is deployed upon sensitive endpoints (e.g., login, OTP generation) to preempt brute-force permutations or Distributed Denial of Service (DDoS) vectors. Moreover, Razorpay's HMAC-SHA256 signature verification guarantees financial transaction integrity.

## Page 25: Non-Functional Requirements (Usability & Scalability)
As a modern web application, Herbify's usability metrics heavily hinge upon the fluidity and reactivity of its UI/UX, built on React.js. The non-functional usability prerequisite demands a responsive, mobile-first design language that fluidly adapts to fragmented viewport dimensions. This encompasses minimizing cumulative layout shift (CLS) and optimizing First Contentful Paint (FCP) through Vercel's global Content Delivery Network (CDN) edge deployments.

Scalability represents the framework's capability to absorb exponential growth without proportional infrastructure decay. Herbify addresses this through a stateless backend architecture, allowing container instances to replicate horizontally under compute duress. The MongoDB Atlas cluster is structurally equipped with auto-scaling capabilities, ensuring that the I/O operations per second (IOPS) scale dynamically to accommodate seasonal or synthetic traffic spikes, thereby presenting an architecture built for enterprise survivability.

## Page 26: System Architecture Overview
The macro-architecture of Herbify operates upon a decoupled, service-oriented topology that structurally delineates the presentation layer from backend logic. The client-side application is rendered utilizing React.js, deployed at the edge via Vercel, which ensures hyper-localized delivery of static assets. 

All stateful logic, data mutation, and algorithmic computations are delegated to a Node.js/Express.js monolithic environment hosted on Render. This backend acts as an orchestration layer, securely interfacing with external microservices: MongoDB Atlas for durable document storage, Cloudinary for high-performance image asset caching, and Razorpay for rigorous financial fulfillment. The communication protocol between the client and server is strictly enforced as HTTPS-encrypted RESTful API interchanges, with identity validation maintained by stateless web tokens.

## Page 27: Proposed System Block Diagram
[REQ: INSERT DIAGRAM HERE - Reference block diagram showing React Frontend hitting Express API which distributes to Mongo, Razorpay, Cloudinary]

*The architectural diagram delineates the flow of data across the Herbify topology. The React client issues RESTful commands to the centralized Node.js API. The API subsequently acts as a secure router, verifying authentication payloads, executing business logic against the MongoDB document stores, or orchestrating external workflows such as Cloudinary signed uploads and Razorpay payment initializations.*

## Page 28: Key Advantages (AI Integration & Personalization)
The integration of specialized artificial intelligence modules into the Herbify ecosystem grants unprecedented advantages within the specialized domain of botanical e-commerce. Traditional storefronts operate on an objective, keyword-based search paradigm. Herbify transcends this by deploying a recommendation engine that semantically correlates a user’s physiological profile—such as dietary goals or specific contraindications—with the biochemical taxonomies of the product inventory.

This capability fundamentally re-engineers product discovery from user-driven searching to system-driven curation. Contextualizing merchandise based on personalized input significantly elevates user engagement metrics, directly influencing increased session duration and conversion probabilities. By mathematically aligning botanical benefits to explicit client necessities, the system essentially acts as an automated, personalized apothecary.

## Page 29: Key Advantages (Inventory Sync & Dynamic UI)
Herbify provides immense operational benefits through its rigorously synchronized inventory tracking and dynamically responsive User Interface. The backend continuously evaluates stock parameters in real-time, instantly reflecting supply permutations onto the client DOM (Document Object Model) via state re-hydration. This bidirectional cohesion prevents the critical e-commerce failure point of phantom inventory or overselling.

The administrative panel capitalizes on this structural synchrony by observing aggregated analytics and receiving automated notification triggers—via Telegram websockets—the moment inventory thresholds are breached. Concurrently, the consumer interfaces adapt heuristically; out-of-stock items dynamically reorganize within indexing algorithms to prioritize available, high-demand substitutes, optimizing the digital storefront layout autonomously without necessitating manual oversight.

## Page 30: Comparison with Existing Systems
When contrasted with legacy digital storefronts, Herbify manifests a significant generational leap. Traditional architectures frequently rely on monolithic structures, where client rendering and database coupling lead to brittle, high-latency workflows. Herbify’s decoupled MERN configuration facilitates asynchronous non-blocking I/O operations, natively preventing thread congestion.

From a feature perspective, legacy equivalents lack intrinsic personalization, leaning on generic 'best-seller' metrics. Herbify pioneers a dynamic, intelligent curation model. Furthermore, traditional systems handle media delivery directly from the primary server, choking bandwidth. Herbify mitigates this via Cloudinary’s decentralized Content Delivery Network, ensuring image payload optimizations independent of the core operational thread, ensuring uncompromised scalability and drastically diminished infrastructural taxation.

## Page 31: Data Modeling Concept
The structural underpinning of Herbify utilizes a NoSQL paradigm managed through MongoDB and structurally validated via the Mongoose Object Data Modeling (ODM) library. Unlike rigid relational matrices, this document-oriented approach permits high-flexibility schematics that seamlessly encapsulate nested arrays—such as an order’s composite items or a user's multi-address portfolio—within single JSON-like BSON documents. 

Data normalization is selectively applied to preserve scalability without sacrificing read performance. For instance, entity relationships (like Products belonging to Categories) utilize `ObjectId` references to minimize duplication, while Order documents embed hard-copied records of item prices to protect historical ledger integrity against future catalog fluctuations. This hybrid approach to data modeling optimizes both transactional security and retrieval kinematics.

## Page 32: Entity-Relationship (ER) Diagram
[REQ: INSERT DIAGRAM HERE - Reference detailed ER Diagram containing User, Product, Category, Order, Review, and OTP models.]

*The Entity-Relationship schematic maps the intricate data topography of Herbify. Users formulate a one-to-many relationship with Orders and Reviews. Products maintain a many-to-one relationship with the central Category taxonomy. Additionally, ephemeral data states, such as OTP lifecycle events, exist as disparate, TTL-indexed configurations independent of persistant historical ledgers.*

## Page 33: User & Authentication Collections
The `User` collection is the central pivot for identity and access management. Each document encapsulates critical demographic strings, a robustly hashed secret (generated via bcrypt), and an array of granular authorization strings representing the user's operational role. Complex substructures within the document include nested arrays for persisting localized delivery addresses and active cart vectors.

To complement this, an `OTP` (One-Time Password) collection operates as an ephemeral verification buffer. Utilizing MongoDB’s Time-To-Live (TTL) indexing logic, documents within this schema automatically disintegrate post-expiration, ensuring optimal storage utilization and preempting sophisticated replay attacks. The synchronicity between the durable `User` schema and volatile `OTP` architecture guarantees a mathematically sound authentication loop.

## Page 34: Product & Category Collections
The inventory ecosystem is distributed across the `Product` and `Category` schemas. The `Category` model dictates the fundamental taxonomy, employing unique algorithmic 'slugs' formatted for Search Engine Optimization (SEO) friendly routing protocols. 

The `Product` and `Herb` models act as extensive repositories for botanical metadata. They encapsulate arrays defining categorical benefits, strict quantitative values associated with pricing and inventory, and Cloudinary-delivered secure image URLs. A critical architectural decision utilizes MongoDB's population logic, allowing frontend systems to query a categorized sector and natively retrieve all encapsulated operational data, drastically decreasing API overheads.

## Page 35: Order & Cart Collections
Order management logic transitions user interactions into permanent financial ledgers. While the user's active cart exists as a volatile embedded array within their User document, achieving "checkout" synthesizes this data into an immutable `Order` document. 

This standalone `Order` entity functions as a cryptographic and chronological receipt. It mandates foreign key references to the original purchaser alongside deep-copied arrays representing the specific products acquired, the exact price per unit at the moment of execution, and the overarching fulfillment statuses. Additionally, it structurally captures Razorpay webhook metadata—such as cryptographic transaction IDs and HMAC signatures—guaranteeing that financial reconciliation is auditable and mathematically infallible.

## Page 36: AI User Profile & Preferences Collections
To facilitate the proprietary heuristic recommendations, the database architecture incorporates an expansion to the typical consumer profile vector. Rather than simple demographics, the schema evaluates a serialized array of explicitly stated goals, dietary limitations, and historic navigational interactions. 

By structuring the backend to utilize aggregation pipelines, the system computes the intersection between a product's array of defined 'uses' and the consumer’s predefined 'deficiencies.' This results in the database natively generating advanced, contextual metrics, dynamically filtering and rating product suitability before relinquishing the payload to the client interface, thus merging data persistence with real-time computational biology.

## Page 37: Database Schema UML
[REQ: INSERT DIAGRAM HERE - Reference Mongoose UML with distinct Schema types, Default implementations, and Index parameters.]

*The Universal Modeling Language (UML) syntax deployed above demonstrates the exact categorical typing enacted by Mongoose. Distinct parameter specifications—such as required fields, default enumerations for order states, and boolean switches for admin privileges—are mapped to emphasize the strict validation criteria blocking corrupt data from database entry.*

## Page 38: Application Navigation Flow
Herbify's user experience architecture is governed by logical routing trees managed by React Router DOM. The topological flow initiates at a highly accessible, public-facing index, guiding the narrative either toward a generalized catalog exploration or targeted botanical searches. 

From these discovery vectors, unauthenticated users are seamlessly obstructed when transitioning toward mutative actions—such as initiating cart checkout or contributing review aggregates. At this interception point, the user is rerouted to the authentication sub-flow. Post-verification, the application utilizes state memory to safely navigate the consumer back to their specific point of interception, culminating in the protected Order and Payment gateway branches.

## Page 39: Site Flowchart Diagram
[REQ: INSERT DIAGRAM HERE - Reference Site tree including Public routes, Protected User routes, and Admin Layout]

*The navigational flowchart visualizes the strict partitioning of the application. The central horizontal axis dictates the public consumer path. Vertical ascents denote authenticated personal management loops (Profiles, Orders) while the distinct sub-graph highlights the rigorously protected, structurally disparate Administrative Dashboard accessible exclusively to elevated roles.*

## Page 40: Front-end Component Hierarchy
React's foundational philosophy of modularity dictates a strictly hierarchical component structure within Herbify. At the apex lies the `App` component acting as the central provider mesh, injecting globally necessitated contexts like Authentication and Toast Notification streams.

Below the root, the presentation bifurcates into Layout modules (`SiteLayout` / `AdminLayout`), defining overarching aesthetic frames. Leaf components—such as dynamic buttons, carousel wrappers, or individual product cards—are architected as highly decoupled variables. This atomic design methodology enables extensive reusability logic; an `AddToCart` structural component behaves uniformly regardless of whether it manifests on the primary search grid, a dedicated product splash page, or an aggregated promotional banner.

## Page 41: State Management Architecture
Predictability of data within the Single Page Application (SPA) is maintained via React’s Context API coupled with functional hooks (`useState`, `useReducer`). The architectural directive intentionally avoids excessive structural bloat introduced by external libraries (like Redux) in favor of localized, mathematically predictable state enclosures.

The global state is definitively restricted to immutable constants requiring universal access: consumer session integrity and aggregated cart volumetric data. To mitigate component re-rendering latency, expensive mathematical calculations (subtotals, AI score mapping) are memoized, and state mutations immediately persist to the backend through asynchronous HTTP wrappers, ensuring physical database synchronicity.

## Page 42: State Lifecycle Diagram
[REQ: INSERT DIAGRAM HERE - Reference State change triggered from DOM -> Action -> Context Provider -> API]

*The sequence explicitly illustrates the bidirectional lifecycle of state mutability. Initial component mounts trigger backend API fetching (hydrate), establishing localized DOM matrices. Subsequent consumer action (e.g., clicking Add to Cart) dispatches a mutation to Context, which initiates an API update. Upon secure 200 OK resolution, the UI rerenders to reflect verifiable data logic.*

## Page 60: Testing Strategy: Unit vs Integration
Quality assurance throughout the Herbify development cycle operates on a bifurcated paradigm balancing atomic granularity with holistic operational flow. Unit testing zeroes in on mathematically deducing the functional logic of isolated utilities—such as ensuring the cryptographic integrity of the JWT token generator or validating the exact mathematical output of the cart subtotal algorithm independent of the User Interface.

Integration testing scales the boundary vectors, confirming the semantic communication protocols between interconnected modules. This phase strictly evaluates whether the Express backend controllers accurately interpret HTTP request payloads, manipulate the Mongoose data models without schema violations, and return appropriately sanitized JSON data objects to the React consuming logic.

## Page 61: End-to-End Testing (E2E) Protocols
End-to-End testing replicates synthetic user behavior to evaluate overarching operational latency and structural integrity across the comprehensive infrastructure. Utilizing frameworks like Cypress, simulated agents navigate the digital DOM, executing multi-step procedures from initial landing to final transaction closure. 

These automated simulations verify that a user can cohesively transition across disparate technologies; selecting a product within the React frontend, bypassing the authentication intercept with a valid payload, manipulating the database cart schemas via the Express API, and securely rendering the external Razorpay widget iframe, culminating strictly in successful database order permutation.

## Page 62: Performance & Load Testing Methodologies
Given the e-commerce requirement for high availability during synthetic traffic bursts, rigorous performance modeling was executed. Utilizing load propagation tools, synthetic concurrent multi-request vectors were driven against the Render nodes to establish physical bottleneck boundaries.

Observations were analyzed regarding MongoDB Atlas IOPS degradation over a thousand requests-per-second, and subsequent mitigation factors were applied—such as horizontal node propagation and deep query indexing. The optimization metrics validated the architectural resilience, documenting exactly how cache utilization preempts database stalling, and ensuring a negligible Cumulative Layout Shift (CLS) on the Vercel-hosted frontend even beneath aggressive processing loads.

## Page 63: Authentication & Registration Test Cases
### Test Case ID: AUTH-01
**Title:** Registration with Valid Payload and Validated OTP  
**Preconditions:** User possesses an unverified but accessible email.  
**Steps:** 
1. Submit valid constraints (Name, Email, Strong Regex Password) to `/api/auth/send-otp`. 
2. Retrieve synthesized OTP from external log and input alongside user details onto the registration mutation.  
**Expected Result:** Express successfully bcrypt hashes the submitted password, validates OTP parity, constructs the Mongoose User Document, attaches an HttpOnly JWT to header payload, and issues a 201 Created Response.

### Test Case ID: AUTH-02
**Title:** Rate Limit Throttling on Authentication Brute Force  
**Preconditions:** Active script configured to bombard the login API controller.  
**Steps:** 
1. Transmit 55 automated payload sequences comprised of invalid credentials over a 10-minute chronological window.  
**Expected Result:** The initial 50 requests reflect 401 Unauthorized parameters. Request 51 activates the structural rate limiter, generating a 429 Too Many Requests response and severing the IP vector for 15 minutes.

## Page 64: Product Browsing Test Case Matrix
### Test Case ID: PROD-01
**Title:** Parametric Query Evaluation
**Preconditions:** Database encompasses products intersecting disparate categories and cost topologies.
**Steps:** 
1. Client selects UI parameter filtering for 'Ayurvedic' taxonomy with an exclusive cost range under 500 INR.
**Expected Result:** Aggregation pipeline retrieves and returns only corresponding documents.

### Test Case ID: PROD-02
**Title:** Malicious Injection Against Search Endpoints
**Preconditions:** Unauthenticated adversary.
**Steps:** 
1. Injects NoSQL syntax variants (`{"$gt": ""}`) into the public search algorithm vector.
**Expected Result:** The backend sanitization filters neutralize the operator payloads, converting the vector to raw string queries resulting in a safe zero-return object without DB failure.

## Page 65: Cart & Transaction Test Case Matrix
### Test Case ID: CART-01
**Title:** Stock Threshold Constraint Logic
**Preconditions:** Target inventory dictates 5 remaining physical units.
**Steps:** 
1. Authenticated user manipulates UI to inject 6 units of the specified taxonomy into their persistent cart.
**Expected Result:** Backend structurally rejects the mutation prior to database adjustment, returning a 400 Bad Request exception accompanied by a semantic stock error message to the React DOM.

### Test Case ID: TRAN-01
**Title:** Post-Checkout Razorpay Cryptographic Verification
**Preconditions:** User executes purchase rendering an arbitrary Razorpay ID sequence.
**Steps:** 
1. User transmits the frontend `razorpay_payment_id` manually altered utilizing malicious hash intercept logic.
**Expected Result:** The backend evaluates the received data against its internal HMAC SHA256 cryptographic sequence mapping the native secret key. Detection of the disparity immediately rejects the transaction logic, failing to orchestrate the internal `Order` schema logic.

## Page 66: Admin & Moderation Quality Assurance
### Test Case ID: ADM-01
**Title:** RBAC Intercept Against Protected Controllers
**Preconditions:** User possesses an authenticated identity explicitly demarcated as 'standard user' within Mongoose.
**Steps:** 
1. Employs API manipulation methodology to directly access the `/api/admin/inventory/` structural endpoint containing the JWT token.
**Expected Result:** Initial middleware confirms token validity; secondary RBAC abstraction evaluates the boolean role array and correctly rejects the request with a strict 403 Forbidden parameter, safeguarding business logic.

### Test Case ID: ADM-02
**Title:** Cloudinary Asset Upload Security Payload
**Preconditions:** Authenticated internal administrator.
**Steps:** 
1. Requests an asynchronous payload to Cloudinary to sign and attach an image file mapped via the React dashboard component.
**Expected Result:** The Node backend accurately constructs the cryptographic signature derived from environmental security logic, allowing direct CDN transmission bypassing backend memory buffers safely.

## Page 67: CORS & API Integration Hotfixes
During the development trajectory, significant structural impediments arose regarding Cross-Origin Resource Sharing (CORS) configurations. Initially, the strict boundary separations between the Vercel-hosted SPA (Single Page Application) and the Render-hosted API yielded immediate `preflight` rejection protocols. Browsers autonomously isolated the HTTP intercepts due to domain mismatches.

Resolution required meticulous architectural reconfiguration of the Express.js middleware sequence. By strictly declaring the origin URL headers—and critically—enabling the `credentials: true` boolean logic on both the generalized Axios instance and the Express CORS module, bidirectional communication was secured. This intervention permitted the seamless propagation of the HTTP-only JWT cookies across disparate operational domains without degrading integral browser safety protocols.
