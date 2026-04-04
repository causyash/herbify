const fs = require('fs');
const path = require('path');

const mdPath = path.join(__dirname, '../DOCUMENTATION.md');
const outPath = path.join(__dirname, 'index.html');

const mdContent = fs.readFileSync(mdPath, 'utf-8');

// Escaping backticks to safely inject raw markdown into the template script block
const escapedMdContent = mdContent.replace(/`/g, '\\`').replace(/\$/g, '\\$');

const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Herbify Documentation</title>
    <!-- We load marked for parsing -->
    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
    <!-- We load mermaid for diagrams -->
    <script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
    <style>
        /* STRICT DESIGN RULES */
        @page {
            size: A4;
            margin: 25mm 20mm 25mm 20mm;
            @bottom-center {
                content: counter(page);
                font-family: "Times New Roman", Times, serif;
                font-size: 11pt;
            }
        }

        @page :first {
            @bottom-center { content: ""; } /* No page number on cover */
        }

        body {
            font-family: "Times New Roman", Times, serif;
            font-size: 12pt;
            line-height: 1.5;
            text-align: justify;
            color: #000;
            margin: 0;
            padding: 0;
            background: #fff;
        }

        /* Headings Hierarchy */
        h1, h2, h3, h4, h5, h6 {
            font-family: "Times New Roman", Times, serif;
            color: #000;
            page-break-after: avoid; /* Prevent orphans */
            page-break-inside: avoid;
            text-align: left;
            margin-top: 1.5em;
            margin-bottom: 0.8em;
        }

        /* Page breaks after each section */
        /* Applying page break before h1 and h2 to naturally break sections */
        h2 {
            page-break-before: always;
            border-bottom: 1px solid #000;
            padding-bottom: 5px;
        }
        
        h1 {
            page-break-before: always;
            text-align: center;
            font-size: 24pt;
        }

        /* Cover Page */
        .cover-page {
            page-break-after: always;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 250mm; /* A4 height approx */
            text-align: center;
            margin-top: 50mm;
        }

        .cover-page h1 {
            font-size: 48pt;
            font-weight: bold;
            margin-bottom: 0.2em;
            page-break-before: auto;
            border-bottom: none;
        }

        .cover-page h2 {
            font-size: 24pt;
            font-weight: normal;
            page-break-before: auto;
            border-bottom: none;
            margin-bottom: 2em;
        }

        .cover-page p {
            font-size: 16pt;
            margin: 10px 0;
        }

        /* Table of Contents */
        .toc-page {
            page-break-after: always;
        }
        
        .toc-page h1 {
            page-break-before: always;
        }

        .toc-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
        }

        .toc-item a {
            text-decoration: none;
            color: #000;
        }

        .toc-item span.dots {
            border-bottom: 1px dotted #000;
            flex-grow: 1;
            margin: 0 10px;
            position: relative;
            top: -6px;
        }

        /* Lists */
        ul, ol {
            margin-bottom: 1.5em;
            text-align: left;
        }

        /* Image placement within margins and scaled correctly */
        img {
            max-width: 100%;
            height: auto;
            display: block;
            margin: 1.5em auto; /* Centered */
            page-break-inside: avoid;
        }

        /* Code blocks to avoid overflow */
        pre {
            white-space: pre-wrap;
            word-wrap: break-word; /* Prevent code overflow */
            background: #f4f4f4;
            padding: 15px;
            border: 1px solid #ddd;
            border-radius: 4px;
            page-break-inside: avoid;
            font-family: monospace;
            font-size: 10pt;
            overflow-x: hidden;
        }
        
        code {
            font-family: monospace;
            background: #f4f4f4;
            padding: 2px 4px;
        }

        .mermaid-wrapper {
            width: 100%;
            display: flex;
            justify-content: center;
            margin: 2em 0;
            page-break-inside: avoid;
            background-color: white; /* sometimes mermaid needs light background */
            padding: 10px 0;
        }

        /* Prevent Mermaid charts from overflowing A4 page horizontally */
        .mermaid {
            max-width: 100%;
            overflow: hidden;
            display: flex;
            justify-content: center;
        }
        
        .mermaid svg {
            max-width: 100% !important;
            height: auto !important;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin: 1.5em 0;
            page-break-inside: avoid;
        }

        th, td {
            border: 1px solid #000;
            padding: 8px;
            text-align: left;
        }

        th {
            background-color: #f2f2f2;
        }

        blockquote {
            border-left: 4px solid #ccc;
            margin: 1.5em 0;
            padding-left: 1em;
            font-style: italic;
        }

        @media print {
            .no-print {
                display: none;
            }
        }

        /* Screen controls */
        #ui-controls {
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            padding: 15px;
            border: 1px solid #ccc;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            font-family: sans-serif;
            text-align: center;
            z-index: 100;
        }
        #ui-controls button {
            padding: 10px 20px;
            background: #000;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div id="ui-controls" class="no-print">
        <button onclick="window.print()">Print / Export PDF</button>
        <p style="font-size:10px; margin-top:5px; color:#666;">Use A4 format when printing</p>
    </div>

    <!-- Cover Page -->
    <div class="cover-page">
        <h1>HERBIFY</h1>
        <h2>Visual Project Documentation</h2>
        <p>A comprehensive MERN e-commerce application</p>
        <p>Date: April 2026</p>
    </div>

    <!-- Table of Contents Container -->
    <div id="toc-container" class="toc-page">
        <h1>Table of Contents</h1>
        <div id="toc-list"></div>
    </div>

    <!-- Main Content -->
    <div id="content" style="display:none;"></div>

    <script type="text/markdown" id="md-source">
