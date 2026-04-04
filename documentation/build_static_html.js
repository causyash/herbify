const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

const mdPath = path.join(__dirname, '../DOCUMENTATION.md');
const outPath = path.join(__dirname, 'index.html');

const mdContent = fs.readFileSync(mdPath, 'utf-8');

// Configuration for marked
const renderer = new marked.Renderer();

const headings = [];
renderer.heading = function({text, depth, raw}) {
    // Generate safe IDs
    const id = raw.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    if (depth <= 2 && !text.includes('Herbify — Visual Project') && !text.includes('Table of Contents')) {
        headings.push({ text, id, depth });
    }
    return `<h${depth} id="h-${id}">${text}</h${depth}>`;
};

renderer.code = function({text, lang}) {
    if (lang === 'mermaid') {
        // Output mermaid div for client rendering
        const safeText = text.replace(/</g, '<').replace(/>/g, '>');
        return `<div class="mermaid-container"><div class="mermaid">${safeText}</div></div>`;
    }
    const escaped = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return `<pre><code class="language-${lang}">${escaped}</code></pre>`;
};

marked.use({ renderer });

// Parse markdown to HTML
const bodyHtml = marked.parse(mdContent);

// Build static ToC HTML
let tocHtml = '';
headings.forEach(h => {
    const isSub = h.depth === 2;
    const styleStr = isSub ? 'style="margin-left: 20px;"' : 'style="font-weight: bold;"';
    tocHtml += `
        <div class="toc-item">
            <a href="#h-${h.id}" ${styleStr}>${h.text}</a>
            <span class="dots"></span>
            <div class="page-placeholder"></div>
        </div>
    `;
});

