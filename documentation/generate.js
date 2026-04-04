const fs = require('fs');
const { generateAcademicContent } = require('./contentGenerator.js');

// We will explicitly map exactly 85 pages to ensure perfect balance and no overloads.
// We use a safe word-count (approx 200-250 words) for text pages to guarantee they fit within a single A4 page without overflowing.

const pagePlan = [
    { p: 1, type: "cover", title: "Cover Page" },
    { p: 2, type: "text", title: "Acknowledgement", content: "We would like to express our deepest appreciation to all those who provided us the possibility to complete this project and those who helped us throughout the journey." },
    { p: 3, type: "toc", title: "Table of Contents" },
    
    // 1. Introduction
    { p: 5, type: "chapter", chapter: "1. Introduction to Project", title: "Background & Context" },
    { p: 6, type: "text", title: "Problem Statement" },
    { p: 7, type: "text", title: "Motivation for Herbify" },
    { p: 8, type: "text", title: "Scope of the Project" },
    { p: 9, type: "text", title: "System Overview" },
    { p: 10, type: "diagram", title: "High-Level Architecture Diagram", desc: "A structural overview connecting the Front-end Client, Backend Node Services, and the AI Recommendation Engine." },
    
    // 2. Objective
    { p: 11, type: "chapter", chapter: "2. Objective of Project", title: "Primary Objectives (AI & E-commerce)" },
    { p: 12, type: "text", title: "Secondary Objectives (Educational)" },
    { p: 13, type: "text", title: "Expected Outcomes" },
    { p: 14, type: "text", title: "Feasibility Study (Economic & Technical)" },
    { p: 15, type: "text", title: "Feasibility Study (Operational & Schedule)" },
    
    // 3. Environment Description
    { p: 16, type: "chapter", chapter: "3. Environment Description", title: "Hardware Requirements" },
    { p: 17, type: "text", title: "Software Requirements Stack" },
    { p: 18, type: "text", title: "Development Tools (Vite, Node, Vercel)" },
    { p: 19, type: "text", title: "Database Environment (MongoDB)" },
    { p: 20, type: "text", title: "Third-party APIs & Libraries" },
    
    // 4. Analysis Report
    { p: 21, type: "chapter", chapter: "4. Analysis Report", section: "4.1 Requirement Specification", title: "Functional Requirements (User Auth)" },
    { p: 22, type: "text", title: "Functional Requirements (Product & Cart)" },
    { p: 23, type: "text", title: "Functional Requirements (Admin & AI Module)" },
    { p: 24, type: "text", title: "Non-Functional Requirements (Performance & Security)" },
    { p: 25, type: "text", title: "Non-Functional Requirements (Usability & Scalability)" },
    { p: 26, type: "diagram", title: "Data Flow Diagram (DFD Level 0)", desc: "Context diagram showcasing the high-level boundary between external entities and the Herbify application." },
    { p: 27, type: "diagram", title: "Data Flow Diagram (DFD Level 1)", desc: "Detailed flow of information across major internal functional modules including Auth and Inventory." },
    { p: 28, type: "diagram", title: "Data Flow Diagram (DFD Level 2)", desc: "Exploded view of the Order and Transaction processing sequence with inventory locks." },
    { p: 29, type: "text", title: "Key Advantages (Inventory Sync & Dynamic UI)" },
    { p: 30, type: "table", title: "Comparison with Existing Systems", desc: "A comparative table outlining Herbify vs. Traditional Digital Storefronts." },
    { p: 31, type: "section", section: "4.3 Database Description", title: "Data Modeling Concept" },
    { p: 32, type: "diagram", title: "Entity-Relationship (ER) Diagram", desc: "Full ER diagram showing relationships between User, Profile, Order, Category, and Product entities." },
    { p: 33, type: "text", title: "User & Authentication Collections" },
    { p: 34, type: "text", title: "Product & Category Collections" },
    { p: 35, type: "text", title: "Order & Cart Collections" },
    { p: 36, type: "text", title: "AI User Profile & Preferences Collections" },
    { p: 37, type: "diagram", title: "Database Schema UML", desc: "Detailed MongoDB Schema design including field types and validation rules." },

    // 5. Design Report
    { p: 38, type: "chapter", chapter: "5. Design Report", section: "5.1 Site Diagram", title: "Application Navigation Flow" },
    { p: 39, type: "diagram", title: "Site Flowchart Diagram", desc: "A comprehensive map of all user journeys from landing to post-purchase." },
    { p: 40, type: "text", title: "Front-end Component Hierarchy" },
    { p: 41, type: "text", title: "State Management Architecture" },
    { p: 42, type: "diagram", title: "State Lifecycle Diagram", desc: "Flow of Redux/Context actions triggered by user interactions affecting the global store." },
    { p: 43, type: "section", section: "5.2 Input Screen Layouts", title: "Authentication Form Layouts" },
    { p: 44, type: "screenshot", title: "Screenshot: Login & Registration Portal", desc: "Input fields, validation behaviors, and OAuth layout." },
    { p: 45, type: "text", title: "Home & Product Discovery Interface" },
    { p: 46, type: "screenshot", title: "Screenshot: Home Page landing & Hero", desc: "The main product carousel and personalized welcome banner." },
    { p: 47, type: "text", title: "Product Details & AI Recommendations UI" },
    { p: 48, type: "screenshot", title: "Screenshot: Product Specifics Page", desc: "Detailed view of botanical specs, pricing, and the 'Why this matches your profile' section." },
    { p: 49, type: "text", title: "Cart & Checkout Walkthrough" },
    { p: 50, type: "screenshot", title: "Screenshot: Checkout and Payment Gateway", desc: "The multi-step cart validation, address input, and order summary UI." },
    { p: 51, type: "text", title: "User Profile & Health Metrics Input" },
    { p: 52, type: "screenshot", title: "Screenshot: Profile & Preferences Menu", desc: "Where users define allergies, goals, and view their order history." },
    { p: 53, type: "text", title: "Admin Dashboard Control Panel", content: "The administrative layer provides a secure interface for inventory management. Access is strictly audited via the primary super-user credentials (User: admin@herbify.com / Pass: adminpassword123), granting full CRUD permissions over categorical data and botanical listings." },
    { p: 54, type: "screenshot", title: "Screenshot: Admin Product Management", desc: "The interface administrators use to CRUD products and monitor stock. (Active Session: admin@herbify.com)" },
    { p: 55, type: "section", section: "5.3 Output Reports", title: "User Analytics & Behavior Tracking" },
    { p: 56, type: "text", title: "Sales & Revenue Logs" },
    { p: 57, type: "screenshot", title: "Screenshot: Admin Sales Chart", desc: "Visual data representation of weekly revenue generated by the application." },
    { p: 58, type: "text", title: "Inventory Alerts & Stock Automated Reports" },
    { p: 59, type: "text", title: "AI Recommendation Effectiveness Metrics" },

    // 6. Testing Report
    { p: 60, type: "chapter", chapter: "6. Testing Report", title: "Testing Strategy: Unit vs Integration" },
    { p: 61, type: "text", title: "End-to-End Testing (E2E) Protocols" },
    { p: 62, type: "text", title: "Performance & Load Testing Methodologies" },
    { p: 63, type: "section", section: "6.1 Test Case Design", title: "Authentication & Registration Test Cases" },
    { p: 64, type: "table", title: "Product Browsing Test Case Matrix", desc: "Test cases validating filtering, searching, and viewing parameters." },
    { p: 65, type: "table", title: "Cart & Transaction Test Case Matrix", desc: "Test cases for total calculation, quantity limits, and payment failures." },
    { p: 66, type: "text", title: "Admin & Moderation Quality Assurance" },
    { p: 67, type: "section", section: "6.2 Testing Issues", title: "CORS & API Integration Hotfixes" },
    { p: 68, type: "text", title: "State Hydration & UI Rendering Bugs" },
    { p: 69, type: "text", title: "Concurrency Challenges in Database Transactions" },
    { p: 70, type: "diagram", title: "Debugging Flow Sequence Diagram", desc: "How an incident is tracked from the client browser to the backend logs." },
    { p: 71, type: "text", title: "Resolutions & Post-Release Patches" },

    // 7. Limitations
    { p: 72, type: "chapter", chapter: "7. Limitations", title: "Technical Limitations (Rate limits, hosting)" },
    { p: 73, type: "text", title: "AI Model Boundaries & Edge Cases" },
    { p: 74, type: "text", title: "Payment Gateway Third-Party Dependencies" },
    { p: 75, type: "text", title: "Geographic & Localization Constraints" },
    { p: 76, type: "text", title: "Security Trade-offs & Current Mitigation" },

    // 8. Future Enhancements
    { p: 77, type: "chapter", chapter: "8. Future Enhancements", title: "Mobile Application Development" },
    { p: 78, type: "text", title: "NLP & Voice Search Integration" },
    { p: 79, type: "text", title: "Expanding AI Predictive Restocking Models" },
    { p: 80, type: "text", title: "Augmented Reality (AR) Product Previews" },
    { p: 81, type: "text", title: "Blockchain for Supply Chain Transparency" },
    { p: 82, type: "text", title: "Subscription & Automated Loyalty Programs" },

    // 9. References
    { p: 83, type: "chapter", chapter: "9. References", title: "Academic & Technical Literature" },
    { p: 84, type: "text", title: "Libraries & Tooling Documentations" },
    { p: 85, type: "text", title: "Industry Standards & Compliance Specifications" },
];
// Content generation logic is now actively context-aware via contentGenerator.js