${escapedMdContent}
    </script>

    <script>
        document.addEventListener("DOMContentLoaded", async function() {
            // Force mermaid to wait for us to process the text
            mermaid.initialize({ startOnLoad: false, theme: 'default', securityLevel: 'loose' });

            // 1. Get Markdown content
            const mdSource = document.getElementById("md-source").textContent;

            // 2. Parse Markdown to HTML
            const renderer = new marked.Renderer();
            
            renderer.heading = function({text, depth, raw}) {
                // Ensure IDs are CSS safe
                const id = raw.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                return '<h' + depth + ' id="h-' + id + '">' + text + '</h' + depth + '>';
            };

            renderer.code = function({text, lang}) {
                if (lang === 'mermaid') {
                    // mermaid needs raw unescaped text correctly embedded manually
                    // because if marked escapes > as &gt;, mermaid fails.
                    return '<div class="mermaid-wrapper"><div class="mermaid">' + text.replace(/</g, '<').replace(/>/g, '>') + '</div></div>';
                }
                const escaped = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
                return '<pre><code class="language-' + lang + '">' + escaped + '</code></pre>';
            };

            marked.use({ renderer });

            // 3. Inject parsed HTML into the DOM
            const html = marked.parse(mdSource);
            const contentDiv = document.getElementById("content");
            contentDiv.innerHTML = html;
            contentDiv.style.display = "block";

            // 4. Generate Table of Contents from headings
            const tocList = document.getElementById("toc-list");
            const headings = contentDiv.querySelectorAll("h1, h2");
            headings.forEach(heading => {
                // Skip the title headings
                if (heading.tagName === 'H1' && heading.textContent.includes('Table of Contents')) {
                    heading.style.display = 'none';
                    return;
                }
                if (heading.tagName === 'H1' && heading.textContent.includes('Herbify — Visual Project Documentation')) {
                    heading.style.display = 'none';
                    return;
                }
                
                const item = document.createElement("div");
                item.className = "toc-item";
                
                const isSub = heading.tagName === 'H2';
                const styleStr = isSub ? 'style="margin-left: 20px;"' : 'style="font-weight: bold;"';
                
                item.innerHTML = '<a href="#' + heading.id + '" ' + styleStr + '>' + heading.textContent + '</a>' +
                    '<span class="dots"></span>' +
                    '<div></div>'; // Page numbering in HTML is tricky, we leave it blank intentionally as anchor jumps work perfectly
                tocList.appendChild(item);
            });

            // 5. Initialize Mermaid
            // We use setTimeout to ensure the DOM has painted the blocks before we run mermaid
            setTimeout(async () => {
                try {
                    await mermaid.run({ querySelector: '.mermaid' });
                    // Explicitly fix scaling issue after render
                    document.querySelectorAll('.mermaid svg').forEach(svg => {
                        svg.style.maxWidth = '100%';
                        svg.style.height = 'auto';
                    });
                } catch(err) {
                    console.error('Mermaid render error:', err);
                }
            }, 500);
        });
    </script>
</body>
</html>
`;

try {
    fs.writeFileSync(outPath, htmlTemplate);
    console.log('Documentation successfully generated at: ' + outPath);
} catch (e) {
    console.error('Error writing file:', e);
}