// Build final static HTML Document
const htmlDocument = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Herbify Documentation</title>
    <!-- Embedded Mermaid.js for flowcharts rendering visually -->
    <script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
    <style>
        /* STRICT: A4 Page Setup */
        @page {
            size: A4;
            margin: 20mm;
            @bottom-center {
                content: counter(page);
                font-family: "Times New Roman", Times, serif;
                font-size: 11pt;
            }
        }
        
        @page :first {
            @bottom-center { content: ""; } /* Hide page number on cover */
        }

        body {
            font-family: "Times New Roman", Times, serif;
            font-size: 12pt;
            line-height: 1.5;
            text-align: justify;
            color: #000;
            background: #fff;
            margin: 0;
            padding: 0;
        }

        /* STRICT: No overflow, proper page breaks */
        * {
            box-sizing: border-box;
        }

        div, p, pre, blockquote, table, img, svg {
            max-width: 100%;
        }

        /* Headings Hierarchy */
        h1, h2, h3, h4, h5, h6 {
            font-family: "Times New Roman", Times, serif;
            color: #000;
            page-break-after: avoid; 
            page-break-inside: avoid;
            text-align: left;
            margin-top: 1.5em;
            margin-bottom: 0.8em;
        }

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

        /* Cover Page styling */
        .cover-page {
            page-break-after: always;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 250mm;
            text-align: center;
        }

        .cover-page h1 {
            font-size: 48pt;
            font-weight: bold;
            margin-bottom: 0px;
            page-break-before: auto;
            border-bottom: none;
            text-align: center;
        }

        .cover-page h2 {
            font-size: 24pt;
            font-weight: normal;
            page-break-before: auto;
            border-bottom: none;
            margin-bottom: 50px;
            text-align: center;
        }

        .cover-page p {
            font-size: 16pt;
            margin: 10px 0;
            text-indent: 0;
            text-align: center;
        }

        /* Table of Contents Styling */
        .toc-page {
            page-break-after: always;
        }
        
        .toc-page h1 {
            page-break-before: always;
        }

        .toc-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 6px;
            page-break-inside: avoid;
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

        /* Global formatting rules */
        p {
            margin-bottom: 1em;
            text-indent: 20px;
        }

        ul, ol {
            margin-bottom: 1.5em;
            text-align: left;
            padding-left: 40px;
        }
        
        li {
            margin-bottom: 5px;
            page-break-inside: avoid;
        }

        /* STRICT: Images inside margins */
        img {
            max-width: 100%;
            height: auto;
            display: block;
            margin: 1.5em auto;
            page-break-inside: avoid;
            object-fit: contain;
        }

        /* STRICT: No overflow on pre blocks */
        pre {
            white-space: pre-wrap;
            word-wrap: break-word; 
            max-width: 100%;
            background: #f4f4f4;
            padding: 15px;
            border: 1px solid #ccc;
            border-radius: 4px;
            page-break-inside: avoid;
            font-family: monospace;
            font-size: 10pt;
            overflow: hidden;
        }
        
        code {
            font-family: monospace;
            background: #f4f4f4;
            padding: 2px 4px;
        }

        /* STRICT: fix for flows rendering perfectly visually */
        .mermaid-container {
            width: 100%;
            margin: 2em 0;
            page-break-inside: avoid;
            display: flex;
            justify-content: center;
            overflow: hidden;
            background: #fff;
        }
        
        .mermaid {
            max-width: 100%;
            overflow: hidden;
        }

        .mermaid svg {
            max-width: 100% !important;
            height: auto !important;
            display: block;
            margin: 0 auto;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin: 1.5em 0;
            page-break-inside: avoid;
            table-layout: fixed;
            word-wrap: break-word;
        }

        th, td {
            border: 1px solid #000;
            padding: 8px;
            text-align: left;
            overflow-wrap: break-word;
        }

        th { background-color: #f2f2f2; }
        
        blockquote {
            border-left: 4px solid #ccc;
            margin: 1.5em 0;
            padding-left: 1em;
            font-style: italic;
            page-break-inside: avoid;
        }

        @media screen {
            #doc-container {
                max-width: 210mm;
                margin: 0 auto;
                background: white;
                box-shadow: 0 0 10px rgba(0,0,0,0.1);
                padding: 20mm;
            }
            body { background: #e0e0e0; }
        }

        @media print {
            .no-print { display: none; }
            #doc-container {
                box-shadow: none;
                margin: 0;
                padding: 0;
                max-width: none;
            }
            body { background: #fff; }
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

    <!-- Wrapping exact page contents to render correctly and cleanly structured -->
    <div id="doc-container">
        
        <div class="cover-page">
            <h1>HERBIFY</h1>
            <h2>Visual Project Documentation</h2>
            <p>A comprehensive MERN e-commerce application</p>
            <p>Date: April 2026</p>
        </div>

        <div class="toc-page">
            <h1>Table of Contents</h1>
            ${tocHtml}
        </div>

        <!-- Fully parsed markdown directly inside the HTML -->
        ${bodyHtml}
        
    </div>

    <script>
        document.addEventListener("DOMContentLoaded", () => {
            // Enforce mermaid to safely load SVG diagrams.
            mermaid.initialize({ 
                startOnLoad: false, 
                theme: 'default', 
                securityLevel: 'loose',
                flowchart: { useMaxWidth: true, htmlLabels: true }
            });
            
            // Run mermaid on all mermaid divs
            mermaid.run({ querySelector: '.mermaid' }).then(() => {
                // Post-process SVG elements specifically to guarantee they never overflow margins visually
                document.querySelectorAll('.mermaid svg').forEach(svg => {
                    svg.style.maxWidth = '100%';
                    svg.style.height = 'auto';
                });
            }).catch(e => { console.error('Mermaid render error: ', e); });
            
            // Hide the extra title headings parsed natively from the markdown
            document.querySelectorAll('#doc-container h1').forEach(h1 => {
                if (h1.textContent.includes('Herbify — Visual Project Documentation') || 
                    h1.textContent === 'Table of Contents') {
                    h1.style.display = 'none';
                }
            });
        });
    </script>
</body>
</html>
`;

try {
    fs.writeFileSync(outPath, htmlTemplate);
    console.log('Fully structured, perfect static HTML documentation generated at: ' + outPath);
} catch (e) {
    console.error('Error writing file:', e);
}