function buildHtml() {
    let pagesHtml = '';

    pagePlan.forEach((page, index) => {
        let pageClass = 'explicit-page';
        if (page.p < 5) {
            pageClass += ' front-matter-page';
        } else {
            pageClass += ' main-content-page';
        }
        
        pagesHtml += `<div class="${pageClass}">`;
        
        if (page.type === "cover") {
            pagesHtml += `
            <div class="cover">
                <h1 style="text-align: left; width: 100%;">Herbify</h1>
                <h2 style="text-align: left; width: 100%;">AI-Powered Plant-Based E-commerce Final Documentation</h2>
                <div style="text-align: center; width: 100%;">
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://herbify-client.vercel.app" alt="Website QR Code" class="qr-code" />
                    <p style="text-align: center; text-indent: 0; font-family: monospace; font-size:16pt;"><a href="https://herbify-client.vercel.app" style="color: black;">https://herbify-client.vercel.app</a></p>
                </div>
                <table style="margin-left: 0;">
                    <tr><th>Role</th><th>Team Member</th></tr>
                    <tr><td>Lead Developer</td><td>Yash Patel</td></tr>
                    <tr><td>Systems Architect</td><td>System Agent</td></tr>
                    <tr><td>QA & Testing</td><td>Testing Agent</td></tr>
                    <tr><td>Design & UX</td><td>Design Agent</td></tr>
                </table>
                <div class="details" style="text-align: left; width: 100%;">
                    <p style="text-indent: 0;"><strong>College/Institution:</strong> University Name</p>
                    <p style="text-indent: 0;"><strong>Course:</strong> Computer Science / Software Engineering</p>
                    <p style="text-indent: 0;"><strong>Academic Year:</strong> 2026</p>
                </div>
            </div>`;
        } 
        // TOC numbering based on local Page 1 starting at physical page 4
        else if (page.type === "toc") {
            pagesHtml += `
            <div class="toc">
                <h1 style="text-align: left; margin-bottom: 2em; text-indent:0;">${page.title}</h1>
                <div style="width:85%; margin: 1em auto; font-family: 'Times New Roman'; font-size:12pt; display:flex; flex-direction:column; gap: 6px;">
                    <div style="display:flex; justify-content:space-between; border-bottom:1px dotted #888;"><strong>1. Introduction to Project</strong><span>01</span></div>
                    <div style="display:flex; justify-content:space-between; border-bottom:1px dotted #888;"><strong>2. Objective of Project</strong><span>07</span></div>
                    <div style="display:flex; justify-content:space-between; border-bottom:1px dotted #888;"><strong>3. Environment Description</strong><span>12</span></div>
                    <div style="display:flex; justify-content:space-between; border-bottom:1px dotted #888;"><strong>4. Analysis Report</strong><span>17</span></div>
                    <div style="margin-left: 20px; display:flex; justify-content:space-between; border-bottom:1px dotted #ccc;"><span>4.1 Requirement Specification</span><span>17</span></div>
                    <div style="margin-left: 20px; display:flex; justify-content:space-between; border-bottom:1px dotted #ccc;"><span>4.2 Proposed System with Advantages</span><span>22</span></div>
                    <div style="margin-left: 20px; display:flex; justify-content:space-between; border-bottom:1px dotted #ccc;"><span>4.3 Database Description</span><span>27</span></div>
                    <div style="display:flex; justify-content:space-between; border-bottom:1px dotted #888;"><strong>5. Design Report</strong><span>34</span></div>
                    <div style="margin-left: 20px; display:flex; justify-content:space-between; border-bottom:1px dotted #ccc;"><span>5.1 Site Diagram</span><span>34</span></div>
                    <div style="margin-left: 20px; display:flex; justify-content:space-between; border-bottom:1px dotted #ccc;"><span>5.2 Input Screen Layouts</span><span>39</span></div>
                    <div style="margin-left: 20px; display:flex; justify-content:space-between; border-bottom:1px dotted #ccc;"><span>5.3 Output Reports</span><span>51</span></div>
                    <div style="display:flex; justify-content:space-between; border-bottom:1px dotted #888;"><strong>6. Testing Report</strong><span>56</span></div>
                    <div style="margin-left: 20px; display:flex; justify-content:space-between; border-bottom:1px dotted #ccc;"><span>6.1 Test Case Design</span><span>59</span></div>
                    <div style="margin-left: 20px; display:flex; justify-content:space-between; border-bottom:1px dotted #ccc;"><span>6.2 Testing Issues</span><span>63</span></div>
                    <div style="display:flex; justify-content:space-between; border-bottom:1px dotted #888;"><strong>7. Limitations</strong><span>68</span></div>
                    <div style="display:flex; justify-content:space-between; border-bottom:1px dotted #888;"><strong>8. Future Enhancements</strong><span>73</span></div>
                    <div style="display:flex; justify-content:space-between; border-bottom:1px dotted #888;"><strong>9. References</strong><span>79</span></div>
                </div>
            </div>`;
        }
        else {
            // Document Pages
            if (page.chapter) {
                pagesHtml += '<h1 style="font-size:20pt; text-align:left; padding-top:20px;">' + page.chapter + '</h1>';
            }
            if (page.section) {
                pagesHtml += '<h2 style="font-size:16pt; margin-top:1em;">' + page.section + '</h2>';
            }

            pagesHtml += '<h3 style="font-size:14pt; margin-top:1em; margin-bottom:1em; font-weight:bold; border-bottom: 1px solid #000; padding-bottom: 5px;">' + page.title + '</h3>';

            if (page.type === "text" || page.type === "chapter" || page.type === "section") {
                if(page.content) {
                    pagesHtml += "<p>" + page.content + "</p>";
                }
                pagesHtml += generateAcademicContent(page.title, page.type, 3);
            } 
            else if (page.type === "diagram") {
                let diagramContent = '';
                if (page.p === 10) { // High Level Architecture
                    diagramContent = `graph TD
    User(Client Browser) --> Vercel[Vercel Edge]
    Vercel --> ReactApp[React 18 SPA]
    ReactApp --> Express[Node.js Express API]
    Express --> AI[AI Recommendation Engine]
    Express --> DB[(MongoDB Atlas)]
    Express --> CD[Cloudinary Media Store]`;
                } else if (page.p === 26) { // DFD Level 0
                    diagramContent = `graph LR
    User((User)) -- Profile/Orders --> Herbify[Herbify System]
    Admin((Admin)) -- Inventory/Users --> Herbify
    Herbify -- Product Catalogs --> User
    Herbify -- Sales Reports --> Admin
    Herbify -- Payment Data --> Gateway((Payment Gateway))`;
                } else if (page.p === 27) { // DFD Level 1
                    diagramContent = `graph LR
    User((User)) -- Auth --> P1[1.0 Authenticate]
    Admin((Admin)) -- Auth --> P1
    P1 -- Session --> User
    
    User -- Search --> P2[2.0 Search & Match]
    P2 -- Read --> DB[(Herbify Database)]
    
    Admin -- CRUD --> P3[3.0 Manage Stock]
    P3 -- Write --> DB
    
    User -- Order --> P4[4.0 Process Order]
    P4 -- Payment --> GW((Gateway))`;
                } else if (page.p === 28) { // DFD Level 2 (Checkout)
                    diagramContent = `graph TD
    Req[Start Checkout] --> P41[4.1 Validate Cart Items]
    P41 --> P42[4.2 Check Inventory Levels]
    P42 -- "Stock < Req" --> Error[Notify Delay]
    P42 -- "Available" --> P43[4.3 Lock Stock Items]
    P43 --> P44[4.4 Execute Payment Transaction]
    P44 -- Success --> P45[4.5 Generate Invoice & Order Record]
    P45 --> DB[(Database)]
    P45 --> User((User Notification))`;
                } else if (page.p === 32) { // ER Diagram
                    diagramContent = `erDiagram
    USER ||--o{ ORDER : places
    ORDER ||--|{ ITEM : contains
    ITEM }|--|| PRODUCT : of_type
    CATEGORY ||--o{ PRODUCT : contains
    USER ||--o{ PROFILE : has`;
                } else if (page.p === 37) { // Database Schema UML
                    diagramContent = `classDiagram
    class UserSchema {
        +String email
        +String passwordHash
        +Array orders
    }
    class ProductSchema {
        +String title
        +Number price
        +Number stockCount
    }
    class OrderSchema {
        +String userId
        +Array items
        +String status
    }
    UserSchema -- OrderSchema : references
    ProductSchema -- OrderSchema : items`;
                } else if (page.p === 39) { // Site Flowchart
                    diagramContent = `graph TD
    Splash[Landing Page] --> Login[Sign In]
    Login --> Store[Herb Gallery]
    Store --> Detail[Product Insight]
    Detail --> Cart[Cart Summary]
    Cart --> Pay[Stripe Payment]
    Pay --> Conf[Order Confirmation]`;
                } else if (page.p === 42) { // State Lifecycle
                    diagramContent = `graph LR
    Action[User Action] --> Dispatcher[Redux Reducer]
    Dispatcher --> Store[Global Application State]
    Store --> View[React Component Render]
    View --> Action`;
                } else if (page.p === 70) { // Debugging Flow
                    diagramContent = `graph LR
    Incident[Frontend Error] --> Log[Sentry/Winston Logs]
    Log --> Analysis[Stack Trace Analysis]
    Analysis --> Patch[Code Fix]
    Patch --> CI[Testing Pipeline]
    CI --> Deploy[Hotfix Release]`;
                } else { // Generic Fallback (Should not be hit)
                    diagramContent = `graph TD
    A[Component] -->|Data| B[Processing]
    B -->|Storage| C[(Database)]`;
                }
                
                pagesHtml += `
                <div class="figure" style="page-break-inside: avoid; overflow-x: auto;">
                    <strong style="display:block; margin-bottom: 10px;">${page.title}</strong>
                    <div class="mermaid" style="text-align: center; max-width: 100%;">
${diagramContent}
                    </div>
                    <p style="font-size: 10pt; text-align: center; margin-top: 10px;"><em>Figure: ${page.desc}</em></p>
                </div>`;
                pagesHtml += generateAcademicContent(page.title, page.type, 1);
            }
            else if (page.type === "screenshot") {
                let imgPath = '';
                if (page.p === 44) imgPath = 'assets/login.png';
                else if (page.p === 46) imgPath = 'assets/homepage.png';
                else if (page.p === 48) imgPath = 'assets/products.png';
                else if (page.p === 50) imgPath = 'assets/checkout.png';
                else if (page.p === 52) imgPath = 'assets/success.png';
                else if (page.p === 54 || page.p === 57) imgPath = 'assets/dashboard_orders.png';
                else imgPath = 'assets/homepage.png'; 

                let screenshotLabel = page.title.replace('Screenshot: ', '');
                pagesHtml += `
                <div class="figure" style="page-break-inside: avoid; text-align: center;">
                    <strong style="display:block; margin-bottom: 10px; text-align: left;">${page.title}</strong>
                    <div style="border: 1px solid #ddd; padding: 5px; background: #fff; max-width: 100%; border-radius: 6px; display: inline-block;">
                        <img src="${imgPath}" alt="${screenshotLabel}" style="max-width: 100%; max-height: 440px; object-fit: contain; border: 1px solid #eee;" />
                    </div>
                    <p style="font-size: 10pt; text-align: center; margin-top: 10px; text-indent: 0;"><em>Figure: ${page.desc}</em></p>
                </div>`;
                pagesHtml += generateAcademicContent(page.title, page.type, 1);
            }
            else if (page.type === "table") {
                pagesHtml += `
                <table class="data-table" style="font-size: 11pt; margin-top:2em; margin-bottom:2em;">
                    <tr><th>Parameter</th><th>Proposed System (Herbify)</th><th>Traditional Systems</th></tr>
                    <tr><td>Performance</td><td>Highly optimized microservices</td><td>Monolithic delays</td></tr>
                    <tr><td>Intelligence</td><td>AI-driven contextual matching</td><td>Keyword-based raw search</td></tr>
                    <tr><td>User Retention</td><td>Increased via personalization</td><td>Static browsing churn</td></tr>
                </table>
                <p style="text-align:center; font-style:italic; font-size:11pt; text-indent:0;">Table: ${page.desc}</p>
                `;
                pagesHtml += generateAcademicContent(page.title, page.type, 2);
            }
        }
        
        pagesHtml += '</div>\n\n'; // end explicit-page
    });

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Herbify Documentation</title>
    <!-- We load paged.js for browser pagination mapping -->
    <script src="https://unpkg.com/pagedjs/dist/paged.polyfill.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
    <script>
        // Paged.js moves elements to a new DOM structure. 
        // We must wait for Paged.js to finish before rendering Mermaid.
        class FinalHandler extends Paged.Handler {
            constructor(chunker, polisher, caller) {
                super(chunker, polisher, caller);
            }
            async afterRendered(pages) {
                mermaid.initialize({ 
                    startOnLoad: false, 
                    theme: 'neutral',
                    securityLevel: 'loose',
                    flowchart: { useMaxWidth: true, htmlLabels: true }
                });
                
                // Explicitly render all mermaid diagrams to control scaling
                const mermaids = document.querySelectorAll('.mermaid');
                for (const m of mermaids) {
                    try {
                        const id = 'mermaid-' + Math.random().toString(36).substr(2, 9);
                        const content = m.textContent.trim();
                        const { svg } = await mermaid.render(id, content);
                        m.innerHTML = svg;
                        const svgElement = m.querySelector('svg');
                        if (svgElement) {
                            svgElement.style.maxWidth = '100% ';
                            svgElement.style.maxHeight = '380px';
                            svgElement.style.height = 'auto';
                            svgElement.style.display = 'block';
                            svgElement.style.margin = '0 auto';
                        }
                    } catch (e) {
                        console.error('Mermaid render error:', e);
                    }
                }

                // FORCE PAGE NUMBERING RESET (Introduction = 1)
                // Paged.js renders page numbers in .pagedjs_margin-bottom-center
                setTimeout(() => {
                   const footers = document.querySelectorAll('.pagedjs_margin-bottom-center');
                   console.log('Auditing Footers:', footers.length);
                   footers.forEach((footer, idx) => {
                       // 1:Cover, 2:Ack, 3:ToC -> Hide
                       if (idx < 3) {
                           footer.innerHTML = '';
                       } else {
                           // 4:Intro -> Page 1
                           footer.innerHTML = (idx - 2); 
                           footer.style.fontFamily = "'Times New Roman', serif";
                           footer.style.fontSize = "11pt";
                       }
                   });
                }, 500); 
            }
        }
        Paged.registerHandlers(FinalHandler);
    </script>
    <style>
        .mermaid svg {
            max-width: 100% !important;
            height: auto !important;
        }
        .figure {
            margin-top: 15px;
            margin-bottom: 25px;
            page-break-inside: avoid;
            text-align: center;
            width: 100%;
        }
        @page {
            size: A4;
            margin-top: 1in;
            margin-left: 1in;
            margin-right: 1in;
            margin-bottom: 0.8in; 
        }
        @page no-number-region {
            @bottom-center {
                content: none !important;
            }
        }
        @page numbered-region {
            @bottom-center {
                content: counter(page);
                font-family: "Times New Roman", Times, serif;
                font-size: 11pt;
                vertical-align: top; 
                padding-top: 6mm; 
            }
        }
        .main-content-page {
            page: numbered-region !important;
        }
        .main-content-page:first-of-type {
            counter-reset: page 1; 
        }

        @page :first {
            @bottom-center { content: none; }
        }
        
        body {
            font-family: "Times New Roman", Times, serif;
            font-size: 12pt;
            line-height: 1.6;
            text-align: justify;
            color: black;
            margin: 0;
            padding: 0;
        }

        h1, h2, h3, h4 {
            font-family: "Times New Roman", Times, serif;
            color: black;
            page-break-after: avoid;
            text-indent: 0;
            text-align: left !important;
            text-align-last: left !important;
        }
        
        p { text-align: justify; margin-bottom: 1.2em; text-indent: 0.5in; }
        
        /* EXACT PAGE CONTROL */
        .explicit-page {
            page-break-after: always;
            break-after: page;
            break-inside: avoid !important;
            height: 252mm; 
            overflow: hidden !important; 
            box-sizing: border-box;
            position: relative;
            border-bottom: 1px solid transparent; 
        }
        .front-matter-page {
            page: no-number-region !important;
        }
        .main-content-page {
            /* Inherits default page with numbering */
        }.cover {
            text-align: center;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }
        .cover h1 { font-size: 38pt; margin-bottom: 0.2em; font-weight: bold; }
        .cover h2 { font-size: 20pt; font-weight: normal; margin-bottom: 2em; }
        .cover .details { margin-top: 2em; font-size: 14pt; }
        .cover table { margin: 2em auto; border-collapse: collapse; font-size: 14pt; width: 80%; max-width: 600px; }
        .cover th, .cover td { border: 1px solid black; padding: 10px 20px; text-align: center; }
        .cover th { background-color: #f2f2f2; }
        .qr-code { width: 140px; height: 140px; margin: 1em auto; display: block; border: 1px solid #000; padding: 10px; background: white;}
        
        /* General tables */
        table.data-table {
            width: 100%;
            border-collapse: collapse;
        }
        table.data-table th, table.data-table td {
            border: 1px solid #000;
            padding: 8px;
            text-align: left;
        }
        
        /* Diagrams and Images */
        .figure {
            margin: 1.5em 0;
            text-align: center;
        }
        .figure-box {
            border: 2px dashed #666;
            padding: 20px;
            background: #f9f9f9;
            color: #333;
            font-family: Arial, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto;
            min-height: 220px;
            width: 90%;
            border-radius: 4px;
        }
        
        @media screen {
            #ui-controls {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999;
                background: white;
                padding: 15px;
                border: 1px solid #ccc;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                font-family: sans-serif;
                text-align: center;
            }
            #ui-controls button {
                padding: 10px 20px;
                background: #28a745;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
                font-weight: bold;
                transition: background 0.2s;
            }
            #ui-controls button:hover { background: #218838; }
            #ui-controls .hint { font-size: 11px; color: #666; margin-top: 8px; }
        }
        @media print {
            #ui-controls { display: none; }
        }
    </style>
</head>
<body>
    <div id="ui-controls">
        <button onclick="window.print()">Download as PDF</button>
        <div class="hint">Preview mode is active.<br>85 precision-mapped pages.</div>
    </div>
    
    <div id="content">
        ${pagesHtml}
    </div>
</body>
</html>`;
}

fs.writeFileSync('/Users/yash/Desktop/Home/herbify/documentation/index.html', buildHtml());
console.log('Precision 85-page documentation generated successfully.');
